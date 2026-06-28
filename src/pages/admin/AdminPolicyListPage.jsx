// import { useState } from "react";
// import { usePolicies } from "../../hooks/usePolicies.js";
// import { usePagination } from "../../hooks/usePagination.js";
// import { formatDate, getEnumOptions } from "../../utils/formatters.js";

// import { POLICY_STATUSES } from "../../utils/constants.js";
// import DataTable from "../../components/common/DataTable.jsx";
// import StatusBadge from "../../components/common/StatusBadge.jsx";
// import BackButton from "../../components/common/BackButton.jsx";
// import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";

// function AdminPolicyListPage() {
//   const { params, page, pageSize, setPage, setPageSize } = usePagination();

//   const [filters, setFilters] = useState({});
//   const queryParams = { ...params, ...filters };
//   const { data, isLoading } = usePolicies(queryParams);

//   const records = data?.data?.content ?? data?.content ?? [];
//   const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0;
//   const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0;

//   const filteredPolicies = records.filter((policy) => {
//     const matchesName = filters.customerName
//       ? policy.customerName
//           ?.toLowerCase()
//           .includes(filters.customerName.toLowerCase())
//       : true;
//     const matchesStatus = filters.status
//       ? policy.status === filters.status
//       : true;
//     return matchesName && matchesStatus;
//   });

//   const columns = [
//     { key: "policyNumber", header: "Policy Number" },
//     {
//       key: "customerName",
//       header: "Customer",
//       render: (row) => row.customerName ?? "—",
//     },
//     { key: "planName", header: "Plan", render: (row) => row.planName ?? "—" },
//     {
//       key: "status",
//       header: "Status",
//       render: (row) => <StatusBadge status={row.status} />,
//     },
//     {
//       key: "startDate",
//       header: "Start Date",
//       render: (row) => formatDate(row.startDate),
//     },
//     {
//       key: "endDate",
//       header: "End Date",
//       render: (row) => formatDate(row.endDate),
//     },
//   ];

//   const filterConfig = [
//     { key: "customerName", label: "Customer Name", type: "text" },
//     {
//       key: "status",
//       label: "Status",
//       type: "select",
//       options: getEnumOptions(POLICY_STATUSES), // Ensure POLICY_STATUSES is imported
//     },
//   ];

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => {
//       const newFilters = { ...prev, [key]: value };
//       if (!value) delete newFilters[key];
//       return newFilters;
//     });
//     setPage(0);
//   };

//   const handleFilterReset = () => {
//     setFilters({});
//     setPage(0);
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <BackButton />
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">All Policies</h1>
//       </div>
//       <SearchFilterBar
//         filters={filterConfig}
//         values={filters}
//         onChange={handleFilterChange}
//         onReset={handleFilterReset}
//         searchPlaceholder="Search by Customer name"
//       />
//       <DataTable
//         columns={columns}
//         data={filteredPolicies}
//         isLoading={isLoading}
//         exportTitle="Admin Policy Report"
//         emptyMessage="No policies found."
//         paginationProps={{
//           currentPage: page,
//           totalPages,
//           pageSize,
//           totalRecords: totalElements,
//           onPageChange: setPage,
//           onPageSizeChange: setPageSize,
//         }}
//       />
//     </div>
//   );
// }

// export default AdminPolicyListPage;
