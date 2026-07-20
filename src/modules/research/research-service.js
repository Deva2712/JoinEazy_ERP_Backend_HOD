// src/modules/research/research-service.js
import { Research, ResearchRole, ResearchApplication, ResearchUserProfile } from "./research-model.js";
import GrantRequest from "../department-research/grant-request-model.js";
import User from "../auth/auth-model.js";

// ─── Helper: format research for frontend ────────────────────────────────────
const formatResearch = (r, userId = null, userMap = new Map(), profileMap = new Map()) => {
  const json = r.toJSON ? r.toJSON() : r;
  const myApp = userId
    ? (json.applications || []).find((a) => a.applicant_id === userId)
    : null;

  const creatorName = userMap.get(json.created_by) || "Dr. Jane Smith";

  const roles = json.roles || [];
  const openRoles = roles.map(role => {
    const rJson = role.toJSON ? role.toJSON() : role;
    return {
      ...rJson,
      roleName: rJson.roleName || rJson.title || "",
    };
  });

  const applications = json.applications || [];
  const applicants = applications.map(app => {
    const appJson = app.toJSON ? app.toJSON() : app;
    const profile = profileMap.get(appJson.applicant_id) || {};
    return {
      ...appJson,
      userId: appJson.applicant_id,
      name: profile.name || userMap.get(appJson.applicant_id) || "Student Applicant",
      role: appJson.role_title || profile.role || "Applicant",
      department: profile.department || "Computer Science",
      appliedDate: appJson.created_at || appJson.createdAt || null,
    };
  });

  return {
    ...json,
    roles,
    openRoles,
    applications,
    applicants,
    hasApplied:   !!myApp,
    applicationStatus: myApp?.status || null,
    isStarred:    myApp?.is_starred || false,
    isOwner:      userId ? String(json.created_by) === String(userId) : false,
    professorName: creatorName,
    abstract:     json.description || json.abstract || "",
    fundingDetails: json.funding_details || json.fundingDetails || "",
    collaborationType: json.collaboration_type || json.collaborationType || "",
    collaborationInstructions: json.collaboration_instructions || json.collaborationInstructions || "",
    journalDetails: json.journal_details || json.journalDetails || "",
    doi:            json.doi || "",
    link:           json.link || "",
    keywords:       json.tags || json.keywords || [],
    coAuthors:      json.type === "publication" ? (json.collaborators || []) : [],
    collaborators:  json.type === "publication" ? [] : (json.collaborators || []),
    publishedDate:  json.start_date || json.createdAt || json.publishedDate || null,
  };
};

// ─── GET /research/dashboard-sync ────────────────────────────────────────────
export const getDashboard = async (userId) => {
  const [myProjects, allProjects, myApplications, researchersList, grants, admins] = await Promise.all([
    Research.findAll({
      where: { created_by: userId },
      include: [
        { model: ResearchRole, as: "roles" },
        { model: ResearchApplication, as: "applications" },
      ],
    }),
    Research.findAll({
      where: { status: "open" },
      include: [
        { model: ResearchRole, as: "roles" },
        { model: ResearchApplication, as: "applications" },
      ],
    }),
    ResearchApplication.findAll({ where: { applicant_id: userId } }),
    ResearchUserProfile.findAll({ order: [["name", "ASC"]] }),
    GrantRequest.findAll(),
    User.findAll({ where: { role: ["admin", "hod"] } }),
  ]);

  const users = await User.findAll({ attributes: ["id", "name"] });
  const userMap = new Map(users.map((u) => [u.id, u.name]));
  const profiles = await ResearchUserProfile.findAll();
  const profileMap = new Map(profiles.map((p) => [p.user_id, p]));

  const formattedMy = myProjects.map((p) => formatResearch(p, userId, userMap, profileMap));
  const formattedAll = allProjects.map((p) => formatResearch(p, userId, userMap, profileMap));

  const myProjList = formattedMy.filter(p => p.type === "research");
  const myPubList = formattedMy.filter(p => p.type === "publication");

  const availProjList = formattedAll.filter(p => p.type === "research");
  const availPubList = formattedAll.filter(p => p.type === "publication");

  const grantRequests = grants.map(g => ({
    id: g.id,
    title: g.title,
    status: g.status,
    amount: g.amount_inr || 0,
    date: g.requested_at,
    targetId: g.research_project_id,
    targetType: "Project",
    reason: g.justification,
    supportingDocs: [],
    adminComments: null,
    lastAdminAction: g.updatedAt,
  }));

  const formattedAdmins = admins.map(a => ({
    name: a.name,
    email: a.email,
    phone: a.mobileNumber || "9876543210",
  }));

  return {
    projects:              formattedMy,
    discover:              formattedAll,
    applications:          myApplications.map((a) => a.toJSON()),
    myApplications:        myApplications.map((a) => a.toJSON()),
    availableProjects:     availProjList,
    myProjects:            myProjList,
    availablePublications: availPubList,
    myPublications:        myPubList,
    grantRequests:         grantRequests,
    admins:                formattedAdmins,
    researchers:           researchersList.map(r => r.toJSON()),
  };
};

