import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { getImageUrl } from '../utils/url';

export const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    const deliveryCharge = 50;
    const subtotal = getCartTotal();
    const total = subtotal + deliveryCharge;

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items List */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shopping Bag</h1>
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">
                                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready for checkout
                                </p>
                            </div>
                            <Link to="/products" className="text-primary-600 font-black hover:text-primary-700 transition-colors flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Continue Shopping</span>
                            </Link>
                        </div>

                        {cartItems.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3rem] p-20 text-center shadow-xl shadow-slate-200/50"
                            >
                                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <svg className="w-16 h-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4">Your bag is empty</h2>
                                <p className="text-slate-400 font-bold mb-10 text-lg">Looks like you haven't added anything yet.</p>
                                <Link to="/products" className="btn-primary px-12 py-5 inline-block">
                                    Browse Collection
                                </Link>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="group bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all flex flex-col sm:flex-row gap-8 items-center"
                                    >
                                        <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                            <img
                                                src={getImageUrl(item.images?.[0])}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary-600 transition-colors mb-2">
                                                {item.name}
                                            </h3>
                                            <p className="text-slate-400 font-bold mb-4">{item.category}</p>
                                            <p className="text-2xl font-black text-slate-900">₹{item.price.toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center space-x-6">
                                            <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 p-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-slate-900 shadow-sm transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="w-12 text-center text-xl font-black text-slate-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-slate-900 shadow-sm transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="text-right min-w-[120px]">
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Subtotal</p>
                                                <p className="text-xl font-black text-primary-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    {cartItems.length > 0 && (
                        <div className="w-full lg:w-[400px]">
                            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-900/40 sticky top-32">
                                <h2 className="text-2xl font-black mb-8">Summary</h2>

                                <div className="space-y-6">
                                    <div className="flex justify-between font-bold text-slate-400">
                                        <span>Subtotal</span>
                                        <span className="text-white">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-slate-400 pb-6 border-b border-white/10">
                                        <span>Delivery</span>
                                        <span className="text-green-400">₹{deliveryCharge}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-4">
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                            <p className="text-4xl font-black">₹{total.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="pt-10">
                                        <motion.button
                                            whileHover={{ y: -4, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleCheckout}
                                            className="w-full bg-white text-slate-900 py-6 rounded-2xl font-black text-xl tracking-widest hover:bg-primary-500 hover:text-white transition-all uppercase shadow-xl"
                                        >
                                            Checkout Now
                                        </motion.button>
                                        <p className="text-center text-slate-500 text-xs font-bold mt-6 flex items-center justify-center space-x-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Secure encrypted checkout</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
