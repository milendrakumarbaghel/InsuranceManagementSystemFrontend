import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { planSchema } from '../../utils/validators.js'
import { usePlan, useCreatePlan, useUpdatePlan } from '../../hooks/usePlans.js'
import { useProducts } from '../../hooks/useProducts.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import FormInput from '../../components/common/FormInput.jsx'
import FormSelect from '../../components/common/FormSelect.jsx'
import FormTextarea from '../../components/common/FormTextarea.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import BackButton from '../../components/common/BackButton.jsx'

const PREMIUM_OPTIONS = [
  { value: '', label: '— Select type —' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'HALF_YEARLY', label: 'Half Yearly' },
  { value: 'ANNUAL', label: 'Annual' },
]

function PlanFormPage() {
  const { id } = useParams()
  const isEditMode = !!id
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data: planData, isLoading } = usePlan(id)
  const { data: productsData } = useProducts({ page: 0, size: 100 })
  const createPlan = useCreatePlan()
  const updatePlan = useUpdatePlan()

  const products = productsData?.data?.content ?? productsData?.content ?? []
  const productOptions = [
    { value: '', label: '— Select product —' },
    ...products.map((p) => ({ value: String(p.productId), label: p.productName })),
  ]

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: {
      productId: 0, planName: '', coverageAmount: 0, premiumAmount: 0,
      premiumType: '', duration: 1, termsAndConditions: '', active: true,
    },
  })

  useEffect(() => {
    if (isEditMode && planData) {
      const p = planData?.data ?? planData
      reset({
        productId: p.productId ?? 0,
        planName: p.planName ?? '',
        coverageAmount: p.coverageAmount ?? 0,
        premiumAmount: p.premiumAmount ?? 0,
        premiumType: p.premiumType ?? '',
        duration: p.duration ?? 1,
        termsAndConditions: p.termsAndConditions ?? '',
        active: p.active ?? true,
      })
    }
  }, [isEditMode, planData, reset])

  function onSubmit(data) {
    const payload = {
      ...data,
      productId: Number(data.productId),
      coverageAmount: Number(data.coverageAmount),
      premiumAmount: Number(data.premiumAmount),
      duration: Number(data.duration),
      active: data.active === true || data.active === 'true',
    }
    if (isEditMode) {
      updatePlan.mutate({ id, data: payload }, {
        onSuccess: () => { showToast('Plan updated.', 'success'); navigate('/admin/plans') },
        onError: (err) => handleApiError(err, showToast),
      })
    } else {
      createPlan.mutate(payload, {
        onSuccess: () => { showToast('Plan created.', 'success'); navigate('/admin/plans') },
        onError: (err) => handleApiError(err, showToast),
      })
    }
  }

  if (isEditMode && isLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  const isBusy = isSubmitting || createPlan.isPending || updatePlan.isPending

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Plan' : 'New Plan'}</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <FormSelect label="Product" name="productId" required options={productOptions} error={errors.productId?.message} {...register('productId', { valueAsNumber: true })} />
        <FormInput label="Plan Name" name="planName" required error={errors.planName?.message} {...register('planName')} />
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Coverage Amount (₹)" name="coverageAmount" type="number" required min="1" error={errors.coverageAmount?.message} {...register('coverageAmount', { valueAsNumber: true })} />
          <FormInput label="Premium Amount (₹)" name="premiumAmount" type="number" required min="1" error={errors.premiumAmount?.message} {...register('premiumAmount', { valueAsNumber: true })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect label="Premium Type" name="premiumType" required options={PREMIUM_OPTIONS} error={errors.premiumType?.message} {...register('premiumType')} />
          <FormInput label="Duration (months)" name="duration" type="number" required min="1" error={errors.duration?.message} {...register('duration', { valueAsNumber: true })} />
        </div>
        <FormTextarea label="Terms & Conditions" name="termsAndConditions" required rows={4} error={errors.termsAndConditions?.message} {...register('termsAndConditions')} />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register('active')} className="h-4 w-4 rounded border-gray-300" />
          Active
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate('/admin/plans')} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isBusy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {isBusy ? 'Saving…' : isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PlanFormPage
