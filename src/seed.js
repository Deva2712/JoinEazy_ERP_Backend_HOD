import sequelize, { connectDB } from "./database/connection.js";
import User from "./modules/auth/auth-model.js";
import Department from "./modules/department/department-model.js";
import Course from "./modules/department-courses/department-courses-model.js";
import UserCourse from "./modules/department-courses/user-course-model.js";
import AttendanceRecord from "./modules/department-courses/attendance-record-model.js";
import Student from "./modules/department-students/department-students-model.js";
import Faculty from "./modules/department-faculty/department-faculty-model.js";
import Placement from "./modules/department-placements/department-placements-model.js";
import JobDrive from "./modules/placement-hod/job-drive-model.js";
import ResearchProject from "./modules/department-research/research-project-model.js";
import GrantRequest from "./modules/department-research/grant-request-model.js";
import ResearchExpense from "./modules/department-research/research-expense-model.js";
import ResearchAllocation from "./modules/department-research/research-allocation-model.js";
import Notification from "./modules/notifications/notifications-model.js";
import Approval from "./modules/approvals/approvals-model.js";

// Cohort model imports
import { Cohort, CohortParticipant, CohortGroup, CohortGroupMember } from "./modules/cohort/cohort-model.js";
import { CohortAssignment, AssignmentSubmission } from "./modules/cohort-assignments/cohort-assignments-model.js";
import { CohortAnnouncement } from "./modules/cohort-announcements/cohort-announcements-model.js";
import { ResourceWeek, CohortResource } from "./modules/cohort-resources/cohort-resources-model.js";
import CohortMember from "./modules/cohort-members/cohort-members-model.js";
import { Schedule, MeetingRequest } from "./modules/schedule/schedule-model.js";
import ExamDuty from "./modules/exam-duties/exam-duties-model.js";
import { LibraryBook, LibraryRequest } from "./modules/library/library-model.js";
import { Research, ResearchApplication } from "./modules/research/research-model.js";
import { MentorSession } from "./modules/mentoring/mentoring-model.js";
import { LorRequest, RegistrarRequest, RegistrarProcess } from "./modules/document-request/document-request-model.js";
import { Asset, AssetRequest } from "./modules/asset-request/asset-request-model.js";
import MaintenanceRequest from "./modules/maintenance/maintenance-model.js";
import { Expense } from "./modules/expenses/expenses-model.js";
import { Advance } from "./modules/advances/advances-model.js";
import Payroll from "./modules/payroll/payroll-model.js";
import { CalendarEvent } from "./modules/calendar/calendar-model.js";
import RevaluationRequest from "./modules/revaluation/revaluation-model.js";

