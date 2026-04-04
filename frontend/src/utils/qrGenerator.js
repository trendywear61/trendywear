export const generateUPIString = (orderId, amount) => {
    const upiId = 'daviddavid88687@okhdfcbank';
    const businessName = 'Trendy Wear';

    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessName)}&am=${amount}&cu=INR&tn=Order_${orderId}`;
};
