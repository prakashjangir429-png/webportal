import { useState, useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import api from "../../axiosInstance";

const ChargebacksTable = () => {
    const [chargebacks, setChargebacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: "",
        fromDate: "",
        toDate: "",
        minAmount: "",
        maxAmount: "",
        search: "",
        user_id: "",
        sortField: "createdAt",
        sortOrder: "desc"
    });

    useEffect(() => {
        fetchChargebacks();
    }, [filters]);

    const fetchChargebacks = async () => {
        try {
            setLoading(true);
            const params = {
                ...filters
            };

            const response = await api.get("/chargebacks", { params });
            setChargebacks(response.data.data);
            setTotal(response.data.pagination.total);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1
        }));
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleSort = (column) => {
        setFilters(prev => ({
            ...prev,
            sortField: column,
            sortOrder: prev.sortField === column ? (prev.sortOrder === 'desc' ? 'asc' : 'desc') : 'desc',
            page: 1
        }));
    };

    const renderSortIcon = (column) => {
        if (filters.sortField !== column) return null;
        return filters.sortOrder === 'desc' ? "▼" : "▲";
    };

    const resetFilters = () => {
        setFilters({
            page: 1,
            limit: 10,
            status: "",
            fromDate: "",
            toDate: "",
            search: "",
            user_id: "",
            sortField: "createdAt",
            sortOrder: "desc"
        });
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            Success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            Failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        };
        return (
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div>
            <PageMeta
                title="Chargebacks | Admin Dashboard"
                description="View and manage chargeback records"
            />
            <PageBreadcrumb pageTitle="Chargebacks" />

            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 lg:px-8">
                {/* Filters Section */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Search (Payer, Txn ID, Description)
                        </label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search chargebacks..."
                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Success">Success</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>

                    {/* Date Range Filters */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            From Date
                        </label>
                        <input
                            type="date"
                            name="fromDate"
                            value={filters.fromDate}
                            onChange={handleDateChange}
                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            To Date
                        </label>
                        <input
                            type="date"
                            name="toDate"
                            value={filters.toDate}
                            onChange={handleDateChange}
                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                </div>

                {/* Actions Section */}
                <div className="mb-4 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={resetFilters}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                        >
                            Reset Filters
                        </button>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Rows per page:
                            </label>
                            <select
                                name="limit"
                                value={filters.limit}
                                onChange={handleFilterChange}
                                className="rounded-md border border-gray-300 bg-white py-1 px-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Chargebacks Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                        </div>
                    ) : (
                        <div className="min-w-full">
                            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer sm:px-6"
                                            onClick={() => handleSort("createdAt")}
                                        >
                                            Date {renderSortIcon("createdAt")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6"
                                        >
                                            User
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer sm:px-6"
                                            onClick={() => handleSort("txnId")}
                                        >
                                            Txn ID {renderSortIcon("txnId")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer sm:px-6"
                                            onClick={() => handleSort("amount")}
                                        >
                                            Amount {renderSortIcon("amount")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer sm:px-6"
                                            onClick={() => handleSort("charges")}
                                        >
                                            charges {renderSortIcon("charges")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:table-cell sm:px-6"
                                        >
                                            Payer
                                        </th>
                                        <th
                                            scope="col"
                                            className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:table-cell sm:px-6"
                                        >
                                            UTR
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer sm:px-6"
                                            onClick={() => handleSort("status")}
                                        >
                                            Status {renderSortIcon("status")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {chargebacks?.length > 0 ? (
                                        chargebacks.map((cb) => (
                                            <tr key={cb._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300 sm:px-6">
                                                    {moment(cb.createdAt).format("MMM D, YYYY h:mm A")}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300 sm:px-6">
                                                    {cb.user?.fullName || cb.user?.email || 'N/A'}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white sm:px-6">
                                                    {cb.txnId}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white sm:px-6">
                                                    ₹{cb.amount.toFixed(2)}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white sm:px-6">
                                                    ₹{cb.charges.toFixed(2)}
                                                </td>
                                                <td className="hidden whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300 sm:table-cell sm:px-6">
                                                    {cb.payerName || 'N/A'}
                                                </td>
                                                <td className="hidden whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300 sm:table-cell sm:px-6">
                                                    {cb.utr || 'N/A'}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300 sm:px-6">
                                                    {getStatusBadge(cb.status)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-300 sm:px-6"
                                            >
                                                No chargebacks found matching your criteria
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {total > 0 && (
                    <div className="mt-4 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                            Showing{" "}
                            <span className="font-medium">
                                {(filters.page - 1) * filters.limit + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                                {Math.min(filters.page * filters.limit, total)}
                            </span>{" "}
                            of <span className="font-medium">{total}</span> results
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                className={`rounded-md border border-gray-300 px-3 py-1 text-sm ${filters.page === 1
                                    ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                    }`}
                            >
                                Previous
                            </button>
                            {Array.from(
                                { length: Math.ceil(total / filters.limit) },
                                (_, i) => i + 1
                            )
                                .slice(
                                    Math.max(0, filters.page - 3),
                                    Math.min(Math.ceil(total / filters.limit), filters.page + 2)
                                )
                                .map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`rounded-md border px-3 py-1 text-sm ${filters.page === pageNum
                                            ? "border-indigo-500 bg-indigo-500 text-white"
                                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            <button
                                onClick={() => handlePageChange(filters.page + 1)}
                                disabled={filters.page * filters.limit >= total}
                                className={`rounded-md border border-gray-300 px-3 py-1 text-sm ${filters.page * filters.limit >= total
                                    ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChargebacksTable;