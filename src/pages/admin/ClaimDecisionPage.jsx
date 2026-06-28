import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useClaim,
  useApproveClaim,
  useRejectClaim,
} from "../../hooks/useClaims.js";
import { useToast } from "../../context/ToastContext.jsx";
import { handleApiError } from "../../utils/handleApiError.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import BackButton from "../../components/common/BackButton.jsx";
import ClaimDetailsView from "../../components/common/ClaimDetailsView.jsx";

function ClaimDecisionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const { data, isLoading } = useClaim(id);
  const approveClaim = useApproveClaim();
  const rejectClaim = useRejectClaim();
  
  const [remarks, setRemarks] = useState("");

  const claim = data?.data ?? data;

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  if (!claim)
    return (
      <div className="p-6 text-center text-gray-500">Claim not found.</div>
    );

  const isDecidable = [
    "RECOMMENDED_APPROVAL",
    "RECOMMENDED_REJECTION",
    "UNDER_REVIEW",
    "SUBMITTED",
  ].includes(claim.claimStatus);
  const isResolved = ["APPROVED", "REJECTED"].includes(claim.claimStatus);
  const isBusy = approveClaim.isPending || rejectClaim.isPending;

  const handleApprove = () => {
    approveClaim.mutate(
      { id, remarks },
      {
        onSuccess: () => {
          showToast("Claim approved.", "success");
          navigate("/admin/claims");
        },
        onError: (err) => handleApiError(err, showToast),
      },
    );
  };

  const handleReject = () => {
    rejectClaim.mutate(
      { id, remarks },
      {
        onSuccess: () => {
          showToast("Claim rejected.", "success");
          navigate("/admin/claims");
        },
        onError: (err) => handleApiError(err, showToast),
      },
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <BackButton />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claim Decision</h1>
          <p className="text-gray-500 mt-1">{claim.claimNumber}</p>
        </div>
        <StatusBadge status={claim.claimStatus} size="md" />
      </div>

      <ClaimDetailsView claim={claim} />

      {/* Decision Actions */}
      {isDecidable && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-semibold border-b pb-3">Make Decision</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter remarks for your decision..."
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleReject}
              disabled={isBusy}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {rejectClaim.isPending ? "Rejecting..." : "Reject"}
            </button>
            <button
              onClick={handleApprove}
              disabled={isBusy}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {approveClaim.isPending ? "Approving..." : "Approve"}
            </button>
          </div>
        </div>
      )}

      {isResolved && (
        <div
          className={`rounded-xl border p-4 text-sm font-medium ${
            claim.claimStatus === "APPROVED"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          This claim has been {claim.claimStatus === "APPROVED" ? "approved" : "rejected"}.
        </div>
      )}
    </div>
  );
}

export default ClaimDecisionPage;