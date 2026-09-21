import { Router } from 'express';
import { db } from '../db.js';
import { parseToken } from './auth.js';

const router = Router();

// GET /api/student-posts
router.get('/', async (req, res) => {
  try {
    const { skill, achievementType, studentId } = req.query;
    let posts = await db.studentPosts.find({ visibleToRecruiters: true });

    if (studentId) {
      posts = posts.filter(p => p.studentId === studentId);
    }

    if (achievementType && achievementType !== 'all') {
      posts = posts.filter(p => (p.achievementType || '').toLowerCase() === achievementType.toLowerCase());
    }

    if (skill && skill !== 'all') {
      const normalizedSkill = skill.toLowerCase();
      posts = posts.filter(p =>
        Array.isArray(p.skills) && p.skills.some(s => s.toLowerCase().includes(normalizedSkill))
      );
    }

    res.json({ posts });
  } catch (err) {
    console.error('Error fetching student posts:', err);
    res.status(500).json({ error: 'Failed to load student achievements' });
  }
});

// POST /api/student-posts
router.post('/', async (req, res) => {
  try {
    const auth = parseToken(req.headers.authorization);
    if (!auth || auth.role !== 'student') {
      return res.status(403).json({ error: 'Student authentication required to post achievements' });
    }

    const { title, content, achievementType, skills, projectUrl, visibleToRecruiters } = req.body;
    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({ error: 'Title and content description are required.' });
    }

    const student = await db.users.findOne({ id: auth.id });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    const cleanSkills = Array.isArray(skills)
      ? skills.map(skill => String(skill).trim()).filter(Boolean)
      : typeof skills === 'string'
      ? skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const post = {
      id: `post_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      university: student.studentProfile?.university || 'University Student',
      degree: student.studentProfile?.degree || 'Computer Science',
      gradYear: student.studentProfile?.gradYear || '2026',
      github: student.studentProfile?.github || '',
      title: title.trim(),
      content: content.trim(),
      achievementType: achievementType || 'Hackathon Win',
      skills: cleanSkills,
      projectUrl: projectUrl ? projectUrl.trim() : '',
      visibleToRecruiters: visibleToRecruiters !== false,
      likesCount: 0,
      createdAt: new Date().toISOString()
    };

    const created = await db.studentPosts.insertOne(post);
    res.status(201).json({ message: 'Achievement posted successfully', post: created });
  } catch (err) {
    console.error('Error creating student post:', err);
    res.status(500).json({ error: 'Failed to create achievement post' });
  }
});

// DELETE /api/student-posts/:id
router.delete('/:id', async (req, res) => {
  try {
    const auth = parseToken(req.headers.authorization);
    if (!auth) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;
    const posts = await db.studentPosts.find();
    const target = posts.find(p => p.id === id);

    if (!target) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Only the author student or an admin can delete their post
    if (auth.id !== target.studentId) {
      return res.status(403).json({ error: 'You do not have permission to delete this achievement post' });
    }

    await db.studentPosts.deleteOne({ id });
    res.json({ message: 'Achievement post deleted successfully', id });
  } catch (err) {
    console.error('Error deleting student post:', err);
    res.status(500).json({ error: 'Failed to delete achievement post' });
  }
});

export default router;
