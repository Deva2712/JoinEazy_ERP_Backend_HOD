import User from "../auth/auth-model.js";

export const getHODDashboardOverview = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "email", "role"],
  });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return {
    data: {
      user,
      stats: {
        pending_leaves: 0,
        faculty_count: 0,
        student_count: 0,
        upcoming_sessions: 0,
      },
    },
  };
};
