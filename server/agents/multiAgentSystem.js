import { Anthropic } from '@anthropic-ai/sdk';
import * as tools from '../tools/mcpTools.js';

// Initialize Anthropic client if key is present
const apiKey = process.env.CLAUDE_API_KEY || '';
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

// Multi-Agent Personas and System Prompts
const AGENT_PROMPTS = {
  career: "You are the Career Recommendation Agent. Analyze the user profile (interests, skills, budget, preferred country) and suggest the best career paths from the database.",
  college: "You are the College Agent. Match and rank universities based on budget, career compatibility, PR pathways, and placement rates.",
  scholarship: "You are the Scholarship Agent. Evaluate the user's marks and income against scholarships, calculating eligibility odds and improvements.",
  salary: "You are the Salary Intelligence Agent. Forecast future salaries, inflation adjustments, and highlight potential AI automation risks.",
  country: "You are the Country Advisor Agent. Advise on visas, PR options, healthcare, and cost of living compared to savings potentials.",
  roadmap: "You are the Roadmap Planner Agent. Detail exact study milestones, training, and certifications required to achieve a career.",
  skillGap: "You are the Skill Gap Agent. Inspect user skills, calculate readiness, and advise on certificates and self-learning schedules.",
  costCalculator: "You are the Cost Calculator Agent. Calculate ROI, break-even timelines, and compute net ten-year values of degrees.",
  futureDemand: "You are the Future Demand Agent. Forecast automation risks and job stability factors for different careers."
};

// 1. Career Recommendation Agent
export const runCareerAgent = async (profile) => {
  const matchingCareers = tools.careerSearchTool({
    interests: profile.interests,
    difficulty: profile.difficulty
  });
  
  if (anthropic) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: AGENT_PROMPTS.career,
        messages: [{
          role: "user",
          content: `Profile: ${JSON.stringify(profile)}. Matched Database Careers: ${JSON.stringify(matchingCareers)}.`
        }]
      });
      return { analysis: response.content[0].text, careers: matchingCareers };
    } catch (e) {
      console.warn("Claude API failed, falling back to mock response", e);
    }
  }

  // Graceful fallback
  const topMatch = matchingCareers[0]?.name || "Chartered Accountant";
  const reasoning = `Based on your high aptitude in ${profile.interests.join(', ')}, we highly recommend pursuing a career as a ${topMatch}. This aligns with your budget of ${profile.budget} and target country ${profile.preferredCountry}.`;
  return { analysis: reasoning, careers: matchingCareers };
};

// 2. College Agent
export const runCollegeAgent = async (profile, careerId) => {
  const colleges = tools.collegeSearchTool({
    country: profile.preferredCountry,
    maxBudget: profile.budget
  });

  if (anthropic) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: AGENT_PROMPTS.college,
        messages: [{
          role: "user",
          content: `Career Goal: ${careerId}. Profile: ${JSON.stringify(profile)}. Available Colleges: ${JSON.stringify(colleges)}.`
        }]
      });
      return { analysis: response.content[0].text, colleges };
    } catch (e) {
      console.warn("Claude API failed, falling back to mock response", e);
    }
  }

  const matches = colleges.slice(0, 3).map(c => c.name).join(', ');
  const reasoning = `The top colleges matching your profile are ${matches || 'SRCC & University of Toronto'}. These provide solid placement opportunities within your budget constraints.`;
  return { analysis: reasoning, colleges };
};

// 3. Scholarship Agent
export const runScholarshipAgent = async (profile) => {
  const scholarships = tools.scholarshipSearchTool({
    country: profile.preferredCountry,
    minMarks: profile.marks || "90",
    income: profile.familyIncome || "300000"
  });

  if (anthropic) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: AGENT_PROMPTS.scholarship,
        messages: [{
          role: "user",
          content: `Profile: ${JSON.stringify(profile)}. Matches: ${JSON.stringify(scholarships)}.`
        }]
      });
      return { analysis: response.content[0].text, scholarships };
    } catch (e) {
      console.warn("Claude API failed, falling back to mock response", e);
    }
  }

  const eligibleNames = scholarships.map(s => s.name).join(', ');
  const reasoning = scholarships.length > 0
    ? `You qualify for ${scholarships.length} scholarships: ${eligibleNames}. Focus on maintaining a strong GPA and acquiring recommendations to boost selection odds.`
    : `No direct scholarships match your marks/income profile. We suggest looking at domestic state grants or university-specific need-based bursaries.`;
  
  return { analysis: reasoning, scholarships };
};

// 4. Salary Intelligence & Future Demand Agents
export const runSalaryAgent = async (careerId) => {
  const salaryData = tools.salaryLookupTool(careerId);

  if (anthropic && salaryData) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: AGENT_PROMPTS.salary,
        messages: [{
          role: "user",
          content: `Analyze salary trends and AI disruption risk for ${careerId}: ${JSON.stringify(salaryData)}.`
        }]
      });
      return { analysis: response.content[0].text, salaryData };
    } catch (e) {
      console.warn("Claude API failed, falling back to mock response", e);
    }
  }

  const automationRiskText = salaryData
    ? `AI Automation Risk is ${Math.round(salaryData.automationRisk * 100)}%. Growth rate is ${salaryData.growthRate} annually.`
    : "Salary growth is stable around 12-15% annually with moderate AI disruption risk.";

  return { analysis: automationRiskText, salaryData };
};

