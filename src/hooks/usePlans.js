import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as planApi from '../api/planApi.js'
import { queryKeys } from '../utils/queryKeys.js'

export const usePlans = (params) =>
  useQuery({
    queryKey: queryKeys.plans.list(params),
    queryFn: () => planApi.getPlans(params).then((r) => r.data),
  })

export const usePlansByProduct = (productId) =>
  useQuery({
    queryKey: queryKeys.plans.byProduct(productId),
    queryFn: () => planApi.getPlansByProductId(productId).then((r) => r.data),
    enabled: !!productId,
  })

export const usePlan = (id) =>
  useQuery({
    queryKey: queryKeys.plans.detail(id),
    queryFn: () => planApi.getPlanById(id).then((r) => r.data),
    enabled: !!id,
  })

export const useCreatePlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => planApi.createPlan(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.plans.all() }),
  })
}

export const useUpdatePlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => planApi.updatePlan(id, data).then((r) => r.data),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.plans.all() })
      qc.invalidateQueries({ queryKey: queryKeys.plans.detail(id) })
    },
  })
}

export const useTogglePlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => planApi.deactivatePlan(id).then((r) => r.data),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.plans.all() })
      qc.invalidateQueries({ queryKey: queryKeys.plans.detail(id) })
    },
  })
}
