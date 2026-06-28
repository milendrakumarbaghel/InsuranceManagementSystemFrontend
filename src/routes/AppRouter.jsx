// import { Navigate, Route, Routes } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext.jsx'
// import ProtectedRoute from './ProtectedRoute.jsx'
// import AppLayout from '../components/layout/AppLayout.jsx'

// // Auth pages
// import LoginPage from '../pages/auth/LoginPage.jsx'
// import RegisterPage from '../pages/auth/RegisterPage.jsx'
// import OtpVerificationPage from '../pages/auth/OtpVerificationPage.jsx'
// import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
// import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx'

// // Shared pages
// import LandingPage from '../pages/LandingPage.jsx'
// import UnauthorizedPage from '../pages/shared/UnauthorizedPage.jsx'
// import NotFoundPage from '../pages/shared/NotFoundPage.jsx'

// // Admin pages
// import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
// import ProductListPage from '../pages/admin/ProductListPage.jsx'
// import ProductFormPage from '../pages/admin/ProductFormPage.jsx'
// import PlanListPage from '../pages/admin/PlanListPage.jsx'
// import PlanFormPage from '../pages/admin/PlanFormPage.jsx'
// import UserListPage from '../pages/admin/UserListPage.jsx'
// import CreateAgentPage from '../pages/admin/CreateAgentPage.jsx'
// import AdminPolicyListPage from '../pages/admin/AdminPolicyListPage.jsx'
// import AdminClaimListPage from '../pages/admin/AdminClaimListPage.jsx'
// import ClaimDecisionPage from '../pages/admin/ClaimDecisionPage.jsx'
// import AllPaymentsPage from '../pages/admin/AllPaymentsPage.jsx'
// import CustomersDetailPage from "../pages/admin/CustomerDetailPage";

// // Customer pages
// import CustomerDashboard from '../pages/customer/CustomerDashboard.jsx'
// import CustomerProfile from '../pages/customer/CustomerProfile.jsx'
// import ProductsListPage from '../pages/customer/ProductsListPage.jsx'
// import PlansPage from '../pages/customer/PlansPage.jsx'
// import PurchasePolicyPage from '../pages/customer/PurchasePolicyPage.jsx'
// import MyPoliciesPage from '../pages/customer/MyPoliciesPage.jsx'
// import PolicyDetailPage from '../pages/customer/PolicyDetailPage.jsx'
// import MakePaymentPage from '../pages/customer/MakePaymentPage.jsx'
// import MyPaymentsPage from '../pages/customer/MyPaymentsPage.jsx'
// import MyClaimsPage from '../pages/customer/MyClaimsPage.jsx'
// import RaiseClaimPage from '../pages/customer/RaiseClaimPage.jsx'
// import ClaimDetailPage from '../pages/customer/ClaimDetailPage.jsx'

// // Agent pages
// import AgentDashboard from '../pages/agent/AgentDashboard.jsx'
// import CustomerListPage from '../pages/agent/CustomerListPage.jsx'
// import CustomerDetailPage from '../pages/agent/CustomerDetailPage.jsx'
// import IssuePolicyPage from '../pages/agent/IssuePolicyPage.jsx'
// import AgentPolicyListPage from '../pages/agent/AgentPolicyListPage.jsx'
// import AgentPaymentListPage from '../pages/agent/AgentPaymentListPage.jsx'
// import AgentClaimQueuePage from '../pages/agent/AgentClaimQueuePage.jsx'
// import ReviewClaimPage from '../pages/agent/ReviewClaimPage.jsx'

// function RoleRedirect() {
//   const { isLoading, isAuthenticated, user } = useAuth()
//   if (isLoading) return null
//   if (!isAuthenticated) return <Navigate to="/login" replace />
//   const map = { CUSTOMER: '/customer/dashboard', AGENT: '/agent/dashboard', ADMIN: '/admin/dashboard' }
//   return <Navigate to={map[user?.role] ?? '/login'} replace />
// }

// function AppRouter() {
//   return (
//     <Routes>
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/home" element={<RoleRedirect />} />

//       {/* Public */}
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />
//       <Route path="/verify-otp" element={<OtpVerificationPage />} />
//       <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//       <Route path="/reset-password" element={<ResetPasswordPage />} />
//       <Route path="/unauthorized" element={<UnauthorizedPage />} />

