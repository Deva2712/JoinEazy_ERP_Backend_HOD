import { Op } from "sequelize";
import { SessionReflection, SessionDocument } from "./session-planning-model.js";
import { Schedule } from "../schedule/schedule-model.js";
import Course from "../department-courses/department-courses-model.js";
import UserCourse from "../department-courses/user-course-model.js";
import { Cohort } from "../cohort/cohort-model.js";

const mapStatus = (status) => {
  if (status === "active" || status === "Live") return "Ongoing";
  if (status === "inactive" || status === "Archived") return "Completed";
  return status || "Ongoing";
};

export const getSchedules = async (professorId) => {
  const userCourses = await UserCourse.findAll({
    where: { user_id: professorId, role_in_course: "faculty" }
  });
  
  const scheduleEntries = await Schedule.findAll({
    where: { professor_id: professorId, type: { [Op.ne]: "office_hours" } }
  });

  if (userCourses.length > 0) {
    const courseIds = userCourses.map(uc => uc.course_id);
    const courses = await Course.findAll({
      where: { id: courseIds }
    });

    const cohortIds = scheduleEntries.map(s => s.cohort_id).filter(Boolean);
    const cohorts = await Cohort.findAll({
      where: { id: cohortIds }
    });

    const result = [];
    for (const course of courses) {
      // Find matching schedules by course code
      const courseSchedules = scheduleEntries.filter(s => {
        if (s.cohort_id === course.code) return true;
        const cohort = cohorts.find(c => c.id === s.cohort_id);
        return cohort && cohort.course_codes === course.code;
      });

      result.push({
        id: course.id,
        courseName: course.name,
        courseCode: course.code,
        courseCodes: [course.code],
        courseType: "Theory",
        status: mapStatus(course.status),
        schedule: courseSchedules.map(entry => {
          const cohort = cohorts.find(c => c.id === entry.cohort_id);
          return {
            day: entry.day,
            startTime: entry.start_time,
            endTime: entry.end_time,
            courseCode: cohort ? cohort.course_codes : course.code,
            roomNumber: entry.venue || "TBD",
            buildingName: "",
            batchSection: "A",
            branch: "",
            semester: Number(course.semester) || 1,
          };
        })
      });
    }
    return result;
  } else {
    // If no UserCourse found, group Schedule entries by cohort_id
    const grouped = {};
    for (const entry of scheduleEntries) {
      const key = entry.cohort_id || "unknown";
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(entry);
    }

    const cohortIds = Object.keys(grouped);
    const [courses, cohorts] = await Promise.all([
      Course.findAll({ where: { code: cohortIds } }),
      Cohort.findAll({ where: { id: cohortIds } })
    ]);

    const result = [];
    for (const [cohortId, entries] of Object.entries(grouped)) {
      const course = courses.find(c => c.code === cohortId);
      const cohort = cohorts.find(c => c.id === cohortId);

      const displayCode = cohort ? cohort.course_codes : (course ? course.code : cohortId);
      const displayName = cohort ? cohort.cohort_name : (course ? course.name : (entries[0]?.title || "Untitled Course"));
      const displayStatus = cohort ? mapStatus(cohort.status) : (course ? mapStatus(course.status) : "Ongoing");

      result.push({
        id: cohortId,
        courseName: displayName,
        courseCode: displayCode,
        courseCodes: displayCode ? [displayCode] : [cohortId],
        courseType: "Theory",
        status: displayStatus,
        schedule: entries.map(entry => ({
          day: entry.day,
          startTime: entry.start_time,
          endTime: entry.end_time,
          courseCode: displayCode,
          roomNumber: entry.venue || "TBD",
          buildingName: "",
          batchSection: "A",
          branch: "",
          semester: 1,
        }))
      });
    }
    return result;
  }
};

export const getTodaySessions = async (professorId) => {
  const todayDayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const entries = await Schedule.findAll({
    where: { professor_id: professorId, day: todayDayName }
  });

  const userCourses = await UserCourse.findAll({
    where: { user_id: professorId, role_in_course: "faculty" }
  });
  const courseIds = userCourses.map(uc => uc.course_id);
  const courses = await Course.findAll({
    where: { id: courseIds }
  });

  const cohortIds = entries.map(e => e.cohort_id).filter(Boolean);
  const cohorts = await Cohort.findAll({
    where: { id: cohortIds }
  });

  const sessions = entries.map(entry => {
    const course = courses.find(c => c.code === entry.cohort_id);
    const cohort = cohorts.find(c => c.id === entry.cohort_id);

    const displayCode = cohort ? cohort.course_codes : (course ? course.code : (entry.cohort_id || ""));
    const displayName = cohort ? cohort.cohort_name : (course ? course.name : (entry.title || "Untitled Course"));
    const displayId = cohort ? cohort.id : (course ? course.id : (entry.cohort_id || entry.id));

    return {
      day: entry.day,
      startTime: entry.start_time,
      endTime: entry.end_time,
      courseCode: displayCode,
      roomNumber: entry.venue || "TBD",
      buildingName: "",
      batchSection: "",
      branch: "",
      semester: course ? (Number(course.semester) || 1) : 1,
      courseName: displayName,
      courseType: "Theory",
      id: displayId
    };
  });

  return { sessions };
};

