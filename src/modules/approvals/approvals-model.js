import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const Approval = sequelize.define(
  "Approval",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Pending",
    },
    requested_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    leave_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    replacement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    change_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requested_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "approvals",
    timestamps: true,
  }
);

export default Approval;
