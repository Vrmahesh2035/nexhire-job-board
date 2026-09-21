import { Router } from 'express';
import { db } from '../db.js';
import { parseToken } from './auth.js';
import {
  extractTextFromBuffer,
  extractResumeSkills,
  categorizeSkills,
  extractCandidateMetadata,
  generateResumeSummary,
  recommendOpportunities
} from '../resumeParser.js';

const router = Router();

/**
 * POST /api/resume/parse
 * Extracts text from uploaded PDF/Word/Text file, scrapes skills,
 * stores the resume document directly into MongoDB, and returns matched opportunities.
 */
router.post('/parse', async (req, res) => {
  try {
    const { resumeText, fileData, fileName, fileType, saveToProfile } = req.body;
    let extractedText = resumeText || '';

    // If file data (Base64) was uploaded
    if (fileData) {
      try {
        const base64Clean = fileData.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Clean, 'base64');
        const textFromBuffer = await extractTextFromBuffer(buffer, fileName, fileType);
        if (textFromBuffer && textFromBuffer.trim().length > 0) {
          extractedText = textFromBuffer;
        }
      } catch (fileErr) {
        console.warn('Error during buffer extraction:', fileErr.message);
      }
    }

    // If still empty (e.g. image-scanned PDF), provide fallback note
    if (!extractedText || !extractedText.trim()) {
      if (fileData) {
        extractedText = `Resume Document: ${fileName || 'Uploaded Resume'}. Content was uploaded as an image or protected PDF. Please review or add skills manually below.`;
      } else {
        return res.status(400).json({ error: 'No resume text or valid file content could be extracted.' });
      }
    }

    // Scrape skills and metadata
    const skills = extractResumeSkills(extractedText);
    const categorized = categorizeSkills(skills);
    const metadata = extractCandidateMetadata(extractedText);
    const summary = generateResumeSummary(skills, extractedText);

    // Get active listings and compute recommendations
    const allListings = await db.listings.find();
    const activeListings = allListings.filter(l => l.status === 'active');
    const recommended = recommendOpportunities(activeListings, skills, extractedText);

    // Store in MongoDB if authenticated
    let savedToProfile = false;
    let resumeId = null;
    const auth = parseToken(req.headers.authorization);

    if (auth && auth.id) {
      const user = await db.users.findOne({ id: auth.id });
      if (user && user.role === 'student') {
        const currentProfile = user.studentProfile || {};
        const combinedSkills = Array.from(new Set([...(currentProfile.skills || []), ...skills]));
        const uploadedAt = new Date().toISOString();
        const cleanFileType = fileType || (fileName?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');

        // 1. Store the full resume file document in MongoDB 'resumes' collection
        const resumeDoc = {
          id: `resume_${user.id}`,
          studentId: user.id,
          studentName: user.name,
          studentEmail: user.email,
          fileName: fileName || currentProfile.resumeFileName || 'Resume.pdf',
          fileData: fileData || currentProfile.resumeFileData || '',
          fileType: cleanFileType,
          fileSize: fileData ? Math.round((fileData.length * 3) / 4) : 0,
          extractedText: extractedText.slice(0, 30000),
          skills: combinedSkills,
          summary: summary || currentProfile.resumeSummary,
          uploadedAt
        };

        await db.resumes.insertOrUpdate(resumeDoc);
        resumeId = resumeDoc.id;

        // 2. Update student profile in MongoDB 'users' collection
        const updates = {
          studentProfile: {
            ...currentProfile,
            skills: combinedSkills,
            resumeText: extractedText.slice(0, 15000),
            resumeFileName: resumeDoc.fileName,
            resumeFileData: resumeDoc.fileData,
            resumeFileType: cleanFileType,
            resumeSummary: summary || currentProfile.resumeSummary,
            resumeUploadedAt: uploadedAt,
            recommendedOpportunityIds: recommended.slice(0, 6).map(r => r.id),
            github: metadata.github || currentProfile.github,
            linkedin: metadata.linkedin || currentProfile.linkedin
          }
        };

        await db.users.updateOne({ id: user.id }, { $set: updates });
        savedToProfile = true;
      }
    }

    res.json({
      success: true,
      fileName: fileName || 'Uploaded Resume',
      textPreview: extractedText.slice(0, 1000) + (extractedText.length > 1000 ? '...' : ''),
      skills,
      categorizedSkills: categorized,
      summary,
      metadata,
      savedToProfile,
      resumeId,
      recommendedOpportunities: recommended
    });
  } catch (err) {
    console.error('Resume scraping error:', err);
    res.status(500).json({ error: 'Failed to scrape resume: ' + err.message });
  }
});

/**
 * GET /api/resume/recommendations
 * Returns personalized recommendations for the authenticated student.
 */
router.get('/recommendations', async (req, res) => {
  try {
    const auth = parseToken(req.headers.authorization);
    if (!auth) {
      return res.status(401).json({ error: 'Authentication required for personalized recommendations' });
    }

    const user = await db.users.findOne({ id: auth.id });
    if (!user || user.role !== 'student') {
      return res.status(403).json({ error: 'Only student accounts receive opportunity recommendations' });
    }

    const allListings = await db.listings.find();
    const activeListings = allListings.filter(l => l.status === 'active');
    const studentSkills = user.studentProfile?.skills || [];
    const resumeText = user.studentProfile?.resumeText || '';

    const recommendations = recommendOpportunities(activeListings, studentSkills, resumeText);

    res.json({
      studentSkills,
      totalMatched: recommendations.filter(r => r.matchScore > 40).length,
      recommendations
    });
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ error: 'Failed to calculate recommendations' });
  }
});

/**
 * GET /api/resume/file/:studentId
 * Streams the uploaded resume file stored in MongoDB directly to the browser (for student or recruiter).
 */
router.get('/file/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    // First check resumes collection, fallback to users collection
    let resume = await db.resumes.findOne({ studentId });
    if (!resume || !resume.fileData) {
      const user = await db.users.findOne({ id: studentId });
      if (user && user.studentProfile?.resumeFileData) {
        resume = {
          fileName: user.studentProfile.resumeFileName || 'Resume.pdf',
          fileData: user.studentProfile.resumeFileData,
          fileType: user.studentProfile.resumeFileType || 'application/pdf'
        };
      }
    }

    if (!resume || !resume.fileData) {
      return res.status(404).json({ error: 'No uploaded resume found for this candidate in the database.' });
    }

    const cleanBase64 = resume.fileData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const contentType = resume.fileType || (resume.fileName?.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(resume.fileName || 'resume.pdf')}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (err) {
    console.error('Error serving stored resume from MongoDB:', err);
    res.status(500).json({ error: 'Failed to retrieve resume from database' });
  }
});

export default router;
