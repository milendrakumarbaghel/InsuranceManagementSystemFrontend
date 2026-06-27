import { Link, useNavigate } from "react-router-dom";
import { useUsers, useToggleUser } from "../../hooks/useUsers.js";
import { usePagination } from "../../hooks/usePagination.js";
import { useToast } from "../../context/ToastContext.jsx";
import { handleApiError } from "../../utils/handleApiError.js";
import DataTable from "../../components/common/DataTable.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import BackButton from "../../components/common/BackButton.jsx";
import { exportToPDF } from "../../utils/exportUtils";

function getUserId(row) {
  return row.id ?? row.userId ?? row.UserId;
}

function UserListPage() {
  const { params, page, pageSize, setPage, setPageSize } = usePagination();
  const { data, isLoading } = useUsers(params);
  const toggleUser = useToggleUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const records = data?.data?.content ?? data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? data?.totalPages ?? 0;
  const totalElements = data?.data?.totalElements ?? data?.totalElements ?? 0;

  const customers = records.filter((user) => user.role === "CUSTOMER");
  const staff = records.filter(
    (user) => user.role === "AGENT" || user.role === "ADMIN",
  );

  function handleToggle(row) {
    const userId = getUserId(row);

    if (!userId) {
      showToast(
        "Unable to update this user because the user id is missing.",
        "error",
      );
      return;
    }

    toggleUser.mutate(
      { id: userId, active: !row.active },
      {
        onSuccess: () =>
          showToast(
            `User "${row.email}" ${!row.active ? "activated" : "deactivated"}.`,
            "success",
          ),
        onError: (err) => handleApiError(err, showToast),
      },
    );
  }

  const columns = [
    {
      key: "fullName",
      header: "Name",
      render: (row) => row.fullName ?? row.email,
    },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (row) => (
        <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
          {row.role}
        </span>
      ),
    },
    {
      key: "active",
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.active ? "ACTIVE" : "INACTIVE"} />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggle(row);
          }}
          disabled={toggleUser.isPending}
          className={`rounded-md px-3 py-1 text-xs font-medium disabled:opacity-50 ${row.active ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
        >
          {row.active ? "Deactivate" : "Activate"}
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Link
          to="/admin/users/create-agent"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create Agent
        </Link>
      </div>

      {/* 2. Render separate sections */}
      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-semibold mb-4">Customers</h2>
          <DataTable
            columns={columns}
            data={customers}
            isLoading={isLoading}
            emptyMessage="No customers found."
            onRowClick={(row) => navigate(`/admin/customers/${getUserId(row)}`)}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            Staff (Agents & Admins)
          </h2>
          <DataTable
            columns={columns}
            data={staff}
            isLoading={isLoading}
            emptyMessage="No staff found."
            paginationProps={{
              currentPage: page,
              totalPages: totalPages,
              pageSize: pageSize,
              totalRecords: totalElements, // Map totalElements here
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
          />
        </section>
      </div>
    </div>
  );
}

export default UserListPage;
