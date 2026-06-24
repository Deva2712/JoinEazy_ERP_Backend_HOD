import Department from "./department-model.js";

export const getDepartment = async () => {
  const dept = await Department.findOne({
    order: [["createdAt", "ASC"]]
  });
  if (!dept) return null;
  return {
    ...dept.toJSON(),
    academic_year: "2025-2026"
  };
};

export const createDepartment = async (data) => {
  return await Department.create({
    name: data.name,
    code: data.code,
    hod_id: data.hod_id,
    description: data.description
  });
};

export const updateDepartment = async (id, data) => {
  const department = await Department.findByPk(id);
  if (!department) {
    return null;
  }
  return await department.update(data);
};

export const deleteDepartment = async (id) => {
  const department = await Department.findByPk(id);
  if (!department) {
    return null;
  }
  await department.destroy();
  return { message: "Department deleted" };
};
