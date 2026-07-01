import sequelize, { connectDB } from "./database/connection.js";
import User from "./modules/auth/auth-model.js";
import Department from "./modules/department/department-model.js";
import Course from "./modules/department-courses/department-courses-model.js";
import UserCourse from "./modules/department-courses/user-course-model.js";
import AttendanceRecord from "./modules/department-courses/attendance-record-model.js";
import Student from "./modules/department-students/department-students-model.js";
import Faculty from "./modules/department-faculty/department-faculty-model.js";
import Placement from "./modules/department-placements/department-placements-model.js";
import ResearchProject from "./modules/department-research/research-project-model.js";
import GrantRequest from "./modules/department-research/grant-request-model.js";
import ResearchExpense from "./modules/department-research/research-expense-model.js";
import ResearchAllocation from "./modules/department-research/research-allocation-model.js";
import Notification from "./modules/notifications/notifications-model.js";
import Approval from "./modules/approvals/approvals-model.js";

// Cohort model imports
import { Cohort, CohortParticipant } from "./modules/cohort/cohort-model.js";
import { CohortAssignment, AssignmentSubmission } from "./modules/cohort-assignments/cohort-assignments-model.js";
import { CohortAnnouncement } from "./modules/cohort-announcements/cohort-announcements-model.js";
import { ResourceWeek, CohortResource } from "./modules/cohort-resources/cohort-resources-model.js";
import CohortMember from "./modules/cohort-members/cohort-members-model.js";
import { Schedule, MeetingRequest } from "./modules/schedule/schedule-model.js";

