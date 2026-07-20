import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const LeaveApplication = sequelize.define(
  "LeaveApplication",
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
    leave_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    replacement_faculty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "leave_applications",
    timestamps: true,
    underscored: true,
  }
);

export default LeaveApplication;
