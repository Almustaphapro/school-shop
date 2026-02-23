import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  // Dummy data (replace with API later)
  const stats = {
    totalStudents: 420,
    activeStudents: 380,
    totalBalance: 1250000,
    totalSales: 860000,
  };

  const monthlySales = [
    { month: "Jan", sales: 120000 },
    { month: "Feb", sales: 150000 },
    { month: "Mar", sales: 180000 },
    { month: "Apr", sales: 200000 },
    { month: "May", sales: 210000 },
  ];

  const studentsPerClass = [
    { class: "JSS1A", students: 30 },
    { class: "JSS1B", students: 28 },
    { class: "SS1A", students: 32 },
    { class: "SS2A", students: 27 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={stats.totalStudents} />
        <StatCard title="Active Students" value={stats.activeStudents} />
        <StatCard
          title="Total Balance"
          value={`₦${stats.totalBalance.toLocaleString()}`}
        />
        <StatCard
          title="Total Sales"
          value={`₦${stats.totalSales.toLocaleString()}`}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Students Per Class */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Students Per Class</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentsPerClass}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default AdminDashboard;