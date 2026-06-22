import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema } from '../../utils/validators.js'
import { useProduct, useCreateProduct, useUpdateProduct } from '../../hooks/useProducts.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import FormInput from '../../components/common/FormInput.jsx'
import FormSelect from '../../components/common/FormSelect.jsx'
import FormTextarea from '../../components/common/FormTextarea.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import BackButton from '../../components/common/BackButton.jsx'

const PRODUCT_TYPE_OPTIONS = [
  { value: '', label: '— Select type —' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'MOTOR', label: 'Motor' },
  { value: 'LIFE', label: 'Life' },
  { value: 'TRAVEL', label: 'Travel' },
]

function ProductFormPage() {
  const { id } = useParams()
  const isEditMode = !!id
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data: productData, isLoading } = useProduct(id)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { productName: '', productType: '', description: '', active: true },
  })

  useEffect(() => {
    if (isEditMode && productData) {
      const p = productData?.data ?? productData
      reset({
        productName: p.productName ?? '',
        productType: p.productType ?? '',
        description: p.description ?? '',
        active: p.active ?? true,
      })
    }
  }, [isEditMode, productData, reset])

  function onSubmit(data) {
    const payload = { ...data, active: data.active === true || data.active === 'true' }
    if (isEditMode) {
      updateProduct.mutate({ id, data: payload }, {
        onSuccess: () => { showToast('Product updated.', 'success'); navigate('/admin/products') },
        onError: (err) => handleApiError(err, showToast),
      })
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => { showToast('Product created.', 'success'); navigate('/admin/products') },
        onError: (err) => handleApiError(err, showToast),
      })
    }
  }

  if (isEditMode && isLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  const isBusy = isSubmitting || createProduct.isPending || updateProduct.isPending

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Product' : 'New Product'}</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <FormInput label="Product Name" name="productName" required error={errors.productName?.message} {...register('productName')} />
        <FormSelect label="Product Type" name="productType" required options={PRODUCT_TYPE_OPTIONS} error={errors.productType?.message} {...register('productType')} />
        <FormTextarea label="Description" name="description" required rows={4} error={errors.description?.message} {...register('description')} />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register('active')} className="h-4 w-4 rounded border-gray-300" />
          Active
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate('/admin/products')} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isBusy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {isBusy ? 'Saving…' : isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductFormPage
