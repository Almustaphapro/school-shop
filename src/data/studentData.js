// Static student data that doesn't change on refresh
export const studentData = {
  // JSS1 Classes
  JSS1A: [
    { id: 1, studentId: "STU0001", name: "Oluwaseun Okonkwo", house: "Red", status: true, balance: 2500 },
    { id: 2, studentId: "STU0002", name: "Chiamaka Okafor", house: "Blue", status: true, balance: 1800 },
    { id: 3, studentId: "STU0003", name: "Bashir Bello", house: "Green", status: true, balance: 3200 },
    { id: 4, studentId: "STU0004", name: "Aisha Abubakar", house: "Yellow", status: false, balance: 0 },
    { id: 5, studentId: "STU0005", name: "Yakubu Kabir", house: "Red", status: true, balance: 1500 },
    { id: 6, studentId: "STU0006", name: "Ngozi Eze", house: "Blue", status: true, balance: 4200 },
    { id: 7, studentId: "STU0007", name: "Tunde Adeyemi", house: "Green", status: true, balance: 800 },
    { id: 8, studentId: "STU0008", name: "Zainab Yusuf", house: "Yellow", status: true, balance: 5600 },
    { id: 9, studentId: "STU0009", name: "Ifeanyi Nnamdi", house: "Red", status: true, balance: 1200 },
    { id: 10, studentId: "STU0010", name: "Folake Adeleke", house: "Blue", status: true, balance: 3400 },
    { id: 11, studentId: "STU0011", name: "Chidi Okonkwo", house: "Green", status: true, balance: 2200 },
    { id: 12, studentId: "STU0012", name: "Aminat Bello", house: "Yellow", status: true, balance: 4500 },
    { id: 13, studentId: "STU0013", name: "Obinna Eze", house: "Red", status: true, balance: 3800 },
    { id: 14, studentId: "STU0014", name: "Grace Abubakar", house: "Blue", status: true, balance: 600 },
    { id: 15, studentId: "STU0015", name: "Michael Okafor", house: "Green", status: true, balance: 2900 },
    { id: 16, studentId: "STU0016", name: "Blessing Ibrahim", house: "Yellow", status: true, balance: 5100 },
    { id: 17, studentId: "STU0017", name: "Solomon Nwachukwu", house: "Red", status: true, balance: 1300 },
    { id: 18, studentId: "STU0018", name: "Esther Mohammed", house: "Blue", status: true, balance: 4700 },
    { id: 19, studentId: "STU0019", name: "Daniel Ogunleye", house: "Green", status: true, balance: 2000 },
    { id: 20, studentId: "STU0020", name: "Ruth Okoro", house: "Yellow", status: true, balance: 3300 },
  ],
  
  JSS1B: [
    { id: 21, studentId: "STU0021", name: "Samuel Adeyemi", house: "Red", status: true, balance: 1800 },
    { id: 22, studentId: "STU0022", name: "Deborah Okafor", house: "Blue", status: true, balance: 4200 },
    { id: 23, studentId: "STU0023", name: "Joseph Bello", house: "Green", status: true, balance: 3500 },
    { id: 24, studentId: "STU0024", name: "Mary Abubakar", house: "Yellow", status: true, balance: 2900 },
    { id: 25, studentId: "STU0025", name: "David Okonkwo", house: "Red", status: true, balance: 6100 },
    { id: 26, studentId: "STU0026", name: "Sarah Eze", house: "Blue", status: true, balance: 800 },
    { id: 27, studentId: "STU0027", name: "John Yusuf", house: "Green", status: false, balance: 0 },
    { id: 28, studentId: "STU0028", name: "Patience Nnamdi", house: "Yellow", status: true, balance: 2300 },
    { id: 29, studentId: "STU0029", name: "Peter Adeleke", house: "Red", status: true, balance: 4700 },
    { id: 30, studentId: "STU0030", name: "Grace Olayinka", house: "Blue", status: true, balance: 5200 },
  ],
  
  JSS1C: [
    { id: 31, studentId: "STU0031", name: "Emeka Nwachukwu", house: "Red", status: true, balance: 3400 },
    { id: 32, studentId: "STU0032", name: "Aisha Mohammed", house: "Blue", status: true, balance: 2100 },
    { id: 33, studentId: "STU0033", name: "Chidi Ogunleye", house: "Green", status: true, balance: 4300 },
    { id: 34, studentId: "STU0034", name: "Ngozi Okoro", house: "Yellow", status: true, balance: 3800 },
    { id: 35, studentId: "STU0035", name: "Anas Ibrahim", house: "Red", status: true, balance: 1500 },
    { id: 36, studentId: "STU0036", name: "Zainab Sani", house: "Blue", status: true, balance: 4900 },
    { id: 37, studentId: "STU0037", name: "Ifeanyi Okafor", house: "Green", status: true, balance: 2700 },
    { id: 38, studentId: "STU0038", name: "Folake Eze", house: "Yellow", status: true, balance: 3300 },
    { id: 39, studentId: "STU0039", name: "Oluwaseun Bello", house: "Red", status: true, balance: 5800 },
    { id: 40, studentId: "STU0040", name: "Chiamaka Abubakar", house: "Blue", status: true, balance: 1200 },
  ],
  
  // You can continue with other classes (JSS2, JSS3, SS1, etc.)
  JSS2A: [
    { id: 41, studentId: "STU0041", name: "Michael Adeleke", house: "Red", status: true, balance: 2900 },
    { id: 42, studentId: "STU0042", name: "Blessing Yusuf", house: "Blue", status: true, balance: 4600 },
    // Add more students...
  ],
  
  JSS2B: [
    // Add students...
  ],
  
  // Continue for all classes...
};

// Helper function to get students by class
export const getStudentsByClass = (className) => {
  return studentData[className] || [];
};

// Helper function to search students across all classes
export const searchStudents = (query) => {
  if (!query) return [];
  
  const allStudents = Object.values(studentData).flat();
  return allStudents.filter(student => 
    student.studentId.toLowerCase().includes(query.toLowerCase()) ||
    student.name.toLowerCase().includes(query.toLowerCase())
  );
};