import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as paymentApi from '../api/paymentApi.js'
import { queryKeys } from '../utils/queryKeys.js'

export const usePayments = (params) =>
  useQuery({
    queryKey: queryKeys.payments.list(params),
    queryFn: () => paymentApi.getPayments(params).then((r) => r.data),
  })

export const usePaymentsByPolicy = (policyId) =>
  useQuery({
    queryKey: queryKeys.payments.byPolicy(policyId),
    queryFn: () => paymentApi.getPaymentsByPolicy(policyId).then((r) => r.data),
    enabled: !!policyId,
  })

export const useRecordPayment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => paymentApi.recordPayment(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.payments.all() })
      qc.invalidateQueries({ queryKey: queryKeys.policies.all() })
    },
  })
}
