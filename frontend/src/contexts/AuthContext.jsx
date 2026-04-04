import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if admin is logged in
        const adminToken = localStorage.getItem('adminToken');
        const adminData = localStorage.getItem('adminData');

        if (adminToken && adminData) {
            setAdmin(JSON.parse(adminData));
            setIsAdminAuthenticated(true);
        }

        // Check if user is logged in
        const userToken = localStorage.getItem('userToken');
        const userData = localStorage.getItem('userData');

        if (userToken && userData) {
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
        }

        setLoading(false);
    }, []);

    const adminLogin = (token, refreshToken, adminData) => {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminRefreshToken', refreshToken);
        localStorage.setItem('adminData', JSON.stringify(adminData));

        setAdmin(adminData);
        setIsAdminAuthenticated(true);
    };

    const adminLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('adminData');

        setAdmin(null);
        setIsAdminAuthenticated(false);
        navigate('/portal-secure-mgt/login');
    };

    const userLogin = (token, refreshToken, userData) => {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userRefreshToken', refreshToken);
        localStorage.setItem('userData', JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);
    };

    const userLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRefreshToken');
        localStorage.removeItem('userData');

        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    const updateUser = (newUserData) => {
        const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        const updatedUserData = { ...currentUserData, ...newUserData };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUser(updatedUserData);
    };

    const value = {      
        user,
        admin,
        isAuthenticated,
        isAdminAuthenticated,
        loading,
        login: adminLogin, // Keep 'login' for backward compatibility if needed, but prefer specific ones
        adminLogin,
        adminLogout,
        userLogin,
        userLogout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
