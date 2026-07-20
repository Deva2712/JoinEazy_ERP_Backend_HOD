import { DataTypes } from "sequelize";
import sequelize from "../../database/connection.js";

const RegistrarRequest = sequelize.define("RegistrarRequest", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  student_id: { type: DataTypes.UUID, allowNull: false },
  type: { type: DataTypes.ENUM("transcript","bonafide","migration","degree","other"), allowNull: false },
  purpose: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: "pending" },
  remarks: { type: DataTypes.TEXT, allowNull: true },
  copies: { type: DataTypes.INTEGER, defaultValue: 1 },
}, { tableName: "registrar_requests", timestamps: true });

const LorRequest = sequelize.define("LorRequest", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  student_id: { type: DataTypes.UUID, allowNull: false },
  professor_id: { type: DataTypes.UUID, allowNull: true },
  purpose: { type: DataTypes.TEXT, allowNull: true },
  university: { type: DataTypes.STRING, allowNull: true },
  deadline: { type: DataTypes.DATEONLY, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: "pending" },
  remarks: { type: DataTypes.TEXT, allowNull: true },
  meeting_time: { type: DataTypes.DATE, allowNull: true },
  lor_document: { type: DataTypes.JSON, allowNull: true },
  supporting_docs: { type: DataTypes.JSON, allowNull: true },
}, { tableName: "lor_requests", timestamps: true });

const RegistrarProcess = sequelize.define("RegistrarProcess", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  lor_id: { type: DataTypes.STRING, allowNull: false },
  original_request_id: { type: DataTypes.UUID, allowNull: false },
  student_name: { type: DataTypes.STRING, allowNull: true },
  roll_number: { type: DataTypes.STRING, allowNull: true },
  signed_document: { type: DataTypes.JSON, allowNull: true },
  supporting_docs: { type: DataTypes.JSON, allowNull: true },
  approved_document: { type: DataTypes.JSON, allowNull: true },
  note_to_registrar: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: "Pending" },
  sent_date: { type: DataTypes.DATEONLY, allowNull: true },
  approved_date: { type: DataTypes.DATEONLY, allowNull: true },
  sent_to_student_date: { type: DataTypes.DATEONLY, allowNull: true },
}, { tableName: "registrar_processes", timestamps: true });

export { RegistrarRequest, LorRequest, RegistrarProcess };
