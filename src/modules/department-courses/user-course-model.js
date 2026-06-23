import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const UserCourse = sequelize.define(
  "UserCourse",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role_in_course: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    academic_year: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grade: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "user_courses",
    timestamps: true,
  }
);

export default UserCourse;
