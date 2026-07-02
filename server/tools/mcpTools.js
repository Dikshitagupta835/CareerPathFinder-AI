import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load data
const loadJSON = (filename) => {
  try {
    const filePath = path.join(__dirname, '..', 'data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading file ${filename}:`, error);
    return [];
  }
};

export const careerSearchTool = (query = {}) => {
  const careers = loadJSON('careers.json');
  return careers.filter(c => {
    let match = true;
    if (query.category && c.category.toLowerCase() !== query.category.toLowerCase()) match = false;
    if (query.difficulty && c.difficulty.toLowerCase() !== query.difficulty.toLowerCase()) match = false;
    if (query.interests && query.interests.length > 0) {
      // check if any of the interest keywords match required skills or category
      const keywords = query.interests.map(i => i.toLowerCase());
      const cKeywords = [c.name, c.category, ...c.requiredSkills].map(x => x.toLowerCase());
      const hasOverlap = keywords.some(k => cKeywords.some(ck => ck.includes(k)));
      if (!hasOverlap) match = false;
    }
    return match;
  });
};

export const collegeSearchTool = (query = {}) => {
  const colleges = loadJSON('colleges.json');
  return colleges.filter(col => {
    let match = true;
    if (query.country && col.country.toLowerCase() !== query.country.toLowerCase()) match = false;
    if (query.city && col.city.toLowerCase() !== query.city.toLowerCase()) match = false;
    if (query.maxBudget) {
      // parse fee (e.g. ₹2,50,000 / year or $45,000 / year)
      const numericFee = parseCurrency(col.fees);
      if (numericFee > query.maxBudget) match = false;
    }
    if (query.scholarshipsAvailable && col.scholarships.toLowerCase() === 'no') match = false;
    return match;
  });
};

export const scholarshipSearchTool = (query = {}) => {
  const scholarships = loadJSON('scholarships.json');
  return scholarships.filter(s => {
    let match = true;
    if (query.country && s.country.toLowerCase() !== 'global' && s.country.toLowerCase() !== query.country.toLowerCase()) match = false;
    if (query.minMarks && s.minMarks) {
      const minVal = parseFloat(s.minMarks.replace(/[^0-9.]/g, ''));
      const userVal = parseFloat(query.minMarks);
      if (!isNaN(minVal) && !isNaN(userVal) && userVal < minVal) match = false;
    }
    if (query.income && s.incomeCap) {
      const capVal = parseCurrency(s.incomeCap);
      const userVal = parseFloat(query.income);
      if (!isNaN(capVal) && !isNaN(userVal) && userVal > capVal) match = false;
    }
    return match;
  });
};

export const salaryLookupTool = (careerId) => {
  const salaries = loadJSON('salaries.json');
  return salaries.find(s => s.careerId === careerId) || null;
};

export const countryInformationTool = (countryName) => {
  const countries = loadJSON('countries.json');
  return countries.find(c => c.name.toLowerCase() === countryName.toLowerCase() || c.id.toLowerCase() === countryName.toLowerCase()) || null;
};

export const roadmapBuilder = (careerId) => {
  const careers = loadJSON('careers.json');
  const career = careers.find(c => c.id === careerId);
  if (!career) return [];

  // Simulate customized roadmap details
  const roadmapTemplates = {
    "chartered-accountant": [
      { step: "Class 11 & 12 Commerce", duration: "2 Years", description: "Build fundamentals in Accounting, Economics, and Business Studies. Maintain > 80% marks.", status: "completed", salary: "₹0" },
      { step: "CA Foundation Exam", duration: "6 Months", description: "Register with ICAI and pass the Foundation exam covering accounting, mercantile law, and quantitative aptitude.", status: "active", salary: "₹0" },
      { step: "CA Intermediate & Graduation", duration: "1.5 Years", description: "Prepare and clear both groups of the CA Intermediate exam. Pursue a correspondence BCom degree.", status: "upcoming", salary: "₹0" },
      { step: "Articleship Training", duration: "2 Years", description: "Undergo mandatory practical training under a practicing CA. Gain real-world auditing experience.", status: "upcoming", salary: "₹10,000 / month (Stipend)" },
      { step: "CA Final Exam", duration: "6 Months", description: "Pass the highly rigorous CA Final exams. Enroll as a member of ICAI.", status: "upcoming", salary: "₹0" },
      { step: "Senior Auditor / Finance Manager", duration: "3-5 Years", description: "Lead audits, analyze company portfolios, and transition into management positions.", status: "upcoming", salary: "₹12 LPA" },
      { step: "CFO (Chief Financial Officer)", duration: "10+ Years", description: "Steer corporate financial strategy, lead executive decisions, and manage investor relations.", status: "upcoming", salary: "₹35+ LPA" }
    ],
    "financial-analyst": [
      { step: "Class 11 & 12 Commerce/Arts", duration: "2 Years", description: "Acquire basic skills in Mathematics, Statistics, and Finance.", status: "completed", salary: "₹0" },
      { step: "Bachelor's in Commerce / Finance", duration: "3 Years", description: "Complete a BCom Hons or BBA in Finance from a reputed university. Focus on SQL, Excel, and Statistics.", status: "active", salary: "₹0" },
      { step: "CFA Level 1 Exam", duration: "1 Year", description: "Self-study and clear Level 1 of the Chartered Financial Analyst (CFA) curriculum.", status: "upcoming", salary: "₹4 LPA (Entry Level)" },
      { step: "Junior Analyst Role", duration: "2 Years", description: "Work in research, wealth management, or corporate financial planning. Clear CFA Level 2.", status: "upcoming", salary: "₹7.5 LPA" },
      { step: "Senior Analyst / Portfolio Manager", duration: "5 Years", description: "Clear CFA Level 3. Manage asset allocations and evaluate investment deals.", status: "upcoming", salary: "₹15 LPA" }
    ]
  };

  // Fallback template for other careers
  const fallbackTimeline = [
    { step: "High School Preparation", duration: "2 Years", description: "Develop basic quantitative and communication skills.", status: "completed", salary: "₹0" },
    { step: "Bachelor's Degree", duration: "3-4 Years", description: "Earn a degree relevant to the discipline, pursuing summer internships.", status: "active", salary: "₹0" },
    { step: "Professional Certifications", duration: "1 Year", description: "Acquire specialized industry credentials.", status: "upcoming", salary: "₹0" },
    { step: "Entry-Level Position", duration: "2 Years", description: "Gain practical experience, learn team methodologies, and build portfolio.", status: "upcoming", salary: "₹6 LPA" },
    { step: "Senior Practitioner / Specialist", duration: "5 Years", description: "Transition into strategic design and decision-making roles.", status: "upcoming", salary: "₹15 LPA" }
  ];

  return roadmapTemplates[careerId] || fallbackTimeline.map((step, idx) => {
    if (idx === 3) return { ...step, step: `Junior ${career.name}` };
    if (idx === 4) return { ...step, step: `Senior ${career.name}`, salary: career.avgSalaryIndia };
    return step;
  });
};

export const costRoiCalculator = (inputs = {}) => {
  const fees = parseFloat(inputs.collegeFees) || 0;
  const livingCost = parseFloat(inputs.livingExpenses) || 0;
  const years = parseFloat(inputs.duration) || 3;
  const scholarship = parseFloat(inputs.scholarshipAmount) || 0;
  const expectedSalaryStr = inputs.expectedSalary || "₹6,00,000";

  const totalTuition = fees * years;
  const totalLiving = livingCost * 12 * years;
  const totalInvestment = Math.max(0, (totalTuition + totalLiving) - scholarship);

  // Parse average annual expected salary
  const annualSalary = parseCurrency(expectedSalaryStr);

  // Calculate Break-even Time (years)
  const monthlySalary = annualSalary / 12;
  const estimatedTaxRate = 0.15; // assumption
  const netMonthlyInHand = monthlySalary * (1 - estimatedTaxRate);
  
  // Living expenses after graduation (e.g. 40% of income is saved)
  const savingsRate = 0.40;
  const monthlySavings = netMonthlyInHand * savingsRate;

  let breakEvenYears = 0;
  if (monthlySavings > 0) {
    breakEvenYears = parseFloat((totalInvestment / (monthlySavings * 12)).toFixed(1));
  }

  // 10-year ROI
  const tenYearEarnings = annualSalary * 10 * 1.1; // assuming 10% average raise
  const netVal = tenYearEarnings - totalInvestment;
  const roiPercent = totalInvestment > 0 ? Math.round((netVal / totalInvestment) * 100) : 1000;

  return {
    totalInvestment,
    breakEvenYears,
    roiPercent,
    netTenYearCareerValue: Math.round(netVal)
  };
};

export const skillGapAnalyzer = (userSkills = [], careerId) => {
  const careers = loadJSON('careers.json');
  const career = careers.find(c => c.id === careerId);
  if (!career) return { readiness: 0, missingSkills: [], matchSkills: [] };

  const required = career.requiredSkills || [];
  const lowercaseUser = userSkills.map(s => s.toLowerCase());

  const matchSkills = required.filter(s => lowercaseUser.includes(s.toLowerCase()));
  const missingSkills = required.filter(s => !lowercaseUser.includes(s.toLowerCase()));

  const readiness = required.length > 0 ? Math.round((matchSkills.length / required.length) * 100) : 100;

  return {
    readiness,
    matchSkills,
    missingSkills,
    difficulty: career.difficulty
  };
};

// Internal parsing helpers
function parseCurrency(str) {
  if (!str) return 0;
  // strips formatting to extract digits e.g. ₹2,50,000 / year -> 250000
  const normalizedStr = str.replace(/,/g, '');
  const match = normalizedStr.match(/\d+/);
  if (!match) return 0;
  let val = parseFloat(match[0]);
  if (str.includes('$') || str.includes('USD')) {
    val = val * 83; // convert USD/CAD to INR for simple relative comparison if needed
  }
  return val;
}
