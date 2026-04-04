/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#faf9f7',
                    100: '#f5f3ef',
                    200: '#eae5dc',
                    300: '#d9d0c1',
                    400: '#c4b89e',
                    500: '#b09a7a',
                    600: '#8c7355',
                    700: '#6e5940',
                    800: '#4a3b2a',
                    900: '#2a1f15',
                },
                beige: {
                    50: '#fdfcfa',
                    100: '#faf7f2',
                    200: '#f5ede0',
                    300: '#ede0cc',
                    400: '#deca9e',
                    500: '#c9ab75',
                    600: '#a88550',
                    700: '#886640',
                    800: '#634931',
                    900: '#3d2c1e',
                },
                charcoal: {
                    50: '#f4f4f4',
                    100: '#e8e8e8',
                    200: '#d0d0d0',
                    300: '#b0b0b0',
                    400: '#888888',
                    500: '#666666',
                    600: '#444444',
                    700: '#333333',
                    800: '#1f1f1f',
                    900: '#111111',
                },
                secondary: {
                    50: '#f9f9f9',
                    100: '#f0f0f0',
                    200: '#e0e0e0',
                    300: '#c8c8c8',
                    400: '#a8a8a8',
                    500: '#888888',
                    600: '#666666',
                    700: '#444444',
                    800: '#222222',
                    900: '#111111',
                }
            },
            fontFamily: {
                sans: ['"Cormorant Garamond"', '"Plus Jakarta Sans"', 'serif'],
                display: ['"Cormorant Garamond"', 'serif'],
                body: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-down': 'slideDown 0.4s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'bounce-slow': 'bounce 2s infinite',
                'marquee': 'marquee 30s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-33.333%)' },
                },
            },
            boxShadow: {
                'premium-btn': '0 10px 20px -10px rgba(0, 0, 0, 0.3)',
                'premium-btn-hover': '0 15px 25px -10px rgba(0, 0, 0, 0.4)',
                'premium-card': '0 4px 20px -4px rgba(0, 0, 0, 0.08)',
                'premium-card-hover': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
            },
        },
    },
    plugins: [],
}
