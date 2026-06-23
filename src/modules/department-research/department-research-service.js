import ResearchProject from "./research-project-model.js";
import GrantRequest from "./grant-request-model.js";
import ResearchExpense from "./research-expense-model.js";
import ResearchAllocation from "./research-allocation-model.js";

export const getAllResearch = async () => {
  const projects = await ResearchProject.findAll();
  if (projects.length === 0) {
    return {
      total_budget_inr: 0,
      remaining_balance_inr: 0,
      utilization_rate_percentage: 0,
      research_works_count: 0,
      popular_research: []
    };
  }

  const total_budget_inr = projects.reduce((sum, p) => sum + (p.total_budget_inr || 0), 0);

  const expenses = await ResearchExpense.findAll();
  const total_spent = expenses.reduce((sum, e) => sum + (e.amount_inr || 0), 0);

  const remaining_balance_inr = total_budget_inr - total_spent;
  
  const utilization_rate_percentage = total_budget_inr > 0 
    ? Number(((total_spent / total_budget_inr) * 100).toFixed(2)) 
    : 0;

  const research_works_count = projects.length;

  const popular_research = projects.slice(0, 4).map(p => ({
    id: p.id,
    title: p.title,
    authors: p.authors || []
  }));

  return {
    total_budget_inr,
    remaining_balance_inr,
    utilization_rate_percentage,
    research_works_count,
    popular_research
  };
};

export const getGrantRequests = async () => {
  const grantsData = await GrantRequest.findAll();
  
  const approved = grantsData.filter(g => g.status === "Approved").length;
  const pending = grantsData.filter(g => g.status === "Pending").length;
  const rejected = grantsData.filter(g => g.status === "Rejected").length;
  const total = grantsData.length;
  
  const rejection_rate_percentage = total > 0 
    ? Math.round((rejected / total) * 100) 
    : 0;

  const pipeline = {
    approved,
    pending,
    rejection_rate_percentage
  };

  const projects = await ResearchProject.findAll();
  const projectMap = {};
  projects.forEach(p => {
    projectMap[p.id] = p.title;
  });

  const grants = grantsData.map(g => ({
    id: g.id,
    title: g.title,
    status: g.status,
    date: g.requested_at,
    amount_inr: g.amount_inr,
    research_work: projectMap[g.research_project_id] || null,
    supporting_documents: [],
    justification: g.justification
  }));

  return {
    pipeline,
    grants
  };
};

export const getResearchExpenses = async () => {
  const expenses = await ResearchExpense.findAll();
  
  if (expenses.length === 0) {
    return { monthly_expense_trends: [] };
  }

  const getMonthName = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split("-");
    if (parts.length < 2) return null;
    const monthIndex = parseInt(parts[1], 10) - 1;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[monthIndex];
  };

  const groups = {};
  for (const exp of expenses) {
    const monthName = getMonthName(exp.expense_date);
    if (!monthName) continue;
    if (!groups[monthName]) {
      groups[monthName] = {
        month: monthName,
        amount_inr: 0,
        earliestDate: exp.expense_date
      };
    }
    groups[monthName].amount_inr += exp.amount_inr || 0;
    if (exp.expense_date < groups[monthName].earliestDate) {
      groups[monthName].earliestDate = exp.expense_date;
    }
  }

  const monthly_expense_trends = Object.values(groups)
    .sort((a, b) => new Date(a.earliestDate) - new Date(b.earliestDate))
    .map(g => ({
      month: g.month,
      amount_inr: g.amount_inr
    }));

  return { monthly_expense_trends };
};

export const getAllocationBreakdown = async () => {
  const allocations = await ResearchAllocation.findAll();
  
  if (allocations.length === 0) {
    return {
      total_inr: 0,
      breakdown: []
    };
  }

  const total_inr = allocations.reduce((sum, item) => sum + (item.amount_inr || 0), 0);
  const breakdown = allocations.map(item => ({
    category: item.category,
    percentage: item.percentage,
    amount_inr: item.amount_inr
  }));

  return {
    total_inr,
    breakdown
  };
};

export const approveGrant = async (id, decision) => {
  const grant = await GrantRequest.findByPk(id);
  if (!grant) return null;
  
  if (decision === "approve") {
    grant.status = "Approved";
  } else if (decision === "reject") {
    grant.status = "Rejected";
  }
  
  await grant.save();
  return grant;
};
