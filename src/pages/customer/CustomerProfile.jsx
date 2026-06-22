import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { customerProfileSchema } from '../../utils/validators.js'
import { useMyProfile, useCreateProfile, useUpdateProfile } from '../../hooks/useCustomers.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import FormInput from '../../components/common/FormInput.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import BackButton from '../../components/common/BackButton.jsx'

function CustomerProfile() {
  const { showToast } = useToast()
  const { data, isLoading, isError } = useMyProfile()
  const createProfile = useCreateProfile()
  const updateProfile = useUpdateProfile()
  const [editing, setEditing] = useState(false)

  const profile = data?.data ?? data ?? null
  console.log('profile', profile)
  const hasProfile = !!profile?.customerId

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: { nomineeName: '', nomineeRelation: '', dateOfBirth: '', address: '', city: '', state: '', pinCode: '' },
  })

  useEffect(() => {
    if (profile && hasProfile) {
      reset({
        nomineeName: profile.nomineeName ?? '',
        nomineeRelation: profile.nomineeRelation ?? '',
        dateOfBirth: profile.dateOfBirth ?? '',
        address: profile.address ?? '',
        city: profile.city ?? '',
        state: profile.state ?? '',
        pinCode: profile.pinCode ?? '',
      })
    }
  }, [profile, hasProfile, reset])

  function onSubmit(formData) {
    const mutation = hasProfile
      ? updateProfile.mutate({ customerId: profile.customerId, data: formData }, {
          onSuccess: () => { showToast('Profile updated.', 'success'); setEditing(false) },
          onError: (err) => handleApiError(err, showToast),
        })
      : createProfile.mutate(formData, {
          onSuccess: () => { showToast('Profile created.', 'success'); setEditing(false) },
          onError: (err) => handleApiError(err, showToast),
        })
    return mutation
  }

  const isBusy = createProfile.isPending || updateProfile.isPending

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  const showForm = !hasProfile || editing

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <BackButton />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {hasProfile && !editing && (
          <button onClick={() => setEditing(true)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Edit</button>
        )}
      </div>

      {hasProfile && !editing && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['Full Name', profile.fullName],
              ['City', profile.city],
              ['State', profile.state],
              ['Nominee', profile.nomineeName],
              ['Date of Birth', profile.dateOfBirth],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-medium text-gray-500 uppercase">{label}</dt>
                <dd className="mt-1 text-sm text-gray-900">{value ?? '—'}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">{hasProfile ? 'Edit Profile' : 'Complete Your Profile'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Nominee Name" name="nomineeName" required error={errors.nomineeName?.message} {...register('nomineeName')} />
            <FormInput label="Nominee Relation" name="nomineeRelation" required error={errors.nomineeRelation?.message} {...register('nomineeRelation')} />
          </div>
          <FormInput label="Date of Birth" name="dateOfBirth" type="date" required error={errors.dateOfBirth?.message} {...register('dateOfBirth')} />
          <FormInput label="Address" name="address" required error={errors.address?.message} {...register('address')} />
          <div className="grid grid-cols-3 gap-4">
            <FormInput label="City" name="city" required error={errors.city?.message} {...register('city')} />
            <FormInput label="State" name="state" required error={errors.state?.message} {...register('state')} />
            <FormInput label="Pin Code" name="pinCode" required error={errors.pinCode?.message} {...register('pinCode')} />
          </div>
          <div className="flex justify-end gap-3">
            {editing && <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>}
            <button type="submit" disabled={isBusy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {isBusy ? 'Saving…' : hasProfile ? 'Update Profile' : 'Create Profile'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CustomerProfile