// ─── GET /research/:id ────────────────────────────────────────────────────────
export const getById = async (id, userId = null) => {
  const project = await Research.findByPk(id, {
    include: [
      { model: ResearchRole, as: "roles" },
      { model: ResearchApplication, as: "applications" },
    ],
  });
  if (!project) {
    const e = new Error("Research project not found");
    e.statusCode = 404;
    throw e;
  }
  const creator = await User.findByPk(project.created_by, { attributes: ["name"] });
  const userMap = new Map([[project.created_by, creator?.name]]);
  const profiles = await ResearchUserProfile.findAll();
  const profileMap = new Map(profiles.map((p) => [p.user_id, p]));
  return formatResearch(project, userId, userMap, profileMap);
};

// ─── POST /research/create ────────────────────────────────────────────────────
export const createResearch = async (userId, data) => {
  const project = await Research.create({
    created_by:                 userId,
    title:                      data.title,
    description:                data.abstract || data.description || null,
    type:                       data.type ? (data.type.toLowerCase() === "project" ? "research" : data.type.toLowerCase()) : "research",
    status:                     data.status ? (data.status.toLowerCase() === "closed" ? "completed" : data.status.toLowerCase()) : "open",
    start_date:                 data.startDate || data.start_date || null,
    end_date:                   data.endDate || data.end_date || null,
    timeline:                   data.timeline || [],
    tags:                       data.keywords || data.tags || [],
    collaborators:              data.type?.toLowerCase() === "publication" ? (data.coAuthors || []) : (data.collaborators || []),
    journal_details:            data.journalDetails || null,
    doi:                        data.doi || null,
    link:                       data.link || null,
    funding_details:            data.fundingDetails || null,
    collaboration_type:         data.collaborationType || null,
    collaboration_instructions: data.collaborationInstructions || null,
  });
  const creator = await User.findByPk(userId, { attributes: ["name"] });
  const userMap = new Map([[userId, creator?.name]]);
  return formatResearch(project, userId, userMap);
};

// ─── PUT /research/update/:id ─────────────────────────────────────────────────
export const updateResearch = async (id, data, userId) => {
  const project = await Research.findByPk(id);
  if (!project) { const e = new Error("Research not found"); e.statusCode = 404; throw e; }
  if (project.created_by !== userId) { const e = new Error("Not authorized"); e.statusCode = 403; throw e; }
  await project.update({
    title:                      data.title                      ?? project.title,
    description:                data.abstract                   ?? data.description ?? project.description,
    status:                     data.status ? (data.status.toLowerCase() === "closed" ? "completed" : data.status.toLowerCase()) : project.status,
    start_date:                 data.startDate                  ?? data.start_date ?? project.start_date,
    end_date:                   data.endDate                    ?? data.end_date ?? project.end_date,
    tags:                       data.keywords                   ?? data.tags ?? project.tags,
    collaborators:              data.type?.toLowerCase() === "publication" ? (data.coAuthors ?? project.collaborators) : (data.collaborators ?? project.collaborators),
    journal_details:            data.journalDetails             ?? project.journal_details,
    doi:                        data.doi                        ?? project.doi,
    link:                       data.link                       ?? project.link,
    funding_details:            data.fundingDetails             ?? project.funding_details,
    collaboration_type:         data.collaborationType          ?? project.collaboration_type,
    collaboration_instructions: data.collaborationInstructions  ?? project.collaboration_instructions,
  });
  const creator = await User.findByPk(userId, { attributes: ["name"] });
  const userMap = new Map([[userId, creator?.name]]);
  return formatResearch(project, userId, userMap);
};

// ─── POST /research/:id/roles/create ─────────────────────────────────────────
export const createRole = async (researchId, roleData) => {
  const project = await Research.findByPk(researchId);
  if (!project) { const e = new Error("Research not found"); e.statusCode = 404; throw e; }
  const role = await ResearchRole.create({
    research_id: researchId,
    title:       roleData.title,
    description: roleData.description || null,
    vacancies:   roleData.vacancies || 1,
    skills:      roleData.skills || [],
  });
  const updated = await Research.findByPk(researchId, { include: [{ model: ResearchRole, as: "roles" }] });
  return formatResearch(updated);
};

// ─── PUT /research/:id/roles/update/:roleIndex ────────────────────────────────
export const updateRole = async (researchId, roleIndex, roleData) => {
  const roles = await ResearchRole.findAll({ where: { research_id: researchId } });
  const role = roles[roleIndex];
  if (!role) { const e = new Error("Role not found"); e.statusCode = 404; throw e; }
  await role.update({ title: roleData.title ?? role.title, description: roleData.description ?? role.description, vacancies: roleData.vacancies ?? role.vacancies });
  const updated = await Research.findByPk(researchId, { include: [{ model: ResearchRole, as: "roles" }] });
  return formatResearch(updated);
};

// ─── DELETE /research/:id/roles/delete/:roleId ────────────────────────────────
export const deleteRole = async (researchId, roleId) => {
  const role = await ResearchRole.findOne({ where: { id: roleId, research_id: researchId } });
  if (!role) { const e = new Error("Role not found"); e.statusCode = 404; throw e; }
  await role.destroy();
  const updated = await Research.findByPk(researchId, { include: [{ model: ResearchRole, as: "roles" }] });
  return formatResearch(updated);
};

// ─── GET /research/timeline/:id ───────────────────────────────────────────────
export const getTimeline = async (researchId) => {
  const project = await Research.findByPk(researchId);
  if (!project) { const e = new Error("Research not found"); e.statusCode = 404; throw e; }
  return { timeline: project.timeline || [] };
};

// ─── POST /research/timeline/:id ─────────────────────────────────────────────
export const addTimelineEvent = async (researchId, eventData) => {
  const project = await Research.findByPk(researchId);
  if (!project) { const e = new Error("Research not found"); e.statusCode = 404; throw e; }
  const timeline = [...(project.timeline || []), { id: Date.now(), ...eventData, date: eventData.date || new Date().toISOString() }];
  await project.update({ timeline });
  return { timeline };
};

// ─── DELETE /research/timeline/:id/:eventId ───────────────────────────────────
export const deleteTimelineEvent = async (researchId, eventId) => {
  const project = await Research.findByPk(researchId);
  if (!project) { const e = new Error("Research not found"); e.statusCode = 404; throw e; }
  const timeline = (project.timeline || []).filter((e) => String(e.id) !== String(eventId));
  await project.update({ timeline });
  return { timeline };
};

// ─── PUT /research/timeline/:id/:eventId ──────────────────────────────────────
export const updateTimelineEvent = async (researchId, eventId, eventData) => {
  const project = await Research.findByPk(researchId);
  if (!project) { const e = new Error("Research not found"); e.statusCode = 404; throw e; }
  const timeline = (project.timeline || []).map((e) =>
    String(e.id) === String(eventId) ? { ...e, ...eventData } : e
  );
  await project.update({ timeline });
  return { timeline };
};

// ─── POST /research/apply/:id ─────────────────────────────────────────────────
export const applyToResearch = async (researchId, applicantId, data = {}) => {
  const [app, created] = await ResearchApplication.findOrCreate({
    where: { research_id: researchId, applicant_id: applicantId },
    defaults: { role_title: data.roleTitle || null, message: data.message || null },
  });
  return { application: app.toJSON(), already_applied: !created };
};

// ─── POST /research/star/:id ──────────────────────────────────────────────────
export const starResearch = async (researchId, userId) => {
  const [app] = await ResearchApplication.findOrCreate({
    where: { research_id: researchId, applicant_id: userId },
    defaults: { is_starred: true },
  });
  await app.update({ is_starred: !app.is_starred });
  return { is_starred: app.is_starred };
};

// ─── POST /research/applications/:id/:action ─────────────────────────────────
export const handleApplication = async (applicationId, action, details = {}) => {
  const app = await ResearchApplication.findByPk(applicationId);
  if (!app) { const e = new Error("Application not found"); e.statusCode = 404; throw e; }
  const statusMap = { accept: "accepted", reject: "rejected", withdraw: "pending" };
  await app.update({ status: statusMap[action] || action, message: details.message ?? app.message });
  return { application: app.toJSON() };
};

// ─── GET /research/users ──────────────────────────────────────────────────────
export const getUsers = async () => {
  const profiles = await ResearchUserProfile.findAll({ order: [["name", "ASC"]] });
  return profiles.map((p) => p.toJSON());
};

// ─── GET /research/users/:id ──────────────────────────────────────────────────
export const getUserById = async (userId) => {
  let profile = await ResearchUserProfile.findOne({ where: { user_id: userId } });
  if (!profile) {
    return { user_id: userId, name: "", bio: "", skills: [], avatar_url: null };
  }
  return profile.toJSON();
};

// ─── GET /research/users/profile/:id ─────────────────────────────────────────
export const getUserProfile = async (userId) => getUserById(userId);

// ─── PUT /research/users/profile/update/:id ──────────────────────────────────
export const updateUserProfile = async (userId, data) => {
  const [profile] = await ResearchUserProfile.findOrCreate({
    where: { user_id: userId },
    defaults: { name: data.name || "", email: data.email || "" },
  });
  await profile.update({
    name:      data.name      ?? profile.name,
    bio:       data.bio       ?? profile.bio,
    skills:    data.skills    ?? profile.skills,
    linkedin:  data.linkedin  ?? profile.linkedin,
    github:    data.github    ?? profile.github,
    portfolio: data.portfolio ?? profile.portfolio,
    avatar_url: data.avatarUrl ?? profile.avatar_url,
  });
  return profile.toJSON();
};

export const createGrantRequest = async (professorId, data) => {
  const grant = await GrantRequest.create({
    research_project_id: data.targetId || null,
    title: data.title,
    status: "Pending",
    amount_inr: data.amount,
    justification: data.reason,
    requested_at: data.date || new Date().toISOString().split("T")[0],
  });
  return grant.toJSON();
};

