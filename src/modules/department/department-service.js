const mockDepartments = [
  {
    id: "dept-cs-001",
    name: "Computer Science & Engineering",
    code: "CSE",
    hod_name: "Dr. Robert Aris",
    established_year: 1998,
    description: "Focuses on computing theory, software engineering, and AI research",
    academic_year: "2025-2026",
    isActive: true
  },
  {
    id: "dept-ec-001",
    name: "Electronics & Communication Engineering",
    code: "ECE",
    hod_name: "Dr. Priya Sharma",
    established_year: 2001,
    description: "Covers electronics, signal processing, and communication systems",
    academic_year: "2025-2026",
    isActive: true
  }
];

export const getDepartment = async () => {
  return mockDepartments.find((dept) => dept.isActive === true) || null;
};

export const createDepartment = async (data) => {
  const newDept = {
    id: "dept-" + Date.now(),
    name: data.name,
    code: data.code,
    hod_name: data.hod_name,
    established_year: data.established_year,
    description: data.description || "",
    academic_year: data.academic_year,
    isActive: data.isActive !== undefined ? data.isActive : true
  };
  mockDepartments.push(newDept);
  return newDept;
};

export const updateDepartment = async (id, data) => {
  const found = mockDepartments.find((dept) => dept.id === id);
  if (!found) {
    return null;
  }
  Object.assign(found, data);
  return found;
};

export const deleteDepartment = async (id) => {
  const found = mockDepartments.find((dept) => dept.id === id);
  if (!found) {
    return null;
  }
  found.isActive = false;
  return { message: "Department deleted" };
};
