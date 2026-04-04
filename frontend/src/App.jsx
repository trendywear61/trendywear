import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProductManagement } from './pages/admin/ProductManagement';
import { OrderManagement } from './pages/admin/OrderManagement';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { UserProtectedRoute } from './components/UserProtectedRoute';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { CartPage } from './pages/CartPage';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#111111',
                                color: '#ffffff',
                                border: '1px solid #333333',
                                borderRadius: '0',
                                padding: '1rem 1.5rem',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.4)',
                            },
                        }}
                    />

                    <Routes>
                        {/* Admin Routes - Must come BEFORE customer routes */}
                        <Route path="/portal-secure-mgt/login" element={<AdminLogin />} />
                        <Route
                            path="/portal-secure-mgt/dashboard"
                            element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/portal-secure-mgt/products"
                            element={
                                <ProtectedRoute>
                                    <ProductManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/portal-secure-mgt/orders"
                            element={
                                <ProtectedRoute>
                                    <OrderManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/portal-secure-mgt" element={<Navigate to="/portal-secure-mgt/dashboard" replace />} />

                        {/* Customer Routes */}
                        <Route
                            path="/*"
                            element={
                                <>
                                    <Navbar />
                                    <CartDrawer />
                                    <div className="flex flex-col min-h-screen">
                                        <div className="flex-grow">
                                            <Routes>
                                                <Route path="/" element={<HomePage />} />
                                                <Route path="/products" element={<ProductListPage />} />
                                                <Route path="/products/:id" element={<ProductDetailPage />} />
                                                <Route path="/cart" element={<CartPage />} />
                                                <Route path="/checkout" element={<CheckoutPage />} />
                                                <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                                                <Route path="/login" element={<AuthPage />} />
                                                <Route
                                                    path="/profile"
                                                    element={
                                                        <UserProtectedRoute>
                                                            <ProfilePage />
                                                        </UserProtectedRoute>
                                                    }
                                                />
                                                <Route path="*" element={<Navigate to="/" replace />} />
                                            </Routes>
                                        </div>
                                        <Footer />
                                    </div>
                                </>
                            }
                        />
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
