import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const SessionReflection = sequelize.define(
  "SessionReflection",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    session_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    professor_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    class_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    course_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    course_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    batch_section: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    what_was_taught: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    needs_improvement: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    topics_carried_forward: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    personal_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    visible_to_hod: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "submitted",
    },
  },
  {
    tableName: "session_reflections",
    timestamps: true,
    underscored: true,
  }
);

const SessionDocument = sequelize.define(
  "SessionDocument",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    course_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    professor_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "document",
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    uploaded_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Pending",
    },
    hod_comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "session_documents",
    timestamps: true,
    underscored: true,
  }
);

export { SessionReflection, SessionDocument };
