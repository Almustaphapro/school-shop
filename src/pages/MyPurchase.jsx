import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPlus,

  FiCalendar,
  FiPackage,
  FiTrendingUp,
  FiSearch,
  FiDownload,
  FiTrash2,
} from "react-icons/fi";

const MyPurchase = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "supplies",
    amount: "",
    paymentMethod: "cash",
    vendor: "",
    notes: "",
    receipt: null,
  });

  const categories = [
    { value: "supplies", label: "School Supplies", style: "bg-blue-100 text-blue-800" },
    { value: "office", label: "Office Supplies", style: "bg-green-100 text-green-800" },
    { value: "utilities", label: "Utilities", style: "bg-yellow-100 text-yellow-800" },
    { value: "maintenance", label: "Maintenance", style: "bg-orange-100 text-orange-800" },
    { value: "furniture", label: "Furniture", style: "bg-purple-100 text-purple-800" },
    { value: "misc", label: "Misc", style: "bg-gray-100 text-gray-800" },
  ];

  useEffect(() => {
    const stored = localStorage.getItem("schoolExpenses");

    if (stored) {
      try {
        setExpenses(JSON.parse(stored));
      } catch {
        setExpenses([]);
      }
    }
  }, []);

  useEffect(() => {
    let filtered = [...expenses];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      filtered = filtered.filter(
        (e) =>
          e.description.toLowerCase().includes(term) ||
          e.vendor?.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredExpenses(filtered);
  }, [expenses, searchTerm]);

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpense = () => {
    if (!newExpense.description.trim() || !newExpense.amount) {
      alert("Please fill required fields");
      return;
    }

    const expense = {
      id: `EXP-${Date.now()}`,
      date: newExpense.date,
      description: newExpense.description,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      paymentMethod: newExpense.paymentMethod,
      vendor: newExpense.vendor,
      notes: newExpense.notes,
      receipt: newExpense.receipt,
    };

    const updated = [expense, ...expenses];

    setExpenses(updated);

    localStorage.setItem("schoolExpenses", JSON.stringify(updated));

    setShowAddModal(false);

    setNewExpense({
      date: new Date().toISOString().split("T")[0],
      description: "",
      category: "supplies",
      amount: "",
      paymentMethod: "cash",
      vendor: "",
      notes: "",
      receipt: null,
    });
  };

  const handleDeleteExpense = (id) => {
    if (!window.confirm("Delete this expense?")) return;

    const updated = expenses.filter((e) => e.id !== id);

    setExpenses(updated);

    localStorage.setItem("schoolExpenses", JSON.stringify(updated));
  };

  const exportToCSV = () => {
    const headers = ["Date", "Description", "Category", "Amount", "Vendor"];

    const rows = filteredExpenses.map((e) => [
      e.date,
      e.description,
      e.category,
      e.amount,
      e.vendor,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "expenses.csv";

    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <FiArrowLeft size={24} />
          </button>

          <h1 className="text-2xl font-bold">School Expenses</h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Record Expense
        </button>

      </div>

      {/* STATS */}

      <div className="bg-white shadow rounded-xl p-6 mb-6 flex justify-between">

        <div>
          <p className="text-gray-500 text-sm">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">
            ₦{totalExpenses.toLocaleString()}
          </p>
        </div>

        

      </div>

      {/* SEARCH */}

      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-3">

        <div className="relative flex-1">

          <FiSearch className="absolute left-3 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full border rounded-lg p-2"
          />

        </div>

        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 border px-4 rounded-lg"
        >
          <FiDownload /> Export
        </button>

      </div>

      {/* TABLE */}

      <div className="bg-white shadow rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Vendor</th>
              <th className="p-4"></th>
            </tr>

          </thead>

          <tbody>

            {filteredExpenses.map((expense) => {
              const category =
                categories.find((c) => c.value === expense.category) ||
                categories[categories.length - 1];

              return (
                <tr key={expense.id} className="border-t">

                  <td className="p-4">{expense.date}</td>

                  <td className="p-4">{expense.description}</td>

                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${category.style}`}>
                      {category.label}
                    </span>
                  </td>

                  <td className="p-4 text-red-600 font-medium">
                    ₦{expense.amount.toLocaleString()}
                  </td>

                  <td className="p-4">{expense.vendor || "-"}</td>

                  <td className="p-4">

                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-600"
                    >
                      <FiTrash2 />
                    </button>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {showAddModal && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-full max-w-lg">

            <h2 className="text-xl font-bold mb-4">Record Expense</h2>

            <div className="space-y-3">

              <input
                type="date"
                value={newExpense.date}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, date: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Vendor"
                value={newExpense.vendor}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, vendor: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <div className="flex gap-3 pt-3">

                <button
                  onClick={handleAddExpense}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex-1"
                >
                  Record Expense
                </button>

                <button
                  onClick={() => setShowAddModal(false)}
                  className="border px-4 py-2 rounded-lg flex-1"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default MyPurchase;