export const generateWhatsAppMessage = (order) => {
    // Use the environment variable for WhatsApp number, default to placeholder if not set
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+910000000000';
    
    // Clean phone number (remove + and spaces for the link)
    const cleanNumber = phoneNumber.replace(/[\+\s]/g, '');

    if (!order) {
        return `https://wa.me/${cleanNumber}`;
    }

    const { customer, items, totalAmount, id } = order;

    // Formatting items list
    let formattedItems = items && Array.isArray(items) 
        ? items.map(item => `- ${item.name} x${item.qty}`).join('\n')
        : '';

    const message = `*✨ New Order at Trendy Wear ✨*
    
*Order ID:* ${id}
*Customer Name:* ${customer?.name || 'N/A'}

*🛒 Items:*
${formattedItems}

*💰 Total Amount:* ₹${totalAmount.toLocaleString()}

*📍 Delivery Address:*
${customer?.address || 'N/A'}
${customer?.city || 'N/A'} - ${customer?.pincode || 'N/A'}
Phone: ${customer?.phone || 'N/A'}

I am sharing my details/screenshot for confirmation.`;

    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};
