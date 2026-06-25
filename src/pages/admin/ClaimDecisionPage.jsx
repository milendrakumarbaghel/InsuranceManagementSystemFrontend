import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useClaim,
  useApproveClaim,
  useRejectClaim,
} from "../../hooks/useClaims.js";
import { useToast } from "../../context/ToastContext.jsx";
import { handleApiError } from "../../utils/handleApiError.js";
import { formatDate, formatCurrency } from "../../utils/formatters.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import BackButton from "../../components/common/BackButton.jsx";

function ClaimDecisionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data, isLoading } = useClaim(id);
  const approveClaim = useApproveClaim();
  const rejectClaim = useRejectClaim();
  const [remarks, setRemarks] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);

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
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <BackButton />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claim Decision</h1>
          <p className="text-gray-500 mt-1">{claim.claimNumber}</p>
        </div>
        <StatusBadge status={claim.claimStatus} size="md" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-semibold border-b pb-3">Claim Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ["Policy Number", claim.policyNumber],
            ["Customer", claim.customerName],
            ["Claim Amount", formatCurrency(claim.claimAmount)],
            ["Status", <StatusBadge key="s" status={claim.claimStatus} />],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium text-gray-500 uppercase">
                {label}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{value ?? "—"}</dd>
            </div>
          ))}
        </dl>
        {claim.agentRemarks && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Agent Remarks
            </p>
            <p className="text-sm bg-indigo-50 rounded p-3">
              {claim.agentRemarks}
            </p>
          </div>
        )}
        {claim.adminRemarks && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Admin Remarks
            </p>
            <p className="text-sm bg-teal-50 rounded p-3">
              {claim.adminRemarks}
            </p>
          </div>
        )}
      </div>

      {claim.documents?.map((doc, i) => (
  <li key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
    <span className="text-sm text-gray-800">{doc.documentName}</span>
    <button 
      onClick={() => setSelectedDoc(doc)}
      className="text-blue-600 underline text-sm"
    >
      Preview
    </button>
  </li>
))}


{selectedDoc && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-bold text-gray-900 truncate">{selectedDoc.documentName}</h3>
        <button 
          onClick={() => setSelectedDoc(null)} 
          className="text-gray-500 hover:text-red-600 font-bold px-2"
        >
          Close
        </button>
      </div>
      <div className="flex-grow overflow-hidden bg-gray-100">
        {/* Conditional rendering based on file type */}
        {selectedDoc.documentReference.toLowerCase().endsWith('.pdf') ? (
          <iframe 
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedDoc.documentReference)}&embedded=true`} 
            className="w-full h-full" 
            title="PDF Preview"
          />
        ) : (
          <img 
            src={selectedDoc.documentReference} 
            alt="Document Preview" 
            className="w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  </div>
)}
      {isDecidable && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-base font-semibold border-b pb-3">
            Make Decision
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter remarks for your decision…"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleReject}
              disabled={isBusy}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {rejectClaim.isPending ? "Rejecting…" : "Reject"}
            </button>
            <button
              onClick={handleApprove}
              disabled={isBusy}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {approveClaim.isPending ? "Approving…" : "Approve"}
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
          This claim has been{" "}
          {claim.claimStatus === "APPROVED" ? "approved" : "rejected"}.
        </div>
      )}
    </div>
  );
}

export default ClaimDecisionPage;
