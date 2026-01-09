import React, { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { useNavigate } from "react-router-dom";
import {
  User,
  TrendingUp,
  Activity,
  Clock,
  Package
  
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
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminApi.getUsers(1, 5);
        const payload = res?.data || {};
        // support multiple backend shapes
        const usersFromPayload = payload.users || payload.data?.users || payload.data || payload.results || [];
        const totalFromPayload =
          payload.pagination?.total || payload.data?.pagination?.total || payload.pagination?.totalPages || payload.data?.pagination?.totalPages || usersFromPayload.length || 0;

        setUserCount(totalFromPayload);
        setRecentUsers(Array.isArray(usersFromPayload) ? usersFromPayload : []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchProducts = async () => {
      try {
        const res = await adminApi.getProducts(1, 5);
        setProductCount(res.data?.totalProducts || 0);
        // handle products if needed
      } catch (error) {
        console.error("Failed to fetch products", error);
      } 
    };

    const fetchOrders = async () => {
      try {
        const res = await adminApi.getOrders(1, 5);
        setOrderCount(res.data?.totalOrders || 0);
        // handle orders if needed
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Failed to fetch orders: Server responded with error", error.response.status, error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Failed to fetch orders: No response received from server", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Failed to fetch orders: Error in request setup", error.message);
        }
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
    fetchProducts();
    fetchOrders();
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
      
      navigate: () => navigate("/users-list"),
    },
    {
      title: "Total Products",
      value: productCount,
      icon: <Package  className="w-6 h-6 sm:w-7 sm:h-7" />,
      color: "bg-gradient-to-tr from-green-500 to-green-400",
      
      navigate: () => navigate("/products-list"),
    },
    {
      title: "Revenue (USD)",
      value: "$12,540",
      icon: <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />,
      color: "bg-gradient-to-tr from-purple-500 to-purple-400",

    },
    {
      title: "Active Sessions",
      value: "34",
      icon: <Activity className="w-6 h-6 sm:w-7 sm:h-7" />,
      color: "bg-gradient-to-tr from-pink-500 to-pink-400",
     
    },
    {
      title: "Pending Orders",
      value: orderCount,
      icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7" />,
      color: "bg-gradient-to-tr from-yellow-400 to-yellow-300",
      
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Dashboard Overview
      </h1>

      

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={stat.navigate}
            className="flex justify-between cursor-pointer items-center p-4 sm:p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
          > 
            <div className="flex flex-col ">
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <h2 className="mt-1 text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </h2>
              
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
                  <td className="px-4 py-2">{user.username}</td>
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
