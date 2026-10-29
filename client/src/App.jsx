
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API_URL = "https://nodejs-expense-tracker-4vyc.onrender.com";

const COLORS = [
  "#f97316",
  "#3b82f6",
  "#a855f7",
  "#22c55e",
  "#eab308",
  "#ec4899",
];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isSignup, setIsSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch expenses after login
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`${API_URL}/expenses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch expenses");
        }

        setExpenses(data);
      } catch (error) {
        setError(error.message);
      }
    };

    if (isLoggedIn && token) {
      fetchExpenses();
    }
  }, [isLoggedIn, token]);

  // Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setIsSignup(false);
      setPassword("");
      setError("Account created successfully! Please log in.");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setToken(data.token);
      setIsLoggedIn(true);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          amount: Number(amount),
          category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add expense");
      }

      // Fetch latest expenses from backend
      const expensesResponse = await fetch(`${API_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const expensesData = await expensesResponse.json();

      if (!expensesResponse.ok) {
        throw new Error("Failed to refresh expenses");
      }

      setExpenses(expensesData);
      setTitle("");
      setAmount("");
      setCategory("Food");
      setShowForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id) => {
    setError("");

    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete expense");
      }

      setExpenses((prev) =>
        prev.filter((expense) => expense._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken("");
    setExpenses([]);
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  // Dashboard calculations
  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const foodExpenses = expenses
    .filter((expense) => expense.category === "Food")
    .reduce((total, expense) => total + Number(expense.amount), 0);

  const expenseCount = expenses.length;

  // Prepare category-wise chart data
  const categoryData = expenses.reduce((result, expense) => {
    const existingCategory = result.find(
      (item) => item.name === expense.category
    );

    if (existingCategory) {
      existingCategory.value += Number(expense.amount);
    } else {
      result.push({
        name: expense.category,
        value: Number(expense.amount),
      });
    }

    return result;
  }, []);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Login and signup screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#121212] border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 text-2xl mb-4">
              ₹
            </div>

            <h1 className="text-3xl font-bold text-white">
              Expense<span className="text-orange-500">Track</span>
            </h1>

            <p className="text-gray-500 mt-2">
              {isSignup
                ? "Create your account to get started"
                : "Welcome back! Login to continue"}
            </p>
          </div>

          <form
            onSubmit={isSignup ? handleSignup : handleLogin}
            className="space-y-4"
          >
            {isSignup && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#1b1b1b] border border-gray-800 text-white rounded-xl p-3 outline-none focus:border-orange-500"
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1b1b1b] border border-gray-800 text-white rounded-xl p-3 outline-none focus:border-orange-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1b1b1b] border border-gray-800 text-white rounded-xl p-3 outline-none focus:border-orange-500"
            />

            {error && (
              <p className="text-sm text-orange-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isSignup
                ? "Create Account"
                : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
              }}
              className="text-orange-500 font-semibold hover:underline"
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-[#101010] px-5 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold">
            Expense<span className="text-orange-500">Track</span>
          </h1>

          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-orange-500 transition"
          >
            Logout ↗
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
          <div>
            <p className="text-orange-500 text-sm font-semibold mb-2">
              YOUR FINANCES
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold">
              Dashboard
            </h2>

            <p className="text-gray-500 mt-2">
              Here's an overview of your spending.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-5 py-3 rounded-xl transition"
          >
            {showForm ? "Close Form" : "+ Add Expense"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-5">
              Add New Expense
            </h3>

            <form
              onSubmit={handleAddExpense}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <input
                type="text"
                placeholder="Expense Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-[#1b1b1b] border border-gray-800 text-white rounded-xl p-3 outline-none focus:border-orange-500"
              />

              <input
                type="number"
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
                className="bg-[#1b1b1b] border border-gray-800 text-white rounded-xl p-3 outline-none focus:border-orange-500"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#1b1b1b] border border-gray-800 text-white rounded-xl p-3 outline-none focus:border-orange-500"
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>

              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl p-3 transition"
              >
                Save Expense
              </button>
            </form>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Total Expenses</p>
              <span className="text-orange-500 text-xl">₹</span>
            </div>

            <h3 className="text-3xl font-bold mt-4">
              ₹{totalExpenses.toLocaleString("en-IN")}
            </h3>

            <p className="text-gray-600 text-sm mt-2">
              All recorded expenses
            </p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Food Expenses</p>
              <span className="text-orange-500 text-xl">🍽</span>
            </div>

            <h3 className="text-3xl font-bold mt-4">
              ₹{foodExpenses.toLocaleString("en-IN")}
            </h3>

            <p className="text-gray-600 text-sm mt-2">
              Spending on food
            </p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Transactions</p>
              <span className="text-orange-500 text-xl">↗</span>
            </div>

            <h3 className="text-3xl font-bold mt-4">
              {expenseCount}
            </h3>

            <p className="text-gray-600 text-sm mt-2">
              Total recorded transactions
            </p>
          </div>
        </div>

        {/* Category Chart */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 mb-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold">
              Expense Breakdown
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Spending by category
            </p>
          </div>

          {categoryData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No expenses to display in the chart yet.
              </p>

              <p className="text-gray-600 text-sm mt-2">
                Add expenses to see your category breakdown.
              </p>
            </div>
          ) : (
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={55}
                    paddingAngle={3}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) => [
                      `₹${Number(value).toLocaleString("en-IN")}`,
                      "Amount",
                    ]}
                    contentStyle={{
                      backgroundColor: "#1b1b1b",
                      border: "1px solid #333",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold">
                Recent Transactions
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Your latest expenses
              </p>
            </div>

            <span className="text-orange-500 text-sm font-semibold">
              {expenseCount} records
            </span>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No expenses yet.
              </p>

              <p className="text-gray-600 text-sm mt-2">
                Click Add Expense to record your first transaction.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-lg">
                      {expense.category === "Food"
                        ? "🍽"
                        : expense.category === "Transport"
                        ? "🚕"
                        : expense.category === "Shopping"
                        ? "🛍"
                        : expense.category === "Education"
                        ? "📚"
                        : expense.category === "Health"
                        ? "💊"
                        : "💳"}
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">
                        {expense.title}
                      </h4>

                      <p className="text-gray-500 text-sm mt-1">
                        {expense.category} ·{" "}
                        {formatDate(expense.createdAt || expense.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <span className="font-bold text-white">
                      − ₹{Number(expense.amount).toLocaleString("en-IN")}
                    </span>

                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="text-gray-500 hover:text-red-500 text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-gray-700 text-sm mt-8">
          ExpenseTrack · Manage your money smarter
        </p>
      </main>
    </div>
  );
}

export default App;
