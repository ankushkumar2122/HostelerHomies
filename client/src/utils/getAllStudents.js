const getAllStudents = async () => {
  const mainUri = import.meta.env.VITE_MAIN_URI;

  const storedAdmin = localStorage.getItem("admin");
  if (!storedAdmin) {
    console.warn("No admin found in localStorage");
    return { success: false, msg: "Admin not logged in" };
  }

  let admin = null;
  try {
    admin = JSON.parse(storedAdmin);
  } catch (error) {
    console.error("Invalid admin JSON in localStorage:", error);
    return { success: false, msg: "Corrupt admin data" };
  }

  let hostelId = null;

  if (admin?.hostel) {
    hostelId =
      typeof admin.hostel === "object" ? admin.hostel._id : admin.hostel;
  }

  if (!hostelId) {
    console.warn("Hostel ID not found in admin object");
    return { success: false, msg: "Hostel ID missing" };
  }

  try {
    const response = await fetch(`${mainUri}/api/student/get-all-students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hostel: hostelId }),
    });

    const data = await response.json();

    if (!data.success || !Array.isArray(data.students)) {
      return { success: false, msg: "Invalid response format", ...data };
    }

    return data;
  } catch (error) {
    console.error("Error fetching students:", error);
    return { success: false, msg: "Fetch failed" };
  }
};

export default getAllStudents;
