import React, { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { Loader2, Search, RefreshCcw, SortAsc, SortDesc } from "lucide-react";
import toast from "react-hot-toast";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");

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
      console.error(error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    fetchUsers();
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <section className="max-w-7xl mx-auto mt-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          👥 User Management
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition"
          >
            {sortOrder === "asc" ? <SortAsc size={18} /> : <SortDesc size={18} />}
            <span className="text-sm">Sort</span>
          </button>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-lg transition"
          >
            <RefreshCcw size={16} /> <span className="text-sm">Refresh</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6">
        <div className="flex items-center w-full md:w-96 border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500 bg-white">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
        </div>
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="text-sm underline text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        )}
      </form>

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
                      {user.name || "—"}
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
