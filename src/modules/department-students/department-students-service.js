const batches = [
  {
    batch: "2021-2025",
    sections_count: 2,
    students_enrolled: 4,
    avg_cgpa: 7.63,
    attendance_percentage: 81
  },
  {
    batch: "2022-2026",
    sections_count: 2,
    students_enrolled: 2,
    avg_cgpa: 8.10,
    attendance_percentage: 88
  }
];

const students = [
  {
    id: "stu-001",
    name: "John Doe",
    roll_number: "ST21BTECH11001",
    email: "john.doe@mahindra.university.edu",
    phone: "8675413210",
    batch: "2021-2025",
    section: "CSE-A",
    semester: 4,
    cgpa: 8.0,
    attendance_percentage: 88,
    backlogs: 0,
    student_summary: {
      section: "CSE-A",
      semester: 4,
      overall_attendance_percentage: 88
    },
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
        status: "Shortlisted",
        stipend_per_month: 25000,
        duration: "6 Months",
        recruiter: {
          name: "Sarah Miller",
          email: "hr@technova.io"
        }
      }
    ],
    research_work: [
      {
        id: "res-002",
        status: "Active Project",
        title: "AI-Driven Climate Modeling",
        description: "This project focuses on determining global climate models using GCMs to provide actionable data for urban planning in coastal regions."
      },
      {
        id: "res-003",
        status: "Active Project",
        title: "Blockchain for Medical Data Privacy",
        description: "Creating a Layer 2 scaling solution for Ethereum to manage HIPAA-compliant patient records without compromising throughput."
      }
    ],
    mentoring_history: [
      {
        date: "2026-03-15",
        type: "Career Consultation",
        notes: "Discussed career goals and interest in Machine Learning.",
        action_items: [
          "Enroll in an ML certification",
          "Contribute to a research project"
        ]
      },
      {
        date: "2025-11-20",
        type: "Academic Review",
        ratings: {
          academics: 4,
          professional: 3,
          extracurricular: 3
        },
        notes: "Discussed career goals and interest in Machine Learning."
      }
    ]
  },
  {
    id: "stu-002",
    name: "Alice Johnson",
    roll_number: "ST21BTECH11002",
    email: "alice.johnson@mahindra.university.edu",
    phone: "9876543210",
    batch: "2021-2025",
    section: "CSE-A",
    semester: 4,
    cgpa: 6.2,
    attendance_percentage: 65,
    backlogs: 2,
    student_summary: {
      section: "CSE-A",
      semester: 4,
      overall_attendance_percentage: 65
    },
    semester_performance: [
      { semester: 1, gpa: 5.8 },
      { semester: 2, gpa: 6.1 },
      { semester: 3, gpa: 6.5 }
    ],
    placement_and_internships: [],
    research_work: [],
    mentoring_history: []
  },
  {
    id: "stu-003",
    name: "Michael Chen",
    roll_number: "ST21BTECH11005",
    email: "michael.chen@mahindra.university.edu",
    phone: "9123456780",
    batch: "2021-2025",
    section: "CSE-C",
    semester: 4,
    cgpa: 8.5,
    attendance_percentage: 92,
    backlogs: 0,
    student_summary: {
      section: "CSE-C",
      semester: 4,
      overall_attendance_percentage: 92
    },
    semester_performance: [
      { semester: 1, gpa: 8.0 },
      { semester: 2, gpa: 8.4 },
      { semester: 3, gpa: 8.7 }
    ],
    placement_and_internships: [],
    research_work: [],
    mentoring_history: []
  },
  {
    id: "stu-004",
    name: "Sarah Williams",
    roll_number: "ST21BTECH14002",
    email: "sarah.williams@mahindra.university.edu",
    phone: "9988776655",
    batch: "2021-2025",
    section: "CSE-C",
    semester: 4,
    cgpa: 7.8,
    attendance_percentage: 80,
    backlogs: 0,
    student_summary: {
      section: "CSE-C",
      semester: 4,
      overall_attendance_percentage: 80
    },
    semester_performance: [
      { semester: 1, gpa: 7.2 },
      { semester: 2, gpa: 7.6 },
      { semester: 3, gpa: 8.0 }
    ],
    placement_and_internships: [],
    research_work: [],
    mentoring_history: []
  },
  {
    id: "stu-005",
    name: "Riya Patel",
    roll_number: "ST22BTECH10011",
    email: "riya.patel@mahindra.university.edu",
    phone: "9871234560",
    batch: "2022-2026",
    section: "CSE-A",
    semester: 2,
    cgpa: 8.3,
    attendance_percentage: 90,
    backlogs: 0,
    student_summary: {
      section: "CSE-A",
      semester: 2,
      overall_attendance_percentage: 90
    },
    semester_performance: [
      { semester: 1, gpa: 8.1 }
    ],
    placement_and_internships: [],
    research_work: [],
    mentoring_history: []
  },
  {
    id: "stu-006",
    name: "Arjun Mehta",
    roll_number: "ST22BTECH10022",
    email: "arjun.mehta@mahindra.university.edu",
    phone: "9765432100",
    batch: "2022-2026",
    section: "CSE-B",
    semester: 2,
    cgpa: 7.9,
    attendance_percentage: 85,
    backlogs: 0,
    student_summary: {
      section: "CSE-B",
      semester: 2,
      overall_attendance_percentage: 85
    },
    semester_performance: [
      { semester: 1, gpa: 7.7 }
    ],
    placement_and_internships: [],
    research_work: [],
    mentoring_history: []
  }
];

export const getAllStudents = async () => {
  return batches;
};

export const getStudentsByBatch = async (year) => {
  const filtered = students.filter(s => s.batch === year);
  if (filtered.length === 0) return null;
  return {
    batch: year,
    total: filtered.length,
    students: filtered.map(s => ({
      id: s.id,
      name: s.name,
      roll_number: s.roll_number,
      cgpa: s.cgpa,
      attendance_percentage: s.attendance_percentage,
      section: s.section,
      semester: s.semester,
      batch: s.batch,
      backlogs: s.backlogs
    }))
  };
};

export const getStudentDetails = async (id) => {
  const student = students.find(s => s.id === id);
  return student || null;
};

export const getStudentPerformance = async (id) => {
  const student = students.find(s => s.id === id);
  if (!student) return null;
  return {
    id: student.id,
    name: student.name,
    cgpa: student.cgpa,
    attendance_percentage: student.attendance_percentage,
    semester_performance: student.semester_performance,
    backlogs: student.backlogs,
    student_summary: student.student_summary
  };
};
