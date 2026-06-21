import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useNavigate } from 'react-router-dom'
import { raiseClaimSchema } from '../../utils/validators.js'
import { useRaiseClaim } from '../../hooks/useClaims.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import FormInput from '../../components/common/FormInput.jsx'
import FormTextarea from '../../components/common/FormTextarea.jsx'

function RaiseClaimPage() {
  const { policyId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const raiseClaim = useRaiseClaim()

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(raiseClaimSchema),
    defaultValues: {
      policyId: Number(policyId),
      claimAmount: 0,
      claimReason: '',
      incidentDate: '',
      documents: [{ documentName: '', documentType: '', documentReference: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'documents' })

  function onSubmit(data) {
    raiseClaim.mutate({ ...data, policyId: Number(data.policyId), claimAmount: Number(data.claimAmount) }, {
      onSuccess: () => {
        showToast('Claim submitted successfully!', 'success')
        navigate('/customer/claims')
      },
      onError: (err) => handleApiError(err, showToast),
    })
  }

  const isBusy = isSubmitting || raiseClaim.isPending

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
            <button type="button" onClick={() => append({ documentName: '', documentType: '', documentReference: '' })}
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
              <FormInput label="Document Name" name={`documents.${index}.documentName`} required error={errors.documents?.[index]?.documentName?.message} {...register(`documents.${index}.documentName`)} />
              <FormInput label="Document Type" name={`documents.${index}.documentType`} required placeholder="e.g. application/pdf" error={errors.documents?.[index]?.documentType?.message} {...register(`documents.${index}.documentType`)} />
              <FormInput label="Document URL / Reference" name={`documents.${index}.documentReference`} required placeholder="https://..." error={errors.documents?.[index]?.documentReference?.message} {...register(`documents.${index}.documentReference`)} />
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
