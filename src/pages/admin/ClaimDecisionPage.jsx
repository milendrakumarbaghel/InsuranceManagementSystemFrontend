import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useClaim, useApproveClaim, useRejectClaim } from '../../hooks/useClaims.js'
import { claimDecisionSchema } from '../../utils/validators.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'

import StatusBadge from '../../components/common/StatusBadge.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import BackButton from '../../components/common/BackButton.jsx'
import ClaimDetailsView from '../../components/common/ClaimDetailsView.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import FormTextarea from '../../components/common/FormTextarea.jsx'

function ClaimDecisionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data, isLoading } = useClaim(id)
  const approveClaim = useApproveClaim()
  const rejectClaim = useRejectClaim()
  const [pendingDecision, setPendingDecision] = useState(null)
  const [pendingPayload, setPendingPayload] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(claimDecisionSchema),
    defaultValues: { remarks: '' },
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

  const isDecidable = ['RECOMMENDED_APPROVAL', 'RECOMMENDED_REJECTION'].includes(claim.claimStatus)
  const isResolved = ['APPROVED', 'REJECTED'].includes(claim.claimStatus)
  const isBusy = approveClaim.isPending || rejectClaim.isPending || isSubmitting

  const openDecision = (decision) => {
    handleSubmit((formData) => {
      setPendingDecision(decision)
      setPendingPayload(formData)
    })()
  }

  const submitDecision = () => {
    if (!pendingDecision || !pendingPayload) return

    const mutation = pendingDecision === 'approve' ? approveClaim : rejectClaim
    mutation.mutate(
      { id, remarks: pendingPayload.remarks },
      {
        onSuccess: () => {
          showToast(`Claim ${pendingDecision === 'approve' ? 'approved' : 'rejected'}.`, 'success')
          setPendingDecision(null)
          setPendingPayload(null)
          navigate('/admin/claims')
        },
        onError: (err) => handleApiError(err, showToast),
      },
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <BackButton />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claim Decision</h1>
          <p className="mt-1 text-gray-500">{claim.claimNumber}</p>
        </div>
        <StatusBadge status={claim.claimStatus} size="md" />
      </div>

      <ClaimDetailsView claim={claim} />

      {isResolved && (
        <div
          className={`rounded-xl border p-4 text-sm font-medium ${
            claim.claimStatus === 'APPROVED'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          This claim has been {claim.claimStatus === 'APPROVED' ? 'approved' : 'rejected'}.
        </div>
      )}

      {isDecidable ? (
        <form className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="border-b pb-3 text-base font-semibold">Make Final Decision</h2>
          <FormTextarea
            label="Remarks"
            name="remarks"
            required
            rows={4}
            maxLength={500}
            error={errors.remarks?.message}
            {...register('remarks')}
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => openDecision('reject')}
              disabled={isBusy}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {rejectClaim.isPending && pendingDecision === 'reject' ? 'Rejecting...' : 'Reject'}
            </button>
            <button
              type="button"
              onClick={() => openDecision('approve')}
              disabled={isBusy}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {approveClaim.isPending && pendingDecision === 'approve' ? 'Approving...' : 'Approve'}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          Final decision is available after an agent recommendation is submitted.
        </div>
      )}

      <ConfirmDialog
        isOpen={!!pendingDecision}
        title={pendingDecision === 'approve' ? 'Confirm approval' : 'Confirm rejection'}
        message={
          pendingDecision === 'approve'
            ? 'Approve this claim and override the agent recommendation if necessary?'
            : 'Reject this claim and override the agent recommendation if necessary?'
        }
        confirmLabel={pendingDecision === 'approve' ? 'Approve' : 'Reject'}
        variant={pendingDecision === 'approve' ? 'default' : 'danger'}
        onConfirm={submitDecision}
        onCancel={() => {
          setPendingDecision(null)
          setPendingPayload(null)
        }}
        isLoading={isBusy}
      />
    </div>
  )
}

export default ClaimDecisionPage