import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { productsAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';



export const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 600], [0, 200]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const productsRes = await productsAPI.getAll({ sort: 'newest' });
            setFeaturedProducts(productsRes.data.data.slice(0, 8));
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };



    const marqueeItems = ['T-Shirts', 'Shirts', 'Track Pants', 'Pants', 'Streetwear', 'Premium Basics', 'New Arrivals', 'Trendy Wear'];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-[#f5f3ef] pt-24">
                <motion.div
                    style={{ y: heroY }}
                    className="absolute inset-0 z-0 bg-white"
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center space-x-3 mb-8">
                                <div className="w-8 h-px bg-beige-500" />
                                <span className="font-body text-[10px] font-black uppercase tracking-[0.4em] text-beige-600">
                                    New Collection 2026
                                </span>
                            </div>

                            <h1 className="font-display text-7xl md:text-9xl font-bold text-charcoal-900 leading-none tracking-tight mb-8">
                                Dress
                                <br />
                                <span className="italic font-light text-beige-600">Your</span>
                                <br />
                                Story.
                            </h1>

                            <p className="font-body text-lg text-charcoal-500 font-medium max-w-md mb-12 leading-relaxed">
                                Curated fashion for the modern individual. From everyday tees to statement pieces — discover clothing that speaks your language.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-16">
                                <Link to="/products">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full sm:w-auto px-10 py-5 bg-charcoal-900 text-white font-body font-bold text-[11px] uppercase tracking-[0.3em] flex items-center justify-center space-x-3"
                                    >
                                        <span>Shop Now</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </motion.button>
                                </Link>
                                <Link to="/products">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full sm:w-auto px-10 py-5 bg-transparent border border-charcoal-300 text-charcoal-900 font-body font-bold text-[11px] uppercase tracking-[0.3em] hover:border-charcoal-900 transition-colors"
                                    >
                                        View Lookbook
                                    </motion.button>
                                </Link>
                            </div>


                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative hidden lg:block"
                        >
                            <div className="bg-charcoal-900 text-white p-12 rounded-3xl shadow-2xl">
                                <p className="font-body text-[12px] font-black uppercase tracking-[0.4em] text-beige-400 mb-6">Welcome to</p>
                                <h2 className="font-display text-6xl font-bold mb-8 italic">Trendy Wear</h2>
                                <p className="font-body text-charcoal-400 text-lg mb-10 italic">Premium Fashion Curated Just for You.</p>
                                <div className="bg-beige-100 p-8 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <p className="font-body text-[10px] font-black uppercase tracking-[0.3em] text-beige-600 mb-1">Free Delivery</p>
                                        <p className="font-display text-3xl font-bold text-charcoal-900">₹999+</p>
                                    </div>
                                    <div className="w-12 h-12 bg-charcoal-900 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                >
                    <span className="font-body text-[9px] font-black text-charcoal-400 uppercase tracking-[0.4em]">Scroll</span>
                    <div className="w-px h-10 bg-gradient-to-b from-charcoal-300 to-transparent" />
                </motion.div>
            </section>

            {/* Marquee Strip */}
            <div className="py-5 bg-charcoal-900 overflow-hidden">
                <div className="animate-marquee">
                    {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
                        <span key={i} className="inline-flex items-center space-x-6 mx-6">
                            <span className="font-display text-2xl italic font-light text-white/70 tracking-widest">{item}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-beige-500 flex-shrink-0" />
                        </span>
                    ))}
                </div>
            </div>

            {/* Featured Products */}
            <section className="py-28 bg-beige-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <span className="section-label">New Arrivals</span>
                            <h2 className="font-display text-5xl md:text-6xl font-bold text-charcoal-900 tracking-tight">
                                Fresh
                                <br />
                                <span className="italic font-light text-beige-600">Drops</span>
                            </h2>
                        </div>
                        <Link to="/products">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 border border-charcoal-900 text-charcoal-900 font-body font-bold text-[11px] uppercase tracking-widest hover:bg-charcoal-900 hover:text-white transition-all"
                            >
                                View All
                            </motion.button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <LoadingSkeleton key={i} type="product" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.08 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>


            {/* Newsletter CTA */}
            <section className="py-0">
                <div className="bg-charcoal-900 py-20 px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <span className="font-body text-[10px] font-black uppercase tracking-[0.4em] text-beige-500 mb-6 block">Exclusive Access</span>
                        <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Join the
                            <br />
                            <span className="italic font-light text-beige-400">Inner Circle</span>
                        </h2>
                        <p className="font-body text-charcoal-400 text-lg mb-10">
                            Get early access to drops, exclusive offers, and style tips delivered straight to your inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-grow bg-charcoal-800 border border-charcoal-700 text-white placeholder:text-charcoal-500 py-4 px-6 font-body text-sm focus:border-beige-400 outline-none transition-all"
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 bg-white text-charcoal-900 font-body font-bold text-[11px] uppercase tracking-widest hover:bg-beige-100 transition-colors"
                            >
                                Subscribe
                            </motion.button>
                        </form>
                        <p className="mt-4 font-body text-charcoal-500 text-xs">
                            No spam ever. Unsubscribe at any time.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
