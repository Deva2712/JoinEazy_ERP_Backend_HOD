import { Op } from "sequelize";
import Placement from "../department-placements/department-placements-model.js";
import Student from "../department-students/department-students-model.js";
import JobDrive from "./job-drive-model.js";

const normalizeBranches = (branches) => {
  if (!branches) return [];
  const values = Array.isArray(branches) ? branches : [branches];
  return values.map((branch) => String(branch).trim()).filter(Boolean);
};

export const parseBranchQuery = (query = {}) => {
  return normalizeBranches(query.branches ?? query["branches[]"] ?? query.branch);
};

const studentWhereForBranches = (branches) => {
  return branches.length > 0 ? { branch: { [Op.in]: branches } } : {};
};

const batchEndYear = (batch) => {
  if (!batch) return null;
  const endYear = String(batch).split("-").pop()?.trim();
  const year = Number(endYear);
  return Number.isFinite(year) ? year : null;
};

const placementToPlacedStudent = (placement) => {
  const student = placement.student;
  const year = batchEndYear(student?.batch);
  return {
    id: student?.id || placement.student_id,
    name: student?.name || null,
    rollNo: student?.roll_number || null,
    branch: student?.branch || null,
    batch: student?.batch || null,
    year,
    companyName: placement.company_name,
    company: placement.company_name,
    role: null,
    package: placement.amount,
    sector: placement.sector || null,
    offerType: placement.opportunity_type,
    placedDate: placement.placed_date || placement.createdAt,
  };
};

export const getHodPlacementOverview = async (branches = []) => {
  const students = await Student.findAll({
    where: studentWhereForBranches(branches),
    attributes: ["batch"],
  });
  const batchTotals = {};
  for (const student of students) {
    const year = batchEndYear(student.batch);
    if (!year) continue;
    const key = String(year);
    batchTotals[key] = (batchTotals[key] || 0) + 1;
  }

  const placements = await Placement.findAll({
    include: [{
      model: Student,
      as: "student",
      attributes: ["id", "name", "roll_number", "branch", "batch"],
      where: studentWhereForBranches(branches),
      required: true,
    }],
    order: [["placed_date", "DESC"], ["createdAt", "DESC"]],
  });

  const pastPlacedStudents = placements.map(placementToPlacedStudent);

  return { pastPlacedStudents, batchTotals };
};

export const getHodCurrentStudents = async (branches = []) => {
  const students = await Student.findAll({
    where: studentWhereForBranches(branches),
    order: [["batch", "ASC"], ["roll_number", "ASC"]],
  });

  const placements = students.length > 0
    ? await Placement.findAll({
        attributes: ["student_id", "company_name", "opportunity_type", "amount", "sector", "placed_date", "createdAt"],
        include: [{
          model: Student,
          as: "student",
          attributes: ["id"],
          where: studentWhereForBranches(branches),
          required: true,
        }],
        order: [["placed_date", "DESC"], ["createdAt", "DESC"]],
      })
    : [];

  const statusByStudent = new Map();
  const placementByStudent = new Map();
  for (const placement of placements) {
    const current = statusByStudent.get(placement.student_id);
    if (placement.opportunity_type === "FULL_TIME") {
      statusByStudent.set(placement.student_id, "Placed");
    } else if (!current) {
      statusByStudent.set(placement.student_id, "In Process");
    }
    if (!placementByStudent.has(placement.student_id)) {
      placementByStudent.set(placement.student_id, placement);
    }
  }

  return {
    students: students.map((student) => {
      const placement = placementByStudent.get(student.id);
      return {
        id: student.id,
        name: student.name,
        rollNo: student.roll_number,
        branch: student.branch,
        cgpa: student.cgpa,
        placementStatus: statusByStudent.get(student.id) || "Not Placed",
        batch: student.batch,
        year: batchEndYear(student.batch),
        company: placement?.company_name || null,
        role: null,
        package: placement?.amount ?? null,
        sector: placement?.sector || null,
      };
    }),
  };
};

export const getHodActiveDrives = async (branches = []) => {
  const drives = await JobDrive.findAll({
    where: {
      status: { [Op.in]: ["Upcoming", "Active"] },
    },
    order: [["driveDate", "ASC"], ["createdAt", "DESC"]],
  });

  return drives
    .filter((drive) => {
      if (branches.length === 0) return true;
      const driveBranches = Array.isArray(drive.branches) ? drive.branches : [];
      return driveBranches.some((branch) => branches.includes(branch));
    })
    .map((drive) => ({
      id: drive.id,
      companyName: drive.companyName,
      role: drive.role,
      ctc: drive.ctc,
      branches: Array.isArray(drive.branches) ? drive.branches : [],
      status: drive.status,
      driveDate: drive.driveDate,
      openings: drive.openings,
    }));
};

export const createJobDrive = async (data) => {
  const drive = await JobDrive.create({
    companyName: data.companyName || data.company_name,
    role: data.role,
    ctc: data.ctc,
    branches: normalizeBranches(data.branches || data["branches[]"] || data.branch),
    status: data.status || "Upcoming",
    driveDate: data.driveDate || data.drive_date,
    openings: data.openings || 0,
  });

  return drive;
};
