import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './contexts/AppContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { DashboardLayout } from './layout/DashboardLayout'

// Pages
import LandingPage from './pages/LandingPage'
import WalletPage from './pages/WalletPage'
import RoleSelectionPage from './pages/RoleSelectionPage'
import ErrorPages from './pages/ErrorPages'
import NotFoundPage from './pages/NotFoundPage'
import SettingsPage from './pages/SettingsPage'

// Manufacturer Pages
import ManufacturerDashboard from './pages/manufacturer/ManufacturerDashboard'
import AddPartPage from './pages/manufacturer/AddPartPage'
import AddedProductsPage from './pages/manufacturer/AddedProductsPage'
import LogsPage from './pages/manufacturer/LogsPage'

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard'
import VerifyPage from './pages/customer/VerifyPage'

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <div className="min-h-screen transition-colors duration-300">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/role-selection" element={<RoleSelectionPage />} />
              <Route path="/error/:errorType" element={<ErrorPages />} />

              {/* Manufacturer Dashboard Area */}
              <Route
                path="/manufacturer"
                element={
                  <DashboardLayout>
                    <ManufacturerDashboard />
                  </DashboardLayout>
                }
              />
              <Route
                path="/manufacturer/add"
                element={
                  <DashboardLayout>
                    <AddPartPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/manufacturer/products"
                element={
                  <DashboardLayout>
                    <AddedProductsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/manufacturer/logs"
                element={
                  <DashboardLayout>
                    <LogsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/manufacturer/settings"
                element={
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                }
              />

              {/* Customer Dashboard Area */}
              <Route
                path="/customer"
                element={
                  <DashboardLayout>
                    <CustomerDashboard />
                  </DashboardLayout>
                }
              />
              <Route
                path="/customer/verify"
                element={
                  <DashboardLayout>
                    <VerifyPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/customer/settings"
                element={
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                }
              />

              {/* Fallback 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}
