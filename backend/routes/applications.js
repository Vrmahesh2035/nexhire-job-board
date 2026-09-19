import { Router } from "express";
import { db } from "../db.js";
import { parseToken } from "./auth.js";
const router = Router();
function computeMatchScore(studentSkills, requiredSkills) {
  if (!requiredSkills || requiredSkills.length === 0) return 100;
  if (!studentSkills || studentSkills.length === 0) return 40;
  const lowerStudent = studentSkills.map((s) => s.toLowerCase().trim());
  let matches = 0;
  for (const req of requiredSkills) {
    const reqLower = req.toLowerCase().trim();
    if (lowerStudent.some((s) => s.includes(reqLower) || reqLower.includes(s))) {
      matches++;
    }
  }
  const ratio = matches / requiredSkills.length;
  return Math.min(100, Math.max(45, Math.round(ratio * 100)));
}
router.post("/", async (req, res) => {
  try {
    const auth = parseToken(req.headers.authorization);
    if (!auth || auth.role !== "student") {
      return res.status(403).json({ error: "Only student accounts can submit applications" });
    }
    const { listingId, coverNote, portfolioUrl, githubUrl, resumeSummary } = req.body;
    if (!listingId) {
      return res.status(400).json({ error: "listingId is required" });
    }
    const listing = await db.listings.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Opportunity listing not found" });
    }
    const existing = (await db.applications.find({ listingId, studentId: auth.id }))[0];
    if (existing) {
      return res.status(400).json({ error: "You have already applied for this opportunity." });
    }
    const studentUser = await db.users.findOne({ id: auth.id });
    if (!studentUser) {
      return res.status(404).json({ error: "Student profile not found" });
    }
    const studentProfile = studentUser.studentProfile || {};
    const skillsMatch = computeMatchScore(studentProfile.skills || [], listing.skillsRequired || []);
    const newApp = {
      id: `app_${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingType: listing.type,
      companyId: listing.companyId,
      companyName: listing.companyName,
      studentId: auth.id,
      studentName: studentUser.name,
      studentEmail: studentUser.email,
      studentUniversity: studentProfile.university || "University Student",
      studentGradYear: studentProfile.gradYear || "2026",
      studentDegree: studentProfile.degree || "Computer Science / Engineering",
      studentSkills: studentProfile.skills || [],
      skillsMatchScore: skillsMatch,
      resumeSummary: resumeSummary || studentProfile.resumeSummary || "",
      coverNote: coverNote || "",
      portfolioUrl: portfolioUrl || studentProfile.portfolio || "",
      githubUrl: githubUrl || studentProfile.github || "",
      status: "Applied",
      recruiterNotes: "",
      recruiterRating: 0,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      timeline: [
        {
          stage: "Applied",
          note: `Application submitted for ${listing.title}`,
          date: (/* @__PURE__ */ new Date()).toISOString()
        }
      ]
    };
    const created = await db.applications.insertOne(newApp);
    res.status(201).json({ message: "Application submitted successfully", application: created });
  } catch (err) {
    console.error("Error creating application:", err);
    res.status(500).json({ error: "Failed to submit application" });
  }
});
router.get("/student", async (req, res) => {
  try {
    const auth = parseToken(req.headers.authorization);
    if (!auth || auth.role !== "student") {
      return res.status(403).json({ error: "Student authentication required" });
    }
    const applications = await db.applications.find({ studentId: auth.id });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve applications" });
  }
});
router.get("/company", async (req, res) => {
  try {
    const auth = parseToken(req.headers.authorization);
    if (!auth || auth.role !== "company") {
      return res.status(403).json({ error: "Company recruiter authentication required" });
    }
    const { listingId, status, minScore, search, gradYear } = req.query;
    let applications = await db.applications.find({ companyId: auth.id });
    if (listingId && listingId !== "all") {
      applications = applications.filter((app) => app.listingId === listingId);
    }
    if (status && status !== "all") {
      applications = applications.filter((app) => app.status === status);
    }
    if (minScore) {
      const min = Number(minScore);
      if (!isNaN(min)) {
        applications = applications.filter((app) => app.skillsMatchScore >= min);
      }
    }
    if (gradYear && gradYear !== "all") {
      applications = applications.filter((app) => app.studentGradYear === gradYear);
    }
    if (search) {
      const q = String(search).toLowerCase();
      applications = applications.filter(
        (app) => app.studentName.toLowerCase().includes(q) || app.studentUniversity.toLowerCase().includes(q) || app.studentEmail.toLowerCase().includes(q) || app.listingTitle.toLowerCase().includes(q) || app.studentSkills && app.studentSkills.some((s) => s.toLowerCase().includes(q))
      );
    }
    res.json({ applications });
  } catch (err) {
    console.error("Error fetching ATS applications:", err);
    res.status(500).json({ error: "Failed to retrieve candidate applications" });
  }
});
router.patch("/:id/status", async (req, res) => {
  try {
    const auth = parseToken(req.headers.authorization);
    if (!auth || auth.role !== "company") {
      return res.status(403).json({ error: "Unauthorized. Company recruiter access required." });
    }
    const { id } = req.params;
    const { status, note, recruiterRating, recruiterNotes } = req.body;
    const existing = await db.applications.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }
    if (existing.companyId !== auth.id) {
      return res.status(403).json({ error: "Unauthorized to modify applications for other companies" });
    }
    const updates = {
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (status && status !== existing.status) {
      updates.status = status;
      const timeline = existing.timeline || [];
      timeline.push({
        stage: status,
        note: note || `Candidate status updated to ${status} by recruiter`,
        date: (/* @__PURE__ */ new Date()).toISOString()
      });
      updates.timeline = timeline;
    }
    if (recruiterRating !== void 0) {
      updates.recruiterRating = Number(recruiterRating);
    }
    if (recruiterNotes !== void 0) {
      updates.recruiterNotes = recruiterNotes;
    }
    const updated = await db.applications.updateOne(id, updates);
    res.json({ message: "Candidate updated successfully in ATS", application: updated });
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(500).json({ error: "Failed to update candidate status" });
  }
});
export default router;
