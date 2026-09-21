import fs from 'fs';
import { createRequire } from 'module';
import { extractTextFromBuffer, extractResumeSkills, categorizeSkills, generateResumeSummary } from './backend/resumeParser.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const resumeText = `Mahesh Kumar
San Francisco, CA | mahesh@example.com | https://github.com/mahesh-dev | https://linkedin.com/in/mahesh-dev

EDUCATION
University of California, Berkeley - B.S. in Computer Science (Class of 2026)
GPA: 3.85 / 4.0

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, C++, SQL, HTML5, CSS3
Frontend: React, Next.js, Tailwind CSS, Redux, Vite, Vue.js
Backend & APIs: Node.js, Express, FastAPI, REST API, GraphQL, Microservices, WebSockets
Databases: MongoDB, PostgreSQL, Redis, Firebase
Cloud & DevOps: Docker, Kubernetes, AWS (EC2, S3, Lambda), Git, CI/CD, Linux, Terraform
AI & Machine Learning: PyTorch, Machine Learning, Deep Learning, LangChain, AI & LLMs

EXPERIENCE & PROJECTS
Full-Stack MERN Career Hub & ATS
- Built end-to-end recruitment platform using React, Node.js, Express, and MongoDB Atlas.
- Engineered automated resume skill parser and candidate match ranking algorithm.
- Implemented real-time Kanban candidate pipeline and JWT role-based access control.

Autonomous DevSync AI Assistant
- Built multi-agent developer companion using Python, PyTorch, LangChain, and Docker.
- Won 1st Place overall at CalHacks out of 400+ developer teams.
- Scaled inference endpoints using FastAPI and AWS ECS with 99.9% uptime.`;

// 1. Generate clean TXT resume
fs.writeFileSync('sample_resume.txt', resumeText);
console.log(' Successfully generated sample_resume.txt');

// 2. Generate compliant standard PDF resume with valid XRef table
const header = '%PDF-1.4\n';
const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
const obj3 = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n';
const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';

const streamLines = [
  'BT',
  '/F1 14 Tf',
  '50 720 Td',
  '(Mahesh Kumar - Full-Stack & AI Software Engineer) Tj',
  '/F1 10 Tf',
  '0 -25 Td',
  '(Email: mahesh@example.com | GitHub: https://github.com/mahesh-dev) Tj',
  '0 -25 Td',
  '(TECHNICAL SKILLS) Tj',
  '0 -18 Td',
  '(Languages: TypeScript, JavaScript, Python, C++, SQL, HTML5, CSS3) Tj',
  '0 -18 Td',
  '(Frontend: React, Next.js, Tailwind CSS, Redux, Vite, Vue.js) Tj',
  '0 -18 Td',
  '(Backend: Node.js, Express, FastAPI, REST API, GraphQL, Microservices, WebSockets) Tj',
  '0 -18 Td',
  '(Databases & Cloud: MongoDB, PostgreSQL, Redis, Docker, Kubernetes, AWS, Git, CI/CD) Tj',
  '0 -18 Td',
  '(AI & ML: PyTorch, Machine Learning, Deep Learning, LangChain, AI & LLMs) Tj',
  '0 -25 Td',
  '(PROJECTS) Tj',
  '0 -18 Td',
  '(NexHire MERN Platform: Engineered full-stack job board with resume skill matching) Tj',
  '0 -18 Td',
  '(DevSync AI Assistant: Built multi-turn agent using Python, PyTorch, LangChain, Docker) Tj',
  'ET'
];

const streamBody = streamLines.join('\n');
const obj5 = '5 0 obj\n<< /Length ' + Buffer.byteLength(streamBody) + ' >>\nstream\n' + streamBody + '\nendstream\nendobj\n';

let offset = 0;
const offsets = [0];
offset += Buffer.byteLength(header);
offsets.push(offset);
offset += Buffer.byteLength(obj1);
offsets.push(offset);
offset += Buffer.byteLength(obj2);
offsets.push(offset);
offset += Buffer.byteLength(obj3);
offsets.push(offset);
offset += Buffer.byteLength(obj4);
offsets.push(offset);
offset += Buffer.byteLength(obj5);

const startxref = offset;

let xref = 'xref\n0 6\n0000000000 65535 f \r\n';
for (let i = 1; i <= 5; i++) {
  const pad = String(offsets[i]).padStart(10, '0');
  xref += pad + ' 00000 n \r\n';
}

const trailer = 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + startxref + '\n%%EOF';
const fullPdf = header + obj1 + obj2 + obj3 + obj4 + obj5 + xref + trailer;

fs.writeFileSync('sample_resume.pdf', Buffer.from(fullPdf, 'binary'));
console.log(' Successfully generated sample_resume.pdf');

// 3. Test verification using NexHire Parser
const pdfBuffer = fs.readFileSync('sample_resume.pdf');
const extractedPdfText = await extractTextFromBuffer(pdfBuffer, 'sample_resume.pdf', 'application/pdf');
const skillsFound = extractResumeSkills(extractedPdfText);
const categorized = categorizeSkills(skillsFound);
const summary = generateResumeSummary(skillsFound, extractedPdfText);

console.log('\n--- VERIFICATION RESULTS ---');
console.log(`Scraped Skills Count: ${skillsFound.length}`);
console.log('Skills Sample:', skillsFound.slice(0, 12).join(', '));
console.log('Categorized Frontend:', categorized.frontend.join(', '));
console.log('Categorized Backend:', categorized.backend.join(', '));
console.log('Categorized AI/ML:', categorized.aiData.join(', '));
console.log('Auto-generated Summary:', summary);
