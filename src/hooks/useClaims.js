import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as claimApi from '../api/claimApi.js'
import { queryKeys } from '../utils/queryKeys.js'

export const useClaims = (params) =>
  useQuery({
    queryKey: queryKeys.claims.list(params),
    queryFn: () => claimApi.getClaims(params).then((r) => r.data),
  })

export const useMyClaims = (params) =>
  useQuery({
    queryKey: queryKeys.claims.mine(params),
    queryFn: () => claimApi.getMyClaims(params).then((r) => r.data),
  })

export const useClaim = (id) =>
  useQuery({
    queryKey: queryKeys.claims.detail(id),
    queryFn: () => claimApi.getClaimById(id).then((r) => r.data),
    enabled: !!id,
  })

export const useRaiseClaim = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => claimApi.raiseClaim(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.claims.all() }),
  })
}

export const useReviewClaim = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => claimApi.reviewClaim(id, data).then((r) => r.data),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.claims.detail(id) })
      qc.invalidateQueries({ queryKey: queryKeys.claims.all() })
    },
  })
}

export const useApproveClaim = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, remarks }) => claimApi.approveClaim(id, remarks).then((r) => r.data),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.claims.detail(id) })
      qc.invalidateQueries({ queryKey: queryKeys.claims.all() })
    },
  })
}

export const useRejectClaim = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, remarks }) => claimApi.rejectClaim(id, remarks).then((r) => r.data),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.claims.detail(id) })
      qc.invalidateQueries({ queryKey: queryKeys.claims.all() })
    },
  })
}
