import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const RevaluationRequest = sequelize.define("RevaluationRequest", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  student_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  professor_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  subject_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  semester: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  exam_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM("High", "Mid", "Low"),
    defaultValue: "Mid",
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  original_marks: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  max_marks: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 100,
  },
  original_grade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  revised_marks: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  revised_grade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("Pending", "UnderReview", "Approved", "Rejected"),
    defaultValue: "Pending",
  },
  professor_remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "revaluation_requests",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default RevaluationRequest;
