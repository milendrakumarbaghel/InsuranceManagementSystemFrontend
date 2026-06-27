import { useState } from "react";
import { usePayments } from "../../hooks/usePayments.js";
import { usePagination } from "../../hooks/usePagination.js";
import { formatDate, formatCurrency } from "../../utils/formatters.js";
import DataTable from "../../components/common/DataTable.jsx";
import BackButton from "../../components/common/BackButton.jsx";
import { exportToPDF } from "../../utils/exportUtils";
import Spinner from "../../components/common/Spinner.jsx";

function AgentPaymentListPage() {
  const { params, page, pageSize, setPage, setPageSize } = usePagination();
  const { data, isLoading } = usePayments(params);

  const records = data?.data?.content ?? data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0;
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0;

  const [filters, setFilters] = useState({
    minAmount: "",
    mode: "",
    startDate: "",
    endDate: "",
  });

  const filteredRecords = records.filter((payment) => {
    const amount = parseFloat(payment.amount) || 0;
    const matchesAmount = filters.minAmount
      ? amount >= parseFloat(filters.minAmount)
      : true;
    const matchesMode = filters.mode
      ? payment.paymentMode === filters.mode
      : true;

    const paymentDate = payment.paymentDate
      ? new Date(payment.paymentDate)
      : null;
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;

    const matchesDate =
      (!start || (paymentDate && paymentDate >= start)) &&
      (!end || (paymentDate && paymentDate <= end));

    return matchesAmount && matchesMode && matchesDate;
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      minAmount: "",
      mode: "",
      startDate: "",
      endDate: "",
    });
  };

  const columns = [
    { key: "paymentId", header: "ID" },
    {
      key: "policyNumber",
      header: "Policy Number",
      render: (row) => row.policyNumber ?? "—",
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => formatCurrency(row.amount),
    },
    { key: "paymentMode", header: "Mode" },
    {
      key: "paymentDate",
      header: "Date",
      render: (row) => formatDate(row.paymentDate),
    },
    {
      key: "transactionReference",
      header: "Reference",
      render: (row) => row.transactionReference ?? "—",
    },
  ];

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payments</h1>

      <div className="grid grid-cols-6 gap-2 mb-6 bg-white p-4 rounded-lg border border-gray-200 items-end">
        
        <input
          type="number"
          placeholder="Min Amount"
          value={filters.minAmount}
          className="border p-2 rounded text-sm w-full"
          onChange={(e) => handleFilterChange("minAmount", e.target.value)}
        />
        <select
          className="border p-2 rounded text-sm w-full"
          value={filters.mode}
          onChange={(e) => handleFilterChange("mode", e.target.value)}
        >
          <option value="">Mode</option>
          <option value="UPI">UPI</option>
          <option value="CARD">CARD</option>
          <option value="NET_BANKING">NET_BANKING</option>
          <option value="CASH">CASH</option>
        </select>
        <input
          type="date"
          className="border p-2 rounded text-sm w-full"
          title="Start Date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded text-sm w-full"
          title="End Date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
        />
        <button
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded text-sm font-semibold w-full"
        >
          Reset
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredRecords}
        isLoading={isLoading}
        emptyMessage="No payments found."
        exportTitle="Agent Payments Report"
        paginationProps={{
          currentPage: page,
          totalPages,
          pageSize,
          totalRecords: totalElements,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </div>
  );
}

export default AgentPaymentListPage;
