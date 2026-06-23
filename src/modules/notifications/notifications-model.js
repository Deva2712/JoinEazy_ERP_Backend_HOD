import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    course_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
  }
);

export default Notification;
