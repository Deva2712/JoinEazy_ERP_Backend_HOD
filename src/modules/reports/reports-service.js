const faculties = [
  {
    id: "fac-001",
    name: "Dr. Priya Sharma",
    designation: "Associate Professor",
    department: "Computer Science",
    courses_teaching: ["CS101", "CS301"],
    research_projects: 3,
    publications_count: 12,
    avg_student_feedback: 4.3,
    attendance_marked_percentage: 91
  },
  {
    id: "fac-002",
    name: "Prof. Ramesh Kumar",
    designation: "Assistant Professor",
    department: "Computer Science",
    courses_teaching: ["CS201", "MA101"],
    research_projects: 1,
    publications_count: 5,
    avg_student_feedback: 3.9,
    attendance_marked_percentage: 78
  }
];

const students = [
  {
    id: "stu-001",
    name: "John Doe",
    roll_number: "ST21BTECH11001",
    batch: "2021-2025",
    section: "CSE-A",
    semester: 4,
    cgpa: 8.0,
    attendance_percentage: 88,
    backlogs: 0,
    semester_performance: [
      { semester: 1, gpa: 7.68 },
      { semester: 2, gpa: 8.02 },
      { semester: 3, gpa: 8.22 }
    ],
    placement_and_internships: [
      {
        title: "Full Stack Intern",
        company: "TechNova Solutions",
        type: "Internship",
        status: "Shortlisted"
      }
    ],
    research_work: [
      { id: "res-002", status: "Active Project", title: "AI-Driven Climate Modeling" }
    ]
  },
  {
    id: "stu-002",
    name: "Alice Johnson",
    roll_number: "ST21BTECH11002",
    batch: "2021-2025",
    section: "CSE-A",
    semester: 4,
    cgpa: 6.2,
    attendance_percentage: 65,
    backlogs: 2,
    semester_performance: [
      { semester: 1, gpa: 5.8 },
      { semester: 2, gpa: 6.1 },
      { semester: 3, gpa: 6.5 }
    ],
    placement_and_internships: [],
    research_work: []
  }
];

const placementMock = {
  academic_year: "2025-2026",
  department: "Computer Science",
  total_eligible: 120,
  total_placed: 0,
  placement_rate: "0%",
  average_package_lpa: 0,
  highest_package_lpa: 0,
  companies_visited: [],
  internships: [
    {
      student_id: "stu-001",
      student_name: "John Doe",
      company: "TechNova Solutions",
      title: "Full Stack Intern",
      status: "Shortlisted",
      stipend_per_month: 25000,
      duration: "6 Months"
    }
  ]
};

const researchMock = {
  department: "Computer Science",
  academic_year: "2025-2026",
  total_funding: "INR 0",
  active_grants: 45,
  publications_ytd: 18,
  total_citations: 450,
  pending_proposals: 2,
  projects: [
    {
      id: "res-002",
      title: "AI-Driven Climate Modeling",
      status: "Active Project",
      faculty_lead: "fac-001",
      students_involved: ["stu-001"]
    },
    {
      id: "res-003",
      title: "Blockchain for Medical Data Privacy",
      status: "Active Project",
      faculty_lead: "fac-001",
      students_involved: ["stu-001"]
    }
  ]
};

const departmentSummary = {
  department: "Computer Science",
  academic_year: "2025-2026",
  generated_at: null,
  executive_summary: {
    total_enrollment: 450,
    enrollment_change_vs_last_year: "+2.1%",
    faculty_strength: 24,
    faculty_note: "Full-time equivalent",
    active_courses: 4,
    active_courses_note: "Current Semester"
  },
  cohort_distribution: [
    { academic_year: "1st Year", student_count: 120, gender_distribution: "M: 70 / F: 10" },
    { academic_year: "2nd Year", student_count: 115, gender_distribution: "M: 80 / F: 35" },
    { academic_year: "3rd Year", student_count: 108, gender_distribution: "M: 58 / F: 50" },
    { academic_year: "4th Year", student_count: 107, gender_distribution: "M: 62 / F: 45" }
  ]
};

export const generateFacultyReport = async (id) => {
  const faculty = faculties.find(f => f.id === id);
  if (!faculty) return null;
  return {
    report_type: "faculty",
    generated_at: new Date().toISOString(),
    faculty
  };
};

export const generateStudentReport = async (id) => {
  const student = students.find(s => s.id === id);
  if (!student) return null;
  return {
    report_type: "student",
    generated_at: new Date().toISOString(),
    student
  };
};

export const generatePlacementReport = async () => {
  return {
    report_type: "placement",
    generated_at: new Date().toISOString(),
    data: placementMock
  };
};

export const generateResearchReport = async () => {
  return {
    report_type: "research",
    generated_at: new Date().toISOString(),
    data: researchMock
  };
};

export const generateCustomReport = async (params) => {
  const { include_faculty, include_students, include_placement, include_research } = params || {};
  const summaryCopy = {
    ...departmentSummary,
    generated_at: new Date().toISOString()
  };
  
  if (include_faculty === true) {
    summaryCopy.faculty_data = faculties;
  }
  if (include_students === true) {
    summaryCopy.student_data = students;
  }
  if (include_placement === true) {
    summaryCopy.placement_data = placementMock;
  }
  if (include_research === true) {
    summaryCopy.research_data = researchMock;
  }
  
  return {
    report_type: "custom",
    generated_at: new Date().toISOString(),
    data: summaryCopy
  };
};
