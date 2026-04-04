import React from 'react';

export const WhatsAppButton = () => {
    // Standard whatsapp link
    const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '+910000000000'}?text=Hello%20Trendy%20Wear!`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
            aria-label="Contact us on WhatsApp"
        >
            <i className="fa-brands fa-whatsapp text-3xl"></i>
            <span className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm font-bold pointer-events-none">
                Chat with us
            </span>
        </a>
    );
};
