import Course from "../modules/department-courses/department-courses-model.js";
import UserCourse from "../modules/department-courses/user-course-model.js";
import User from "../modules/auth/auth-model.js";
import Faculty from "../modules/department-faculty/department-faculty-model.js";

UserCourse.belongsTo(Course, { as: "course", foreignKey: "course_id" });
Course.hasMany(UserCourse, { as: "userCourses", foreignKey: "course_id" });
UserCourse.belongsTo(User, { as: "user", foreignKey: "user_id" });
Faculty.belongsTo(User, { as: "user", foreignKey: "user_id" });

export default {};
