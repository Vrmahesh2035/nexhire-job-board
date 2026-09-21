import zlib from 'zlib';
import { createRequire } from 'module';

// Support both native ESM (dev) and esbuild CJS bundle (Render production)
let nodeRequire = null;
try {
  if (typeof require === 'function') {
    nodeRequire = require;
  } else if (typeof import.meta !== 'undefined' && import.meta && import.meta.url) {
    nodeRequire = createRequire(import.meta.url);
  } else {
    nodeRequire = createRequire(process.cwd() + '/package.json');
  }
} catch {
  nodeRequire = null;
}

let pdfParse = null;
let mammoth = null;

if (nodeRequire) {
  try {
    pdfParse = nodeRequire('pdf-parse');
  } catch (e) {
    console.warn('pdf-parse not available:', e.message);
  }

  try {
    mammoth = nodeRequire('mammoth');
  } catch (e) {
    console.warn('mammoth not available:', e.message);
  }
}

// Comprehensive technical skill taxonomy categorized for modern software engineering
export const skillTaxonomy = {
  frontend: [
    { name: 'React', aliases: ['react', 'react.js', 'reactjs', 'mern', 'react native', 'create-react-app'] },
    { name: 'Next.js', aliases: ['next.js', 'nextjs', 'next.js 14', 'next.js 15', 'next'] },
    { name: 'TypeScript', aliases: ['typescript', 'ts'] },
    { name: 'JavaScript', aliases: ['javascript', 'js', 'es6', 'es2020', 'ecmascript'] },
    { name: 'Tailwind CSS', aliases: ['tailwind css', 'tailwind', 'tailwindcss'] },
    { name: 'Vue.js', aliases: ['vue', 'vue.js', 'vuejs', 'vue3', 'vue 3', 'nuxt'] },
    { name: 'Angular', aliases: ['angular', 'angular.js', 'angularjs', 'mean'] },
    { name: 'Svelte', aliases: ['svelte', 'sveltekit'] },
    { name: 'HTML5', aliases: ['html', 'html5'] },
    { name: 'CSS3', aliases: ['css', 'css3', 'scss', 'sass', 'less'] },
    { name: 'Redux', aliases: ['redux', 'redux toolkit', 'rtk'] },
    { name: 'Vite', aliases: ['vite', 'vitejs'] },
    { name: 'Webpack', aliases: ['webpack'] },
    { name: 'Bootstrap', aliases: ['bootstrap', 'bootstrap 5'] },
    { name: 'Framer Motion', aliases: ['framer motion', 'motion'] }
  ],
  backend: [
    { name: 'Node.js', aliases: ['node.js', 'nodejs', 'node', 'mern', 'mean'] },
    { name: 'Express', aliases: ['express', 'express.js', 'expressjs', 'mern', 'mean'] },
    { name: 'Python', aliases: ['python', 'py', 'python3', 'django', 'fastapi', 'flask', 'pytorch'] },
    { name: 'Java', aliases: ['java', 'core java', 'spring boot', 'spring'] },
    { name: 'Spring Boot', aliases: ['spring boot', 'springboot', 'spring framework', 'spring mvc'] },
    { name: 'Go', aliases: ['go', 'golang'] },
    { name: 'FastAPI', aliases: ['fastapi'] },
    { name: 'Django', aliases: ['django', 'django rest framework', 'drf'] },
    { name: 'Flask', aliases: ['flask'] },
    { name: 'C++', aliases: ['c++', 'cpp'] },
    { name: 'C#', aliases: ['c#', 'csharp', '.net', 'dotnet', 'asp.net'] },
    { name: 'NestJS', aliases: ['nestjs', 'nest.js'] },
    { name: 'GraphQL', aliases: ['graphql', 'apollo', 'relay'] },
    { name: 'REST API', aliases: ['rest api', 'rest', 'restful', 'api design', 'apis'] },
    { name: 'gRPC', aliases: ['grpc', 'protobuf', 'protocol buffers'] },
    { name: 'WebSockets', aliases: ['websocket', 'websockets', 'socket.io'] },
    { name: 'Microservices', aliases: ['microservices', 'microservice architecture', 'distributed systems'] }
  ],
  database: [
    { name: 'MongoDB', aliases: ['mongodb', 'mongo', 'mongoose', 'mern', 'mean', 'nosql'] },
    { name: 'PostgreSQL', aliases: ['postgresql', 'postgres', 'psql'] },
    { name: 'MySQL', aliases: ['mysql'] },
    { name: 'Redis', aliases: ['redis', 'redis cache', 'in-memory database'] },
    { name: 'SQL', aliases: ['sql', 'relational database', 'rdbms'] },
    { name: 'SQLite', aliases: ['sqlite'] },
    { name: 'Prisma', aliases: ['prisma', 'prisma orm'] },
    { name: 'Firebase', aliases: ['firebase', 'firestore', 'realtime database'] },
    { name: 'Supabase', aliases: ['supabase'] },
    { name: 'DynamoDB', aliases: ['dynamodb'] },
    { name: 'Elasticsearch', aliases: ['elasticsearch', 'elastic'] }
  ],
  cloudDevOps: [
    { name: 'Docker', aliases: ['docker', 'dockerfile', 'containerization', 'docker compose'] },
    { name: 'Kubernetes', aliases: ['kubernetes', 'k8s', 'helm', 'kubectl'] },
    { name: 'AWS', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'ecs', 'eks', 'cloudformation'] },
    { name: 'Google Cloud', aliases: ['gcp', 'google cloud', 'google cloud platform', 'bigquery'] },
    { name: 'Azure', aliases: ['azure', 'microsoft azure'] },
    { name: 'CI/CD', aliases: ['ci/cd', 'github actions', 'jenkins', 'gitlab ci', 'continuous integration'] },
    { name: 'Linux', aliases: ['linux', 'ubuntu', 'debian', 'bash', 'shell scripting', 'unix'] },
    { name: 'Terraform', aliases: ['terraform', 'iac', 'infrastructure as code'] },
    { name: 'Nginx', aliases: ['nginx', 'reverse proxy'] }
  ],
  aiData: [
    { name: 'Machine Learning', aliases: ['machine learning', 'ml', 'scikit-learn', 'sklearn'] },
    { name: 'Deep Learning', aliases: ['deep learning', 'dl', 'neural networks', 'cnn', 'rnn', 'transformer'] },
    { name: 'PyTorch', aliases: ['pytorch', 'torch'] },
    { name: 'TensorFlow', aliases: ['tensorflow', 'tf', 'keras'] },
    { name: 'AI & LLMs', aliases: ['ai', 'artificial intelligence', 'llm', 'llms', 'genai', 'generative ai', 'openai', 'chatgpt', 'claude', 'gemini'] },
    { name: 'NLP', aliases: ['nlp', 'natural language processing', 'huggingface', 'transformers', 'bert', 'spacy'] },
    { name: 'Computer Vision', aliases: ['computer vision', 'opencv', 'yolo', 'image processing'] },
    { name: 'Prompt Engineering', aliases: ['prompt engineering'] },
    { name: 'LangChain', aliases: ['langchain', 'llamaindex', 'rag', 'retrieval-augmented generation'] },
    { name: 'Pandas', aliases: ['pandas'] },
    { name: 'NumPy', aliases: ['numpy'] },
    { name: 'Data Analysis', aliases: ['data analysis', 'data science', 'exploratory data analysis'] },
    { name: 'PowerBI', aliases: ['powerbi', 'power bi', 'tableau'] }
  ],
  toolsMethodologies: [
    { name: 'Git', aliases: ['git', 'version control', 'github', 'gitlab'] },
    { name: 'Figma', aliases: ['figma', 'ui design', 'ux design'] },
    { name: 'UI/UX', aliases: ['ui/ux', 'user experience', 'user interface', 'wireframing', 'prototyping'] },
    { name: 'Agile', aliases: ['agile', 'scrum', 'jira', 'kanban'] },
    { name: 'Postman', aliases: ['postman', 'api testing', 'swagger'] },
    { name: 'Unit Testing', aliases: ['unit testing', 'jest', 'cypress', 'pytest', 'mocha', 'vitest'] },
    { name: 'Cybersecurity', aliases: ['cybersecurity', 'owasp', 'penetration testing', 'security'] }
  ]
};

