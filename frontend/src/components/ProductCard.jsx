import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getImageUrl } from '../utils/url';

export const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product, 1);
    };

    const handleCardClick = () => {
        navigate(`/products/${product.id}`);
    };

    const imageUrl = getImageUrl(product.images?.[0]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative flex flex-col bg-white overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-16px_rgba(0,0,0,0.12)] border border-beige-100 h-full cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-beige-50">
                <motion.img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Stock Badges */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-2">
                    {product.stockQty === 0 ? (
                        <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-charcoal-900/90 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-body font-black uppercase tracking-widest text-red-100">
                            Out of Stock
                        </span>
                    ) : product.stockQty < 10 && (
                        <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-beige-600/90 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-body font-black uppercase tracking-widest">
                            Only {product.stockQty} Left
                        </span>
                    )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/90 backdrop-blur-sm text-charcoal-700 text-[8px] sm:text-[9px] font-body font-black uppercase tracking-widest border border-beige-100 uppercase">
                        {product.category}
                    </span>
                </div>

                {/* Quick Add Overlay - Hide on small mobile */}
                <div className="absolute inset-0 hidden sm:flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-all duration-400">
                    <div className="absolute inset-0 bg-charcoal-900/10" />
                    <motion.button
                        initial={{ y: 10 }}
                        whileHover={product.stockQty > 0 ? { scale: 1.02 } : {}}
                        whileTap={product.stockQty > 0 ? { scale: 0.98 } : {}}
                        className={`relative px-8 py-3.5 text-white font-body font-bold text-[10px] uppercase tracking-widest shadow-2xl transition-colors ${
                            product.stockQty === 0 
                                ? 'bg-gray-500 cursor-not-allowed text-gray-300' 
                                : 'bg-charcoal-900 hover:bg-charcoal-800'
                        }`}
                        onClick={handleAddToCart}
                        disabled={product.stockQty === 0}
                    >
                        {product.stockQty === 0 ? 'Unavailable' : '+ Add to Bag'}
                    </motion.button>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-5 flex flex-col flex-grow">
                <div className="mb-2 sm:mb-3">
                    <div className="flex items-start justify-between gap-1 sm:gap-2">
                        <h3 className="font-display text-sm sm:text-lg font-bold text-charcoal-900 leading-tight group-hover:text-beige-700 transition-colors duration-300 line-clamp-1">
                            {product.name}
                        </h3>
                        <div className="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0 mt-0.5">
                            <svg className="w-2.5 h-2.5 sm:w-3 h-3 text-beige-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-body text-[8px] sm:text-[9px] font-black text-charcoal-400">4.8</span>
                        </div>
                    </div>
                    <p className="font-body text-[10px] sm:text-xs text-charcoal-400 font-medium line-clamp-1 mt-0.5 sm:mt-1">
                        {product.description}
                    </p>
                </div>

                {/* Sizes - Hide on small mobile */}
                {product.sizes && product.sizes.length > 0 && (
                    <div className="hidden sm:flex flex-wrap gap-1.5 mb-4">
                        {product.sizes.map((size) => (
                            <span key={size} className="font-body text-[9px] font-black text-charcoal-400 border border-beige-200 px-2 py-0.5 uppercase">
                                {size}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto pt-2 sm:pt-4 border-t border-beige-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-display text-lg sm:text-2xl font-bold text-charcoal-900 tracking-tight">
                            ₹{product.price.toLocaleString()}
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ x: 3 }}
                        className="text-charcoal-400 hover:text-charcoal-900 transition-colors p-1"
                        onClick={handleCardClick}
                    >
                        <svg className="w-4 h-4 sm:w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};
