export const queryKeys = {
  products: {
    all: () => ['products'],
    list: (params) => ['products', 'list', params],
    detail: (id) => ['products', 'detail', id],
  },

  plans: {
    all: () => ['plans'],
    list: (params) => ['plans', 'list', params],
    byProduct: (productId, params) => ['plans', 'byProduct', productId, params],
    detail: (id) => ['plans', 'detail', id],
  },

  policies: {
    all: () => ['policies'],
    list: (params) => ['policies', 'list', params],
    mine: (params) => ['policies', 'mine', params],
    detail: (id) => ['policies', 'detail', id],
  },

  payments: {
    all: () => ['payments'],
    list: (params) => ['payments', 'list', params],
    byPolicy: (policyId, params) => ['payments', 'byPolicy', policyId, params],
  },

  claims: {
    all: () => ['claims'],
    list: (params) => ['claims', 'list', params],
    mine: (params) => ['claims', 'mine', params],
    detail: (id) => ['claims', 'detail', id],
    history: (claimId) => ['claims', 'history', claimId],
  },

  customers: {
    all: () => ['customers'],
    list: (params) => ['customers', 'list', params],
    detail: (id) => ['customers', 'detail', id],
    me: () => ['customers', 'me'],
  },

  me: {
    profile: () => ['me', 'profile'],
  },
}
