import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/url';

export const CartDrawer = () => {
    const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    const deliveryCharge = 50;
    const subtotal = getCartTotal();
    const total = subtotal + deliveryCharge;

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 px-4"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.5 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-[60] flex flex-col sm:rounded-l-[3rem] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900">Your Bag</h2>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in total
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsCartOpen(false)}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                        <svg className="w-16 h-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Your bag is empty</h3>
                                    <p className="text-slate-400 font-medium mb-8">Ready to find something amazing?</p>
                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsCartOpen(false)}
                                        className="btn-primary"
                                    >
                                        Start Shopping
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cartItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 50, scale: 0.9 }}
                                            className="group flex gap-6 p-6 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-[2rem] transition-all hover:shadow-xl hover:shadow-slate-200/50"
                                        >
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-slate-100 flex-shrink-0">
                                                <img
                                                    src={getImageUrl(item.images?.[0])}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                                                            {item.name}
                                                        </h3>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-slate-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <p className="text-xl font-black text-slate-900">
                                                        ₹{item.price.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center bg-white rounded-xl border border-slate-100 shadow-sm p-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-900"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                                                            </svg>
                                                        </button>
                                                        <span className="w-8 text-center font-black text-slate-900">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-900"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-400">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6 sm:rounded-bl-[3rem]">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                                        <span>Order Summary</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 font-medium">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 font-medium pb-4 border-b border-slate-200">
                                        <span>Delivery Charge</span>
                                        <span className="text-green-600 font-bold">₹{deliveryCharge}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-2xl font-black text-slate-900">Total</span>
                                        <span className="text-3xl font-black text-primary-600">₹{total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCheckout}
                                    className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-lg tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-primary-600 hover:shadow-primary-500/40 transition-all uppercase"
                                >
                                    Go to Checkout
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
