import Student from "../department-students/department-students-model.js";
import Faculty from "../department-faculty/department-faculty-model.js";
import Course from "../department-courses/department-courses-model.js";
import Placement from "../department-placements/department-placements-model.js";
import ResearchProject from "../department-research/research-project-model.js";
import ResearchExpense from "../department-research/research-expense-model.js";
import GrantRequest from "../department-research/grant-request-model.js";

export const getOverview = async () => {
  // departmental_health is hardcoded since no KPI target table exists yet
  const departmental_health = {
    placement_rate: 88.5,
    student_retention_rate: 96.2,
    research_target: 74.0,
    curriculum_done: 82.5
  };

  const total_students = await Student.count();
  const faculty_size = await Faculty.count();
  const active_courses = await Course.count({ where: { status: "active" } });

  return {
    department_name: "Computer Science & Engineering Department",
    academic_year: "2025-2026",
    departmental_health,
    stats: {
      total_students,
      enrollment_trend: "+0%", // Hardcoded since no historical snapshot table exists yet
      faculty_size,
      active_courses
    },
    alerts: []
  };
};

export const getCohortDistribution = async () => {
  // Gender diversity and distribution is hardcoded as gender field is not on Student model yet (future enhancement)
  return {
    years: [
      { year: "1st Yr", female_count: 95, male_count: 125 },
      { year: "2nd Yr", female_count: 88, male_count: 112 },
      { year: "3rd Yr", female_count: 92, male_count: 108 },
      { year: "4th Yr", female_count: 85, male_count: 135 }
    ],
    gender_diversity_percentage: 42.8
  };
};

export const getFacultyAttendance = async () => {
  // Faculty attendance data is hardcoded as no faculty attendance table exists yet
  // (Note: this is separate from student attendance_records and would need its own table)
  return {
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
};

export const getPlacements = async () => {
  const totalStudents = await Student.count();

  const fullTimePlacements = await Placement.findAll({
    where: { opportunity_type: "FULL_TIME" }
  });

  const internshipPlacements = await Placement.findAll({
    where: { opportunity_type: "INTERNSHIP" }
  });

  const ftStudentIds = new Set(fullTimePlacements.map(p => p.student_id).filter(Boolean));
  const ftPlacementPercentage = totalStudents > 0
    ? Number(((ftStudentIds.size / totalStudents) * 100).toFixed(1))
    : 0.0;

  const ftAmounts = fullTimePlacements.map(p => p.amount).filter(a => a !== null && a !== undefined);
  const avg_salary_lpa = ftAmounts.length > 0
    ? Number((ftAmounts.reduce((sum, val) => sum + val, 0) / ftAmounts.length).toFixed(1))
    : 0.0;
  const highest_salary_lpa = ftAmounts.length > 0
    ? Math.max(...ftAmounts)
    : 0.0;

  const internStudentIds = new Set(internshipPlacements.map(p => p.student_id).filter(Boolean));
  const internPlacementPercentage = totalStudents > 0
    ? Number(((internStudentIds.size / totalStudents) * 100).toFixed(1))
    : 0.0;

  const internAmounts = internshipPlacements.map(p => p.amount).filter(a => a !== null && a !== undefined);
  const avg_stipend_per_month = internAmounts.length > 0
    ? Number((internAmounts.reduce((sum, val) => sum + val, 0) / internAmounts.length).toFixed(1))
    : 0.0;
  const highest_stipend_per_month = internAmounts.length > 0
    ? Math.max(...internAmounts)
    : 0.0;

  return {
    full_time: {
      placement_percentage: ftPlacementPercentage,
      avg_salary_lpa,
      highest_salary_lpa,
      total_offers: fullTimePlacements.length
    },
    internships: {
      placement_percentage: internPlacementPercentage,
      avg_stipend_per_month,
      highest_stipend_per_month,
      total_offers: internshipPlacements.length
    }
  };
};

export const getResearch = async () => {
  const projects = await ResearchProject.findAll();
  if (projects.length === 0) {
    return {
      total_funding_cr: 0.0,
      utilization_rate_percentage: 0.0,
      active_grants: 0,
      total_fees_cr: 0.0,
      spent_cr: 0.0
    };
  }

  const total_budget = projects.reduce((sum, p) => sum + (p.total_budget_inr || 0), 0);
  const total_funding_cr = Number((total_budget / 10000000).toFixed(2));

  const expenses = await ResearchExpense.findAll();
  const total_spent = expenses.reduce((sum, e) => sum + (e.amount_inr || 0), 0);
  const spent_cr = Number((total_spent / 10000000).toFixed(2));

  const utilization_rate_percentage = total_budget > 0
    ? Number(((total_spent / total_budget) * 100).toFixed(2))
    : 0.0;

  const active_grants = await GrantRequest.count({
    where: { status: "Pending" }
  });

  // Hardcoded — no separate fees tracking exists (distinct from research budget)
  const total_fees_cr = 0.0;

  return {
    total_funding_cr,
    utilization_rate_percentage,
    active_grants,
    total_fees_cr,
    spent_cr
  };
};
