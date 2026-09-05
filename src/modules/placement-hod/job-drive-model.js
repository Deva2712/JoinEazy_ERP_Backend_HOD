import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const JobDrive = sequelize.define(
  "JobDrive",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ctc: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    branches: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM("Upcoming", "Active", "Closed"),
      allowNull: false,
      defaultValue: "Upcoming",
    },
    driveDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    openings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "job_drives",
    timestamps: true,
  }
);

export default JobDrive;
