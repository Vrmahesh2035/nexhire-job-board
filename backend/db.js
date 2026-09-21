import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
const memoryStore = {
  users: [],
  listings: [],
  applications: [],
  bookmarks: [],
  studentPosts: [],
  resumes: []
};
let mongoClient = null;
let mongoDb = null;
let isAtlasConnected = false;
let connectionError = null;
export async function initDatabase() {
  const uri = process.env.MONGODB_URI;
  if (uri && !uri.includes("<username>") && !uri.includes("MY_MONGODB")) {
    try {
      console.log("Attempting connection to MongoDB Atlas...");
      mongoClient = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5e3,
        connectTimeoutMS: 5e3
      });
      await mongoClient.connect();
      mongoDb = mongoClient.db("nexhire_jobboard");
      await mongoDb.command({ ping: 1 });
      isAtlasConnected = true;
      console.log("Successfully connected to MongoDB Atlas (database: nexhire_jobboard)");
      await seedDatabaseIfEmpty();
      await seedStudentPostsIfEmpty();
      return { connected: true, type: "mongodb_atlas" };
    } catch (err) {
      console.warn("MongoDB Atlas connection failed, falling back to embedded in-memory store:", err.message);
      connectionError = err.message;
      isAtlasConnected = false;
      await seedDatabaseIfEmpty();
      await seedStudentPostsIfEmpty();
      return { connected: false, type: "embedded_store", error: err.message };
    }
  } else {
    console.log("MONGODB_URI not provided or contains placeholders. Using embedded memory store.");
    await seedDatabaseIfEmpty();
    await seedStudentPostsIfEmpty();
    return { connected: false, type: "embedded_store" };
  }
}
export function getDbStatus() {
  const uri = process.env.MONGODB_URI;
  const isConfigured = Boolean(uri && !uri.includes("<username>"));
  return {
    connected: isAtlasConnected,
    dbType: isAtlasConnected ? "mongodb_atlas" : "embedded_store",
    databaseName: isAtlasConnected ? "nexhire_jobboard" : "embedded_memory_store",
    uriConfigured: isConfigured,
    message: isAtlasConnected ? "Live connection active with MongoDB Atlas cluster." : isConfigured ? `Connection failed: ${connectionError || "Could not reach cluster"}. Using embedded store.` : "Using embedded persistent store. Set MONGODB_URI to connect your MongoDB Atlas cluster."
  };
}
export const db = {
  users: {
    async findOne(filter) {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("users").findOne(filter);
      }
      return memoryStore.users.find((u) => {
        return Object.entries(filter).every(([k, v]) => u[k] === v);
      }) || null;
    },
    async insertOne(doc) {
      if (isAtlasConnected && mongoDb) {
        const res = await mongoDb.collection("users").insertOne(doc);
        return { ...doc, _id: res.insertedId };
      }
      const newDoc = { ...doc, _id: doc.id || `user_${Date.now()}` };
      memoryStore.users.push(newDoc);
      return newDoc;
    },
    async find(filter = {}) {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("users").find(filter).toArray();
      }
      return memoryStore.users.filter((u) => {
        return Object.entries(filter).every(([k, v]) => u[k] === v);
      });
    },
    async count() {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("users").countDocuments();
      }
      return memoryStore.users.length;
    },
    async updateOne(filter, update) {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("users").updateOne(filter, update);
      }
      const user = memoryStore.users.find(
        (u) => Object.entries(filter).every(([k, v]) => u[k] === v)
      );
      if (user && update.$set) {
        Object.assign(user, update.$set);
      }
      return { matchedCount: user ? 1 : 0, modifiedCount: user ? 1 : 0 };
    }
  },
  listings: {
    async find(filter = {}) {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("listings").find(filter).sort({ createdAt: -1 }).toArray();
      }
      return [...memoryStore.listings].filter((item) => Object.entries(filter).every(([k, v]) => item[k] === v)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async findById(id) {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("listings").findOne({ id });
      }
      return memoryStore.listings.find((item) => item.id === id) || null;
    },
    async insertOne(doc) {
      if (isAtlasConnected && mongoDb) {
        await mongoDb.collection("listings").insertOne(doc);
        return doc;
      }
      memoryStore.listings.push(doc);
      return doc;
    },
    async updateOne(id, updateData) {
      if (isAtlasConnected && mongoDb) {
        await mongoDb.collection("listings").updateOne({ id }, { $set: updateData });
        return await mongoDb.collection("listings").findOne({ id });
      }
      const index = memoryStore.listings.findIndex((item) => item.id === id);
      if (index !== -1) {
        memoryStore.listings[index] = { ...memoryStore.listings[index], ...updateData };
        return memoryStore.listings[index];
      }
      return null;
    },
    async deleteOne(id) {
      if (isAtlasConnected && mongoDb) {
        const res = await mongoDb.collection("listings").deleteOne({ id });
        return res.deletedCount > 0;
      }
      const index = memoryStore.listings.findIndex((item) => item.id === id);
      if (index !== -1) {
        memoryStore.listings.splice(index, 1);
        return true;
      }
      return false;
    },
    async count() {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("listings").countDocuments();
      }
      return memoryStore.listings.length;
    }
  },
  applications: {
    async find(filter = {}) {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("applications").find(filter).sort({ appliedAt: -1 }).toArray();
      }
      return [...memoryStore.applications].filter((item) => Object.entries(filter).every(([k, v]) => item[k] === v)).sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
    },
    async findById(id) {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("applications").findOne({ id });
      }
      return memoryStore.applications.find((item) => item.id === id) || null;
    },
    async insertOne(doc) {
      if (isAtlasConnected && mongoDb) {
        await mongoDb.collection("applications").insertOne(doc);
        return doc;
      }
      memoryStore.applications.push(doc);
      return doc;
    },
    async updateOne(id, updateData) {
      if (isAtlasConnected && mongoDb) {
        await mongoDb.collection("applications").updateOne({ id }, { $set: updateData });
        return await mongoDb.collection("applications").findOne({ id });
      }
      const index = memoryStore.applications.findIndex((item) => item.id === id);
      if (index !== -1) {
        memoryStore.applications[index] = { ...memoryStore.applications[index], ...updateData };
        return memoryStore.applications[index];
      }
      return null;
    },
    async count(filter = {}) {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("applications").countDocuments(filter);
      }
      return memoryStore.applications.filter((item) => Object.entries(filter).every(([k, v]) => item[k] === v)).length;
    }
  },
  bookmarks: {
    async find(studentId) {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("bookmarks").find({ studentId }).toArray();
      }
      return memoryStore.bookmarks.filter((b) => b.studentId === studentId);
    },
    async add(studentId, listingId) {
      const exists = await this.exists(studentId, listingId);
      if (exists) return true;
      const doc = { id: `bm_${Date.now()}`, studentId, listingId, createdAt: new Date().toISOString() };
      if (isAtlasConnected && mongoDb) {
        await mongoDb.collection("bookmarks").insertOne(doc);
      } else {
        memoryStore.bookmarks.push(doc);
      }
      return true;
    },
    async remove(studentId, listingId) {
      if (isAtlasConnected && mongoDb) {
        await mongoDb.collection("bookmarks").deleteOne({ studentId, listingId });
      } else {
        const index = memoryStore.bookmarks.findIndex((b) => b.studentId === studentId && b.listingId === listingId);
        if (index !== -1) memoryStore.bookmarks.splice(index, 1);
      }
      return true;
    },
    async exists(studentId, listingId) {
      if (isAtlasConnected && mongoDb) {
        const doc = await mongoDb.collection("bookmarks").findOne({ studentId, listingId });
        return !!doc;
      }
      return memoryStore.bookmarks.some((b) => b.studentId === studentId && b.listingId === listingId);
    }
  },
  studentPosts: {
    async find(filter = {}) {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("studentPosts").find(filter).sort({ createdAt: -1 }).toArray();
      }
      return [...memoryStore.studentPosts].filter((item) => Object.entries(filter).every(([k, v]) => item[k] === v)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async insertOne(doc) {
      if (isAtlasConnected && mongoDb) {
        await mongoDb.collection("studentPosts").insertOne(doc);
        return doc;
      }
      memoryStore.studentPosts.push(doc);
      return doc;
    },
    async deleteOne(filter) {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("studentPosts").deleteOne(filter);
      }
      const index = memoryStore.studentPosts.findIndex(item => Object.entries(filter).every(([k, v]) => item[k] === v));
      if (index !== -1) {
        memoryStore.studentPosts.splice(index, 1);
        return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
    },
    async count() {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("studentPosts").countDocuments();
      }
      return memoryStore.studentPosts.length;
    }
  },
  resumes: {
    async findOne(filter) {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("resumes").findOne(filter);
      }
      return memoryStore.resumes.find(r => Object.entries(filter).every(([k, v]) => r[k] === v)) || null;
    },
    async insertOrUpdate(doc) {
      if (isAtlasConnected && mongoDb) {
        await mongoDb.collection("resumes").updateOne(
          { studentId: doc.studentId },
          { $set: doc },
          { upsert: true }
        );
        return doc;
      }
      const idx = memoryStore.resumes.findIndex(r => r.studentId === doc.studentId);
      if (idx !== -1) {
        memoryStore.resumes[idx] = { ...memoryStore.resumes[idx], ...doc };
      } else {
        memoryStore.resumes.push(doc);
      }
      return doc;
    },
    async deleteOne(filter) {
      if (isAtlasConnected && mongoDb) {
        return await mongoDb.collection("resumes").deleteOne(filter);
      }
      const idx = memoryStore.resumes.findIndex(r => Object.entries(filter).every(([k, v]) => r[k] === v));
      if (idx !== -1) {
        memoryStore.resumes.splice(idx, 1);
        return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
    }
  }
};
async function seedDatabaseIfEmpty() {
  const usersCount = await db.users.count();
  if (usersCount > 0) {
    console.log("Database already populated. Skipping seed.");
    return;
  }
  console.log("Seeding initial MERN Job Board data with realistic students, companies, listings, and applicants...");
  const passwordHash = await bcrypt.hash("password123", 10);
  const demoStudent = {
    id: "user_student_1",
    role: "student",
    email: "student@demo.com",
    passwordHash,
    name: "Alex Rivera",
    createdAt: new Date(Date.now() - 30 * 864e5).toISOString(),
    studentProfile: {
      university: "UC Berkeley",
      degree: "B.S. Computer Science",
      gradYear: "2026",
      skills: ["React", "TypeScript", "Node.js", "MongoDB", "Express", "Tailwind CSS", "Python", "Git"],
      resumeSummary: "CS Senior with high proficiency in full-stack MERN engineering, cloud APIs, and distributed systems. Built production hackathon apps with 10k+ MAU.",
      github: "https://github.com/alexrivera-demo",
      linkedin: "https://linkedin.com/in/alexrivera-demo",
      portfolio: "https://alexrivera.dev",
      bio: "Aspiring Full Stack Engineer passionate about developer tooling, real-time web applications, and scalable microservices."
    }
  };
  const candidate2 = {
    id: "user_student_2",
    role: "student",
    email: "priya.sharma@stanford.edu",
    passwordHash,
    name: "Priya Sharma",
    createdAt: new Date(Date.now() - 20 * 864e5).toISOString(),
    studentProfile: {
      university: "Stanford University",
      degree: "M.S. Artificial Intelligence",
      gradYear: "2025",
      skills: ["Python", "PyTorch", "TensorFlow", "FastAPI", "Docker", "PostgreSQL", "React"],
      resumeSummary: "AI/ML Graduate Researcher focusing on large multimodal systems and generative agents. Authored 2 CVPR workshop papers.",
      github: "https://github.com/priyasharma-ai",
      linkedin: "https://linkedin.com/in/priyasharma-ai",
      bio: "Machine learning researcher and software engineer eager to solve real-world problems."
    }
  };
  const candidate3 = {
    id: "user_student_3",
    role: "student",
    email: "marcus.chen@mit.edu",
    passwordHash,
    name: "Marcus Chen",
    createdAt: new Date(Date.now() - 15 * 864e5).toISOString(),
    studentProfile: {
      university: "MIT",
      degree: "B.S. Electrical Eng & CS",
      gradYear: "2026",
      skills: ["React", "Next.js", "TypeScript", "Node.js", "GraphQL", "AWS", "MongoDB"],
      resumeSummary: "Front-end specialist with deep passion for interactive web experiences, design systems, and WebGL.",
      github: "https://github.com/marcuschen-web",
      linkedin: "https://linkedin.com/in/marcuschen",
      portfolio: "https://marcus.design",
      bio: "Bridging design and engineering through modern web architectures."
    }
  };
  const demoCompany = {
    id: "user_company_1",
    role: "company",
    email: "recruiter@cloudscale.io",
    passwordHash,
    name: "Sarah Jenkins",
    createdAt: new Date(Date.now() - 60 * 864e5).toISOString(),
    companyProfile: {
      companyName: "CloudScale Technologies",
      recruiterName: "Sarah Jenkins (Senior Talent Partner)",
      industry: "Cloud Infrastructure & Enterprise SaaS",
      website: "https://cloudscale.io",
      headquarters: "San Francisco, CA & Remote",
      size: "250 - 500 Employees",
      bio: "CloudScale builds high-throughput distributed database accelerators and next-gen developer tooling trusted by Fortune 500 teams."
    }
  };
  const demoCompany2 = {
    id: "user_company_2",
    role: "company",
    email: "recruiter@fintechpulse.com",
    passwordHash,
    name: "David Vance",
    createdAt: new Date(Date.now() - 45 * 864e5).toISOString(),
    companyProfile: {
      companyName: "Pulse FinTech",
      recruiterName: "David Vance (Director of Engineering Hiring)",
      industry: "Financial Technology & Payments",
      website: "https://pulsefintech.com",
      headquarters: "New York, NY",
      size: "500 - 1000 Employees",
      bio: "Powering automated cross-border treasury settlements with bank-grade security and zero-friction developer APIs."
    }
  };
  await db.users.insertOne(demoStudent);
  await db.users.insertOne(candidate2);
  await db.users.insertOne(candidate3);
  await db.users.insertOne(demoCompany);
  await db.users.insertOne(demoCompany2);
  await db.studentPosts.insertOne({
    id: "post_demo_1",
    studentId: demoStudent.id,
    studentName: demoStudent.name,
    studentEmail: demoStudent.email,
    university: "UC Berkeley",
    degree: "B.S. Computer Science",
    gradYear: "2026",
    github: "https://github.com/alexrivera-demo",
    title: "1st Place Winner @ CalHacks 11.0 - DevSync AI Assistant",
    content: "Built an autonomous developer companion that scans pull requests, detects breaking changes, and auto-generates unit test fixtures. Won 1st place overall out of 400+ teams!",
    achievementType: "Hackathon Win",
    skills: ["React", "TypeScript", "Node.js", "MongoDB", "AI & LLMs"],
    projectUrl: "https://github.com/alexrivera-demo/devsync-ai",
    createdAt: new Date(Date.now() - 2 * 864e5).toISOString(),
    visibleToRecruiters: true
  });
  await db.studentPosts.insertOne({
    id: "post_demo_2",
    studentId: candidate3.id,
    studentName: candidate3.name,
    studentEmail: candidate3.email,
    university: "MIT",
    degree: "B.S. Electrical Eng & CS",
    gradYear: "2026",
    github: "https://github.com/marcuschen-web",
    title: "Open-Source Release: fast-react-table (1,400+ GitHub Stars)",
    content: "Released fast-react-table: a virtualized, headless grid library for React 19 capable of 60 FPS scrolling through 500,000+ data rows with zero frame drops. Featured on Hacker News!",
    achievementType: "Project Launch",
    skills: ["React", "TypeScript", "Vite", "Tailwind CSS", "UI/UX"],
    projectUrl: "https://github.com/marcuschen-web/fast-react-table",
    createdAt: new Date(Date.now() - 5 * 864e5).toISOString(),
    visibleToRecruiters: true
  });
  await db.studentPosts.insertOne({
    id: "post_demo_3",
    studentId: candidate2.id,
    studentName: candidate2.name,
    studentEmail: candidate2.email,
    university: "Stanford University",
    degree: "M.S. Artificial Intelligence",
    gradYear: "2025",
    github: "https://github.com/priyasharma-ai",
    title: "Published Research Paper: Low-Latency Inference for LLMs on Edge GPUs",
    content: "Our research on low-bit quantization and speculative decoding for edge-deployed LLMs was accepted at NeurIPS workshop. Achieved a 42% reduction in latency while retaining 98% perplexity scores.",
    achievementType: "Research & Publication",
    skills: ["Python", "PyTorch", "Machine Learning", "Deep Learning", "Docker"],
    projectUrl: "https://arxiv.org/abs/2405.demo",
    createdAt: new Date(Date.now() - 7 * 864e5).toISOString(),
    visibleToRecruiters: true
  });
  await db.studentPosts.insertOne({
    id: "post_demo_4",
    studentId: "user_student_4",
    studentName: "Jordan Lee",
    studentEmail: "jordan.lee@gatech.edu",
    university: "Georgia Tech",
    degree: "B.S. Computer Science",
    gradYear: "2026",
    github: "https://github.com/jordanlee-devops",
    title: "Earned AWS Certified Solutions Architect - Associate (Score: 920/1000)",
    content: "Officially passed the AWS Solutions Architect Associate exam! Deep dived into multi-region VPC architectures, S3 lifecycle policies, EKS container orchestration, and resilient cloud infrastructure design.",
    achievementType: "Certification",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
    projectUrl: "https://aws.amazon.com/verification",
    createdAt: new Date(Date.now() - 10 * 864e5).toISOString(),
    visibleToRecruiters: true
  });
  const sampleListings = [
    {
      id: "list_intern_1",
      companyId: "user_company_1",
      companyName: "CloudScale Technologies",
      type: "internship",
      title: "Summer 2026 Software Engineering Intern (Full-Stack)",
      department: "Engineering",
      location: "San Francisco, CA (or Remote US/Canada)",
      workMode: "Hybrid",
      experienceLevel: "Freshers / Students",
      salaryOrStipend: "$52/hr (~$8,300/mo) + Housing Stipend",
      duration: "12 Weeks (June - August 2026)",
      skillsRequired: ["React", "TypeScript", "Node.js", "MongoDB", "REST APIs", "Git"],
      description: "Join CloudScale\u2019s Core Platform team for an immersive 12-week summer internship. You will own and ship real production microservices and user-facing dashboards alongside staff engineers.",
      responsibilities: [
        "Design and implement interactive data dashboards using React, TypeScript, and modern styling.",
        "Build scalable REST endpoints in Node.js connected to high-volume MongoDB Atlas clusters.",
        "Collaborate with Senior Staff Mentors through 1-on-1 weekly code reviews and architecture jams.",
        "Present your capstone feature to company leadership at the end-of-summer Demo Day."
      ],
      requirements: [
        "Enrolled in BS/MS Computer Science or related STEM program with expected graduation in 2026 or 2027.",
        "Hands-on experience building web apps with React, JavaScript/TypeScript, and backend servers.",
        "Familiarity with database concepts (NoSQL or SQL) and version control using Git.",
        "Excited to learn, ask thoughtful questions, and work in a collaborative environment."
      ],
      perks: [
        "$2,500 Relocation or Home Office Setup Stipend",
        "Top-spec M3 Max MacBook Pro provided",
        "Daily catered lunches in SF office & barista bar",
        "Direct consideration for full-time Return Offers upon graduation"
      ],
      deadline: "2026-10-31",
      status: "active",
      createdAt: new Date(Date.now() - 10 * 864e5).toISOString()
    },
    {
      id: "list_intern_2",
      companyId: "user_company_2",
      companyName: "Pulse FinTech",
      type: "internship",
      title: "Winter/Spring 2026 Frontend Engineering Intern",
      department: "Product Engineering",
      location: "New York, NY (Hybrid) or Remote",
      workMode: "Remote",
      experienceLevel: "Freshers / Students",
      salaryOrStipend: "$45/hr (~$7,200/mo)",
      duration: "16 Weeks",
      skillsRequired: ["React", "JavaScript", "Tailwind CSS", "Next.js", "State Management"],
      description: "Work on our merchant onboarding and payment analytics portal. You will convert Figma design systems into responsive, accessible, pixel-perfect React components.",
      responsibilities: [
        "Build reusable component libraries and responsive UI flows.",
        "Optimize client bundle performance and lighthouse accessibility scores.",
        "Write automated component tests and participate in sprint planning."
      ],
      requirements: [
        "Pursuing an undergraduate or graduate degree in technical discipline.",
        "Solid foundation in modern React hooks and Tailwind CSS styling.",
        "Strong design intuition and eye for typographic detail."
      ],
      perks: [
        "Flexible 100% remote working hours across US timezones",
        "Bi-weekly technical mentorship sessions with Principal Engineers",
        "Monthly wellness and learning budget"
      ],
      deadline: "2026-11-15",
      status: "active",
      createdAt: new Date(Date.now() - 8 * 864e5).toISOString()
    },
    {
      id: "list_hackathon_1",
      companyId: "user_company_1",
      companyName: "CloudScale Technologies",
      type: "hackathon",
      title: "CloudScale Global GenAI & MERN Sprint 2026",
      department: "Developer Relations & Community",
      location: "Virtual Worldwide",
      workMode: "Remote",
      experienceLevel: "Open to All Students",
      salaryOrStipend: "$35,000 Prize Pool + Fast-Track Interviews",
      duration: "48 Hours Online Hackathon",
      skillsRequired: ["React", "Node.js", "MongoDB", "AI/LLM APIs", "Full-Stack"],
      description: "A worldwide 48-hour virtual hackathon challenging university students and developers to build revolutionary applications using MERN stack and AI agents. Grand prizes, investor demo, and direct interviews for summer 2026 internships!",
      responsibilities: [
        "Form a team of 1 to 4 students or developers.",
        "Build a functional MVP web application within the 48-hour hacking window.",
        "Submit a 3-minute video demo and public GitHub repository."
      ],
      requirements: [
        "Must be currently enrolled in college/university or recent bootcamp graduate.",
        "All project code must be written during the official hacking period.",
        "Adhere to the student code of conduct and open-source licensing."
      ],
      perks: [
        "1st Place: $15,000 Cash + Direct Final-Round Internship Interviews",
        "2nd Place: $10,000 Cash + 1-year Cloud Credits",
        "3rd Place: $5,000 Cash + Developer Swag Kit",
        "Free MongoDB Atlas & CloudScale API credits for all participants"
      ],
      deadline: "2026-10-20",
      prizePool: "$35,000 USD",
      teamSize: "1 - 4 Members",
      startDate: "2026-10-24",
      endDate: "2026-10-26",
      theme: "Next-Gen Intelligent Full-Stack Applications",
      status: "active",
      createdAt: new Date(Date.now() - 5 * 864e5).toISOString()
    },
    {
      id: "list_hackathon_2",
      companyId: "user_company_2",
      companyName: "Pulse FinTech",
      type: "hackathon",
      title: "FinTech Disrupt 2026: Collegiate Hackathon",
      department: "FinTech Innovation Lab",
      location: "New York, NY & Virtual Stream",
      workMode: "Hybrid",
      experienceLevel: "Open to Students",
      salaryOrStipend: "$25,000 in Scholarships & Prizes",
      duration: "Weekend (36 Hours)",
      skillsRequired: ["Python", "React", "Financial APIs", "Data Analysis", "Security"],
      description: "Rethink modern personal finance, micro-investing, and automated fraud prevention. Mentors from top Wall Street firms and Silicon Valley FinTech unicorns on-site.",
      responsibilities: [
        "Prototype solutions addressing financial literacy or automated budget intelligence.",
        "Pitch live to judges and venture partners."
      ],
      requirements: [
        "Valid university student ID.",
        "Passionate about finance, code, or product design."
      ],
      perks: [
        "Full travel reimbursement grants available for eligible student teams",
        "VIP networking dinner with FinTech founders and CTOs"
      ],
      deadline: "2026-11-05",
      prizePool: "$25,000 USD",
      teamSize: "2 - 4 Members",
      startDate: "2026-11-12",
      endDate: "2026-11-14",
      theme: "Financial Inclusion & Automated Intelligence",
      status: "active",
      createdAt: new Date(Date.now() - 4 * 864e5).toISOString()
    },
    {
      id: "list_job_1",
      companyId: "user_company_1",
      companyName: "CloudScale Technologies",
      type: "job",
      title: "Full Stack MERN Software Engineer (Entry to Mid-Level)",
      department: "Engineering",
      location: "San Francisco, CA / Hybrid",
      workMode: "Hybrid",
      experienceLevel: "0-2 Years / New Grads Welcome",
      salaryOrStipend: "$125,000 - $155,000/yr + 0.1% Equity",
      duration: "Full-Time Permanent",
      skillsRequired: ["React", "Node.js", "Express", "MongoDB", "TypeScript", "Docker"],
      description: "We are expanding our core product engineering team. You will build user-facing features across our web portal, design and maintain scalable Express/Node microservices, and optimize MongoDB Atlas query performance.",
      responsibilities: [
        "Develop customer-facing web interfaces using React 19, TypeScript, and Tailwind CSS.",
        "Architect high-performance RESTful and WebSocket endpoints in Express/Node.js.",
        "Write clean, well-tested code with comprehensive unit and integration test suites.",
        "Participate in on-call rotations and collaborate with product designers on UX improvements."
      ],
      requirements: [
        "B.S. or M.S. in Computer Science or equivalent practical engineering experience.",
        "Demonstrated competence in the modern JavaScript/TypeScript ecosystem (MERN stack).",
        "Understanding of database indexing, aggregation pipelines in MongoDB, and asynchronous programming.",
        "Strong communication skills and empathy for developer users."
      ],
      perks: [
        "Comprehensive Health, Dental, and Vision coverage (100% employer paid)",
        "401(k) retirement plan with 4% company match",
        "Unlimited Paid Time Off (PTO) with 3-week minimum encouraged",
        "$3,000 annual continuous education and conference stipend"
      ],
      deadline: "2026-11-30",
      status: "active",
      createdAt: new Date(Date.now() - 14 * 864e5).toISOString()
    },
    {
      id: "list_job_2",
      companyId: "user_company_2",
      companyName: "Pulse FinTech",
      type: "job",
      title: "Associate Cloud & DevOps Engineer",
      department: "Infrastructure",
      location: "New York, NY or Remote US",
      workMode: "Remote",
      experienceLevel: "0-2 Years",
      salaryOrStipend: "$115,000 - $140,000/yr + Bonus",
      duration: "Full-Time Permanent",
      skillsRequired: ["Linux", "Docker", "Kubernetes", "CI/CD", "Python", "AWS"],
      description: "Join the infrastructure squad ensuring 99.999% availability for financial settlement networks handling billions in transactions daily.",
      responsibilities: [
        "Maintain automated deployment pipelines and container clusters.",
        "Monitor system telemetry, alerting thresholds, and latency metrics.",
        "Automate cloud infrastructure provisioning using Terraform."
      ],
      requirements: [
        "Degree in CS or related field or proven sysadmin/devops background.",
        "Hands-on experience with Linux environments, shell scripting, and containerization.",
        "Passion for reliability engineering and security best practices."
      ],
      perks: [
        "Flexible work arrangement with high autonomy",
        "Performance bonus paid semi-annually"
      ],
      deadline: "2026-12-15",
      status: "active",
      createdAt: new Date(Date.now() - 7 * 864e5).toISOString()
    }
  ];
  for (const item of sampleListings) {
    await db.listings.insertOne(item);
  }
  const sampleApplications = [
    {
      id: "app_1",
      listingId: "list_intern_1",
      listingTitle: "Summer 2026 Software Engineering Intern (Full-Stack)",
      listingType: "internship",
      companyId: "user_company_1",
      companyName: "CloudScale Technologies",
      studentId: "user_student_1",
      studentName: "Alex Rivera",
      studentEmail: "student@demo.com",
      studentUniversity: "UC Berkeley",
      studentGradYear: "2026",
      studentDegree: "B.S. Computer Science",
      studentSkills: ["React", "TypeScript", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
      skillsMatchScore: 95,
      resumeSummary: "Full-stack MERN builder with production experience. Built hackathon winner projects using MongoDB Atlas and real-time websockets.",
      coverNote: "I have followed CloudScale for over a year and love your focus on developer experience. My core stack aligns directly with your React + Node + MongoDB infrastructure, and I would love to contribute to the core platform this summer!",
      portfolioUrl: "https://alexrivera.dev",
      githubUrl: "https://github.com/alexrivera-demo",
      status: "Shortlisted",
      recruiterNotes: "Top candidate from UC Berkeley. Outstanding Github repositories with clean TypeScript code and solid MERN understanding. Schedule technical round.",
      recruiterRating: 5,
      appliedAt: new Date(Date.now() - 6 * 864e5).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 864e5).toISOString(),
      timeline: [
        { stage: "Applied", note: "Application submitted online via NexHire portal", date: new Date(Date.now() - 6 * 864e5).toISOString() },
        { stage: "Screening", note: "Resume screened by Talent Team - High skills match (95%)", date: new Date(Date.now() - 4 * 864e5).toISOString() },
        { stage: "Shortlisted", note: "Moved to Shortlist by Sarah Jenkins. Technical screening invitation queued.", date: new Date(Date.now() - 2 * 864e5).toISOString() }
      ]
    },
    {
      id: "app_2",
      listingId: "list_intern_1",
      listingTitle: "Summer 2026 Software Engineering Intern (Full-Stack)",
      listingType: "internship",
      companyId: "user_company_1",
      companyName: "CloudScale Technologies",
      studentId: "user_student_3",
      studentName: "Marcus Chen",
      studentEmail: "marcus.chen@mit.edu",
      studentUniversity: "MIT",
      studentGradYear: "2026",
      studentDegree: "B.S. Electrical Eng & CS",
      studentSkills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
      skillsMatchScore: 84,
      resumeSummary: "Frontend specialist and MIT junior with excellent UI component architecture skills.",
      coverNote: "Excited to apply for CloudScale Summer 2026 internship! I have built several open source React design system libraries.",
      portfolioUrl: "https://marcus.design",
      githubUrl: "https://github.com/marcuschen-web",
      status: "Interview",
      recruiterNotes: "Completed screening with flying colors. Very strong on frontend systems and accessibility. Technical pair-programming session scheduled for Friday.",
      recruiterRating: 4,
      appliedAt: new Date(Date.now() - 9 * 864e5).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 864e5).toISOString(),
      timeline: [
        { stage: "Applied", note: "Application submitted", date: new Date(Date.now() - 9 * 864e5).toISOString() },
        { stage: "Screening", note: "Initial recruiter phone screen passed", date: new Date(Date.now() - 7 * 864e5).toISOString() },
        { stage: "Shortlisted", note: "Approved by Engineering Manager", date: new Date(Date.now() - 4 * 864e5).toISOString() },
        { stage: "Interview", note: "Live technical coding round scheduled", date: new Date(Date.now() - 1 * 864e5).toISOString() }
      ]
    },
    {
      id: "app_3",
      listingId: "list_job_1",
      listingTitle: "Full Stack MERN Software Engineer (Entry to Mid-Level)",
      listingType: "job",
      companyId: "user_company_1",
      companyName: "CloudScale Technologies",
      studentId: "user_student_2",
      studentName: "Priya Sharma",
      studentEmail: "priya.sharma@stanford.edu",
      studentUniversity: "Stanford University",
      studentGradYear: "2025",
      studentDegree: "M.S. Artificial Intelligence",
      studentSkills: ["Python", "FastAPI", "Docker", "PostgreSQL", "React"],
      skillsMatchScore: 72,
      resumeSummary: "Stanford AI Masters graduate with backend microservice and data pipeline experience.",
      coverNote: "Interested in working on high-performance data systems at CloudScale.",
      githubUrl: "https://github.com/priyasharma-ai",
      status: "Screening",
      recruiterNotes: "Strong academic pedigree. Backend heavy; need to assess familiarity with React and Node.js.",
      recruiterRating: 3,
      appliedAt: new Date(Date.now() - 3 * 864e5).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 864e5).toISOString(),
      timeline: [
        { stage: "Applied", note: "Application received", date: new Date(Date.now() - 3 * 864e5).toISOString() },
        { stage: "Screening", note: "Under preliminary resume review", date: new Date(Date.now() - 1 * 864e5).toISOString() }
      ]
    },
    {
      id: "app_4",
      listingId: "list_hackathon_1",
      listingTitle: "CloudScale Global GenAI & MERN Sprint 2026",
      listingType: "hackathon",
      companyId: "user_company_1",
      companyName: "CloudScale Technologies",
      studentId: "user_student_1",
      studentName: "Alex Rivera",
      studentEmail: "student@demo.com",
      studentUniversity: "UC Berkeley",
      studentGradYear: "2026",
      studentDegree: "B.S. Computer Science",
      studentSkills: ["React", "TypeScript", "Node.js", "MongoDB"],
      skillsMatchScore: 100,
      resumeSummary: "Team lead for Team NexAI. Building automated developer workflow bot.",
      coverNote: "Our team is registered and excited to build with CloudScale and MongoDB Atlas during the 48-hour sprint!",
      githubUrl: "https://github.com/alexrivera-demo",
      status: "Offer",
      recruiterNotes: "Registered & Approved for Hackathon VIP Track. Project pitch approved.",
      recruiterRating: 5,
      appliedAt: new Date(Date.now() - 4 * 864e5).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 864e5).toISOString(),
      timeline: [
        { stage: "Applied", note: "Hackathon registration submitted", date: new Date(Date.now() - 4 * 864e5).toISOString() },
        { stage: "Screening", note: "Team credentials verified", date: new Date(Date.now() - 3 * 864e5).toISOString() },
        { stage: "Shortlisted", note: "Selected for Sponsored Hacker Track", date: new Date(Date.now() - 2 * 864e5).toISOString() },
        { stage: "Offer", note: "Official Hackathon Acceptance & Fast-Track Badge Confirmed", date: new Date(Date.now() - 1 * 864e5).toISOString() }
      ]
    }
  ];
  for (const app of sampleApplications) {
    await db.applications.insertOne(app);
  }
  await db.bookmarks.add("user_student_1", "list_intern_2");
  await db.bookmarks.add("user_student_1", "list_hackathon_1");
  await seedStudentPostsIfEmpty();
  console.log("Seeding complete. MERN Job Board ready.");
}

