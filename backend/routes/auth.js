import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const router = Router();

// Your secret key for signing tokens. In production, this comes from Render's environment variables.
const JWT_SECRET = process.env.JWT_SECRET || 'your_temporary_local_secret';

// Helper to sanitize user object (don't leak password hash)
function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, _id, ...safe } = user;
  return { id: user.id || _id?.toString(), ...safe };
}

// Token helper (Cryptographically secure JWT for robust session handling)
export function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function parseToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.replace('Bearer ', '').trim();
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { role, email, password, name, studentProfile, companyProfile } = req.body;

    if (!role || !email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields (role, email, password, name)' });
    }

    if (role !== 'student' && role !== 'company') {
      return res.status(400).json({ error: 'Role must be "student" or "company"' });
    }

    const existing = await db.users.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `user_${role}_${Date.now()}`;

    const newUserDoc = {
      id: userId,
      role,
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name.trim(),
      createdAt: new Date().toISOString()
    };

    if (role === 'student') {
      newUserDoc.studentProfile = {
        university: studentProfile?.university || '',
        degree: studentProfile?.degree || '',
        gradYear: studentProfile?.gradYear || '2026',
        skills: Array.isArray(studentProfile?.skills) ? studentProfile.skills : (studentProfile?.skills || '').split(',').map((s) => s.trim()).filter(Boolean),
        resumeSummary: studentProfile?.resumeSummary || '',
        github: studentProfile?.github || '',
        linkedin: studentProfile?.linkedin || '',
        portfolio: studentProfile?.portfolio || '',
        bio: studentProfile?.bio || ''
      };
    } else if (role === 'company') {
      newUserDoc.companyProfile = {
        companyName: companyProfile?.companyName || name,
        recruiterName: companyProfile?.recruiterName || name,
        industry: companyProfile?.industry || 'Technology & Software',
        website: companyProfile?.website || '',
        headquarters: companyProfile?.headquarters || 'San Francisco, CA',
        size: companyProfile?.size || '50 - 200 Employees',
        bio: companyProfile?.bio || ''
      };
    }

    const created = await db.users.insertOne(newUserDoc);
    const safeUser = sanitizeUser(created);
    const token = generateToken(safeUser);

    res.status(201).json({
      message: 'Registration successful',
      user: safeUser,
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.users.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        error: `This account is registered as a ${user.role}. Please log in via the ${user.role === 'student' ? 'Student' : 'Company'} portal.`
      });
    }

    const safeUser = sanitizeUser(user);
    const token = generateToken(safeUser);

    res.json({
      message: 'Login successful',
      user: safeUser,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const parsed = parseToken(req.headers.authorization);
    if (!parsed) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await db.users.findOne({ id: parsed.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

// GET /api/auth/demo/:role (instant 1-click test login)
router.get('/demo/:role', async (req, res) => {
  try {
    const { role } = req.params;
    let email = 'student@demo.com';
    if (role === 'company') {
      email = 'recruiter@cloudscale.io';
    }

    const user = await db.users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: `Demo user for role ${role} not found` });
    }

    const safeUser = sanitizeUser(user);
    const token = generateToken(safeUser);

    res.json({
      message: `Logged in as demo ${role}`,
      user: safeUser,
      token
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed demo login' });
  }
});

// PUT /api/auth/profile
router.put('/profile', async (req, res) => {
  try {
    const parsed = parseToken(req.headers.authorization);
    if (!parsed) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await db.users.findOne({ id: parsed.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, studentProfile, companyProfile } = req.body;

    const updates = {};
    if (name) updates.name = name;

    if (user.role === 'student' && studentProfile) {
      updates.studentProfile = {
        ...user.studentProfile,
        ...studentProfile
      };
    } else if (user.role === 'company' && companyProfile) {
      updates.companyProfile = {
        ...user.companyProfile,
        ...companyProfile
      };
    }

    user.name = updates.name || user.name;
    if (updates.studentProfile) user.studentProfile = updates.studentProfile;
    if (updates.companyProfile) user.companyProfile = updates.companyProfile;

    await db.users.updateOne({ id: user.id }, { $set: updates });

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;