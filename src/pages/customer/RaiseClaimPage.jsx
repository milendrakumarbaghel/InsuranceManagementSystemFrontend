import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { raiseClaimSchema } from '../../utils/validators.js'
import { useRaiseClaim } from '../../hooks/useClaims.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import FormInput from '../../components/common/FormInput.jsx'
import FormTextarea from '../../components/common/FormTextarea.jsx'
import * as claimApi from '../../api/claimApi.js'

function getSelectedFiles(documents = []) {
  return documents.map((doc) => doc.file?.[0]).filter(Boolean)
}

function normalizeDocumentName(name) {
  const normalized = String(name ?? 'document')
    .replace(/[^a-zA-Z0-9\s_().-]/g, '-')
    .trim()
    .slice(0, 150)

  return normalized.length >= 3 ? normalized : 'document'
}

function normalizeDocumentType(type) {
  return /^[a-zA-Z\s/-]{2,80}$/.test(type ?? '') ? type : 'Document'
}

function toTemporaryDocument(file) {
  const documentName = normalizeDocumentName(file.name)

  return {
    documentName,
    documentType: normalizeDocumentType(file.type),
    documentReference: `Pending upload for ${documentName}`,
  }
}

function RaiseClaimPage() {
  const { policyId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const raiseClaim = useRaiseClaim()
  const [isUploading, setIsUploading] = useState(false)

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(raiseClaimSchema),
    defaultValues: {
      policyId: Number(policyId),
      claimAmount: 0,
      claimReason: '',
      incidentDate: '',
      documents: [{ file: undefined }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'documents' })

  async function onSubmit(data) {
    const files = getSelectedFiles(data.documents)
    const payload = {
      ...data,
      policyId: Number(data.policyId),
      claimAmount: Number(data.claimAmount),
      documents: files.map(toTemporaryDocument),
    }

    setIsUploading(true)

    try {
      const createdClaimResponse = await raiseClaim.mutateAsync(payload)
      const createdClaim = createdClaimResponse?.data ?? createdClaimResponse
      const claimId = createdClaim?.claimId

      if (!claimId) {
        throw new Error('Claim was created, but claim id was not returned.')
      }

      await Promise.all(files.map((file) => claimApi.uploadClaimDocument(claimId, file)))

      const temporaryDocuments = createdClaim.documents ?? []
      await Promise.allSettled(
        temporaryDocuments
          .map((doc) => doc.claimDocumentId)
          .filter(Boolean)
          .map((documentId) => claimApi.deleteClaimDocument(documentId))
      )

      showToast('Claim submitted successfully!', 'success')
      navigate('/customer/claims')
    } catch (err) {
      if (err.response) {
        handleApiError(err, showToast)
      } else {
        showToast(err.message || 'Claim submission failed.', 'error')
      }
    } finally {
      setIsUploading(false)
    }
  }

  const isBusy = isSubmitting || raiseClaim.isPending || isUploading

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Raise Claim</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl border border-gray-200 p-6">
        <input type="hidden" {...register('policyId', { valueAsNumber: true })} />
        <FormInput label="Claim Amount (₹)" name="claimAmount" type="number" step="0.01" required error={errors.claimAmount?.message} {...register('claimAmount', { valueAsNumber: true })} />
        <FormTextarea label="Claim Reason" name="claimReason" required rows={3} error={errors.claimReason?.message} {...register('claimReason')} />
        <FormInput label="Incident Date" name="incidentDate" type="date" required error={errors.incidentDate?.message} {...register('incidentDate')} />

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Documents <span className="text-red-500">*</span></label>
            <button type="button" onClick={() => append({ file: undefined })}
              className="text-xs text-blue-600 hover:underline">+ Add Document</button>
          </div>
          {errors.documents && <p className="text-xs text-red-600 mb-2">{errors.documents.message}</p>}
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Document {index + 1}</span>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="text-xs text-red-500 hover:underline">Remove</button>
                )}
              </div>
              <FormInput label="Upload Document" name={`documents.${index}.file`} type="file" required error={errors.documents?.[index]?.file?.message} {...register(`documents.${index}.file`)} />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isBusy} className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50">
            {isBusy ? 'Submitting…' : 'Submit Claim'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RaiseClaimPage
