// Realistic Mock Data for Department Research

const researchOverview = {
  total_budget_inr: 1250000,
  remaining_balance_inr: 838000,
  utilization_rate_percentage: 32.96,
  research_works_count: 5,
  popular_research: [
    {
      id: "res-001",
      title: "Neuro-Symbolic Reasoning in Large Language Models",
      authors: ["Dr. Victor Von Neumann", "Dr. Elizabeth H."]
    },
    {
      id: "res-002",
      title: "Scalable Neural Networks for Edge Computing",
      authors: ["Dr. Jane Smith", "Kevin Wright", "Dr. Liu Wei"]
    },
    {
      id: "res-003",
      title: "Ethical Implications of Autonomous Defense Systems",
      authors: ["Prof. Alan Turing", "Dr. Jane Smith", "Kyle R."]
    },
    {
      id: "res-004",
      title: "AI-Driven Climate Modeling",
      authors: ["Dr. Jane Smith", "Dr. Robert Chen", "Sarah J."]
    }
  ]
};

const pipeline = {
  approved: 45,
  pending: 2,
  rejection_rate_percentage: 15
};

const grants = [
  {
    id: "grant-001",
    title: "National Science Foundation: Climate Tech Grant",
    status: "Pending",
    date: "2026-03-15",
    amount_inr: 50000,
    research_work: "AI Driven Climate Modeling",
    supporting_documents: [
      { name: "Project_Proposal.pdf", type: "pdf" },
      { name: "Budget_Breakdown.xlsx", type: "xlsx" }
    ],
    justification: "Funding required for high compute GPU instances to train GAN architectures and travel for coastal field data collection."
  },
  {
    id: "grant-002",
    title: "International Travel Grant - HRI 2026",
    status: "Resubmitted",
    date: "2026-04-01",
    amount_inr: 2200,
    research_work: "Human-Robot Interaction in Pediatric Care",
    supporting_documents: [
      { name: "Updated_CV_and_Travel_History.pdf", type: "pdf" }
    ],
    justification: "Revised application including full travel history and updated publication record as requested by the admin office.",
    previous_submission: {
      note: "Has previous submission details"
    }
  }
];

const monthly_expense_trends = [
  { month: "Jan", amount_inr: 45000 },
  { month: "Feb", amount_inr: 52000 },
  { month: "Mar", amount_inr: 125000 },
  { month: "Apr", amount_inr: 157000 }
];

const allocationBreakdown = {
  total_inr: 1250000,
  breakdown: [
    { category: "Personnel & Stipends", percentage: 52, amount_inr: 650000 },
    { category: "Equipment & Hardware", percentage: 24, amount_inr: 300000 },
    { category: "Travel & Conferences", percentage: 12, amount_inr: 150000 },
    { category: "Operations & Admin", percentage: 12, amount_inr: 150000 }
  ]
};

export const getAllResearch = async () => {
  return researchOverview;
};

export const getGrantRequests = async () => {
  return {
    pipeline,
    grants
  };
};

export const getResearchExpenses = async () => {
  return {
    monthly_expense_trends
  };
};

export const getAllocationBreakdown = async () => {
  return allocationBreakdown;
};

export const approveGrant = async (id, decision) => {
  const grant = grants.find(g => g.id === id);
  if (!grant) return null;
  
  if (decision === "approve") {
    grant.status = "Approved";
  } else if (decision === "reject") {
    grant.status = "Rejected";
  }
  
  return grant;
};