//       {/* Customer */}
//       <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
//         <Route element={<AppLayout />}>
//           <Route path="/customer/dashboard" element={<CustomerDashboard />} />
//           <Route path="/customer/profile" element={<CustomerProfile />} />
//           <Route path="/customer/products" element={<ProductsListPage />} />
//           <Route path="/customer/products/:id/plans" element={<PlansPage />} />
//           <Route path="/customer/policies/purchase/:planId" element={<PurchasePolicyPage />} />
//           <Route path="/customer/policies" element={<MyPoliciesPage />} />
//           <Route path="/customer/policies/:id" element={<PolicyDetailPage />} />
//           <Route path="/customer/policies/:id/pay" element={<MakePaymentPage />} />
//           <Route path="/customer/claims" element={<MyClaimsPage />} />
//           <Route path="/customer/claims/raise/:policyId" element={<RaiseClaimPage />} />
//           <Route path="/customer/claims/:id" element={<ClaimDetailPage />} />
//           <Route path="/customer/payments" element={<MyPaymentsPage />} />
//         </Route>
//       </Route>

//       {/* Agent */}
//       <Route element={<ProtectedRoute allowedRoles={['AGENT']} />}>
//         <Route element={<AppLayout />}>
//           <Route path="/agent/dashboard" element={<AgentDashboard />} />
//           <Route path="/agent/customers" element={<CustomerListPage />} />
//           <Route path="/agent/customers/:id" element={<CustomerDetailPage />} />
//           <Route path="/agent/policies/issue" element={<IssuePolicyPage />} />
//           <Route path="/agent/policies" element={<AgentPolicyListPage />} />
//           <Route path="/agent/payments" element={<AgentPaymentListPage />} />
//           <Route path="/agent/claims" element={<AgentClaimQueuePage />} />
//           <Route path="/agent/claims/:id/review" element={<ReviewClaimPage />} />
//         </Route>
//       </Route>

//       {/* Admin */}
//       <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
//         <Route element={<AppLayout />}>
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           <Route path="/admin/users" element={<UserListPage />} />
//           <Route path="/admin/users/create-agent" element={<CreateAgentPage />} />
//           <Route path="/admin/products" element={<ProductListPage />} />
//           <Route path="/admin/products/new" element={<ProductFormPage />} />
//           <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
//           <Route path="/admin/plans" element={<PlanListPage />} />
//           <Route path="/admin/plans/new" element={<PlanFormPage />} />
//           <Route path="/admin/plans/:id/edit" element={<PlanFormPage />} />
//           <Route path="/admin/policies" element={<AdminPolicyListPage />} />
//           <Route path="/admin/claims" element={<AdminClaimListPage />} />
//           <Route path="/admin/claims/:id/decide" element={<ClaimDecisionPage />} />
//           <Route path="/admin/payments" element={<AllPaymentsPage />} />
//           <Route path="/admin/customers/:id" element={<CustomersDetailPage />} />   
//          </Route>
//       </Route>

//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   )
// }

// export default AppRouter
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import AppLayout from '../components/layout/AppLayout.jsx'

// Auth pages
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import OtpVerificationPage from '../pages/auth/OtpVerificationPage.jsx'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx'

// Shared pages
import LandingPage from '../pages/LandingPage.jsx'
import UnauthorizedPage from '../pages/shared/UnauthorizedPage.jsx'
import NotFoundPage from '../pages/shared/NotFoundPage.jsx'

// --- UNIFIED SHARED COMPONENTS ---
import SharedCustomerDetailPage from '../pages/shared/SharedCustomerDetailPage.jsx'
import SharedPolicyListPage from '../pages/shared/SharedPolicyListPage.jsx'
import SharedClaimListPage from '../pages/shared/SharedClaimListPage.jsx'

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import ProductListPage from '../pages/admin/ProductListPage.jsx'
import ProductFormPage from '../pages/admin/ProductFormPage.jsx'
import PlanListPage from '../pages/admin/PlanListPage.jsx'
import PlanFormPage from '../pages/admin/PlanFormPage.jsx'
import UserListPage from '../pages/admin/UserListPage.jsx'
import CreateAgentPage from '../pages/admin/CreateAgentPage.jsx'
import ClaimDecisionPage from '../pages/admin/ClaimDecisionPage.jsx'
import AllPaymentsPage from '../pages/admin/AllPaymentsPage.jsx'

