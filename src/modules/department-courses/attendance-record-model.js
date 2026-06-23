import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const AttendanceRecord = sequelize.define(
  "AttendanceRecord",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_course_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "attendance_records",
    timestamps: true,
  }
);

export default AttendanceRecord;
