import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useClaims } from "../../hooks/useClaims.js";
import { usePagination } from "../../hooks/usePagination.js";
import { formatCurrency, formatDate, getEnumOptions } from "../../utils/formatters.js";
import { CLAIM_STATUSES } from "../../utils/constants.js";

import DataTable from "../../components/common/DataTable.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import BackButton from "../../components/common/BackButton.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";

function SharedClaimListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const isAgent = user?.role === "AGENT";

  const { params, page, pageSize, setPage, setPageSize } = usePagination();
  const [filters, setFilters] = useState({});

  // Force Agent view to only fetch the queue of SUBMITTED claims
  const baseParams = isAgent ? { status: 'SUBMITTED' } : {};
  const queryParams = { ...params, ...baseParams, ...filters };
  
  const { data, isLoading } = useClaims(queryParams);

  const records = data?.data?.content ?? data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0;
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0;

  const filteredClaims = records.filter((claim) => {
    const matchesName = filters.customerName ? claim.customerName?.toLowerCase().includes(filters.customerName.toLowerCase()) : true;
    const matchesStatus = filters.status ? claim.claimStatus === filters.status : true;
    return matchesName && matchesStatus;
  });

  const columns = [
    { key: "claimNumber", header: "Claim Number" },
    { key: "policyNumber", header: "Policy Number", render: (row) => row.policyNumber ?? "—" },
    { key: "customerName", header: "Customer", render: (row) => row.customerName ?? "—" },
    { key: "claimAmount", header: "Amount", render: (row) => formatCurrency(row.claimAmount) },
    { key: "incidentDate", header: "Incident Date", render: (row) => formatDate(row.incidentDate) },
    { key: "claimStatus", header: "Status", render: (row) => <StatusBadge status={row.claimStatus} /> },
  ];

  if (isAgent) {
    columns.push({
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Link
          to={`/agent/claims/${row.claimId}/review`}
          onClick={(e) => e.stopPropagation()}
          className="rounded-md bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
        >
          Review
        </Link>
      ),
    });
  }

  const filterConfig = [
    { key: "customerName", label: "Customer Name", type: "text" },
    ...(isAdmin ? [{ key: "status", label: "Claim Status", type: "select", options: getEnumOptions(CLAIM_STATUSES) }] : [])
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (!value) delete newFilters[key];
      return newFilters;
    });
    setPage(0);
  };

  const handleRowClick = (row) => {
    if (isAdmin) {
      navigate(`/admin/claims/${row.claimId}/decide`);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? "All Claims" : "Claim Queue"}
        </h1>
      </div>

      <div className="mb-6">
        <SearchFilterBar
          filters={filterConfig}
          values={filters}
          onChange={handleFilterChange}
          onReset={() => { setFilters({}); setPage(0); }}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredClaims}
        isLoading={isLoading}
        emptyMessage={isAdmin ? "No claims found." : "No submitted claims in queue."}
        onRowClick={isAdmin ? handleRowClick : undefined}
        exportTitle={`${isAdmin ? 'Admin' : 'Agent'} Claims Report`}
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

export default SharedClaimListPage;