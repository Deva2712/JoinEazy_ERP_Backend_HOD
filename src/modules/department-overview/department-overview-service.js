// Realistic Mock Data for Department Overview

const mockOverview = {
  department_name: "Computer Science & Engineering Department",
  academic_year: "2025-2026",
  departmental_health: {
    placement_rate: 88.5,
    student_retention_rate: 96.2,
    research_target: 74.0,
    curriculum_done: 82.5
  },
  stats: {
    total_students: 840,
    enrollment_trend: "+3.4%",
    faculty_size: 42,
    active_courses: 28
  },
  alerts: []
};

const mockCohortDistribution = {
  years: [
    { year: "1st Yr", female_count: 95, male_count: 125 },
    { year: "2nd Yr", female_count: 88, male_count: 112 },
    { year: "3rd Yr", female_count: 92, male_count: 108 },
    { year: "4th Yr", female_count: 85, male_count: 135 }
  ],
  gender_diversity_percentage: 42.8
};

const mockFacultyAttendance = {
  avg_attendance_percentage: 94.6,
  counts: {
    present: 38,
    absent: 1,
    late: 2,
    on_leave: 1
  },
  monthly_data: [
    { month: "Jan", attendance_percentage: 95.2 },
    { month: "Feb", attendance_percentage: 94.8 },
    { month: "Mar", attendance_percentage: 96.0 },
    { month: "Apr", attendance_percentage: 93.5 },
    { month: "May", attendance_percentage: 95.0 },
    { month: "Jun", attendance_percentage: 93.1 }
  ]
};

const mockPlacements = {
  full_time: {
    placement_percentage: 85.4,
    avg_salary_lpa: 8.5,
    highest_salary_lpa: 44.0,
    total_offers: 180
  },
  internships: {
    placement_percentage: 72.1,
    avg_stipend_per_month: 25000,
    highest_stipend_per_month: 80000,
    total_offers: 120
  }
};

const mockResearch = {
  total_funding_cr: 4.8,
  utilization_rate_percentage: 78.5,
  active_grants: 12,
  total_fees_cr: 1.2,
  spent_cr: 3.77
};

export const getOverview = async () => {
  return mockOverview;
};

export const getCohortDistribution = async () => {
  return mockCohortDistribution;
};

export const getFacultyAttendance = async () => {
  return mockFacultyAttendance;
};

export const getPlacements = async () => {
  return mockPlacements;
};

export const getResearch = async () => {
  return mockResearch;
};
