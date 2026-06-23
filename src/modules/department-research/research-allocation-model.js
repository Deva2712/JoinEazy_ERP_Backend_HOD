import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const ResearchAllocation = sequelize.define(
  "ResearchAllocation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    percentage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    amount_inr: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "research_allocation",
    timestamps: true,
  }
);

export default ResearchAllocation;