export const getReflections = async (professorId) => {
  const reflections = await SessionReflection.findAll({
    where: { professor_id: professorId },
    order: [["createdAt", "DESC"]]
  });

  const mapped = reflections.map(r => ({
    id: r.id,
    classId: r.class_id,
    courseName: r.course_name,
    courseCode: r.course_code,
    batchSection: r.batch_section,
    semester: r.semester,
    whatWasTaught: r.what_was_taught,
    needsImprovement: r.needs_improvement,
    topicsCarriedForward: r.topics_carried_forward,
    personalNotes: r.personal_notes,
    visibleToHOD: r.visible_to_hod,
    date: r.date,
    status: r.status
  }));

  return { reflections: mapped };
};

export const createReflection = async (professorId, body) => {
  let courseName = null;
  let courseCode = null;
  let semester = null;

  if (body.classId) {
    const course = await Course.findByPk(body.classId);
    if (course) {
      courseName = course.name;
      courseCode = course.code;
      semester = Number(course.semester) || 1;
    } else {
      // Fallback: search by code
      const courseByCode = await Course.findOne({ where: { code: body.classId } });
      if (courseByCode) {
        courseName = courseByCode.name;
        courseCode = courseByCode.code;
        semester = Number(courseByCode.semester) || 1;
      } else {
        // Search by Cohort
        const cohort = await Cohort.findByPk(body.classId);
        if (cohort) {
          courseName = cohort.cohort_name;
          courseCode = cohort.course_codes;
          semester = 1;
        }
      }
    }
  }

  const reflection = await SessionReflection.create({
    professor_id: professorId,
    class_id: body.classId,
    course_name: courseName || body.courseName || null,
    course_code: courseCode || body.courseCode || null,
    batch_section: body.batchSection || "",
    semester: semester || body.semester || 1,
    what_was_taught: body.whatWasTaught,
    needs_improvement: body.needsImprovement || null,
    topics_carried_forward: body.topicsCarriedForward || null,
    personal_notes: body.personalNotes || null,
    visible_to_hod: body.visibleToHOD || false,
    date: body.date ? body.date.split("T")[0] : new Date().toISOString().split("T")[0],
    status: "submitted",
  });

  return reflection.toJSON();
};

export const getDocuments = async (courseId) => {
  const docs = await SessionDocument.findAll({ where: { course_id: courseId } });
  const mapped = docs.map(d => ({
    id: d.id,
    type: d.type,
    title: d.title,
    fileName: d.file_name,
    fileLink: d.url,
    version: d.version,
    uploadDate: d.createdAt ? d.createdAt.toISOString().split("T")[0] : null,
    uploadedBy: d.uploaded_by,
    status: d.status,
    hodComments: d.hod_comments,
  }));
  return mapped;
};

export const bulkCreateDocuments = async (courseId, professorId, docs, fileNames = {}) => {
  let docsToCreate = [];

  if (Array.isArray(docs)) {
    // Check if element is a string (e.g. docs array of keys)
    if (docs.length > 0 && typeof docs[0] === 'string') {
      docsToCreate = docs.map(docType => ({
        course_id: courseId,
        professor_id: professorId,
        title: docType,
        url: null,
        type: docType,
        file_name: fileNames[docType] || `${docType}.pdf`,
        version: 1,
        uploaded_by: professorId,
        status: "Pending"
      }));
    } else {
      // Element is an object
      docsToCreate = docs.map(d => ({
        course_id: courseId,
        professor_id: professorId,
        title: d.title || d.type || "Document",
        url: d.url || d.fileLink || null,
        type: d.type || "document",
        file_name: d.fileName || d.title || "document.pdf",
        version: 1,
        uploaded_by: professorId,
        status: "Pending"
      }));
    }
  } else if (docs && typeof docs === 'object') {
    // If docs is the full body object { docs, fileNames }
    const docsArray = docs.docs || [];
    const fNames = docs.fileNames || {};
    docsToCreate = docsArray.map(docType => ({
      course_id: courseId,
      professor_id: professorId,
      title: docType,
      url: null,
      type: docType,
      file_name: fNames[docType] || `${docType}.pdf`,
      version: 1,
      uploaded_by: professorId,
      status: "Pending"
    }));
  }

  if (docsToCreate.length > 0) {
    await SessionDocument.bulkCreate(docsToCreate);
  }

  return getDocuments(courseId);
};
