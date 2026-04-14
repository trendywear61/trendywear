export const generateUPIString = (orderId, amount, upiId = import.meta.env.VITE_UPI_ID, businessName = import.meta.env.VITE_BUSINESS_NAME) => {
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessName)}&am=${amount}&cu=INR&tn=Order_${orderId}`;
};
