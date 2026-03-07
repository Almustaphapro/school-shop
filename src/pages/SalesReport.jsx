import React, { useEffect, useState } from "react";
import { FiSearch, FiDownload, FiCalendar } from "react-icons/fi";

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const storedSales = localStorage.getItem("schoolSales");

    if (storedSales) {
      const data = JSON.parse(storedSales);
      setSales(data);
      setFilteredSales(data);
    }
  }, []);

  useEffect(() => {
    let filtered = [...sales];

    if (startDate || endDate) {
      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.date);

        const start = startDate ? new Date(startDate) : new Date("2000-01-01");
        const end = endDate ? new Date(endDate) : new Date();

        end.setHours(23, 59, 59, 999);

        return saleDate >= start && saleDate <= end;
      });
    }

    setFilteredSales(filtered);
  }, [sales, startDate, endDate]);

  const totalSales = filteredSales.reduce((sum, s) => sum + s.total, 0);

  const exportCSV = () => {
    const headers = ["Date", "Student", "Item", "Quantity", "Price", "Total"];

    const rows = filteredSales.map((s) => [
      s.date,
      s.student,
      s.item,
      s.quantity,
      s.price,
      s.total,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-report.csv";
    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}

      <h1 className="text-2xl font-bold mb-6">Sales Report</h1>

      {/* FILTERS */}

      <div className="bg-white shadow p-4 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">

        <div>
          <label className="text-sm">Start Date</label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm">End Date</label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg"
        >
          <FiDownload /> Export CSV
        </button>

      </div>

      {/* STATS */}

      <div className="bg-white shadow p-6 rounded-xl mb-6 flex justify-between">

        <div>
          <p className="text-gray-500">Transactions</p>
          <p className="text-2xl font-bold">{filteredSales.length}</p>
        </div>

        <div>
          <p className="text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold text-green-600">
            ₦{totalSales.toLocaleString()}
          </p>
        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white shadow rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-left">Item</th>
              <th className="p-4 text-left">Qty</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Total</th>
            </tr>

          </thead>

          <tbody>

            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (

                <tr key={sale.id} className="border-t">

                  <td className="p-4">{sale.date}</td>
                  <td className="p-4">{sale.student}</td>
                  <td className="p-4">{sale.item}</td>
                  <td className="p-4">{sale.quantity}</td>
                  <td className="p-4">₦{sale.price}</td>

                  <td className="p-4 text-green-600 font-semibold">
                    ₦{sale.total.toLocaleString()}
                  </td>

                </tr>

              ))
            ) : (

              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No sales found for selected date
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default SalesReport;