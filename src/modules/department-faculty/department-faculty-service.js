const mockFaculty = [
  {
    id: "fac-001",
    name: "Dr. Alan Turing",
    email: "a.turing@university.edu",
    designation: "Professor",
    courses_count: 1,
    hours_per_week: 2,
    faculty_summary: {
      avg_rating: 4.7,
      courses: 1,
      personal_attendance_percentage: 92,
    },
    academic_metrics: {
      papers_published: 2,
      projects_guided: 0,
      conferences_attended: 2,
    },
    teaching_load: {
      hours_per_week: 2,
      courses: [
        {
          course_name: "Introduction to Computer Science",
          course_code: "CS181",
          section: "CSS-A",
          schedule: [
            { day: "Monday", time: "10:00 AM - 11:00 AM" },
            { day: "Wednesday", time: "9:00 AM - 10:00 AM" },
          ],
        },
      ],
    },
    research: {
      active_projects: [],
      active_publications: [],
    },
    conferences: [],
    feedback: [],
  },
  {
    id: "fac-002",
    name: "Dr. Jane Smith",
    email: "j.smith@university.edu",
    designation: "Assistant Professor",
    courses_count: 1,
    hours_per_week: 4,
    faculty_summary: {
      avg_rating: 4.7,
      courses: 1,
      personal_attendance_percentage: 88,
    },
    academic_metrics: {
      papers_published: 3,
      projects_guided: 3,
      conferences_attended: 0,
    },
    teaching_load: {
      hours_per_week: 4,
      courses: [
        {
          course_name: "Introduction to Computer Science",
          course_code: "CS101",
          section: "CSE-B",
          schedule: [
            { day: "Tuesday", time: "2:00 PM - 3:00 PM" },
          ],
        },
      ],
    },
    research: {
      active_projects: [
        {
          id: "proj-001",
          status: "Active Project",
          title: "AI-Driven Climate Modeling",
          description: "This project focuses on determining global climate models using GCMs to provide actionable data for urban planning in coastal regions.",
        },
        {
          id: "proj-002",
          status: "Active Project",
          title: "Quantum Cryptography Protocols",
          description: "Developing lattice-based and code-based cryptographic solutions against Shor's algorithm vulnerabilities.",
        },
        {
          id: "proj-003",
          status: "Active Project",
          title: "Blockchain for Medical Data Privacy",
          description: "Creating a Layer 2 scaling solution for Ethereum to manage HIPAA-compliant patient records without compromising throughput.",
        },
      ],
      active_publications: [
        {
          id: "pub-001",
          status: "Active Publication",
          title: "Scalable Neural Network for Edge Computing",
          description: "We present a novel pruning technique that reduces model size by 87%.",
        },
        {
          id: "pub-002",
          status: "Active Publication",
          title: "Ethical Implications of Autonomous Defense Systems",
          description: "An analysis of autonomous systems in lethal autonomous weapons systems.",
        },
        {
          id: "pub-003",
          status: "Active Publication",
          title: "Analyzing Social Media Echo Chambers in Local Elections",
          description: "A graph theory approach to identifying polarization patterns in political discourse on decentralized social platforms.",
        },
      ],
    },
    conferences: [],
    feedback: [
      { rating: 5, comment: "Amazing support for the mentorship program!", date: "2026-06-01" },
      { rating: 4, comment: "Very helpful during office hours.", date: "2026-06-10" },
    ],
  },
];

export const getAllFaculty = async () => {
  return mockFaculty.map((f) => ({
    id: f.id,
    name: f.name,
    designation: f.designation,
    courses_count: f.courses_count,
    hours_per_week: f.hours_per_week,
  }));
};

export const getFacultyDetails = async (id) => {
  const f = mockFaculty.find((faculty) => faculty.id === id);
  if (!f) return null;
  return {
    id: f.id,
    name: f.name,
    email: f.email,
    designation: f.designation,
    faculty_summary: f.faculty_summary,
    academic_metrics: f.academic_metrics,
  };
};

export const getFacultyWorkload = async (id) => {
  const f = mockFaculty.find((faculty) => faculty.id === id);
  if (!f) return null;
  return {
    id: f.id,
    name: f.name,
    teaching_load: f.teaching_load,
  };
};

export const getFacultyPerformance = async (id) => {
  const f = mockFaculty.find((faculty) => faculty.id === id);
  if (!f) return null;
  return {
    id: f.id,
    name: f.name,
    research: f.research,
    conferences: f.conferences,
    feedback: f.feedback,
  };
};
