import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as policyApi from '../api/policyApi.js'
import { queryKeys } from '../utils/queryKeys.js'

export const usePolicies = (params) =>
  useQuery({
    queryKey: queryKeys.policies.list(params),
    queryFn: () => policyApi.getPolicies(params).then((r) => r.data),
  })

export const useMyPolicies = () =>
  useQuery({
    queryKey: queryKeys.policies.mine(),
    queryFn: () => policyApi.getMyPolicies().then((r) => r.data),
  })

export const usePolicy = (id) =>
  useQuery({
    queryKey: queryKeys.policies.detail(id),
    queryFn: () => policyApi.getPolicyById(id).then((r) => r.data),
    enabled: !!id,
  })

export const usePurchasePolicy = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (planId) => policyApi.purchasePolicy(planId).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.policies.all() }),
  })
}

export const useIssuePolicy = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => policyApi.issuePolicy(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.policies.all() }),
  })
}

export const useCancelPolicy = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (policyId) => policyApi.cancelPolicy(policyId).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.policies.all() }),
  })
}