const seed = async () => {
  try {
    // Establish DB connection
    await connectDB();

    console.log("=== STEP 1: CLEARING DATA ===");
    const modelsToClear = [
      { name: "MeetingRequest", model: MeetingRequest },
      { name: "Schedule", model: Schedule },
      { name: "AssignmentSubmission", model: AssignmentSubmission },
      { name: "CohortAssignment", model: CohortAssignment },
      { name: "CohortAnnouncement", model: CohortAnnouncement },
      { name: "CohortResource", model: CohortResource },
      { name: "ResourceWeek", model: ResourceWeek },
      { name: "CohortMember", model: CohortMember },
      { name: "CohortParticipant", model: CohortParticipant },
      { name: "Cohort", model: Cohort },
      { name: "AttendanceRecord", model: AttendanceRecord },
      { name: "UserCourse", model: UserCourse },
      { name: "Notification", model: Notification },
      { name: "Approval", model: Approval },
      { name: "ResearchExpense", model: ResearchExpense },
      { name: "ResearchAllocation", model: ResearchAllocation },
      { name: "GrantRequest", model: GrantRequest },
      { name: "ResearchProject", model: ResearchProject },
      { name: "Placement", model: Placement },
      { name: "Student", model: Student },
      { name: "Faculty", model: Faculty },
      { name: "Course", model: Course },
      { name: "Department", model: Department }
    ];

    for (const m of modelsToClear) {
      try {
        await m.model.destroy({ where: {}, force: true });
        console.log(`Cleared: ${m.name}`);
      } catch (err) {
        console.warn(`Could not clear table for ${m.name}: ${err.message}`);
      }
    }

    console.log("=== STEP 2: INSERTING DEPARTMENT ===");
    const dept = await Department.create({
      name: "Computer Science & Engineering",
      code: "CSE",
      description: "Focuses on computing theory, software engineering, and AI research"
    });
    const departmentId = dept.id;

    console.log("=== STEP 3: INSERTING FACULTY USERS ===");
    const getOrCreateFacultyUser = async (name, email, role = "professor") => {
      const [user] = await User.findOrCreate({
        where: { email },
        defaults: { name, email, password: "faculty123", role }
      });
      return user;
    };

    const userMenon = await getOrCreateFacultyUser("Dr. Rajesh Menon", "rajesh.menon@mahindrauniversity.edu.in");
    const userKrishnan = await getOrCreateFacultyUser("Dr. Ananya Krishnan", "ananya.krishnan@mahindrauniversity.edu.in");
    const userNair = await getOrCreateFacultyUser("Dr. Vikram Nair", "vikram.nair@mahindrauniversity.edu.in");
    const userSharma = await getOrCreateFacultyUser("Dr. Priya Sharma", "priya.sharma@mahindrauniversity.edu.in");
    const userBose = await getOrCreateFacultyUser("Dr. Arjun Bose", "arjun.bose@mahindrauniversity.edu.in");
    const userIyer = await getOrCreateFacultyUser("Dr. Meera Iyer", "meera.iyer@mahindrauniversity.edu.in");

    const hodUser = await User.findOrCreate({
      where: { email: "robert.aris@mahindrauniversity.edu.in" },
      defaults: {
        name: "Dr. Robert Aris",
        email: "robert.aris@mahindrauniversity.edu.in",
        password: "hod123",
        role: "hod"
      }
    });
    const userHoD = hodUser[0];

    console.log("=== STEP 4: INSERTING FACULTY ROWS ===");
    const facultyMenon = await Faculty.create({
      user_id: userMenon.id,
      department_id: departmentId,
      designation: "Professor",
      specialization: "Artificial Intelligence",
      experience_years: 18,
      status: "active"
    });

    const facultyKrishnan = await Faculty.create({
      user_id: userKrishnan.id,
      department_id: departmentId,
      designation: "Associate Professor",
      specialization: "Data Science",
      experience_years: 11,
      status: "active"
    });

    const facultyNair = await Faculty.create({
      user_id: userNair.id,
      department_id: departmentId,
      designation: "Assistant Professor",
      specialization: "Computer Networks",
      experience_years: 5,
      status: "active"
    });

    const facultySharma = await Faculty.create({
      user_id: userSharma.id,
      department_id: departmentId,
      designation: "Associate Professor",
      specialization: "Cybersecurity",
      experience_years: 9,
      status: "active"
    });

    const facultyBose = await Faculty.create({
      user_id: userBose.id,
      department_id: departmentId,
      designation: "Assistant Professor",
      specialization: "Software Engineering",
      experience_years: 4,
      status: "active"
    });

    const facultyIyer = await Faculty.create({
      user_id: userIyer.id,
      department_id: departmentId,
      designation: "Professor",
      specialization: "Database Systems",
      experience_years: 14,
      status: "active"
    });

    console.log("=== STEP 5: INSERTING COURSES ===");
    const courseCS101 = await Course.create({
      department_id: departmentId,
      code: "CS101",
      name: "Introduction to Computer Science",
      credits: 4,
      semester: "Fall 2026",
      status: "active"
    });

    const courseCS201 = await Course.create({
      department_id: departmentId,
      code: "CS201",
      name: "Data Structures and Algorithms",
      credits: 4,
      semester: "Fall 2026",
      status: "active"
    });

    const courseCS301 = await Course.create({
      department_id: departmentId,
      code: "CS301",
      name: "Operating Systems",
      credits: 3,
      semester: "Fall 2026",
      status: "active"
    });

    const courseCS401 = await Course.create({
      department_id: departmentId,
      code: "CS401",
      name: "Machine Learning Fundamentals",
      credits: 4,
      semester: "Fall 2026",
      status: "active"
    });

    const courseCS501 = await Course.create({
      department_id: departmentId,
      code: "CS501",
      name: "Database Management Systems",
      credits: 3,
      semester: "Fall 2026",
      status: "active"
    });

    console.log("=== STEP 6: INSERTING STUDENTS ===");
    const studentDataList = [
      // Batch 2021-2025
      { name: "Rohan Verma", roll_number: "ST21BTECH11001", email: "rohan.verma@mahindra.university.edu", batch: "2021-2025", section: "CSE-A", semester: 7, cgpa: 8.4, attendance_percentage: 91, backlogs: 0 },
      { name: "Sneha Kapoor", roll_number: "ST21BTECH11002", email: "sneha.kapoor@mahindra.university.edu", batch: "2021-2025", section: "CSE-A", semester: 7, cgpa: 7.1, attendance_percentage: 68, backlogs: 2 },
      { name: "Aditya Sharma", roll_number: "ST21BTECH11003", email: "aditya.sharma@mahindra.university.edu", batch: "2021-2025", section: "CSE-A", semester: 7, cgpa: 9.1, attendance_percentage: 95, backlogs: 0 },
      { name: "Priya Nambiar", roll_number: "ST21BTECH11004", email: "priya.nambiar@mahindra.university.edu", batch: "2021-2025", section: "CSE-B", semester: 7, cgpa: 6.8, attendance_percentage: 72, backlogs: 1 },
      { name: "Karan Singh", roll_number: "ST21BTECH11005", email: "karan.singh@mahindra.university.edu", batch: "2021-2025", section: "CSE-B", semester: 7, cgpa: 8.9, attendance_percentage: 88, backlogs: 0 },
      { name: "Divya Menon", roll_number: "ST21BTECH11006", email: "divya.menon@mahindra.university.edu", batch: "2021-2025", section: "CSE-B", semester: 7, cgpa: 7.5, attendance_percentage: 79, backlogs: 0 },
      { name: "Rahul Gupta", roll_number: "ST21BTECH11007", email: "rahul.gupta@mahindra.university.edu", batch: "2021-2025", section: "CSE-C", semester: 7, cgpa: 7.8, attendance_percentage: 83, backlogs: 0 },
      { name: "Anjali Desai", roll_number: "ST21BTECH11008", email: "anjali.desai@mahindra.university.edu", batch: "2021-2025", section: "CSE-C", semester: 7, cgpa: 8.2, attendance_percentage: 90, backlogs: 0 },
      // Batch 2022-2026
      { name: "Aryan Mehta", roll_number: "ST22BTECH10001", email: "aryan.mehta@mahindra.university.edu", batch: "2022-2026", section: "CSE-A", semester: 5, cgpa: 8.7, attendance_percentage: 93, backlogs: 0 },
      { name: "Ishaan Pillai", roll_number: "ST22BTECH10002", email: "ishaan.pillai@mahindra.university.edu", batch: "2022-2026", section: "CSE-A", semester: 5, cgpa: 7.3, attendance_percentage: 75, backlogs: 1 },
      { name: "Kavya Reddy", roll_number: "ST22BTECH10003", email: "kavya.reddy@mahindra.university.edu", batch: "2022-2026", section: "CSE-B", semester: 5, cgpa: 9.0, attendance_percentage: 96, backlogs: 0 },
      { name: "Nikhil Joshi", roll_number: "ST22BTECH10004", email: "nikhil.joshi@mahindra.university.edu", batch: "2022-2026", section: "CSE-B", semester: 5, cgpa: 7.6, attendance_percentage: 81, backlogs: 0 }
    ];

    const students = [];
    for (const s of studentDataList) {
      const studentUser = await getOrCreateFacultyUser(s.name, s.email, "student");
      const stud = await Student.create({
        user_id: studentUser.id,
        department_id: departmentId,
        name: s.name,
        roll_number: s.roll_number,
        email: s.email,
        phone: "9876543210",
        batch: s.batch,
        section: s.section,
        semester: s.semester,
        cgpa: s.cgpa,
        attendance_percentage: s.attendance_percentage,
        backlogs: s.backlogs
      });
      students.push(stud);
    }

    console.log("=== STEP 7: INSERTING USERCOURSE ROWS ===");
    // Faculty assignments
    await UserCourse.create({ user_id: userMenon.id, course_id: courseCS101.id, role_in_course: "faculty", academic_year: "2025-2026" });
    await UserCourse.create({ user_id: userKrishnan.id, course_id: courseCS201.id, role_in_course: "faculty", academic_year: "2025-2026" });
    await UserCourse.create({ user_id: userNair.id, course_id: courseCS301.id, role_in_course: "faculty", academic_year: "2025-2026" });
    await UserCourse.create({ user_id: userSharma.id, course_id: courseCS401.id, role_in_course: "faculty", academic_year: "2025-2026" });
    await UserCourse.create({ user_id: userBose.id, course_id: courseCS101.id, role_in_course: "faculty", academic_year: "2025-2026" });
    await UserCourse.create({ user_id: userIyer.id, course_id: courseCS501.id, role_in_course: "faculty", academic_year: "2025-2026" });

    // Student assignments
    // Batch 2021-2025 (first 8 students) enroll in CS101, CS201, CS301
    let ucRohanCS101 = null;
    for (let i = 0; i < 8; i++) {
      const uc1 = await UserCourse.create({ user_id: students[i].user_id, course_id: courseCS101.id, role_in_course: "student", academic_year: "2025-2026" });
      if (i === 0) ucRohanCS101 = uc1;
      await UserCourse.create({ user_id: students[i].user_id, course_id: courseCS201.id, role_in_course: "student", academic_year: "2025-2026" });
      await UserCourse.create({ user_id: students[i].user_id, course_id: courseCS301.id, role_in_course: "student", academic_year: "2025-2026" });
    }

    // Batch 2022-2026 (next 4 students) enroll in CS401, CS501
    for (let i = 8; i < 12; i++) {
      await UserCourse.create({ user_id: students[i].user_id, course_id: courseCS401.id, role_in_course: "student", academic_year: "2025-2026" });
      await UserCourse.create({ user_id: students[i].user_id, course_id: courseCS501.id, role_in_course: "student", academic_year: "2025-2026" });
    }

    console.log("=== STEP 8: INSERTING ATTENDANCE RECORDS ===");
    if (ucRohanCS101) {
      await AttendanceRecord.create({ user_course_id: ucRohanCS101.id, date: "2026-06-10", status: "present" });
      await AttendanceRecord.create({ user_course_id: ucRohanCS101.id, date: "2026-06-12", status: "present" });
      await AttendanceRecord.create({ user_course_id: ucRohanCS101.id, date: "2026-06-14", status: "absent" });
      await AttendanceRecord.create({ user_course_id: ucRohanCS101.id, date: "2026-06-17", status: "present" });
      await AttendanceRecord.create({ user_course_id: ucRohanCS101.id, date: "2026-06-19", status: "present" });
      await AttendanceRecord.create({ user_course_id: ucRohanCS101.id, date: "2026-06-21", status: "present" });
      await AttendanceRecord.create({ user_course_id: ucRohanCS101.id, date: "2026-06-22", status: "present" });
    }

    console.log("=== STEP 9: INSERTING PLACEMENTS ===");
    await Placement.create({ student_id: students[0].id, company_name: "Google India", company_tier: "Tier 1", sector: "Software Development", opportunity_type: "FULL_TIME", amount: 18, status: "Active" });
    await Placement.create({ student_id: students[2].id, company_name: "Microsoft India", company_tier: "Tier 1", sector: "Software Development", opportunity_type: "FULL_TIME", amount: 22, status: "Active" });
    await Placement.create({ student_id: students[4].id, company_name: "Goldman Sachs", company_tier: "Tier 1", sector: "FinTech", opportunity_type: "FULL_TIME", amount: 20, status: "Active" });
    await Placement.create({ student_id: students[7].id, company_name: "Amazon India", company_tier: "Tier 1", sector: "Software Development", opportunity_type: "FULL_TIME", amount: 19, status: "Active" });
    await Placement.create({ student_id: students[5].id, company_name: "Flipkart", company_tier: "Tier 1", sector: "E-Commerce", opportunity_type: "INTERNSHIP", amount: 35000, status: "Active" });
    await Placement.create({ student_id: students[3].id, company_name: "Infosys", company_tier: "Tier 2", sector: "IT Services", opportunity_type: "INTERNSHIP", amount: 20000, status: "Active" });

    console.log("=== STEP 10: INSERTING RESEARCH PROJECTS ===");
    const project1 = await ResearchProject.create({
      title: "Deep Learning for Early Cancer Detection",
      status: "Active",
      authors: ["Dr. Rajesh Menon", "Dr. Ananya Krishnan"],
      total_budget_inr: 1800000
    });

    const project2 = await ResearchProject.create({
      title: "Quantum-Resistant Cryptography Protocols",
      status: "Active",
      authors: ["Dr. Priya Sharma", "Dr. Vikram Nair"],
      total_budget_inr: 1200000
    });

    const project3 = await ResearchProject.create({
      title: "Federated Learning for Privacy-Preserving Healthcare",
      status: "Completed",
      authors: ["Dr. Meera Iyer", "Dr. Arjun Bose"],
      total_budget_inr: 950000
    });

    console.log("=== STEP 11: INSERTING GRANT REQUESTS ===");
    await GrantRequest.create({
      research_project_id: project1.id,
      title: "DST SERB Research Grant - Cancer AI",
      status: "Approved",
      amount_inr: 750000,
      justification: "Funding for GPU cluster and medical imaging dataset licensing.",
      requested_at: "2026-02-10"
    });

    await GrantRequest.create({
      research_project_id: project2.id,
      title: "DRDO Collaborative Research Grant",
      status: "Pending",
      amount_inr: 500000,
      justification: "Quantum hardware access and international conference travel.",
      requested_at: "2026-04-15"
    });

    await GrantRequest.create({
      research_project_id: project3.id,
      title: "Indo-US Science and Technology Forum Grant",
      status: "Resubmitted",
      amount_inr: 300000,
      justification: "Revised proposal with updated methodology and team composition.",
      requested_at: "2026-03-20"
    });

    console.log("=== STEP 12: INSERTING RESEARCH EXPENSES ===");
    await ResearchExpense.create({ research_project_id: project1.id, category: "Equipment", amount_inr: 280000, expense_date: "2026-03-15" });
    await ResearchExpense.create({ research_project_id: project1.id, category: "Personnel", amount_inr: 150000, expense_date: "2026-04-01" });
    await ResearchExpense.create({ research_project_id: project2.id, category: "Equipment", amount_inr: 95000, expense_date: "2026-03-20" });
    await ResearchExpense.create({ research_project_id: project2.id, category: "Travel", amount_inr: 45000, expense_date: "2026-05-10" });
    await ResearchExpense.create({ research_project_id: project3.id, category: "Personnel", amount_inr: 180000, expense_date: "2026-02-28" });

    console.log("=== STEP 13: INSERTING RESEARCH ALLOCATIONS ===");
    await ResearchAllocation.create({ category: "Personnel & Stipends", percentage: 52, amount_inr: 1300000 });
    await ResearchAllocation.create({ category: "Equipment & Hardware", percentage: 24, amount_inr: 600000 });
    await ResearchAllocation.create({ category: "Travel & Conferences", percentage: 12, amount_inr: 300000 });
    await ResearchAllocation.create({ category: "Operations & Admin", percentage: 12, amount_inr: 300000 });

    console.log("=== STEP 14: INSERTING NOTIFICATIONS ===");
    await Notification.create({ category: "EXAM_DUTY", title: "New Exam Duty Assignment", message: "You have been assigned as chief invigilator for CS401 End Semester Examination.", priority: "HIGH", is_read: false, scope: "hod" });
    await Notification.create({ category: "MEETING", title: "Academic Council Meeting", message: "Academic council meeting scheduled for June 28, 2026 at 10:00 AM in Conference Room B.", priority: "MEDIUM", is_read: false, scope: "hod" });
    await Notification.create({ category: "RESEARCH", title: "Grant Disbursement Confirmed", message: "DST SERB grant of INR 7,50,000 for Deep Learning Cancer Detection project has been disbursed.", priority: "HIGH", is_read: false, scope: "hod" });
    await Notification.create({ category: "FINANCE", title: "Budget Approval Required", message: "Department infrastructure upgrade request of INR 1,20,000 requires HoD sign-off.", priority: "HIGH", is_read: false, scope: "hod" });
    await Notification.create({ category: "MEETING", title: "Faculty Performance Review", message: "Quarterly faculty performance review meeting scheduled for June 30, 2026.", priority: "MEDIUM", is_read: true, scope: "hod" });
    await Notification.create({ category: "ATTENDANCE", title: "Attendance Overdue", message: "Attendance not marked for CSE-A (CS101) for the last three classes.", priority: "HIGH", is_read: false, scope: "department", course_code: "CS101", section: "CSE-A" });
    await Notification.create({ category: "LOW_ATTENDANCE", title: "Low Attendance Alert", message: "Sneha Kapoor has dropped below 75% attendance in CS201.", priority: "HIGH", is_read: false, scope: "department", course_code: "CS201", section: "CSE-A", student_id: students[1].id });
    await Notification.create({ category: "BACKLOG_ALERT", title: "Backlog Alert", message: "Priya Nambiar has 1 active backlog. Mentoring session recommended.", priority: "MEDIUM", is_read: true, scope: "department", student_id: students[3].id });

    console.log("=== STEP 15: INSERTING APPROVALS ===");
    const now = new Date();
    await Approval.create({ type: "leave", status: "Pending", requested_by: "Dr. Ananya Krishnan", leave_type: "Medical Leave", start_date: "2026-06-25", end_date: "2026-06-28", replacement: "Dr. Vikram Nair", requested_at: now });
    await Approval.create({ type: "leave", status: "Pending", requested_by: "Dr. Arjun Bose", leave_type: "Personal Leave", start_date: "2026-07-01", end_date: "2026-07-02", replacement: "Dr. Meera Iyer", requested_at: now });
    await Approval.create({ type: "leave", status: "Approved", requested_by: "Dr. Vikram Nair", leave_type: "Conference Leave", start_date: "2026-06-10", end_date: "2026-06-14", replacement: "Dr. Arjun Bose", requested_at: now });
    await Approval.create({ type: "finance", status: "Pending", requested_by: "Dr. Rajesh Menon", title: "Advanced GPU Server for AI Lab", amount: 280000, category: "Equipment", requested_at: now });
    await Approval.create({ type: "finance", status: "Approved", requested_by: "Dr. Meera Iyer", title: "Database Licensing Renewal", amount: 45000, category: "Software", requested_at: now });
    await Approval.create({ type: "course", status: "Pending", requested_by: "Dr. Priya Sharma", title: "CS401 Curriculum Revision", change_type: "Syllabus", requested_at: now });

    console.log("=== STEP 16: INSERTING COHORTS ===");

    // Cohort 1 — Active cohort taught by HoD
    const cohort1 = await Cohort.create({
      cohort_name: "Introduction to Artificial Intelligence",
      cohort_description: "A comprehensive course covering fundamentals of AI including search algorithms, machine learning basics, and neural networks.",
      course_codes: "CS601",
      slug: "intro-to-ai-2026",
      organization_name: "Mahindra University",
      instructor: "Dr. Robert Aris",
      creator_id: userHoD.id,
      creator_name: userHoD.name,
      start_date: new Date("2026-06-01"),
      end_date: new Date("2026-11-30"),
      status: "Live",
      visibility: "Active",
      member_count: 4,
      group_count: 0
    });

    // Cohort 2 — Second active cohort
    const cohort2 = await Cohort.create({
      cohort_name: "Advanced Machine Learning",
      cohort_description: "Deep dive into supervised and unsupervised learning, reinforcement learning, and practical ML engineering.",
      course_codes: "CS602",
      slug: "advanced-ml-2026",
      organization_name: "Mahindra University",
      instructor: "Dr. Robert Aris",
      creator_id: userHoD.id,
      creator_name: userHoD.name,
      start_date: new Date("2026-06-01"),
      end_date: new Date("2026-11-30"),
      status: "Live",
      visibility: "Active",
      member_count: 3,
      group_count: 0
    });

    // Add students as CohortParticipants for cohort1
    // Use the first 4 students from the seeded students array
    await CohortParticipant.create({
      cohort_id: cohort1.id,
      user_id: students[0].user_id,
      email: students[0].email,
      display_name: students[0].name,
      roll_number: students[0].roll_number,
      is_active: true
    });
    await CohortParticipant.create({
      cohort_id: cohort1.id,
      user_id: students[1].user_id,
      email: students[1].email,
      display_name: students[1].name,
      roll_number: students[1].roll_number,
      is_active: true
    });
    await CohortParticipant.create({
      cohort_id: cohort1.id,
      user_id: students[2].user_id,
      email: students[2].email,
      display_name: students[2].name,
      roll_number: students[2].roll_number,
      is_active: true
    });
    await CohortParticipant.create({
      cohort_id: cohort1.id,
      user_id: students[3].user_id,
      email: students[3].email,
      display_name: students[3].name,
      roll_number: students[3].roll_number,
      is_active: true
    });

    // Add students as CohortParticipants for cohort2
    await CohortParticipant.create({
      cohort_id: cohort2.id,
      user_id: students[4].user_id,
      email: students[4].email,
      display_name: students[4].name,
      roll_number: students[4].roll_number,
      is_active: true
    });
    await CohortParticipant.create({
      cohort_id: cohort2.id,
      user_id: students[5].user_id,
      email: students[5].email,
      display_name: students[5].name,
      roll_number: students[5].roll_number,
      is_active: true
    });
    await CohortParticipant.create({
      cohort_id: cohort2.id,
      user_id: students[6].user_id,
      email: students[6].email,
      display_name: students[6].name,
      roll_number: students[6].roll_number,
      is_active: true
    });

    // Add CohortMembers for cohort1 (same students, different model)
    await CohortMember.create({
      cohort_id: cohort1.id,
      user_id: students[0].user_id,
      name: students[0].name,
      email: students[0].email,
      role: "student",
      department: "Computer Science"
    });
    await CohortMember.create({
      cohort_id: cohort1.id,
      user_id: students[1].user_id,
      name: students[1].name,
      email: students[1].email,
      role: "student",
      department: "Computer Science"
    });
    await CohortMember.create({
      cohort_id: cohort1.id,
      user_id: students[2].user_id,
      name: students[2].name,
      email: students[2].email,
      role: "student",
      department: "Computer Science"
    });
    await CohortMember.create({
      cohort_id: cohort1.id,
      user_id: students[3].user_id,
      name: students[3].name,
      email: students[3].email,
      role: "student",
      department: "Computer Science"
    });

    // Add assignments for cohort1
    await CohortAssignment.create({
      cohort_id: cohort1.id,
      title: "Assignment 1 — Search Algorithms",
      description: "Implement BFS, DFS and A* search algorithms and compare their performance on a maze problem.",
      deadline: new Date("2026-07-15"),
      marks: "20",
      type: "individual",
      created_by: userHoD.id
    });
    await CohortAssignment.create({
      cohort_id: cohort1.id,
      title: "Assignment 2 — Neural Network from Scratch",
      description: "Build a simple feedforward neural network using NumPy only. Train on MNIST dataset.",
      deadline: new Date("2026-08-10"),
      marks: "30",
      type: "individual",
      created_by: userHoD.id
    });
    await CohortAssignment.create({
      cohort_id: cohort2.id,
      title: "Mini Project — ML Pipeline",
      description: "Build an end-to-end ML pipeline including data preprocessing, model training, evaluation and deployment.",
      deadline: new Date("2026-09-01"),
      marks: "50",
      type: "group",
      created_by: userHoD.id
    });

    // Add announcements for cohort1
    await CohortAnnouncement.create({
      cohort_id: cohort1.id,
      author_id: userHoD.id,
      author_name: userHoD.name,
      title: "Welcome to Introduction to AI",
      content: "Welcome everyone to CS601. Please go through the course syllabus and join the discussion forum. First class is on June 5th at 9 AM in Lab 101.",
      type: "announcement",
      is_pinned: true,
      is_archived: false,
      is_locked: false,
      replies_count: 0
    });
    await CohortAnnouncement.create({
      cohort_id: cohort1.id,
      author_id: userHoD.id,
      author_name: userHoD.name,
      title: "Assignment 1 Released",
      content: "Assignment 1 on Search Algorithms has been released. Deadline is July 15th. Submit via the assignments tab.",
      type: "update",
      is_pinned: false,
      is_archived: false,
      is_locked: false,
      replies_count: 0
    });

    // Add resource weeks for cohort1
    const week1 = await ResourceWeek.create({
      cohort_id: cohort1.id,
      title: "Week 1 — Introduction & History of AI",
      dateRange: "June 1 - June 7",
      order: 1
    });
    const week2 = await ResourceWeek.create({
      cohort_id: cohort1.id,
      title: "Week 2 — Search Algorithms",
      dateRange: "June 8 - June 14",
      order: 2
    });

    // Add resources to weeks
    await CohortResource.create({
      week_id: week1.id,
      cohort_id: cohort1.id,
      title: "Introduction to AI — Lecture Slides",
      url: "https://drive.google.com/example/ai-intro-slides",
      type: "slides",
      description: "Week 1 lecture slides covering history and foundations of AI",
      order: 1
    });
    await CohortResource.create({
      week_id: week1.id,
      cohort_id: cohort1.id,
      title: "Turing Test — Original Paper",
      url: "https://www.cs.ox.ac.uk/activities/ieg/e-library/sources/t_article.pdf",
      type: "paper",
      description: "Alan Turing's original 1950 paper on computing machinery and intelligence",
      order: 2
    });
    await CohortResource.create({
      week_id: week2.id,
      cohort_id: cohort1.id,
      title: "BFS and DFS — Video Lecture",
      url: "https://drive.google.com/example/search-lecture",
      type: "video",
      description: "60 minute lecture on uninformed search strategies",
      order: 1
    });

    console.log("=== STEP 17: INSERTING SCHEDULE & MEETINGS ===");

    // HoD's weekly timetable
    await Schedule.create({
      professor_id: userHoD.id,
      title: "Introduction to Artificial Intelligence",
      day: "Monday",
      start_time: "09:00",
      end_time: "10:30",
      venue: "Lab 101",
      cohort_id: cohort1.id,
      type: "class"
    });
    await Schedule.create({
      professor_id: userHoD.id,
      title: "Introduction to Artificial Intelligence",
      day: "Wednesday",
      start_time: "09:00",
      end_time: "10:30",
      venue: "Lab 101",
      cohort_id: cohort1.id,
      type: "class"
    });
    await Schedule.create({
      professor_id: userHoD.id,
      title: "Introduction to Artificial Intelligence",
      day: "Friday",
      start_time: "09:00",
      end_time: "10:30",
      venue: "Lab 101",
      cohort_id: cohort1.id,
      type: "class"
    });
    await Schedule.create({
      professor_id: userHoD.id,
      title: "Advanced Machine Learning",
      day: "Tuesday",
      start_time: "11:00",
      end_time: "12:30",
      venue: "Seminar Hall B",
      cohort_id: cohort2.id,
      type: "class"
    });
    await Schedule.create({
      professor_id: userHoD.id,
      title: "Advanced Machine Learning",
      day: "Thursday",
      start_time: "11:00",
      end_time: "12:30",
      venue: "Seminar Hall B",
      cohort_id: cohort2.id,
      type: "class"
    });
    await Schedule.create({
      professor_id: userHoD.id,
      title: "Office Hours",
      day: "Wednesday",
      start_time: "14:00",
      end_time: "16:00",
      venue: "Room 204, Faculty Block",
      cohort_id: null,
      type: "office_hours"
    });
    await Schedule.create({
      professor_id: userHoD.id,
      title: "Office Hours",
      day: "Friday",
      start_time: "14:00",
      end_time: "15:30",
      venue: "Room 204, Faculty Block",
      cohort_id: null,
      type: "office_hours"
    });

    // Meeting requests
    await MeetingRequest.create({
      professor_id: userHoD.id,
      student_id: students[0].id,
      title: "Doubt Clarification — Neural Networks Assignment",
      proposed_time: new Date("2026-07-05T10:00:00.000Z"),
      status: "pending",
      message: "I have some doubts regarding backpropagation in Assignment 2. Can we schedule a meeting?"
    });
    await MeetingRequest.create({
      professor_id: userHoD.id,
      student_id: students[1].id,
      title: "Project Discussion — ML Pipeline",
      proposed_time: new Date("2026-07-08T14:00:00.000Z"),
      status: "accepted",
      message: "Would like to discuss the mini project requirements in detail."
    });
    await MeetingRequest.create({
      professor_id: userHoD.id,
      student_id: students[2].id,
      title: "Career Guidance Session",
      proposed_time: new Date("2026-07-10T11:00:00.000Z"),
      status: "pending",
      message: "Seeking guidance on research internship opportunities."
    });

    console.log("=== SEED COMPLETE (INCLUDING COHORTS) ===");
    process.exit(0);
  } catch (error) {
    console.error("Seed script failed with error:", error);
    process.exit(1);
  }
};

seed();
