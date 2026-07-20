import Payroll from "./payroll-model.js";

const mapPayrollRecord = (payroll) => {
  if (!payroll) return null;
  const raw = payroll.get ? payroll.get({ plain: true }) : payroll;

  const isPaid = raw.status === "paid";
  const present = isPaid ? 22 : 20;
  const absent = isPaid ? 0 : 2;

  const allowances = (raw.da || 0) + (raw.ta || 0) + (raw.other_allowances || 0);
  const bonuses = 0;
  const insurance = 0;
  const absence = 0;

  return {
    ...raw,
    allowances,
    bonuses,
    attendance: {
      present,
      absent
    },
    deductions: {
      tax: raw.tax_deduction || 0,
      pf: raw.pf_deduction || 0,
      insurance,
      absence,
      other: raw.other_deductions || 0
    },
    netPay: raw.net_salary || 0
  };
};

export const getHistory = async (userId, userRole) => {
  const history = await Payroll.findAll({ order: [["year","DESC"],["month","DESC"]] });
  return { history: history.map(mapPayrollRecord) };
};

export const getBreakdown = async (userId, userRole, month, year) => {
  const currentMonth = month || new Date().toLocaleString("default",{month:"long"});
  const currentYear = year || new Date().getFullYear();
  
  let breakdown = await Payroll.findOne({ where: { month: currentMonth, year: currentYear } });
  
  if (!breakdown) {
    breakdown = await Payroll.findOne({ order: [["year","DESC"],["createdAt","DESC"]] });
  }
  
  return { breakdown: mapPayrollRecord(breakdown) };
};
