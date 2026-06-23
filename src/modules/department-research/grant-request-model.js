import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const GrantRequest = sequelize.define(
  "GrantRequest",
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Pending",
    },
    amount_inr: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    justification: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requested_at: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "grant_requests",
    timestamps: true,
  }
);

export default GrantRequest;
