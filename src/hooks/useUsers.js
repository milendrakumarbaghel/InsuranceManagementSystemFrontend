import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as userApi from '../api/userApi.js'

export const useUsers = (params) =>
  useQuery({
    queryKey: ['users', 'list', params],
    queryFn: () => userApi.getUsers(params).then((r) => r.data),
  })

export const useCreateAgent = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => userApi.createAgent(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export const useToggleUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }) => userApi.toggleUser(id, active).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
