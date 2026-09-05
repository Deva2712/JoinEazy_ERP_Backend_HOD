import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const Placement = sequelize.define(
  "Placement",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_tier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    opportunity_type: {
      type: DataTypes.ENUM("FULL_TIME", "INTERNSHIP"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    placed_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Active",
    },
  },
  {
    tableName: "placements",
    timestamps: true,
  }
);

export default Placement;