export async function seedStudentPostsIfEmpty() {
  try {
    const postCount = await db.studentPosts.count();
    if (postCount > 0) return;

    const samplePosts = [
      {
        id: "post_seed_1",
        studentId: "user_student_1",
        studentName: "Alex Rivera",
        studentEmail: "student@demo.com",
        university: "UC Berkeley",
        degree: "B.S. Computer Science",
        gradYear: "2026",
        github: "https://github.com/alexrivera-demo",
        title: "1st Place Winner @ CalHacks 11.0 - DevSync AI Assistant",
        content: "Excited to share that our team won 1st Place overall at CalHacks out of 400+ teams! We engineered DevSync, an autonomous developer workflow companion that scans pull requests, detects breaking API changes, and auto-generates unit test fixtures.",
        achievementType: "Hackathon Win",
        skills: ["React", "TypeScript", "Node.js", "MongoDB", "AI & LLMs"],
        projectUrl: "https://github.com/alexrivera-demo/devsync-ai",
        visibleToRecruiters: true,
        likesCount: 24,
        createdAt: new Date(Date.now() - 2 * 864e5).toISOString()
      },
      {
        id: "post_seed_2",
        studentId: "user_student_3",
        studentName: "Marcus Chen",
        studentEmail: "marcus.chen@mit.edu",
        university: "MIT",
        degree: "B.S. Electrical Eng & CS",
        gradYear: "2026",
        github: "https://github.com/marcuschen-web",
        title: "Open-Source Release: fast-react-table (1,400+ GitHub Stars)",
        content: "Released fast-react-table: a virtualized, headless grid library for React 19 capable of 60 FPS scrolling through 500,000+ data rows with zero frame drops. Featured on GitHub Trending and Hacker News!",
        achievementType: "Project Launch",
        skills: ["React", "TypeScript", "Vite", "Tailwind CSS", "UI/UX"],
        projectUrl: "https://github.com/marcuschen-web/fast-react-table",
        visibleToRecruiters: true,
        likesCount: 42,
        createdAt: new Date(Date.now() - 5 * 864e5).toISOString()
      },
      {
        id: "post_seed_3",
        studentId: "user_student_2",
        studentName: "Priya Sharma",
        studentEmail: "priya.sharma@stanford.edu",
        university: "Stanford University",
        degree: "M.S. Artificial Intelligence",
        gradYear: "2025",
        github: "https://github.com/priyasharma-ai",
        title: "Published Research Paper: Low-Latency Inference for LLMs on Edge GPUs",
        content: "Our research on low-bit quantization and speculative decoding for edge-deployed LLMs was accepted at NeurIPS workshop. Achieved a 42% reduction in generation latency while retaining 98% perplexity benchmark scores.",
        achievementType: "Research & Publication",
        skills: ["Python", "PyTorch", "Machine Learning", "Deep Learning", "Docker"],
        projectUrl: "https://arxiv.org/abs/2405.demo",
        visibleToRecruiters: true,
        likesCount: 38,
        createdAt: new Date(Date.now() - 8 * 864e5).toISOString()
      },
      {
        id: "post_seed_4",
        studentId: "user_student_4",
        studentName: "Jordan Lee",
        studentEmail: "jordan.lee@gatech.edu",
        university: "Georgia Tech",
        degree: "B.S. Computer Science",
        gradYear: "2026",
        github: "https://github.com/jordanlee-devops",
        title: "Earned AWS Certified Solutions Architect - Associate (Score: 920/1000)",
        content: "Officially passed the AWS Solutions Architect Associate exam! Deep dived into multi-region VPC architectures, S3 lifecycle policies, EKS container orchestration, and resilient cloud infrastructure design.",
        achievementType: "Certification",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
        projectUrl: "https://aws.amazon.com/verification",
        visibleToRecruiters: true,
        likesCount: 19,
        createdAt: new Date(Date.now() - 11 * 864e5).toISOString()
      }
    ];

    for (const p of samplePosts) {
      await db.studentPosts.insertOne(p);
    }
  } catch (err) {
    console.warn("Error seeding sample student achievements:", err.message);
  }
}

