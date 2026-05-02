import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Index from "./pages/Index"
import About from "./pages/About"
import Plans from "./pages/Plans"
import HowItWorks from "./pages/HowItWorks"
import Contact from "./pages/Contact"
import Blog from "./pages/Blog"
import Ranking from "./pages/Ranking"
import NotFound from "./pages/NotFound"
import Auth from "./pages/Auth"
import ResetPassword from "./pages/ResetPassword"
import Dashboard from "./pages/Dashboard"
import Invest from "./pages/dashboard/Invest"
import Deposit from "./pages/dashboard/Deposit"
import Withdraw from "./pages/dashboard/Withdraw"
import Transactions from "./pages/dashboard/Transactions"
import Referrals from "./pages/dashboard/Referrals"
import KYC from "./pages/dashboard/KYC"
import Profile from "./pages/dashboard/Profile"
import AdminDashboard from "./pages/admin/Dashboard"
import ManageUsers from "./pages/admin/Users"
import KYCApprovals from "./pages/admin/KYC"
import AdminTransactions from "./pages/admin/Transactions"
import { ProtectedRoute, AdminRoute } from "./components/layout/ProtectedRoute"
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/invest" element={
          <ProtectedRoute>
            <Invest />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/deposit" element={
          <ProtectedRoute>
            <Deposit />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/withdraw" element={
          <ProtectedRoute>
            <Withdraw />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/transactions" element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/referrals" element={
          <ProtectedRoute>
            <Referrals />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/kyc" element={
          <ProtectedRoute>
            <KYC />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        } />
        <Route path="/admin/kyc" element={
          <AdminRoute>
            <KYCApprovals />
          </AdminRoute>
        } />
        <Route path="/admin/transactions" element={
          <AdminRoute>
            <AdminTransactions />
          </AdminRoute>
        } />

        {/* Catch-all */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
