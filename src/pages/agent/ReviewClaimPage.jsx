import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewClaimSchema } from "../../utils/validators.js";
import { useClaim, useReviewClaim } from "../../hooks/useClaims.js";
import { useToast } from "../../context/ToastContext.jsx";
import { handleApiError } from "../../utils/handleApiError.js";
import FormTextarea from "../../components/common/FormTextarea.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import BackButton from "../../components/common/BackButton.jsx";
import ClaimDetailsView from "../../components/common/ClaimDetailsView.jsx";

function ReviewClaimPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const { data, isLoading } = useClaim(id);
  const reviewClaim = useReviewClaim();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewClaimSchema),
    defaultValues: { recommended: undefined, remarks: "" },
  });

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

  function onSubmit(formData) {
    reviewClaim.mutate(
      {
        id,
        data: { recommended: formData.recommended, remarks: formData.remarks },
      },
      {
        onSuccess: () => {
          showToast("Claim reviewed successfully.", "success");
          navigate("/agent/claims");
        },
        onError: (err) => handleApiError(err, showToast),
      },
    );
  }

  const isBusy = isSubmitting || reviewClaim.isPending;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <BackButton />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Claim</h1>
          <p className="text-gray-500 mt-1">{claim.claimNumber}</p>
        </div>
        <StatusBadge status={claim.claimStatus} size="md" />
      </div>

      <ClaimDetailsView claim={claim} />

      {/* Agent Review Action */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 shadow-sm"
      >
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-2">
            Recommendation <span className="text-red-500">*</span>
          </legend>
          <div className="flex gap-6">
            {[
              ["true", "Recommend Approval"],
              ["false", "Recommend Rejection"],
            ].map(([val, label]) => (
              <label
                key={val}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={val}
                  {...register("recommended")}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          {errors.recommended && (
            <p className="mt-1 text-xs text-red-600">
              {errors.recommended.message}
            </p>
          )}
        </fieldset>
        
        <FormTextarea
          label="Remarks"
          name="remarks"
          required
          rows={4}
          error={errors.remarks?.message}
          {...register("remarks")}
        />
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/agent/claims")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isBusy}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isBusy ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewClaimPage;