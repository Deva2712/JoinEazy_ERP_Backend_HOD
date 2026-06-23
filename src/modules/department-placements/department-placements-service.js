import Placement from "./department-placements-model.js";
import Student from "../department-students/department-students-model.js";
import { Op } from "sequelize";

const getBatchForStudents = async (studentIds) => {
  const students = await Student.findAll({
    where: {
      id: {
        [Op.in]: studentIds
      }
    },
    attributes: ["id", "batch"]
  });

  const map = new Map();
  for (const s of students) {
    map.set(s.id, s.batch);
  }
  return map;
};

const computeStats = (allPlacements, studentBatchMap, studentCountByBatch) => {
  const fullTimePlacements = allPlacements.filter(p => p.opportunity_type === "FULL_TIME");
  const internshipPlacements = allPlacements.filter(p => p.opportunity_type === "INTERNSHIP");

  // placements logic
  const ftGrouped = {};
  for (const p of fullTimePlacements) {
    const batch = studentBatchMap.get(p.student_id);
    if (!batch) continue;
    if (!ftGrouped[batch]) {
      ftGrouped[batch] = { batch, placements: [], amounts: [], sectors: new Set() };
    }
    const g = ftGrouped[batch];
    g.placements.push(p);
    if (p.amount !== null && p.amount !== undefined) g.amounts.push(Number(p.amount));
    if (p.sector) g.sectors.add(p.sector);
  }

  const placementsArray = Object.values(ftGrouped).map(g => {
    const placed_count = g.placements.length;
    const total_count = studentCountByBatch[g.batch] || 0;
    const placement_percentage = total_count > 0 ? Math.round((placed_count / total_count) * 100) : 0;
    const avg_package_lpa = g.amounts.length > 0
      ? Number((g.amounts.reduce((sum, val) => sum + val, 0) / g.amounts.length).toFixed(1))
      : 0;
    const highest_package_lpa = g.amounts.length > 0 ? Math.max(...g.amounts) : 0;
    const top_hiring_sectors = [...g.sectors].slice(0, 3);
    return { batch: g.batch, placed_count, total_count, placement_percentage, avg_package_lpa, highest_package_lpa, top_hiring_sectors };
  });

  // internships logic
  const internGrouped = {};
  for (const p of internshipPlacements) {
    const batch = studentBatchMap.get(p.student_id);
    if (!batch) continue;
    if (!internGrouped[batch]) {
      internGrouped[batch] = { batch, placements: [], amounts: [], sectors: new Set() };
    }
    const g = internGrouped[batch];
    g.placements.push(p);
    if (p.amount !== null && p.amount !== undefined) g.amounts.push(Number(p.amount));
    if (p.sector) g.sectors.add(p.sector);
  }

  const internshipsArray = Object.values(internGrouped).map(g => {
    const secured_count = g.placements.length;
    const total_count = studentCountByBatch[g.batch] || 0;
    const placement_percentage = total_count > 0 ? Math.round((secured_count / total_count) * 100) : 0;
    const avg_stipend_per_month = g.amounts.length > 0
      ? Number((g.amounts.reduce((sum, val) => sum + val, 0) / g.amounts.length).toFixed(1))
      : 0;
    const highest_stipend_per_month = g.amounts.length > 0 ? Math.max(...g.amounts) : 0;
    const top_hiring_sectors = [...g.sectors].slice(0, 3);
    return { batch: g.batch, secured_count, total_count, placement_percentage, avg_stipend_per_month, highest_stipend_per_month, top_hiring_sectors };
  });

  return { placements: placementsArray, internships: internshipsArray };
};

export const getAllPlacements = async () => {
  const allPlacements = await Placement.findAll();
  if (allPlacements.length === 0) {
    return {
      placements: [],
      internships: [],
      ecosystem: { partner_companies: 0, sectors: 0, hired: 0, openings: 0, top_hiring_sectors: [] }
    };
  }

  const studentIds = [...new Set(allPlacements.map(p => p.student_id).filter(id => id !== null))];
  const studentBatchMap = await getBatchForStudents(studentIds);

  const allStudents = await Student.findAll({ attributes: ["batch"] });
  const studentCountByBatch = {};
  for (const s of allStudents) {
    if (s.batch) {
      studentCountByBatch[s.batch] = (studentCountByBatch[s.batch] || 0) + 1;
    }
  }

  const { placements, internships } = computeStats(allPlacements, studentBatchMap, studentCountByBatch);

  const distinctCompanies = new Set(allPlacements.map(p => p.company_name).filter(c => c !== null));
  const distinctSectors = new Set(allPlacements.map(p => p.sector).filter(s => s !== null));
  const fullTimePlacements = allPlacements.filter(p => p.opportunity_type === "FULL_TIME");

  // openings is 0 because no job openings table exists yet
  const ecosystem = {
    partner_companies: distinctCompanies.size,
    sectors: distinctSectors.size,
    hired: fullTimePlacements.length,
    openings: 0,
    top_hiring_sectors: [...distinctSectors].slice(0, 4)
  };

  return { placements, internships, ecosystem };
};