// 5. Country Advisor Agent
export const runCountryAgent = async (countryName) => {
  const countryData = tools.countryInformationTool(countryName);

  if (anthropic && countryData) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: AGENT_PROMPTS.country,
        messages: [{
          role: "user",
          content: `Country Profile: ${JSON.stringify(countryData)}.`
        }]
      });
      return { analysis: response.content[0].text, countryData };
    } catch (e) {
      console.warn("Claude API failed, falling back to mock response", e);
    }
  }

  const prText = countryData
    ? `PR potential is ${countryData.prPossibility} via professional visa routes. Cost of living is ${countryData.livingCost} with avg salary of ${countryData.avgSalary}.`
    : "Visa processing times average 2-4 months with standard post-study work rights.";

  return { analysis: prText, countryData };
};

// 6. Roadmap Planner Agent & Skill Gap Agent
export const runRoadmapAndSkillsAgent = async (profile, careerId) => {
  const timeline = tools.roadmapBuilder(careerId);
  const gapAnalysis = tools.skillGapAnalyzer(profile.skills || [], careerId);

  if (anthropic) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: AGENT_PROMPTS.roadmap,
        messages: [{
          role: "user",
          content: `Career: ${careerId}. Profile Skills: ${JSON.stringify(profile.skills)}. Required steps: ${JSON.stringify(timeline)}. Gap: ${JSON.stringify(gapAnalysis)}.`
        }]
      });
      return { analysis: response.content[0].text, timeline, gapAnalysis };
    } catch (e) {
      console.warn("Claude API failed, falling back to mock response", e);
    }
  }

  const missing = gapAnalysis.missingSkills.join(', ');
  const advice = `Your career readiness for this path is ${gapAnalysis.readiness}%. To fill the skill gaps, we recommend acquiring proficiency in: ${missing || 'Excel, Auditing, Financial Modelling'}.`;

  return { analysis: advice, timeline, gapAnalysis };
};

// 7. Cost Calculator & ROI Agent
export const runRoiAgent = async (inputs) => {
  const roiData = tools.costRoiCalculator(inputs);
  
  if (anthropic) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: AGENT_PROMPTS.costCalculator,
        messages: [{
          role: "user",
          content: `Inputs: ${JSON.stringify(inputs)}. Results: ${JSON.stringify(roiData)}.`
        }]
      });
      return { analysis: response.content[0].text, roiData };
    } catch (e) {
      console.warn("Claude API failed, falling back to mock response", e);
    }
  }

  const analysisText = `Based on a total investment of ₹${(roiData.totalInvestment).toLocaleString()}, you will achieve break-even in approximately ${roiData.breakEvenYears} years, yielding a 10-year Net Career Value of ₹${(roiData.netTenYearCareerValue).toLocaleString()}.`;

  return { analysis: analysisText, roiData };
};

// 8. Orchestrator Agent (Aggregates all other specialized agent outputs)
export const orchestrateCareerQuery = async (profile, userQuery) => {
  console.log(`[Orchestrator] Routing query: "${userQuery}" for user: ${profile.name}`);

  // Fetch data asynchronously using specialized agents
  const careerTask = runCareerAgent(profile);
  const scholarshipTask = runScholarshipAgent(profile);
  const countryTask = runCountryAgent(profile.preferredCountry || 'Canada');

  const [careerResult, scholarshipResult, countryResult] = await Promise.all([
    careerTask,
    scholarshipTask,
    countryTask
  ]);

  // Use the top recommended career to extract roadmap & salary
  const primaryCareerId = careerResult.careers[0]?.id || 'chartered-accountant';
  const collegeTask = runCollegeAgent(profile, primaryCareerId);
  const salaryTask = runSalaryAgent(primaryCareerId);
  const roadmapTask = runRoadmapAndSkillsAgent(profile, primaryCareerId);

  const [collegeResult, salaryResult, roadmapResult] = await Promise.all([
    collegeTask,
    salaryTask,
    roadmapTask
  ]);

  // Aggregate results inside the Career Report Generator Agent
  const finalSummary = `### Summary Report for ${profile.name}
- **Top Career Match**: **${careerResult.careers[0]?.name || 'Chartered Accountant'}** (${roadmapResult.gapAnalysis.readiness}% Readiness)
- **Salary Prospects**: ${salaryResult.salaryData?.avgSalaryIndia || '₹8.5 LPA'} average starting salary.
- **Top University Recommendation**: ${collegeResult.colleges[0]?.name || 'SRCC, Delhi'}
- **Best Scholarship Match**: ${scholarshipResult.scholarships[0]?.name || 'Reliance Foundation Undergraduate Scholarship'}
- **Study Abroad Advisor**: ${countryResult.countryData?.name || 'Canada'} visa difficulty is ${countryResult.countryData?.visaDifficulty || 'Medium'}.
- **Action Plan**: Focus on closing skills gaps: *${roadmapResult.gapAnalysis.missingSkills.join(', ')}*.`;

  return {
    summary: finalSummary,
    careers: careerResult.careers,
    colleges: collegeResult.colleges,
    scholarships: scholarshipResult.scholarships,
    country: countryResult.countryData,
    salary: salaryResult.salaryData,
    roadmap: roadmapResult.timeline,
    skills: roadmapResult.gapAnalysis,
    activeAgent: "Orchestrator Agent (Completed merging Specialized Sub-Agents' advice)"
  };
};
