const placements = [
  {
    batch: "2021-2025",
    placed_count: 485,
    total_count: 550,
    placement_percentage: 88,
    avg_package_lpa: 8.5,
    highest_package_lpa: 42,
    top_hiring_sectors: ["IT/Software", "FinTech", "EdTech"]
  },
  {
    batch: "2022-2026",
    placed_count: 320,
    total_count: 600,
    placement_percentage: 53,
    avg_package_lpa: 9.2,
    highest_package_lpa: 48,
    top_hiring_sectors: ["Automotive", "Software", "E-commerce"]
  }
];

const internships = [
  {
    batch: "2021-2025",
    secured_count: 310,
    total_count: 550,
    placement_percentage: 56,
    avg_stipend_per_month: 28500,
    highest_stipend_per_month: 120000,
    top_hiring_sectors: ["Software", "Research"]
  },
  {
    batch: "2022-2026",
    secured_count: 410,
    total_count: 600,
    placement_percentage: 68,
    avg_stipend_per_month: 31000,
    highest_stipend_per_month: 150000,
    top_hiring_sectors: ["FinTech", "Cybersecurity"]
  }
];

const ecosystem = {
  partner_companies: 4,
  sectors: 4,
  hired: 64,
  openings: 20,
  top_hiring_sectors: ["Software Development", "FinTech", "Cloud Infrastructure", "Industrial"]
};

const companies = [
  {
    id: "comp-001",
    name: "TechNova Solutions",
    tier: "Tier 1",
    sector: "Software Development",
    location: "San Francisco, CA",
    status: "Active",
    lifetime_hires: 20,
    latest_package_lpa: 14,
    recruiter: {
      name: "Sarah Miller",
      email: "hr@technova.io"
    },
    active_opportunities: [
      { title: "Full Stack Intern", type: "Internship", positions: 5 },
      { title: "SDE-1", type: "Full-Time Offer", positions: 3 }
    ],
    placement_history: [
      { batch: "2021-2025", placed: 12, avg_ctc_lpa: 12.5 },
      { batch: "2022-2026", placed: 8, avg_ctc_lpa: 14 }
    ]
  },
  {
    id: "comp-002",
    name: "BlueBird Finance",
    tier: "Tier 1",
    sector: "FinTech",
    location: "Mumbai, India",
    status: "Active",
    lifetime_hires: 25,
    latest_package_lpa: 16,
    recruiter: {
      name: "Priya Sharma",
      email: "placements@bluebird.in"
    },
    active_opportunities: [
      { title: "Financial Analyst", type: "Full-Time Offer", positions: 4 }
    ],
    placement_history: [
      { batch: "2021-2025", placed: 15, avg_ctc_lpa: 14 },
      { batch: "2022-2026", placed: 10, avg_ctc_lpa: 16 }
    ]
  },
  {
    id: "comp-003",
    name: "CloudStream Systems",
    tier: "Super Dream",
    sector: "Cloud Infrastructure",
    location: "Seattle, WA",
    status: "Inactive",
    lifetime_hires: 4,
    latest_package_lpa: 32,
    recruiter: {
      name: "James Kotler",
      email: "campus@cloudstream.com"
    },
    active_opportunities: [],
    placement_history: [
      { batch: "2021-2025", placed: 4, avg_ctc_lpa: 28 }
    ]
  },
  {
    id: "comp-004",
    name: "Apex Manufacturing",
    tier: "Tier 2",
    sector: "Industrial",
    location: "Detroit, MI",
    status: "Active",
    lifetime_hires: 15,
    latest_package_lpa: 7,
    recruiter: {
      name: "Linda Park",
      email: "hr@apexmfg.com"
    },
    active_opportunities: [
      { title: "Operations Intern", type: "Internship", positions: 8 }
    ],
    placement_history: [
      { batch: "2021-2025", placed: 10, avg_ctc_lpa: 6.5 },
      { batch: "2022-2026", placed: 5, avg_ctc_lpa: 7 }
    ]
  }
];

const partner_insights = {
  tier_1_count: 2,
  sectors_count: 4,
  top_hiring_sectors: ["Software Development", "FinTech", "Cloud Infrastructure", "Industrial"]
};

export const getAllPlacements = async () => {
  return {
    placements,
    internships,
    ecosystem
  };
};

export const getBatchStats = async () => {
  return {
    placements,
    internships
  };
};

export const getCompanyList = async () => {
  return {
    total_partners: companies.length,
    partner_insights,
    companies: companies.map(c => ({
      id: c.id,
      name: c.name,
      tier: c.tier,
      sector: c.sector,
      location: c.location,
      status: c.status
    }))
  };
};

export const getCompanyDetails = async (id) => {
  const company = companies.find(c => c.id === id);
  return company || null;
};

export const createJobOpening = async (data) => {
  return {
    success: true,
    message: "Job opening created successfully",
    data
  };
};
