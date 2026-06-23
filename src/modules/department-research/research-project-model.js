import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const ResearchProject = sequelize.define(
  "ResearchProject",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Active",
    },
    authors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    total_budget_inr: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "research_projects",
    timestamps: true,
  }
);

export default ResearchProject;
