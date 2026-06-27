import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as customerApi from '../api/customerApi.js'
import { queryKeys } from '../utils/queryKeys.js'

export const useCustomers = (params) =>
  useQuery({
    queryKey: queryKeys.customers.list(params),
    queryFn: () => customerApi.getCustomers(params).then((r) => r.data),
  })

export const useCustomer = (id) =>
  useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customerApi.getCustomerById(id).then((r) => r.data),
    enabled: !!id,
  })

export const useMyProfile = () =>
  useQuery({
    queryKey: queryKeys.customers.me(),
    queryFn: () => customerApi.getMyProfile().then((r) => r.data),
    retry: false,
  })

export const useCreateProfile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => customerApi.createProfile(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.customers.me() }),
  })
}

export const useUpdateProfile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ customerId, data }) => customerApi.updateMyProfile(customerId, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.customers.me() }),
  })
}

export const useCustomerByUserId = (userId) =>
  useQuery({
    queryKey: ['customers', 'user', userId],
    queryFn: () => customerApi.getCustomerByUserId(userId).then((r) => r.data),
    enabled: !!userId,
  })
