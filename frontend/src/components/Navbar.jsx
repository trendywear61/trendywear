import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
    const { getCartCount, toggleCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const cartCount = getCartCount();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'T-Shirts', path: '/products?category=T-shirts' },
        { name: 'Shirts', path: '/products?category=Shirts' },
        { name: 'Track Pants', path: '/products?category=Track Pants' },
        { name: 'Pants', path: '/products?category=Pants' },
        { name: 'All Products', path: '/products' },
    ];

    const isActiveLink = (link) => {
        if (link.path === '/') return location.pathname === '/';
        if (link.path === '/products' && !link.path.includes('category')) {
            return location.pathname === '/products' && !location.search;
        }
        return location.pathname + location.search === link.path;
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'py-0 bg-white/95 backdrop-blur-xl border-b border-beige-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]'
                : 'py-2 bg-white/80 backdrop-blur-sm'
                }`}
        >
            {/* Top announcement bar */}
            <div className="bg-charcoal-900 text-white text-center py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-body font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase truncate px-4">
                <span className="hidden sm:inline">Free Shipping on Orders Above ₹999 &nbsp;·&nbsp; Welcome to Trendy Wear</span>
                <span className="sm:hidden">Free Shipping Above ₹999</span>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
                        <div className="w-10 h-10 bg-charcoal-900 rounded-full overflow-hidden flex items-center justify-center">
                            <img src="/logo.png" alt="Trendy Wear" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-display text-xl font-bold text-charcoal-900 tracking-widest uppercase leading-none">
                                Trendy
                            </span>
                            <span className="font-display text-xl italic font-light text-beige-600 tracking-widest uppercase leading-none">
                                Wear
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative px-4 py-2 font-body text-[11px] font-bold tracking-widest uppercase transition-colors duration-200 ${isActiveLink(link)
                                    ? 'text-charcoal-900'
                                    : 'text-charcoal-400 hover:text-charcoal-900'
                                    }`}
                            >
                                {link.name}
                                {isActiveLink(link) && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute bottom-0 left-4 right-4 h-px bg-charcoal-900"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Search Desktop */}
                        <div className="hidden lg:block relative" ref={searchRef}>
                            <AnimatePresence>
                                {isSearchOpen ? (
                                    <motion.form
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 260, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        onSubmit={handleSearch}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center"
                                    >
                                        <input
                                            autoFocus
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search styles..."
                                            className="w-full bg-beige-50 border border-beige-300 py-2.5 pl-4 pr-10 text-sm font-body font-medium focus:border-charcoal-900 outline-none transition-all"
                                        />
                                        <button type="submit" className="absolute right-3 text-charcoal-400 hover:text-charcoal-900">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onClick={() => setIsSearchOpen(true)}
                                        className="p-2.5 text-charcoal-500 hover:text-charcoal-900 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User Profile / Login */}
                        <Link to={isAuthenticated ? "/profile" : "/login"}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="hidden sm:flex p-2.5 text-charcoal-500 hover:text-charcoal-900 transition-all items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {isAuthenticated && (
                                    <span className="text-[11px] font-body font-bold text-charcoal-900 uppercase tracking-widest hidden xl:block">
                                        {user?.firstName}
                                    </span>
                                )}
                            </motion.button>
                        </Link>

                        {/* Cart Button */}
                        <motion.button
                            onClick={() => navigate('/cart')}
                            className="relative p-2.5 text-charcoal-500 hover:text-charcoal-900 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute top-1 right-1 bg-charcoal-900 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2.5 text-charcoal-500 hover:text-charcoal-900 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-beige-100 shadow-xl overflow-hidden"
                    >
                        <div className="px-6 py-6 space-y-1">
                            <form onSubmit={handleSearch} className="relative mb-6">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search styles..."
                                    className="w-full bg-beige-50 border border-beige-200 py-3 pl-4 pr-12 text-sm font-body outline-none"
                                />
                                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </form>

                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`block px-4 py-3 font-body text-sm font-bold uppercase tracking-widest transition-all ${isActiveLink(link)
                                        ? 'text-charcoal-900 bg-beige-50'
                                        : 'text-charcoal-500'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <hr className="border-beige-100 my-4" />

                            <Link
                                to={isAuthenticated ? "/profile" : "/login"}
                                className="flex items-center space-x-3 px-4 py-3 text-charcoal-600 font-body font-bold text-sm uppercase tracking-widest"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{isAuthenticated ? `Hi, ${user?.firstName}` : "Sign In"}</span>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