// Customer pages
import CustomerDashboard from '../pages/customer/CustomerDashboard.jsx'
import CustomerProfile from '../pages/customer/CustomerProfile.jsx'
import ProductsListPage from '../pages/customer/ProductsListPage.jsx'
import PlansPage from '../pages/customer/PlansPage.jsx'
import PurchasePolicyPage from '../pages/customer/PurchasePolicyPage.jsx'
import MyPoliciesPage from '../pages/customer/MyPoliciesPage.jsx'
import PolicyDetailPage from '../pages/customer/PolicyDetailPage.jsx'
import MakePaymentPage from '../pages/customer/MakePaymentPage.jsx'
import MyPaymentsPage from '../pages/customer/MyPaymentsPage.jsx'
import MyClaimsPage from '../pages/customer/MyClaimsPage.jsx'
import RaiseClaimPage from '../pages/customer/RaiseClaimPage.jsx'
import ClaimDetailPage from '../pages/customer/ClaimDetailPage.jsx'

// Agent pages
import AgentDashboard from '../pages/agent/AgentDashboard.jsx'
import CustomerListPage from '../pages/agent/CustomerListPage.jsx'
import IssuePolicyPage from '../pages/agent/IssuePolicyPage.jsx'
import AgentPaymentListPage from '../pages/agent/AgentPaymentListPage.jsx'
import ReviewClaimPage from '../pages/agent/ReviewClaimPage.jsx'


function RoleRedirect() {
  const { isLoading, isAuthenticated, user } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const map = { CUSTOMER: '/customer/dashboard', AGENT: '/agent/dashboard', ADMIN: '/admin/dashboard' }
  return <Navigate to={map[user?.role] ?? '/login'} replace />
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<RoleRedirect />} />

      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OtpVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Customer */}
      <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
        <Route element={<AppLayout />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route path="/customer/products" element={<ProductsListPage />} />
          <Route path="/customer/products/:id/plans" element={<PlansPage />} />
          <Route path="/customer/policies/purchase/:planId" element={<PurchasePolicyPage />} />
          <Route path="/customer/policies" element={<MyPoliciesPage />} />
          <Route path="/customer/policies/:id" element={<PolicyDetailPage />} />
          <Route path="/customer/policies/:id/pay" element={<MakePaymentPage />} />
          <Route path="/customer/claims" element={<MyClaimsPage />} />
          <Route path="/customer/claims/raise/:policyId" element={<RaiseClaimPage />} />
          <Route path="/customer/claims/:id" element={<ClaimDetailPage />} />
          <Route path="/customer/payments" element={<MyPaymentsPage />} />
        </Route>
      </Route>

      {/* Agent */}
      <Route element={<ProtectedRoute allowedRoles={['AGENT']} />}>
        <Route element={<AppLayout />}>
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/customers" element={<CustomerListPage />} />
          <Route path="/agent/customers/:id" element={<SharedCustomerDetailPage idType="customerId" />} />
          <Route path="/agent/policies/issue" element={<IssuePolicyPage />} />
          <Route path="/agent/policies" element={<SharedPolicyListPage />} />
          <Route path="/agent/payments" element={<AgentPaymentListPage />} />
          <Route path="/agent/claims" element={<SharedClaimListPage />} />
          <Route path="/agent/claims/:id/review" element={<ReviewClaimPage />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/users/create-agent" element={<CreateAgentPage />} />
          <Route path="/admin/products" element={<ProductListPage />} />
          <Route path="/admin/products/new" element={<ProductFormPage />} />
          <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/admin/plans" element={<PlanListPage />} />
          <Route path="/admin/plans/new" element={<PlanFormPage />} />
          <Route path="/admin/plans/:id/edit" element={<PlanFormPage />} />
          <Route path="/admin/policies" element={<SharedPolicyListPage />} />
          <Route path="/admin/claims" element={<SharedClaimListPage />} />
          <Route path="/admin/claims/:id/decide" element={<ClaimDecisionPage />} />
          <Route path="/admin/payments" element={<AllPaymentsPage />} />
          <Route path="/admin/customers/:id" element={<SharedCustomerDetailPage idType="userId" />} />   
         </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRouter