const mockCourses = [
  {
    id: "cs-101",
    code: "CS101",
    name: "Introduction to Computer Science",
    semester: "Fall 2026",
    faculty_names: ["Dr. Alice Smith", "Prof. Bob Jones"],
    weekly_schedule: [
      { day: "Monday", time: "10:00 AM - 11:30 AM", room: "Room 401" },
      { day: "Wednesday", time: "10:00 AM - 11:30 AM", room: "Room 401" }
    ],
    attendance_history: [
      { date: "2026-06-15", day: "Monday", percentage: 92 },
      { date: "2026-06-17", day: "Wednesday", percentage: 88 }
    ],
    grading_status: {
      assignments: { total: 5, completed: 3, ongoing: 2 },
      projects: { total: 2, completed: 1, ongoing: 1 }
    },
    documents: [
      { name: "Syllabus", version: "v1.0", date: "2026-06-01", approval_status: "Approved" },
      { name: "Lecture 1 Slides", version: "v1.1", date: "2026-06-10", approval_status: "Approved" }
    ],
    reflections: [
      {
        date: "2026-06-15",
        day: "Monday",
        what_was_taught: "Introduction to Databases & SQL",
        needs_improvement: "Pacing of SQL queries introduction",
        next_topic: "ER Diagrams"
      }
    ],
    course_summary: {
      class_size: 60,
      credits: 4,
      syllabus_coverage_percentage: 85,
      attendance_percentage: 90
    }
  },
  {
    id: "cs-102",
    code: "CS102",
    name: "Data Structures and Algorithms",
    semester: "Fall 2026",
    faculty_names: ["Dr. Carol White", "Prof. Dave Miller"],
    weekly_schedule: [
      { day: "Tuesday", time: "01:00 PM - 02:30 PM", room: "Room 302" },
      { day: "Thursday", time: "01:00 PM - 02:30 PM", room: "Room 302" }
    ],
    attendance_history: [
      { date: "2026-06-16", day: "Tuesday", percentage: 95 }
    ],
    grading_status: {
      assignments: { total: 6, completed: 4, ongoing: 2 },
      projects: { total: 1, completed: 0, ongoing: 1 }
    },
    documents: [
      { name: "Course Guidelines", version: "v1.0", date: "2026-06-02", approval_status: "Approved" },
      { name: "Assignment 1 Specification", version: "v2.0", date: "2026-06-12", approval_status: "Pending" }
    ],
    reflections: [
      {
        date: "2026-06-16",
        day: "Tuesday",
        what_was_taught: "Complexity Analysis and Big O Notation",
        needs_improvement: "Need more practical examples for space complexity",
        next_topic: "Linked Lists"
      }
    ],
    course_summary: {
      class_size: 55,
      credits: 4,
      syllabus_coverage_percentage: 75,
      attendance_percentage: 93
    }
  }
];

export const getAllCourses = async () => {
  return mockCourses.map(course => ({
    id: course.id,
    code: course.code,
    name: course.name,
    semester: course.semester,
    faculty_names: course.faculty_names
  }));
};

export const getCourseDetails = async (id) => {
  const course = mockCourses.find(c => c.id === id);
  if (!course) return null;
  return course;
};

export const getCourseDocuments = async (id) => {
  const course = mockCourses.find(c => c.id === id);
  if (!course) return null;
  return course.documents;
};

export const updateCourse = async (id, data) => {
  const course = mockCourses.find(c => c.id === id);
  if (!course) return null;
  Object.assign(course, data);
  return course;
};
