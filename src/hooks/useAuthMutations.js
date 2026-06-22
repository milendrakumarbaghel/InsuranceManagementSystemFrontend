import { useMutation } from '@tanstack/react-query'
import * as authApi from '../api/authApi.js'
import { useToast } from '../context/ToastContext.jsx'
import { handleApiError } from '../utils/handleApiError.js'

export const useLoginMutation = () => {
  const { showToast } = useToast()
  
  return useMutation({
    mutationFn: (payload) => authApi.login(payload).then((res) => res.data),
    onError: (error) => handleApiError(error, showToast)
  })
}

export const useRegisterMutation = () => {
  const { showToast } = useToast()
  
  return useMutation({
    mutationFn: (payload) => authApi.register(payload).then((res) => res.data),
    onError: (error) => handleApiError(error, showToast)
  })
}
