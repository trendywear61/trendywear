import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, selectedSize = null) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id && item.selectedSize === selectedSize);

            // Determine available stock for the specific size if applicable
            const availableStock = (product.sizes && product.sizes.length > 0 && selectedSize)
                ? (product.sizes.find(s => s.size === selectedSize)?.quantity || 0)
                : product.stockQty;

            if (existingItem) {
                // Check if adding more would exceed stock
                const newQty = existingItem.quantity + quantity;
                if (newQty > availableStock) {
                    toast.error(`Only ${availableStock} items available in stock`);
                    return prevItems;
                }

                toast.success('Cart updated!');
                return prevItems.map((item) =>
                    (item.id === product.id && item.selectedSize === selectedSize)
                        ? { ...item, quantity: newQty }
                        : item
                );
            } else {
                if (quantity > availableStock) {
                    toast.error(`Only ${availableStock} items available in stock`);
                    return prevItems;
                }

                toast.success('Added to cart!');
                return [...prevItems, { ...product, quantity, selectedSize }];
            }
        });
    };

    const removeFromCart = (productId, selectedSize = null) => {
        setCartItems((prevItems) => prevItems.filter((item) => !(item.id === productId && item.selectedSize === selectedSize)));
        toast.success('Removed from cart');
    };

    const updateQuantity = (productId, quantity, selectedSize = null) => {
        if (quantity < 1) {
            removeFromCart(productId, selectedSize);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === productId && item.selectedSize === selectedSize) {
                    const availableStock = (item.sizes && item.sizes.length > 0 && item.selectedSize)
                        ? (item.sizes.find(s => s.size === item.selectedSize)?.quantity || 0)
                        : item.stockQty;

                    if (quantity > availableStock) {
                        toast.error(`Only ${availableStock} items available in stock`);
                        return item;
                    }
                    return { ...item, quantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
        toast.success('Cart cleared');
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        toggleCart,
        setIsCartOpen,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
