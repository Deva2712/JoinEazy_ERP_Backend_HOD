const performanceTrends = {
  years: [
    {
      year: "2022-23",
      avg_cgpa: 7.6,
      pass_percentage: 91,
      top_performers_count: 24
    },
    {
      year: "2023-24",
      avg_cgpa: 7.8,
      pass_percentage: 93,
      top_performers_count: 32
    },
    {
      year: "2024-25",
      avg_cgpa: 8.1,
      pass_percentage: 95,
      top_performers_count: 45
    }
  ],
  overall_trend: "improving"
};

const comparisonData = {
  departments: [
    {
      name: "Computer Science & Engineering",
      code: "CSE",
      avg_cgpa: 8.1,
      placement_rate: 88,
      research_output: 18,
      faculty_count: 24
    },
    {
      name: "Electronics & Communication Engineering",
      code: "ECE",
      avg_cgpa: 7.9,
      placement_rate: 82,
      research_output: 12,
      faculty_count: 20
    },
    {
      name: "Mechanical Engineering",
      code: "ME",
      avg_cgpa: 7.4,
      placement_rate: 74,
      research_output: 8,
      faculty_count: 18
    },
    {
      name: "Electrical & Electronics Engineering",
      code: "EEE",
      avg_cgpa: 7.5,
      placement_rate: 76,
      research_output: 9,
      faculty_count: 15
    },
    {
      name: "Civil Engineering",
      code: "CE",
      avg_cgpa: 7.2,
      placement_rate: 68,
      research_output: 5,
      faculty_count: 12
    }
  ],
  base_department: "CSE"
};

const predictiveInsights = {
  predicted_enrollment: 150,
  predicted_placement_rate: 92,
  at_risk_students_count: 12,
  predicted_research_output: 22,
  confidence_percentage: 85,
  insights: [
    {
      category: "Enrollment",
      message: "Predicted 15% increase in CSE new enrollments next term, requiring additional lab resources.",
      severity: "medium"
    },
    {
      category: "Academic Performance",
      message: "12 students are flagged at-risk of falling below 75% attendance/minimum GPA. Targeted mentoring is recommended.",
      severity: "high"
    },
    {
      category: "Placements",
      message: "Strong hiring pipeline from Tier 1 partners indicates a high placement rate exceeding 90% for the upcoming batch.",
      severity: "low"
    },
    {
      category: "Research",
      message: "Projected 22% increase in research paper submissions due to 3 newly approved external funding grants.",
      severity: "low"
    }
  ]
};

export const getPerformanceTrends = async () => {
  return performanceTrends;
};

export const getComparison = async () => {
  return comparisonData;
};

export const getPredictions = async () => {
  return predictiveInsights;
};
