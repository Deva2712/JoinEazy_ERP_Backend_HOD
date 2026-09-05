import Course from "../modules/department-courses/department-courses-model.js";
import UserCourse from "../modules/department-courses/user-course-model.js";
import User from "../modules/auth/auth-model.js";
import Faculty from "../modules/department-faculty/department-faculty-model.js";
import LeaveApplication from "../modules/leaves/leaves-model.js";
import { CohortGroup, CohortGroupMember } from "../modules/cohort/cohort-model.js";
import { AttendanceLog, AttendanceRecord } from "../modules/cohort-attendance/cohort-attendance-model.js";
import { CohortAnnouncement, CohortAnnouncementReply, AnnouncementReplyUpvote } from "../modules/cohort-announcements/cohort-announcements-model.js";
import { SessionReflection, SessionDocument } from "../modules/session-planning/session-planning-model.js";
import Bulletin from "../modules/bulletins/bulletins-model.js";
import Student from "../modules/department-students/department-students-model.js";
import Placement from "../modules/department-placements/department-placements-model.js";
import RevaluationRequest from "../modules/revaluation/revaluation-model.js";


UserCourse.belongsTo(Course, { as: "course", foreignKey: "course_id" });
Course.hasMany(UserCourse, { as: "userCourses", foreignKey: "course_id" });
UserCourse.belongsTo(User, { as: "user", foreignKey: "user_id" });
Faculty.belongsTo(User, { as: "user", foreignKey: "user_id" });
User.hasMany(LeaveApplication, { as: "leaveApplications", foreignKey: "user_id" });
LeaveApplication.belongsTo(User, { as: "user", foreignKey: "user_id" });

// Missing associations needed for cohort modules
CohortGroupMember.belongsTo(CohortGroup, { foreignKey: "group_id", as: "group" });
AttendanceRecord.belongsTo(AttendanceLog, { foreignKey: "log_id", as: "log" });

CohortAnnouncement.hasMany(CohortAnnouncementReply, { foreignKey: "announcement_id", as: "replies", onDelete: "CASCADE" });
CohortAnnouncementReply.belongsTo(CohortAnnouncement, { foreignKey: "announcement_id" });
CohortAnnouncementReply.hasMany(AnnouncementReplyUpvote, { foreignKey: "reply_id", as: "upvote_records", onDelete: "CASCADE" });

// Student and Revaluation associations
User.hasOne(Student, { as: "studentProfile", foreignKey: "user_id" });
Student.belongsTo(User, { as: "user", foreignKey: "user_id" });
Placement.belongsTo(Student, { as: "student", foreignKey: "student_id" });
Student.hasMany(Placement, { as: "placements", foreignKey: "student_id" });
RevaluationRequest.belongsTo(User, { as: "student", foreignKey: "student_id" });
RevaluationRequest.belongsTo(User, { as: "professor", foreignKey: "professor_id" });

export default {};
