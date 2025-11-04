import React, { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import {
  User,
  ShoppingBag,
  TrendingUp,
  Activity,
  Clock,
  PlusCircle,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminApi.getUsers(1, 5);
        setUserCount(res.data.pagination.total);
        setRecentUsers(res.data.users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    const mockSales = [
      { day: "Mon", sales: 250, orders: 12 },
      { day: "Tue", sales: 400, orders: 18 },
      { day: "Wed", sales: 300, orders: 15 },
      { day: "Thu", sales: 500, orders: 22 },
      { day: "Fri", sales: 700, orders: 28 },
      { day: "Sat", sales: 650, orders: 24 },
      { day: "Sun", sales: 550, orders: 20 },
    ];

    setSalesData(mockSales);
    setOrdersData(mockSales);
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-blue-600 font-semibold text-lg animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );

  const stats = [
    {
      title: "Total Users",
      value: userCount,
      icon: <User className="w-6 h-6 sm:w-7 sm:h-7" />,
      color: "bg-gradient-to-tr from-blue-500 to-blue-400",
      growth: "12%",
    },
    {
      title: "Total Orders",
      value: "189",
      icon: <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />,
      color: "bg-gradient-to-tr from-green-500 to-green-400",
      growth: "8%",
    },
    {
      title: "Revenue (USD)",
      value: "$12,540",
      icon: <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />,
      color: "bg-gradient-to-tr from-purple-500 to-purple-400",
      growth: "15%",
    },
    {
      title: "Active Sessions",
      value: "34",
      icon: <Activity className="w-6 h-6 sm:w-7 sm:h-7" />,
      color: "bg-gradient-to-tr from-pink-500 to-pink-400",
      growth: "5%",
    },
    {
      title: "Pending Orders",
      value: "4",
      icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7" />,
      color: "bg-gradient-to-tr from-yellow-400 to-yellow-300",
      growth: "2%",
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Dashboard Overview
      </h1>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow"
        >
          <PlusCircle /> Add User
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow"
        >
          <PlusCircle /> Add Product
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow"
        >
          <FileText /> Generate Report
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex justify-between items-center p-4 sm:p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col">
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <h2 className="mt-1 text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </h2>
              <span className="text-green-500 text-xs mt-1">{stat.growth} ↑</span>
            </div>
            <div className={`p-3 rounded-full text-white shadow-lg ${stat.color}`}>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Weekly Sales
          </h2>
          <div className="h-64 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="5 5" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Orders Overview
          </h2>
          <div className="h-64 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="5 5" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="orders" fill="#10B981" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Users */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Recent Users
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-2 text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-4 py-2 text-gray-500 dark:text-gray-400">Email</th>
                <th className="px-4 py-2 text-gray-500 dark:text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
