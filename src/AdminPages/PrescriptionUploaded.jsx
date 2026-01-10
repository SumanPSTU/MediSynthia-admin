import React, { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { motion } from 'framer-motion';
import { FileText, Search, RefreshCcw, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

// Define colors for filter/status
const statColorMap = {
    All: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    Pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    Approved: "bg-green-100 text-green-700 hover:bg-green-200",
    Rejected: "bg-red-100 text-red-700 hover:bg-red-200",
};

const StatCard = ({ title, value, className }) => (
    <div className={`p-4 rounded-xl shadow-sm flex flex-col items-center hover:shadow-lg transition ${className}`}>
        <p className="text-sm font-medium">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
);

const PrescriptionListPage = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [filterStatus, setFilterStatus] = useState("All");

    // Load prescriptions
    const loadPrescriptions = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getAllPrescriptions(page, limit);
            setPrescriptions(res.data.prescriptions);
            setTotal(res.data.totalItems);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load prescriptions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrescriptions();
    }, [page]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!search.trim()) {
                loadPrescriptions();
                return;
            }

            try {
                setLoading(true);
                const res = await adminApi.searchPrescriptions(search.trim());
                setPrescriptions(res.data.results || []);
                setPage(1);
            } catch (err) {
                toast.error("Search failed");
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const clearSearch = () => {
        setSearch("");
        loadPrescriptions();
    };

    // Compute stats
    const stats = [
        { label: "All", value: total },
        { label: "Pending", value: prescriptions.filter(p => p.status === "Pending").length },
        { label: "Approved", value: prescriptions.filter(p => p.status === "Approved").length },
        { label: "Rejected", value: prescriptions.filter(p => p.status === "Rejected").length },
    ];

    return (
        <div className="mx-auto mt-6 px-4">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-2xl bg-emerald-500 p-6 text-white shadow-lg"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <FileText className="h-7 w-7" />
                            <h1 className="text-2xl font-semibold"> Prescriptions</h1>
                        </div>
                        <p className="text-gray-200 text-sm mt-1">View and manage all prescriptions uploaded by users</p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search prescription..."
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
                        onClick={loadPrescriptions}
                        className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-lg transition"
                    >
                        <RefreshCcw size={16} /> <span className="text-sm">Refresh</span>
                    </button>
                </div>
            </motion.div>

            {/* Stats + Filters combined */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {stats.map(({ label, value }) => {
                    const isActive = filterStatus === label;

                    return (
                        <button
                            key={label}
                            onClick={() => setFilterStatus(label)}
                            className={`rounded-xl transition transform hover:scale-[1.02] ${isActive ? "ring-2 ring-emerald-500" : ""}`}
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

            {/* PRESCRIPTIONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <LoadingSkeleton />
                ) : prescriptions.length === 0 ? (
                    <EmptyState text="No prescriptions found" />
                ) : (
                    prescriptions.map((prescription, index) => (
                        <div
                            key={prescription._id}
                            className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition cursor-pointer"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-800">Prescription #{(page - 1) * limit + index + 1}</h3>
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${prescription.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : prescription.status === "Approved"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {prescription.status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-1">ID: {prescription._id}</p>
                            <p className="text-gray-600 text-sm mb-1">User: {prescription.user?.name}</p>
                            <p className="text-gray-400 text-xs mb-3">{new Date(prescription.createdAt).toLocaleDateString()}</p>
                            <div className="flex justify-end gap-2">
                                <a
                                    href={prescription.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                                >
                                    <Eye size={16} /> View
                                </a>
                                <a
                                    href={prescription.fileUrl}
                                    download
                                    className="flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                                >
                                    <Download size={16} /> Download
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center gap-3 mt-6 items-center">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50 transition"
                >
                    <ChevronLeft size={18} /> Prev
                </button>
                <span className="text-gray-700 font-medium">{page}</span>
                <button
                    disabled={prescriptions.length < limit}
                    onClick={() => setPage(page + 1)}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border hover:bg-gray-50 transition"
                >
                    Next <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default PrescriptionListPage;

/* ===================== COMPONENTS ===================== */
const LoadingSkeleton = () => (
    <div className="space-y-4 animate-pulse col-span-full">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>
        ))}
    </div>
);

const EmptyState = ({ text = "No data found" }) => (
    <div className="text-center py-20 text-gray-500 col-span-full">
        <p className="text-lg font-medium">{text}</p>
    </div>
);
