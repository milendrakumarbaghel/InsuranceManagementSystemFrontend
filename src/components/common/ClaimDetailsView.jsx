import { useState } from "react";
import { formatCurrency, formatDate, formatDateTime } from "../../utils/formatters.js";
import StatusBadge from "./StatusBadge.jsx";

const DetailItem = ({ label, value }) => (
  <div>
    <dt className="text-xs font-medium text-gray-500 uppercase">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value ?? "—"}</dd>
  </div>
);

function ClaimDetailsView({ claim }) {
  const [selectedDoc, setSelectedDoc] = useState(null);

  if (!claim) return null;

  return (
    <div className="space-y-6">
      {/* 1. Plan Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-semibold border-b pb-3">Plan Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <DetailItem label="Plan Name" value={claim.planDetails?.planName} />
          <DetailItem label="Coverage Amount" value={formatCurrency(claim.planDetails?.coverageAmount)} />
          <DetailItem label="Premium Amount" value={formatCurrency(claim.planDetails?.premiumAmount)} />
          <DetailItem label="Premium Type" value={claim.planDetails?.premiumType} />
          <DetailItem label="Policy Duration" value={`${claim.planDetails?.duration} Months`} />
        </div>
        {claim.planDetails?.termsAndConditions && (
          <div className="mt-4">
            <dt className="text-xs font-medium text-gray-500 uppercase mb-1">Terms & Conditions</dt>
            <dd className="text-sm text-gray-700 whitespace-pre-wrap">{claim.planDetails.termsAndConditions}</dd>
          </div>
        )}
      </div>

      {/* 2. Plan-wise Claim Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-semibold border-b pb-3">Plan-wise Claim Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DetailItem label="Total Previous Claims on Plan" value={claim.planSummary?.totalPreviousClaims} />
          <DetailItem label="Total Amount Claimed (Approved)" value={formatCurrency(claim.planSummary?.totalPreviousClaimAmount)} />
          <DetailItem label="Remaining Eligible Coverage" value={formatCurrency(claim.planSummary?.remainingCoverage)} />
        </div>
      </div>

      {/* 3. Current Claim Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-semibold border-b pb-3">Current Claim Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem label="Claim Number" value={claim.claimNumber} />
          <DetailItem label="Policy Number" value={claim.policyNumber} />
          <DetailItem label="Customer" value={claim.customerName} />
          <DetailItem label="Claim Amount" value={formatCurrency(claim.claimAmount)} />
          <DetailItem label="Incident Date" value={formatDate(claim.incidentDate)} />
        </div>
        
        <div className="mt-2">
          <dt className="text-xs font-medium text-gray-500 uppercase mb-1">Claim Reason / Description</dt>
          <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">{claim.claimReason || "No description provided."}</dd>
        </div>

        {claim.agentRemarks && (
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Agent Remarks</p>
            <p className="text-sm bg-indigo-50 rounded p-3 text-indigo-900">{claim.agentRemarks}</p>
          </div>
        )}

        {claim.adminRemarks && (
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Admin Remarks</p>
            <p className="text-sm bg-teal-50 rounded p-3 text-teal-900">{claim.adminRemarks}</p>
          </div>
        )}
        
        {claim.documents?.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Uploaded Documents</p>
            <ul className="space-y-2">
              {claim.documents.map((doc, i) => (
                <li key={i} className="flex flex-col gap-2 rounded-lg border bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{doc.documentName}</p>
                    <p className="text-xs text-gray-500">
                      {doc.documentType ?? 'Document'}
                      {doc.uploadedDate ? ` • Uploaded ${formatDateTime(doc.uploadedDate)}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={doc.documentReference}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
                    >
                      View / Download
                    </a>
                    <button onClick={() => setSelectedDoc(doc)} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100">Preview</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 4. Customer Claim History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-semibold border-b pb-3 flex items-center">
          Customer Claim History
          <span className="ml-3 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Total Submitted: {claim.customerClaimHistory?.length || 0}
          </span>
        </h2>
        
        {claim.customerClaimHistory?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 border-collapse">
              <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-3 px-4 font-medium">Claim Number</th>
                  <th className="py-3 px-4 font-medium">Plan Name</th>
                  <th className="py-3 px-4 font-medium">Coverage Amount</th>
                  <th className="py-3 px-4 font-medium">Claimed Amount</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {claim.customerClaimHistory.map((h, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{h.claimNumber}</td>
                    <td className="py-3 px-4 truncate max-w-[200px]" title={h.planName}>{h.planName}</td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(h.coverageAmount)}</td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(h.claimedAmount)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{formatDate(h.claimDate)}</td>
                    <td className="py-3 px-4"><StatusBadge status={h.claimStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg text-center border border-dashed">
            No previous claim history found for this customer.
          </p>
        )}
      </div>

      {/* Document Preview Modal */}
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
    </div>
  );
}

export default ClaimDetailsView;