const seed = async () => {
  try {
    // Establish DB connection
    await connectDB();

    console.log("=== STEP 1: CLEARING DATA ===");
    const modelsToClear = [
      { name: "CalendarEvent", model: CalendarEvent },
      { name: "AssetRequest", model: AssetRequest },
      { name: "Asset", model: Asset },
      { name: "MaintenanceRequest", model: MaintenanceRequest },
      { name: "LibraryRequest", model: LibraryRequest },
      { name: "LibraryBook", model: LibraryBook },
      { name: "Research", model: Research },
      { name: "ExamDuty", model: ExamDuty },
      { name: "MeetingRequest", model: MeetingRequest },
      { name: "Schedule", model: Schedule },
      { name: "AssignmentSubmission", model: AssignmentSubmission },
      { name: "CohortAssignment", model: CohortAssignment },
      { name: "CohortAnnouncement", model: CohortAnnouncement },
      { name: "CohortResource", model: CohortResource },
      { name: "ResourceWeek", model: ResourceWeek },
      { name: "CohortMember", model: CohortMember },
      { name: "CohortGroupMember", model: CohortGroupMember },
      { name: "CohortGroup", model: CohortGroup },
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
      { name: "JobDrive", model: JobDrive },
      { name: "Placement", model: Placement },
      { name: "RegistrarProcess", model: RegistrarProcess },
      { name: "LorRequest", model: LorRequest },
      { name: "MentorSession", model: MentorSession },
      { name: "Expense", model: Expense },
      { name: "Advance", model: Advance },
      { name: "Payroll", model: Payroll },
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
        role: "hod",
        department: "Computer Science & Engineering",
        branches: ["CSE", "AIML", "IT"]
      }
    });
    const userHoD = hodUser[0];
    await userHoD.update({
      department: "Computer Science & Engineering",
      branches: ["CSE", "AIML", "IT"]
    });

    console.log("=== STEP 3B: INSERTING CALENDAR EVENTS ===");
    await CalendarEvent.create({
      user_id: userHoD.id,
      title: "HOD Department Review Meeting",
      date: "2026-07-20",
      type: "meeting",
      description: "Quarterly review of CSE department progress, syllabus completion, and lab upgrades.",
      start_time: "10:00",
      end_time: "11:30",
      location: "CSE Seminar Hall",
      is_all_day: false,
      source: "personal"
    });

    await CalendarEvent.create({
      user_id: userHoD.id,
      title: "Semester Exam Preparation",
      date: "2026-07-22",
      type: "exam",
      description: "Prepare review guidelines and set exam question papers.",
      start_time: "14:00",
      end_time: "16:00",
      location: "HOD Cabin",
      is_all_day: false,
      source: "personal"
    });

    await CalendarEvent.create({
      user_id: userHoD.id,
      title: "Personal Research Review",
      date: "2026-07-25",
      type: "personal",
      description: "Review progress on personal AI research paper drafts.",
      start_time: "09:00",
      end_time: "10:30",
      location: "Home",
      is_all_day: false,
      source: "personal"
    });

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
      { name: "Rohan Verma", roll_number: "ST21BTECH11001", email: "rohan.verma@mahindra.university.edu", batch: "2021-2025", branch: "CSE", section: "CSE-A", semester: 7, cgpa: 8.4, attendance_percentage: 91, backlogs: 0 },
      { name: "Sneha Kapoor", roll_number: "ST21BTECH11002", email: "sneha.kapoor@mahindra.university.edu", batch: "2021-2025", branch: "CSE", section: "CSE-A", semester: 7, cgpa: 7.1, attendance_percentage: 68, backlogs: 2, backlog_subjects: [
        { name: "Mathematics III", subject: "Mathematics III", code: "MA201", semester: 3, attempts: 1, status: "Pending Clearance" },
        { name: "Data Structures", subject: "Data Structures", code: "CS201", semester: 3, attempts: 2, status: "Pending Clearance" }
      ] },
      { name: "Aditya Sharma", roll_number: "ST21BTECH11003", email: "aditya.sharma@mahindra.university.edu", batch: "2021-2025", branch: "AIML", section: "CSE-A", semester: 7, cgpa: 9.1, attendance_percentage: 95, backlogs: 0 },
      { name: "Priya Nambiar", roll_number: "ST21BTECH11004", email: "priya.nambiar@mahindra.university.edu", batch: "2021-2025", branch: "AIML", section: "CSE-B", semester: 7, cgpa: 6.8, attendance_percentage: 72, backlogs: 1 },
      { name: "Karan Singh", roll_number: "ST21BTECH11005", email: "karan.singh@mahindra.university.edu", batch: "2021-2025", branch: "IT", section: "CSE-B", semester: 7, cgpa: 8.9, attendance_percentage: 88, backlogs: 0 },
      { name: "Divya Menon", roll_number: "ST21BTECH11006", email: "divya.menon@mahindra.university.edu", batch: "2021-2025", branch: "IT", section: "CSE-B", semester: 7, cgpa: 7.5, attendance_percentage: 79, backlogs: 0 },
      { name: "Rahul Gupta", roll_number: "ST21BTECH11007", email: "rahul.gupta@mahindra.university.edu", batch: "2021-2025", branch: "CSE", section: "CSE-C", semester: 7, cgpa: 7.8, attendance_percentage: 83, backlogs: 0 },
      { name: "Anjali Desai", roll_number: "ST21BTECH11008", email: "anjali.desai@mahindra.university.edu", batch: "2021-2025", branch: "AIML", section: "CSE-C", semester: 7, cgpa: 8.2, attendance_percentage: 90, backlogs: 0 },
      // Batch 2022-2026
      { name: "Aryan Mehta", roll_number: "ST22BTECH10001", email: "aryan.mehta@mahindra.university.edu", batch: "2022-2026", branch: "CSE", section: "CSE-A", semester: 5, cgpa: 8.7, attendance_percentage: 93, backlogs: 0 },
      { name: "Ishaan Pillai", roll_number: "ST22BTECH10002", email: "ishaan.pillai@mahindra.university.edu", batch: "2022-2026", branch: "IT", section: "CSE-A", semester: 5, cgpa: 7.3, attendance_percentage: 75, backlogs: 1 },
      { name: "Kavya Reddy", roll_number: "ST22BTECH10003", email: "kavya.reddy@mahindra.university.edu", batch: "2022-2026", branch: "AIML", section: "CSE-B", semester: 5, cgpa: 9.0, attendance_percentage: 96, backlogs: 0 },
      { name: "Nikhil Joshi", roll_number: "ST22BTECH10004", email: "nikhil.joshi@mahindra.university.edu", batch: "2022-2026", branch: "IT", section: "CSE-B", semester: 5, cgpa: 7.6, attendance_percentage: 81, backlogs: 0 }
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
        branch: s.branch,
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
    await Placement.create({ student_id: students[0].id, company_name: "Google India", company_tier: "Tier 1", sector: "Software Development", opportunity_type: "FULL_TIME", amount: 18, placed_date: "2025-03-14", status: "Active" });
    await Placement.create({ student_id: students[2].id, company_name: "Microsoft India", company_tier: "Tier 1", sector: "Software Development", opportunity_type: "FULL_TIME", amount: 22, placed_date: "2025-02-28", status: "Active" });
    await Placement.create({ student_id: students[4].id, company_name: "Goldman Sachs", company_tier: "Tier 1", sector: "FinTech", opportunity_type: "FULL_TIME", amount: 20, placed_date: "2025-04-09", status: "Active" });
    await Placement.create({ student_id: students[7].id, company_name: "Amazon India", company_tier: "Tier 1", sector: "Software Development", opportunity_type: "FULL_TIME", amount: 19, placed_date: "2025-01-22", status: "Active" });
    await Placement.create({ student_id: students[5].id, company_name: "Flipkart", company_tier: "Tier 1", sector: "E-Commerce", opportunity_type: "INTERNSHIP", amount: 35000, placed_date: "2024-11-12", status: "Active" });
    await Placement.create({ student_id: students[3].id, company_name: "Infosys", company_tier: "Tier 2", sector: "IT Services", opportunity_type: "INTERNSHIP", amount: 20000, placed_date: "2024-10-05", status: "Active" });

    console.log("=== STEP 9B: INSERTING JOB DRIVES ===");
    await JobDrive.bulkCreate([
      { companyName: "Adobe India", role: "Software Development Engineer", ctc: 28, branches: ["CSE", "AIML"], status: "Active", driveDate: "2026-09-18", openings: 12 },
      { companyName: "Deloitte", role: "Technology Analyst", ctc: 11, branches: ["CSE", "IT"], status: "Upcoming", driveDate: "2026-09-25", openings: 20 },
      { companyName: "NVIDIA", role: "AI Systems Intern", ctc: 18, branches: ["AIML"], status: "Active", driveDate: "2026-10-03", openings: 8 },
      { companyName: "TCS Digital", role: "Digital Specialist Engineer", ctc: 7.5, branches: ["CSE", "IT", "AIML"], status: "Upcoming", driveDate: "2026-10-12", openings: 30 },
      { companyName: "Infosys", role: "Systems Engineer", ctc: 4.5, branches: ["IT"], status: "Closed", driveDate: "2026-08-20", openings: 15 }
    ]);

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

    console.log("=== STEP 16: INSERTING MENTORING & DOCUMENT REQUESTS ===");
    const lor1 = await LorRequest.create({
      student_id: students[0].user_id,
      professor_id: facultyMenon.user_id,
      purpose: "PhD Application to IIT Bombay",
      university: "IIT Bombay",
      deadline: "2026-08-15",
      status: "pending"
    });

    const lor2 = await LorRequest.create({
      student_id: students[2].user_id,
      professor_id: facultyKrishnan.user_id,
      purpose: "Masters Application to NUS Singapore",
      university: "National University of Singapore",
      deadline: "2026-07-30",
      status: "Under Review"
    });

    const lor3 = await LorRequest.create({
      student_id: students[4].user_id,
      professor_id: facultyMenon.user_id,
      purpose: "Job Application at Google",
      university: null,
      deadline: "2026-07-20",
      status: "pending"
    });

    await RegistrarProcess.create({
      lor_id: "LOR-PROC-1001",
      original_request_id: lor2.id,
      student_name: students[2].name,
      roll_number: students[2].roll_number,
      note_to_registrar: "Please process urgently for NUS application",
      status: "Pending",
      sent_date: "2026-07-10"
    });

    await MentorSession.create({
      mentor_id: facultyMenon.user_id,
      mentee_id: students[0].user_id,
      title: "Semester Progress Review",
      scheduled_at: "2026-06-20T10:00:00Z",
      status: "completed",
      notes: "Student performing well. Suggested focusing on ML electives."
    });

    await MentorSession.create({
      mentor_id: facultyMenon.user_id,
      mentee_id: students[1].user_id,
      title: "Attendance and Backlog Discussion",
      scheduled_at: "2026-06-25T11:00:00Z",
      status: "pending",
      notes: "Needs improvement in attendance and clearing backlogs."
    });

    await MentorSession.create({
      mentor_id: userHoD.id,
      mentee_id: students[3].user_id,
      title: "Backlog Clearance Counseling",
      scheduled_at: "2026-07-22T14:30:00Z",
      status: "pending",
      notes: "Advisory session to discuss strategy for clearing backlogs."
    });

    console.log("=== STEP 17: INSERTING COHORTS ===");

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

    // Seed groups for cohort1
    const group1 = await CohortGroup.create({
      cohort_id: cohort1.id,
      group_name: "Team Alpha",
      group_description: "Alpha team working on the AI project",
      project_name: "AI Project Alpha",
      max_members: 4,
    });
    await CohortGroupMember.create({
      group_id: group1.id,
      user_id: students[0].user_id,
      email: students[0].email,
      role: "leader"
    });
    await CohortGroupMember.create({
      group_id: group1.id,
      user_id: students[1].user_id,
      email: students[1].email,
      role: "member"
    });

    const group2 = await CohortGroup.create({
      cohort_id: cohort1.id,
      group_name: "Team Beta",
      group_description: "Beta team working on the AI project",
      project_name: "AI Project Beta",
      max_members: 4,
    });
    await CohortGroupMember.create({
      group_id: group2.id,
      user_id: students[2].user_id,
      email: students[2].email,
      role: "leader"
    });
    await CohortGroupMember.create({
      group_id: group2.id,
      user_id: students[3].user_id,
      email: students[3].email,
      role: "member"
    });
    
    await cohort1.increment("group_count", { by: 2 });

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

    await CohortMember.create({
      cohort_id: cohort2.id,
      user_id: students[4].user_id,
      name: students[4].name,
      email: students[4].email,
      role: "student",
      department: "Computer Science"
    });
    await CohortMember.create({
      cohort_id: cohort2.id,
      user_id: students[5].user_id,
      name: students[5].name,
      email: students[5].email,
      role: "student",
      department: "Computer Science"
    });
    await CohortMember.create({
      cohort_id: cohort2.id,
      user_id: students[6].user_id,
      name: students[6].name,
      email: students[6].email,
      role: "student",
      department: "Computer Science"
    });

    // Add assignments for cohort1
    const assignment1 = await CohortAssignment.create({
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

    // Add seed data: 2 submissions for Assignment 1 in cohort1
    await AssignmentSubmission.create({
      assignment_id: assignment1.id,
      student_id: students[0].user_id,
      student_name: students[0].name,
      link: "https://github.com/student0/search-algorithms",
      note: "Completed BFS and DFS implementation.",
      submitted_at: new Date()
    });
    await AssignmentSubmission.create({
      assignment_id: assignment1.id,
      student_id: students[2].user_id,
      student_name: students[2].name,
      link: "https://github.com/student2/search-algorithms",
      note: "Maze solver works perfectly.",
      submitted_at: new Date()
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

    console.log("=== STEP 18: INSERTING SCHEDULE & MEETINGS ===");

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

    await ExamDuty.create({
      professor_id: userHoD.id,
      subject: "Introduction to Artificial Intelligence (CS601)",
      date: "2026-07-15",
      start_time: "09:00",
      end_time: "12:00",
      venue: "LH-101",
      status: "pending"
    });
    await ExamDuty.create({
      professor_id: userHoD.id,
      subject: "Advanced Machine Learning (CS602)",
      date: "2026-07-18",
      start_time: "14:00",
      end_time: "17:00",
      venue: "LH-202",
      status: "accepted"
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
    await MeetingRequest.create({
      professor_id: userHoD.id,
      student_id: students[3].id,
      title: "Thesis Topic Finalisation",
      proposed_time: new Date("2026-07-20T10:00:00.000Z"),
      status: "pending",
      initiated_by: "student",
      message: "I would like to finalise my B.Tech thesis topic and need your approval before proceeding."
    });
    await MeetingRequest.create({
      professor_id: userHoD.id,
      student_id: students[4].id,
      title: "Mid-Semester Performance Review",
      proposed_time: new Date("2026-07-24T14:00:00.000Z"),
      status: "pending",
      initiated_by: "student",
      message: "Requesting a meeting to discuss my mid-semester performance and areas I can improve on."
    });

    await MeetingRequest.create({
      professor_id: userHoD.id,
      student_id: students[3].id,
      title: "Thesis Topic Finalisation",
      proposed_time: new Date("2026-07-22T14:30:00.000Z"),
      status: "pending",
      initiated_by: "student",
      message: "I would like to discuss and finalise my B.Tech thesis topic and need your approval."
    });

    console.log("=== STEP 19: INSERTING LIBRARY SEED DATA ===");
    const book1 = await LibraryBook.create({
      title: "Deep Learning",
      author: "Ian Goodfellow",
      isbn: "978-0262035613",
      category: "Computer Science",
      total_copies: 5,
      available_copies: 4
    });

    const book2 = await LibraryBook.create({
      title: "Clean Code",
      author: "Robert Martin",
      isbn: "978-0132350884",
      category: "Software Engineering",
      total_copies: 3,
      available_copies: 2
    });

    const book3 = await LibraryBook.create({
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      isbn: "978-1449373320",
      category: "System Design",
      total_copies: 4,
      available_copies: 4
    });

    // 2 borrowed books for HoD
    await LibraryRequest.create({
      user_id: userHoD.id,
      user_name: userHoD.name,
      book_id: book1.id,
      book_title: book1.title,
      author: book1.author,
      isbn: book1.isbn,
      category: book1.category,
      status: "approved",
      approved_date: "2026-07-06",
      due_date: "2026-07-20",
      physical_copy_picked_up: true
    });

    await LibraryRequest.create({
      user_id: userHoD.id,
      user_name: userHoD.name,
      book_id: book2.id,
      book_title: book2.title,
      author: book2.author,
      isbn: book2.isbn,
      category: book2.category,
      status: "approved",
      approved_date: "2026-07-11",
      due_date: "2026-07-25",
      physical_copy_picked_up: true
    });

    // 1 pending book request
    await LibraryRequest.create({
      user_id: userHoD.id,
      user_name: userHoD.name,
      book_id: book3.id,
      book_title: book3.title,
      author: book3.author,
      isbn: book3.isbn,
      category: book3.category,
      status: "pending",
      request_date: "2026-07-10"
    });

    console.log("=== STEP 20: INSERTING RESEARCH SEED DATA ===");
    const eduAnalyticsProj = await Research.create({
      title: "AI for Educational Analytics",
      description: "Using ML to predict student performance",
      status: "active",
      created_by: userHoD.id,
      type: "research"
    });

    await Research.create({
      title: "Optimizing Transformer Models for Low-Resource Edge Devices",
      description: "A study on deploying compressed NLP architectures on resource-constrained embedded systems.",
      type: "publication",
      status: "completed",
      journal_details: "IEEE Transactions on Computers, Vol. 74, 2026",
      doi: "10.1109/TC.2026.0001",
      link: "https://ieeexplore.ieee.org/document/9999999",
      funding_details: "DST Cognitive Computing Grant #8874",
      tags: ["Deep Learning", "Model Compression", "Edge Computing"],
      start_date: "2026-01-15",
      created_by: userHoD.id
    });

    await ResearchApplication.create({
      research_id: eduAnalyticsProj.id,
      applicant_id: students[2].user_id,
      role_title: "Research Assistant",
      status: "pending",
      message: "I am highly interested in neural nets and educational analytics, and have completed relevant coursework in ML."
    });

    await GrantRequest.create({
      research_project_id: eduAnalyticsProj.id,
      title: "AI for Educational Analytics - Infrastructure & Compute Grant",
      status: "Pending",
      amount_inr: 150000,
      justification: "Compute resources for training deep models and cloud hosting for performance analysis.",
      requested_at: "2026-07-15"
    });

    console.log("=== STEP 21: INSERTING ASSETS, ASSET REQUESTS & MAINTENANCE DATA ===");
    const asset1 = await Asset.create({ name: "Projector - Epson", type: "Equipment", status: "available" });
    const asset2 = await Asset.create({ name: "Room 101", type: "Class Room", status: "available", capacity: 40, location: "Block A" });
    const asset3 = await Asset.create({ name: "Laptop - Dell Latitude", type: "Equipment", status: "available" });
    const asset4 = await Asset.create({ name: "Conference Room", type: "Class Room", status: "available", capacity: 20, location: "Admin Block" });

    const asset5 = await Asset.create({ name: "Advanced AI Lab", type: "Lab", status: "available", capacity: 30, location: "Block B - Room 202" });
    const asset6 = await Asset.create({ name: "Cybersecurity Lab", type: "Lab", status: "available", capacity: 25, location: "Block B - Room 204" });
    const asset7 = await Asset.create({ name: "Main Auditorium", type: "Seminar Hall", status: "available", capacity: 150, location: "Admin Block" });
    const asset8 = await Asset.create({ name: "Seminar Room 1", type: "Seminar Hall", status: "available", capacity: 60, location: "Block C" });
    const asset9 = await Asset.create({ name: "Executive Guest House Room 1", type: "Accommodation", status: "available", location: "Guest House" });
    const asset10 = await Asset.create({ name: "Executive Guest House Room 2", type: "Accommodation", status: "available", location: "Guest House" });

    await AssetRequest.create({
      requester_id: userMenon.id,
      requester_name: "Dr. Rajesh Menon",
      asset_id: asset1.id,
      asset_name: "Projector - Epson",
      type: "Equipment",
      date: "2026-07-15",
      start_time: "09:00",
      end_time: "11:00",
      course: "CS401",
      reason: "Guest lecture on Deep Learning",
      status: "Pending",
      posted_at: new Date()
    });

    await AssetRequest.create({
      requester_id: userKrishnan.id,
      requester_name: "Dr. Ananya Krishnan",
      asset_id: asset2.id,
      asset_name: "Room 101",
      type: "Class Room",
      date: "2026-07-18",
      start_time: "14:00",
      end_time: "16:00",
      course: "CS201",
      reason: "Extra class for semester exam preparation",
      status: "Approved",
      posted_at: new Date()
    });

    await AssetRequest.create({
      requester_id: userSharma.id,
      requester_name: "Dr. Priya Sharma",
      asset_id: asset3.id,
      asset_name: "Laptop - Dell Latitude",
      type: "Equipment",
      date: "2026-07-20",
      start_time: "10:00",
      end_time: "13:00",
      course: "CS501",
      reason: "Database lab demo session",
      status: "Rejected",
      rejection_reason: "Asset already booked for that slot",
      posted_at: new Date()
    });

    await MaintenanceRequest.create({
      requester_id: userMenon.id,
      requester_name: "Dr. Rajesh Menon",
      category: "university",
      location: "Block A - Room 101",
      title: "AC Not Working",
      description: "AC in Room 101 has stopped cooling",
      priority: "high",
      status: "pending"
    });

    await MaintenanceRequest.create({
      requester_id: userNair.id,
      requester_name: "Dr. Vikram Nair",
      category: "university",
      location: "Block C - CS Lab",
      title: "WiFi Not Working",
      description: "WiFi router in CS Lab is down since morning",
      priority: "urgent",
      status: "in-progress"
    });

    await MaintenanceRequest.create({
      requester_id: userSharma.id,
      requester_name: "Dr. Priya Sharma",
      category: "accommodation",
      location: "Guest House Room 1",
      title: "Tap Leakage",
      description: "Bathroom tap is leaking continuously",
      priority: "medium",
      status: "resolved"
    });

    console.log("=== STEP 22: INSERTING EXPENSES, ADVANCES & PAYROLL DATA ===");
    await Expense.create({
      submitted_by: userMenon.id,
      submitted_name: "Dr. Rajesh Menon",
      title: "Conference Registration - ICML 2026",
      category: "Conference",
      amount_spent: 15000,
      description: "Registration fee for ICML 2026 conference in Vienna",
      status: "Approved"
    });

    await Expense.create({
      submitted_by: userKrishnan.id,
      submitted_name: "Dr. Ananya Krishnan",
      title: "Research Lab Equipment",
      category: "Equipment",
      amount_spent: 8500,
      description: "Purchased GPU memory module for data science lab",
      status: "Pending"
    });

    await Expense.create({
      submitted_by: userSharma.id,
      submitted_name: "Dr. Priya Sharma",
      title: "Travel Reimbursement - Workshop",
      category: "Travel",
      amount_spent: 4200,
      description: "Travel expenses for cybersecurity workshop in Bangalore",
      status: "Rejected",
      admin_comments: "Receipt not attached"
    });

    await Advance.create({
      submitted_by: userMenon.id,
      submitted_name: "Dr. Rajesh Menon",
      title: "Research Field Trip Advance",
      category: "Research",
      amount_requested: 25000,
      description: "Advance required for upcoming field data collection trip",
      status: "Approved"
    });

    await Advance.create({
      submitted_by: userBose.id,
      submitted_name: "Dr. Arjun Bose",
      title: "Conference Advance - ICCV 2026",
      category: "Conference",
      amount_requested: 18000,
      description: "Advance for registration and accommodation at ICCV 2026",
      status: "Pending"
    });

    await Payroll.create({
      user_id: userMenon.id,
      month: "April",
      year: 2026,
      basic: 85000,
      hra: 34000,
      da: 8500,
      ta: 5000,
      other_allowances: 2000,
      pf_deduction: 10200,
      tax_deduction: 8500,
      other_deductions: 0,
      net_salary: 115800,
      status: "paid"
    });

    await Payroll.create({
      user_id: userMenon.id,
      month: "May",
      year: 2026,
      basic: 85000,
      hra: 34000,
      da: 8500,
      ta: 5000,
      other_allowances: 2000,
      pf_deduction: 10200,
      tax_deduction: 8500,
      other_deductions: 0,
      net_salary: 115800,
      status: "paid"
    });

    await Payroll.create({
      user_id: userMenon.id,
      month: "June",
      year: 2026,
      basic: 85000,
      hra: 34000,
      da: 8500,
      ta: 5000,
      other_allowances: 2000,
      pf_deduction: 10200,
      tax_deduction: 8500,
      other_deductions: 0,
      net_salary: 115800,
      status: "processing"
    });

    console.log("=== STEP 16: INSERTING REVALUATION REQUESTS ===");
    try {
      await RevaluationRequest.destroy({ where: {}, force: true });
    } catch (err) {
      console.warn("Could not clear revaluation_requests table:", err.message);
    }
    await RevaluationRequest.create({
      student_id: students[0].user_id,
      professor_id: userHoD.id,
      subject_code: "CS201",
      subject_name: "Data Structures and Algorithms",
      semester: "Semester 5",
      exam_type: "End Term",
      priority: "High",
      reason: "I believe my answer for Q4(b) was marked incorrectly. The approach used is an alternate valid solution.",
      original_marks: 38,
      max_marks: 50,
      original_grade: "B",
      status: "Pending",
    });
    await RevaluationRequest.create({
      student_id: students[1].user_id,
      professor_id: userHoD.id,
      subject_code: "CS501",
      subject_name: "Database Management Systems",
      semester: "Semester 5",
      exam_type: "End Term",
      priority: "Mid",
      reason: "My ER diagram in Q2 was marked 0 but it correctly represents the given schema.",
      original_marks: 41,
      max_marks: 50,
      original_grade: "B+",
      status: "UnderReview",
    });
    await RevaluationRequest.create({
      student_id: students[2].user_id,
      professor_id: userHoD.id,
      subject_code: "CS201",
      subject_name: "Data Structures and Algorithms",
      semester: "Semester 5",
      exam_type: "End Term",
      priority: "High",
      reason: "The dynamic programming solution in Q5 is correct but received no marks.",
      original_marks: 35,
      max_marks: 50,
      original_grade: "C",
      revised_marks: 43,
      revised_grade: "A",
      professor_remarks: "Upon re-evaluation, alternate DP approach is accepted. Revised marks awarded.",
      status: "Approved",
    });

    console.log("=== SEED COMPLETE (INCLUDING COHORTS) ===");
    process.exit(0);
  } catch (error) {
    console.error("Seed script failed with error:", error);
    process.exit(1);
  }
};

seed();
