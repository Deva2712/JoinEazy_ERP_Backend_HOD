import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const ResearchExpense = sequelize.define(
  "ResearchExpense",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    research_project_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount_inr: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    expense_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "research_expenses",
    timestamps: true,
  }
);

export default ResearchExpense;
