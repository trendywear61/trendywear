import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [productsRes, ordersRes] = await Promise.all([
                adminAPI.getAllProducts(),
                adminAPI.getAllOrders(),
            ]);

            const products = productsRes.data.data;
            const orders = ordersRes.data.data;

            setStats({
                totalProducts: products.length,
                activeProducts: products.filter(p => p.isActive).length,
                totalOrders: orders.length,
                pendingOrders: orders.filter(o => o.orderStatus === 'Pending').length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Products', value: stats.totalProducts, color: 'from-blue-500 to-blue-600', link: '/portal-secure-mgt/products' },
        { label: 'Active Products', value: stats.activeProducts, color: 'from-green-500 to-green-600', link: '/portal-secure-mgt/products' },
        { label: 'Total Orders', value: stats.totalOrders, color: 'from-purple-500 to-purple-600', link: '/portal-secure-mgt/orders' },
        { label: 'Pending Orders', value: stats.pendingOrders, color: 'from-orange-500 to-orange-600', link: '/portal-secure-mgt/orders?status=Pending' },
    ];

    return (
        <AdminLayout>
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="skeleton h-32 rounded-xl"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={stat.link}>
                                    <div className={`bg-gradient-to-br ${stat.color} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow`}>
                                        <p className="text-white/80 text-sm font-medium mb-2">{stat.label}</p>
                                        <p className="text-4xl font-bold">{stat.value}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link to="/portal-secure-mgt/products">
                                <button className="w-full btn-primary text-left">
                                    Manage Products
                                </button>
                            </Link>
                            <Link to="/portal-secure-mgt/orders">
                                <button className="w-full btn-secondary text-left">
                                    View Orders
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">System Info</h2>
                        <div className="space-y-2 text-gray-700">
                            <p><span className="font-semibold">Store:</span> My Store</p>
                            <p><span className="font-semibold">Version:</span> 1.0.0</p>
                            <p><span className="font-semibold">Status:</span> <span className="badge-success">Active</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};
