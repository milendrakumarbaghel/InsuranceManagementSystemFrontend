import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewClaimSchema } from '../../utils/validators.js'
import { useClaim, useReviewClaim } from '../../hooks/useClaims.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'

import FormTextarea from '../../components/common/FormTextarea.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import BackButton from '../../components/common/BackButton.jsx'
import ClaimDetailsView from '../../components/common/ClaimDetailsView.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'

function ReviewClaimPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data, isLoading } = useClaim(id)
  const reviewClaim = useReviewClaim()
  const [pendingRecommendation, setPendingRecommendation] = useState(null)
  const [pendingPayload, setPendingPayload] = useState(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewClaimSchema),
    defaultValues: { recommended: undefined, remarks: '' },
  })

  const claim = data?.data ?? data

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  if (!claim) {
    return <div className="p-6 text-center text-gray-500">Claim not found.</div>
  }

  const isAssigned = claim.claimStatus === 'ASSIGNED'
  const isReviewed = ['RECOMMENDED_APPROVAL', 'RECOMMENDED_REJECTION', 'APPROVED', 'REJECTED'].includes(claim.claimStatus)
  const isBusy = reviewClaim.isPending || isSubmitting

  const submitReview = () => {
    if (!pendingPayload) return

    reviewClaim.mutate(
      {
        id,
        data: {
          recommended: pendingPayload.recommended,
          remarks: pendingPayload.remarks,
        },
      },
      {
        onSuccess: () => {
          showToast('Claim reviewed successfully.', 'success')
          setPendingRecommendation(null)
          setPendingPayload(null)
          navigate('/agent/claims')
        },
        onError: (err) => handleApiError(err, showToast),
      },
    )
  }

  const prepareRecommendation = (recommended) => {
    if (!isAssigned || isReviewed) return

    setValue('recommended', recommended)
    handleSubmit((formData) => {
      setPendingRecommendation(recommended ? 'approve' : 'reject')
      setPendingPayload(formData)
    })()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <BackButton />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Claim</h1>
          <p className="mt-1 text-gray-500">{claim.claimNumber}</p>
        </div>
        <StatusBadge status={claim.claimStatus} size="md" />
      </div>

      <ClaimDetailsView claim={claim} />

      {isReviewed && !isAssigned && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          This claim has already been reviewed. The recommendation can no longer be edited.
        </div>
      )}

      <form className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <input type="hidden" {...register('recommended')} />

        <FormTextarea
          label="Remarks"
          name="remarks"
          required
          rows={4}
          maxLength={500}
          error={errors.remarks?.message}
          disabled={!isAssigned || isReviewed}
          {...register('remarks')}
        />

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/agent/claims')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => prepareRecommendation(true)}
            disabled={!isAssigned || isReviewed || isBusy}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            Recommend Approval
          </button>
          <button
            type="button"
            onClick={() => prepareRecommendation(false)}
            disabled={!isAssigned || isReviewed || isBusy}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            Recommend Rejection
          </button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={!!pendingRecommendation}
        title={pendingRecommendation === 'approve' ? 'Confirm recommendation' : 'Confirm rejection recommendation'}
        message={
          pendingRecommendation === 'approve'
            ? 'Submit this claim recommendation for approval?'
            : 'Submit this claim recommendation for rejection?'
        }
        confirmLabel={pendingRecommendation === 'approve' ? 'Recommend Approval' : 'Recommend Rejection'}
        variant={pendingRecommendation === 'approve' ? 'default' : 'danger'}
        onConfirm={submitReview}
        onCancel={() => {
          setPendingRecommendation(null)
          setPendingPayload(null)
        }}
        isLoading={isBusy}
      />
    </div>
  )
}

export default ReviewClaimPage