import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { adminApi } from "../api/adminApi";
import { Loader2, Search, RefreshCcw, SortAsc, SortDesc, Users } from "lucide-react";
import toast from "react-hot-toast";

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center hover:shadow-lg transition">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold text-gray-800 mt-1">{value}</h2>
  </div>
);

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredUsers = users.filter((u) => {
    if (filterStatus === "Active") return !u.isBlocked;
    if (filterStatus === "Blocked") return u.isBlocked;
    return true; // All
  });

  const total = users.length;

  useEffect(() => {
    fetchUsers();
  }, [page, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers(page, limit, sortOrder);
      if (response.data.success) {
        setUsers(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return fetchUsers();
    try {
      setLoading(true);
      const response = await adminApi.searchUsers(search);
      if (response.data.success) {

        setUsers(response.data.results || []); // <-- corrected here

        setTotalPages(1);
        setPage(1);
      }
    } catch (error) {

      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    fetchUsers();
  };


  return (
    <section className=" mx-auto mt-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl bg-emerald-500 p-6 text-white shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <Users className="h-7 w-7" />
              <h1 className="text-2xl font-semibold"> Users</h1>
            </div>
            <p className="text-gray-200 text-sm mt-1">Monitor, block, or unblock users in your system</p>
          </div>

          {/* Search */}
          <div onKeyUp={handleSearch} className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
              className="w-full rounded-lg bg-white/90 pl-9 pr-10 py-2 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                clear
              </button>
            )}
          </div>

          <button
            onClick={fetchUsers}
            className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-lg transition"
          >
            <RefreshCcw size={16} /> <span className="text-sm">Refresh</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "All", value: users.length },
          { label: "Active", value: users.filter(u => !u.isBlocked).length },
          { label: "Blocked", value: users.filter(u => u.isBlocked).length },
          { label: "Page", value: page, infoOnly: true },
        ].map(({ label, value, infoOnly }) => {
          const isActive = filterStatus === label;

          return (
            <button
              key={label}
              disabled={infoOnly}
              onClick={() => !infoOnly && setFilterStatus(label)}
              className={`
          rounded-xl transition transform hover:scale-[1.02]
          ${isActive ? "ring-2 ring-emerald-500" : ""}
          ${infoOnly ? "cursor-default" : ""}
        `}
            >
              <StatCard title={label} value={value} />
            </button>
          );
        })}
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        ) : (
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Registered</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 border-t">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-3 border-t font-medium">
                      {user.username || "—"}
                    </td>
                    <td className="px-4 py-3 border-t">{user.email}</td>
                    <td className="px-4 py-3 border-t">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                          }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-t">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
        <p>
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserListPage;