export const getBatchStats = async () => {
  const allPlacements = await Placement.findAll();
  if (allPlacements.length === 0) {
    return { placements: [], internships: [] };
  }

  const studentIds = [...new Set(allPlacements.map(p => p.student_id).filter(id => id !== null))];
  const studentBatchMap = await getBatchForStudents(studentIds);

  const allStudents = await Student.findAll({ attributes: ["batch"] });
  const studentCountByBatch = {};
  for (const s of allStudents) {
    if (s.batch) {
      studentCountByBatch[s.batch] = (studentCountByBatch[s.batch] || 0) + 1;
    }
  }

  return computeStats(allPlacements, studentBatchMap, studentCountByBatch);
};

export const getCompanyList = async () => {
  const allPlacements = await Placement.findAll();

  const grouped = {};
  for (const p of allPlacements) {
    if (!p.company_name) continue;
    if (!grouped[p.company_name]) {
      grouped[p.company_name] = [];
    }
    grouped[p.company_name].push(p);
  }

  const companiesArray = Object.entries(grouped).map(([name, rows]) => {
    const firstRow = rows[0];
    return {
      id: name,
      name: name,
      tier: firstRow.company_tier || null,
      sector: firstRow.sector || null,
      location: null,
      status: "Active"
    };
  });

  const total_partners = companiesArray.length;

  const tier_1_count = companiesArray.filter(c => c.tier === "Tier 1").length;
  const sectorsSet = new Set(companiesArray.map(c => c.sector).filter(s => s !== null));
  const topSectors = [...sectorsSet].slice(0, 4);

  const partner_insights = {
    tier_1_count,
    sectors_count: sectorsSet.size,
    top_hiring_sectors: topSectors
  };

  return {
    total_partners,
    partner_insights,
    companies: companiesArray
  };
};

export const getCompanyDetails = async (id) => {
  // id is company_name
  const placements = await Placement.findAll({
    where: { company_name: id },
    order: [["createdAt", "DESC"]]
  });
  if (placements.length === 0) return null;

  const firstRow = placements[0]; // most recently created row since order is DESC
  const latest_package_lpa = firstRow.amount || 0;

  const studentIds = [...new Set(placements.map(p => p.student_id).filter(sid => sid !== null))];
  const studentBatchMap = await getBatchForStudents(studentIds);

  // Group by batch for placement_history
  const batchGroups = {};
  for (const p of placements) {
    const batch = studentBatchMap.get(p.student_id);
    if (!batch) continue;
    if (!batchGroups[batch]) {
      batchGroups[batch] = {
        batch,
        count: 0,
        ftAmounts: []
      };
    }
    const g = batchGroups[batch];
    g.count += 1;
    if (p.opportunity_type === "FULL_TIME" && p.amount !== null && p.amount !== undefined) {
      g.ftAmounts.push(Number(p.amount));
    }
  }

  const placement_history = Object.values(batchGroups).map(g => {
    const avg_ctc_lpa = g.ftAmounts.length > 0
      ? Number((g.ftAmounts.reduce((sum, val) => sum + val, 0) / g.ftAmounts.length).toFixed(1))
      : 0;
    return {
      batch: g.batch,
      placed: g.count,
      avg_ctc_lpa
    };
  });

  // recruiter is { name: null, email: null } because no recruiter data table exists yet
  const recruiter = { name: null, email: null };

  // active_opportunities is [] because no job openings table exists yet
  const active_opportunities = [];

  return {
    id,
    name: id,
    tier: firstRow.company_tier || null,
    sector: firstRow.sector || null,
    location: null,
    status: "Active",
    lifetime_hires: placements.length,
    latest_package_lpa,
    recruiter,
    active_opportunities,
    placement_history
  };
};

export const createJobOpening = async (data) => {
  return { success: true, message: "Job opening created successfully", data };
};
