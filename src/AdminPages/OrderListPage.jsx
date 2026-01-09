import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  ChevronDown,
  RefreshCcw
} from 'lucide-react';

const initialOrders = [
  {
    id: 'ORD-1001',
    customer: 'John Doe',
    email: 'john@example.com',
    date: 'Dec 10, 2025',
    total: '$120.00',
    status: 'Pending',
  },
  {
    id: 'ORD-1002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    date: 'Dec 11, 2025',
    total: '$250.00',
    status: 'On the Way',
  },
  {
    id: 'ORD-1003',
    customer: 'Alex Brown',
    email: 'alex@example.com',
    date: 'Dec 12, 2025',
    total: '$75.00',
    status: 'Cancelled',
  },
];

const statusConfig = {
  Pending: {
    className: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
  'On the Way': {
    className: 'bg-blue-100 text-blue-700',
    icon: Truck,
  },
  Completed: {
    className: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  Cancelled: {
    className: 'bg-red-100 text-red-700',
    icon: XCircle,
  },
};

const statusOptions = ['Pending', 'On the Way', 'Completed', 'Cancelled'];

const StatCard = ({ title, value, className }) => (
  <div
    className={`p-3 rounded-xl shadow-sm flex flex-col items-center transition ${className}`}
  >
    <p className="text-sm font-medium">{title}</p>
    <h2 className="text-2xl font-bold mt-1">{value}</h2>
  </div>
);

const statColorMap = {
  All: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  Pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  "On the Way": "bg-blue-100 text-blue-700 hover:bg-blue-200",
  Completed: "bg-green-100 text-green-700 hover:bg-green-200",
  Cancelled: "bg-red-100 text-red-700 hover:bg-red-200",
};


function OrderListPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState("All");
  const total = orders.length;
  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const completedCount = orders.filter(o => o.status === "Completed").length;
  const cancelledCount = orders.filter(o => o.status === "Cancelled").length;
  const onTheWayCount = orders.filter(o => o.status === "On the Way").length;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newOrder, setNewOrder] = useState({
    customer: '',
    email: '',
    date: '',
    total: '',
    orderStatus: 'pending',
  });


  const stats = [
    { label: "All", value: total },
    { label: "Pending", value: pendingCount },
    { label: "On the Way", value: onTheWayCount },
    { label: "Completed", value: completedCount },
    { label: "Cancelled", value: cancelledCount },
  ];

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const handleRefresh = () => {
    setOrders([...initialOrders]);
    setSearch('');
    setFilterStatus('All');
  };

  const handleAddOrder = (e) => {
    e.preventDefault();

    if (editingId) {
      // Edit existing order
      setOrders(prev =>
        prev.map(o => o.id === editingId ? { ...o, ...newOrder } : o)
      );
      toast.success("Order updated!");
    } else {
      // Create new order
      const newId = `ORD-${Math.floor(Math.random() * 9000) + 1000}`;
      setOrders(prev => [...prev, { id: newId, ...newOrder }]);
      toast.success("Order created!");
    }

    setShowAddModal(false);
    setNewOrder({
      customer: "",
      email: "",
      date: "",
      total: "",
      status: "Pending",
    });
    setEditingId(null);
  };

  // combined filtering
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto mt-6 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl bg-emerald-500 p-6 text-white shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="h-7 w-7" />
            <h1 className="text-2xl font-semibold">Orders</h1>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order..."
              className="w-full rounded-lg bg-white/90 pl-9 pr-3 py-2 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div className="flex justify-between items-center gap-4">
            <button
              onClick={() => {
                setEditingId(null);
                setNewOrder({
                  customer: "",
                  email: "",
                  date: "",
                  total: "",
                  status: "Pending",
                });
                setShowAddModal(true);
              }}
              className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-lg transition"
            >
              Create Order
            </button>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-lg transition"
            >
              <RefreshCcw size={16} /> <span className="text-sm">Refresh</span>
            </button>
          </div>

        </div>
      </motion.div>

      {/* Stats + Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {stats.map(({ label, value }) => {
          const isActive = filterStatus === label;

          return (
            <button
              key={label}
              onClick={() => setFilterStatus(label)}
              className={`rounded-xl transition transform hover:scale-[1.02] ${isActive ? "ring-2 ring-emerald-500" : ""
                }`}
            >
              <StatCard
                title={label}
                value={value}
                className={statColorMap[label]}
              />
            </button>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-sm sm:text-base">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left">Order</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Total</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;

              return (
                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.email}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">{order.total}</td>

                  {/* Status dropdown */}
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`appearance-none cursor-pointer px-4 py-2 pr-8 rounded-full text-sm sm:text-base font-medium outline-none ${statusConfig[order.status].className}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-600" />
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button className="inline-flex items-center gap-1 text-green-600 hover:text-green-800">
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-base">
            No orders found
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = statusConfig[order.status].icon;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{order.id}</h3>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${statusConfig[order.status].className}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {order.status}
                </span>
              </div>

              <p className="text-sm sm:text-base text-gray-600">
                Customer: {order.customer}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                Email: {order.email}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                Date: {order.date}
              </p>
              <p className="text-sm sm:text-base font-medium mt-1">
                Total: {order.total}
              </p>

              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(order.id, e.target.value)
                }
                className={`mt-3 w-full px-3 py-2 rounded-lg text-sm sm:text-base font-medium outline-none ${statusConfig[order.status].className}`}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white py-2 text-sm sm:text-base hover:bg-blue-700">
                <Eye className="h-4 w-4" />
                View Order
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderListPage;