// Flatten list of all identifiable skills
export const allSkills = Object.values(skillTaxonomy).flatMap(group => group);

export function normalizeSkill(skill) {
  return String(skill || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Universal text extractor for all file formats:
 * 1. Microsoft Word (.docx) -> mammoth
 * 2. PDF (.pdf) -> pdf-parse (primary) with fallback to custom FlateDecode stream decompressor
 * 3. Text (.txt, .md, .json, .rtf) -> utf-8 decoding
 */
export async function extractTextFromBuffer(buffer, fileName = '', fileType = '') {
  if (!buffer || !buffer.length) return '';

  const lowerName = String(fileName || '').toLowerCase();
  const lowerType = String(fileType || '').toLowerCase();

  // 1. Check if DOCX
  if (lowerName.endsWith('.docx') || lowerType.includes('wordprocessingml') || lowerType.includes('officedocument')) {
    if (mammoth && mammoth.extractRawText) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        if (result && result.value && result.value.trim().length > 10) {
          return cleanExtractedText(result.value);
        }
      } catch (docxErr) {
        console.warn('Mammoth docx extraction error:', docxErr.message);
      }
    }
  }

  // 2. Check if PDF by magic bytes or extension
  const isPdf = lowerName.endsWith('.pdf') ||
    lowerType.includes('pdf') ||
    buffer.slice(0, 5).toString('binary').startsWith('%PDF');

  if (isPdf) {
    // Primary: pdf-parse (handles all standard PDFs, ToUnicode font tables, layout)
    if (pdfParse) {
      try {
        const data = await pdfParse(buffer);
        if (data && data.text && data.text.trim().length > 15) {
          return cleanExtractedText(data.text);
        }
      } catch (pdfErr) {
        console.warn('pdf-parse encountered error, attempting stream parser:', pdfErr.message);
      }
    }

    // Secondary fallback: pure Node.js stream decompressor
    const streamText = extractTextFromPdfBuffer(buffer);
    if (streamText && streamText.trim().length > 20) {
      return streamText;
    }
  }

  // 3. Fallback to standard UTF-8 string decoding
  try {
    const rawUtf8 = buffer.toString('utf-8');
    if (rawUtf8 && rawUtf8.trim().length > 0 && !rawUtf8.includes('\ufffd\ufffd\ufffd')) {
      return cleanExtractedText(rawUtf8);
    }
  } catch {}

  // 4. Last resort: extract printable ASCII / word tokens
  const printableTokens = buffer.toString('binary').match(/[a-zA-Z0-9.,+/#@\-_:;() ]{3,}/g) || [];
  return cleanExtractedText(printableTokens.join(' '));
}

/**
 * Robust extraction of plain text from PDF streams using zlib without native binaries.
 */
export function extractTextFromPdfBuffer(buffer) {
  try {
    const rawContent = buffer.toString('binary');
    let extractedText = '';

    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let match;

    while ((match = streamRegex.exec(rawContent)) !== null) {
      const streamData = Buffer.from(match[1], 'binary');
      let textChunk = '';

      try {
        const decompressed = zlib.inflateSync(streamData);
        textChunk = decompressed.toString('latin1');
      } catch {
        try {
          const decompressedRaw = zlib.inflateRawSync(streamData);
          textChunk = decompressedRaw.toString('latin1');
        } catch {
          textChunk = streamData.toString('latin1');
        }
      }

      // Extract PDF text operators
      const tjMatches = textChunk.match(/\(([^)]*)\)\s*Tj/g);
      if (tjMatches) {
        for (const tj of tjMatches) {
          const content = tj.replace(/^\(/, '').replace(/\)\s*Tj$/, '');
          extractedText += ' ' + content;
        }
      }

      const tjArrayMatches = textChunk.match(/\[([^\]]*)\]\s*TJ/g);
      if (tjArrayMatches) {
        for (const tjArr of tjArrayMatches) {
          const innerMatches = tjArr.match(/\(([^)]*)\)/g);
          if (innerMatches) {
            const line = innerMatches.map(m => m.slice(1, -1)).join('');
            extractedText += ' ' + line;
          }
        }
      }
    }

    if (extractedText.trim().length > 30) {
      return cleanExtractedText(extractedText);
    }

    const printableTokens = rawContent.match(/[a-zA-Z0-9.,+/#@\-_:;() ]{4,}/g) || [];
    return cleanExtractedText(printableTokens.join(' '));
  } catch (err) {
    console.warn('PDF stream extraction encountered an error, falling back to raw text:', err.message);
    return cleanExtractedText(buffer.toString('utf-8'));
  }
}

/**
 * Cleans extracted text, removing PDF formatting artifacts and normalizing whitespace.
 */
export function cleanExtractedText(text) {
  return String(text || '')
    .replace(/\\n|\\r|\\t/g, ' ')
    .replace(/\\[0-9]{3}/g, ' ')
    .replace(/\\([()])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Scrapes skills from text using taxonomy and word boundary checks.
 */
export function extractResumeSkills(resumeText = '') {
  const text = String(resumeText || '').toLowerCase();
  if (!text.trim()) {
    return [];
  }

  const detectedSkills = new Map(); // Skill Name -> Category

  for (const [category, skillsList] of Object.entries(skillTaxonomy)) {
    for (const skillDef of skillsList) {
      for (const alias of skillDef.aliases) {
        const normalizedAlias = normalizeSkill(alias);
        if (!normalizedAlias) continue;

        // Escape regex special chars
        const escaped = normalizedAlias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Match word boundaries; allow symbols like +, #, .
        const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');

        if (regex.test(text)) {
          if (!detectedSkills.has(skillDef.name)) {
            detectedSkills.set(skillDef.name, category);
          }
          break;
        }
      }
    }
  }

  return Array.from(detectedSkills.keys());
}

/**
 * Categorizes detected skills into Frontend, Backend, Database, Cloud & DevOps, AI/ML, Tools.
 */
export function categorizeSkills(skills = []) {
  const normalizedSkillSet = new Set(skills.map(s => normalizeSkill(s)));
  const result = {
    frontend: [],
    backend: [],
    database: [],
    cloudDevOps: [],
    aiData: [],
    toolsMethodologies: [],
    other: []
  };

  for (const [catKey, list] of Object.entries(skillTaxonomy)) {
    for (const item of list) {
      if (normalizedSkillSet.has(normalizeSkill(item.name))) {
        result[catKey].push(item.name);
        normalizedSkillSet.delete(normalizeSkill(item.name));
      }
    }
  }

  // Any remaining custom skills
  for (const skill of skills) {
    if (normalizedSkillSet.has(normalizeSkill(skill))) {
      result.other.push(skill);
    }
  }

  return result;
}

/**
 * Extracts candidate details such as links, degree, and generates a concise summary.
 */
export function extractCandidateMetadata(text = '') {
  const githubMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  // Degree detection
  let degreeHint = '';
  if (/b\.?s\.?c?|bachelor|b\.tech|b\.e\./i.test(text)) {
    degreeHint = 'B.S. in Computer Science';
  } else if (/m\.?s\.?c?|master|m\.tech/i.test(text)) {
    degreeHint = 'M.S. in Computer Science';
  } else if (/ph\.?d/i.test(text)) {
    degreeHint = 'Ph.D. in Computer Science';
  }

  return {
    github: githubMatch ? `https://${githubMatch[0]}` : '',
    linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : '',
    email: emailMatch ? emailMatch[0] : '',
    degreeHint
  };
}

/**
 * Generates an executive summary based on extracted skills.
 */
export function generateResumeSummary(skills = [], resumeText = '') {
  if (!skills.length && !resumeText.trim()) {
    return 'Motivated computer science student exploring high-impact opportunities.';
  }

  const topSkills = skills.slice(0, 5).join(', ');
  const cat = categorizeSkills(skills);

  let focus = 'Full-Stack Software Engineering';
  if (cat.aiData.length >= 3) {
    focus = 'Artificial Intelligence & Machine Learning';
  } else if (cat.cloudDevOps.length >= 2 && cat.backend.length >= 2) {
    focus = 'Cloud Infrastructure & Backend Systems';
  } else if (cat.frontend.length >= 3) {
    focus = 'Modern Frontend Architecture & Web Applications';
  }

  return `Aspiring technologist focusing on ${focus} with hands-on proficiency in ${topSkills}. Proven foundation in building scalable solutions and eager to contribute to forward-thinking engineering teams.`;
}

/**
 * Recommends opportunities ranked by match score against extracted skills.
 */
export function recommendOpportunities(listings = [], studentSkills = [], resumeText = '') {
  const skillsToMatch = (studentSkills && studentSkills.length > 0)
    ? studentSkills
    : extractResumeSkills(resumeText);

  if (!listings || !listings.length) {
    return [];
  }

  const normalizedStudentSkills = new Set(skillsToMatch.map(s => normalizeSkill(s)));

  return listings
    .map(listing => {
      const requiredSkills = Array.isArray(listing.skillsRequired) ? listing.skillsRequired : [];
      if (!requiredSkills.length) {
        return {
          ...listing,
          matchScore: 50,
          matchedSkills: [],
          missingSkills: []
        };
      }

      const matchedSkills = [];
      const missingSkills = [];

      for (const requiredSkill of requiredSkills) {
        const normalizedRequired = normalizeSkill(requiredSkill);
        const hasMatch = normalizedStudentSkills.has(normalizedRequired) ||
          [...normalizedStudentSkills].some(s => s.includes(normalizedRequired) || normalizedRequired.includes(s));

        if (hasMatch) {
          matchedSkills.push(requiredSkill);
        } else {
          missingSkills.push(requiredSkill);
        }
      }

      let matchScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);
      if (matchedSkills.length > 0 && matchScore < 45) {
        matchScore = 45;
      }

      return {
        ...listing,
        matchScore,
        matchedSkills,
        missingSkills
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

// Backward compatibility alias
export function recommendOpportunityIds(listings = [], resumeText = '') {
  return recommendOpportunities(listings, [], resumeText)
    .filter(item => item.matchScore > 0)
    .slice(0, 5)
    .map(item => item.id);
}
