import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productsAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = ['T-shirts', 'Shirts', 'Track Pants', 'Pants'];

export const ProductListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState([]);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'newest',
    });

    useEffect(() => {
        const newFilters = {
            search: searchParams.get('search') || '',
            category: searchParams.get('category') || '',
            minPrice: searchParams.get('minPrice') || '',
            maxPrice: searchParams.get('maxPrice') || '',
            sort: searchParams.get('sort') || 'newest',
        };
        setFilters(newFilters);
        fetchProducts(newFilters);
    }, [searchParams]);

    const fetchProducts = async (currentFilters) => {
        setLoading(true);
        try {
            const params = {};
            if (currentFilters.search) params.search = currentFilters.search;
            if (currentFilters.category) params.category = currentFilters.category;
            if (currentFilters.minPrice) params.minPrice = currentFilters.minPrice;
            if (currentFilters.maxPrice) params.maxPrice = currentFilters.maxPrice;
            if (currentFilters.sort) params.sort = currentFilters.sort;

            const res = await productsAPI.getAll(params);
            setProducts(res.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const toggleSize = (size) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    const clearFilters = () => {
        setSearchParams({});
        setSelectedSizes([]);
    };

    const activeFilterCount = [
        filters.search,
        filters.category,
        filters.minPrice,
        filters.maxPrice,
        ...selectedSizes,
    ].filter(Boolean).length;

    // Filter products by size (client-side, since size is a product attribute)
    const displayedProducts = selectedSizes.length > 0
        ? products.filter((p) => {
            const availSizes = p.sizes || [];
            return selectedSizes.some((s) => availSizes.includes(s));
        })
        : products;

    const currentCategory = filters.category;

    return (
        <div className="min-h-screen bg-[#faf9f7] pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <span className="section-label">
                            {currentCategory ? currentCategory : 'All Products'}
                        </span>
                        <h1 className="font-display text-5xl md:text-7xl font-bold text-charcoal-900 tracking-tight leading-none">
                            {currentCategory ? (
                                <>
                                    {currentCategory.split(' ')[0]}
                                    {currentCategory.split(' ').length > 1 && (
                                        <>
                                            <br />
                                            <span className="italic font-light text-beige-600">
                                                {currentCategory.split(' ').slice(1).join(' ')}
                                            </span>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    The<br />
                                    <span className="italic font-light text-beige-600">Collection</span>
                                </>
                            )}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center space-x-2 px-5 py-3 border border-charcoal-200 font-body font-bold text-[11px] uppercase tracking-widest text-charcoal-700 relative"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span>Filter</span>
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-charcoal-900 text-white text-[9px] font-black flex items-center justify-center rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="appearance-none bg-white border border-charcoal-200 px-6 py-3 pr-10 font-body font-bold text-[11px] uppercase tracking-widest outline-none focus:border-charcoal-900 transition-all cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low → High</option>
                                <option value="price-high">Price: High → Low</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
                    {/* Filters Sidebar */}
                    <aside className={`lg:col-span-3 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        {/* Search */}
                        <div>
                            <h3 className="font-body text-[10px] font-black text-charcoal-900 uppercase tracking-[0.3em] mb-5">Search</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    placeholder="Search styles..."
                                    className="w-full bg-white border border-beige-200 py-3 pl-10 pr-4 font-body text-sm outline-none focus:border-charcoal-900 transition-all"
                                />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="font-body text-[10px] font-black text-charcoal-900 uppercase tracking-[0.3em] mb-5">Category</h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => handleFilterChange('category', '')}
                                    className={`w-full text-left px-4 py-3 font-body font-bold text-[11px] uppercase tracking-widest transition-all ${filters.category === ''
                                        ? 'bg-charcoal-900 text-white'
                                        : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-beige-50'
                                        }`}
                                >
                                    All Styles
                                </button>
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleFilterChange('category', cat)}
                                        className={`w-full text-left px-4 py-3 font-body font-bold text-[11px] uppercase tracking-widest transition-all ${filters.category === cat
                                            ? 'bg-charcoal-900 text-white'
                                            : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-beige-50'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div>
                            <h3 className="font-body text-[10px] font-black text-charcoal-900 uppercase tracking-[0.3em] mb-5">Size</h3>
                            <div className="flex flex-wrap gap-2">
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => toggleSize(size)}
                                        className={`w-10 h-10 border font-body font-bold text-[11px] uppercase transition-all duration-200 ${selectedSizes.includes(size)
                                            ? 'bg-charcoal-900 border-charcoal-900 text-white'
                                            : 'border-beige-300 text-charcoal-600 hover:border-charcoal-900 hover:text-charcoal-900'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="font-body text-[10px] font-black text-charcoal-900 uppercase tracking-[0.3em] mb-5">Price Range</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="font-body text-[9px] font-black text-charcoal-400 uppercase tracking-widest">Min (₹)</label>
                                    <input
                                        type="number"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-white border border-beige-200 py-2.5 px-3 font-body text-sm outline-none focus:border-charcoal-900 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-body text-[9px] font-black text-charcoal-400 uppercase tracking-widest">Max (₹)</label>
                                    <input
                                        type="number"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        placeholder="∞"
                                        className="w-full bg-white border border-beige-200 py-2.5 px-3 font-body text-sm outline-none focus:border-charcoal-900 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Price Quick Picks */}
                        <div>
                            <h3 className="font-body text-[10px] font-black text-charcoal-400 uppercase tracking-[0.3em] mb-3">Quick Price Filter</h3>
                            <div className="space-y-1">
                                {[
                                    { label: 'Under ₹500', min: '', max: '500' },
                                    { label: '₹500 – ₹1000', min: '500', max: '1000' },
                                    { label: '₹1000 – ₹2000', min: '1000', max: '2000' },
                                    { label: 'Above ₹2000', min: '2000', max: '' },
                                ].map((range) => (
                                    <button
                                        key={range.label}
                                        onClick={() => {
                                            handleFilterChange('minPrice', range.min);
                                            handleFilterChange('maxPrice', range.max);
                                        }}
                                        className="w-full text-left px-4 py-2.5 font-body text-xs text-charcoal-500 hover:text-charcoal-900 hover:bg-beige-50 transition-all"
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {activeFilterCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="w-full py-3 font-body text-[10px] font-black text-charcoal-400 hover:text-charcoal-900 uppercase tracking-[0.3em] border-t border-beige-100 pt-6 transition-colors"
                            >
                                Clear All Filters ({activeFilterCount})
                            </button>
                        )}
                    </aside>

                    {/* Product Grid */}
                    <main className="lg:col-span-9">
                        {/* Result count */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="font-body text-sm text-charcoal-400 font-medium">
                                {loading ? 'Loading...' : `${displayedProducts.length} styles found`}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                                >
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <LoadingSkeleton key={i} type="product" />
                                    ))}
                                </motion.div>
                            ) : displayedProducts.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center py-32 bg-white border border-beige-100"
                                >
                                    <div className="w-16 h-16 border-2 border-beige-200 flex items-center justify-center mb-6">
                                        <svg className="w-8 h-8 text-beige-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-display text-3xl font-bold text-charcoal-900 mb-2">No styles found</h3>
                                    <p className="font-body text-charcoal-400 font-medium mb-8">Try adjusting your filters</p>
                                    <button
                                        onClick={clearFilters}
                                        className="px-8 py-4 bg-charcoal-900 text-white font-body font-bold text-[11px] uppercase tracking-widest"
                                    >
                                        Clear Filters
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="grid"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                                >
                                    {displayedProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
};
