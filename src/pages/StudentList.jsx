

import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const navigate = useNavigate();

  const levels = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
  const arms = ["A", "B", "C", "D"];

  const classes = levels.flatMap((level) =>
    arms.map((arm) => `${level}${arm}`)
  );

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Select Class</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {classes.map((cls) => (
          <button
            key={cls}
            onClick={() => navigate(`/admin/student-list/${cls}`)}
            className="bg-blue-600 text-white p-4 rounded hover:bg-blue-700 transition"
          >
            {cls}
          </button>
        ))}
      </div>
    </>
  );
};

export default StudentList;