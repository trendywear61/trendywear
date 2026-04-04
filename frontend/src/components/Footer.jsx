import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Shop: [
            { name: 'All Products', path: '/products' },
            { name: 'T-Shirts', path: '/products?category=T-shirts' },
            { name: 'Shirts', path: '/products?category=Shirts' },
            { name: 'Track Pants', path: '/products?category=Track Pants' },
            { name: 'Pants', path: '/products?category=Pants' },
        ],
        Company: [
            { name: 'About Us', path: '#' },
        ],
        Support: [
            { name: 'Contact Us', path: '#' },
            { name: 'Shipping Info', path: '#' },
            { name: 'Returns & Exchanges', path: '#' },
        ]
    };

    return (
        <footer className="bg-charcoal-900 pt-20 pb-10 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16 pb-16 border-b border-charcoal-800">
                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        <Link to="/" className="flex items-center space-x-3 mb-8 group">
                            <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center">
                                <img src="/logo.png" alt="Trendy Wear" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="font-display text-xl font-bold text-white tracking-widest uppercase leading-none">
                                    Trendy
                                </span>
                                <span className="font-display text-xl italic font-light text-beige-400 tracking-widest uppercase leading-none">
                                    Wear
                                </span>
                            </div>
                        </Link>

                        <p className="font-body text-charcoal-400 font-medium leading-relaxed mb-8 max-w-xs text-sm">
                            Curated fashion for the modern individual. Discover styles that speak your language — from everyday basics to statement pieces.
                        </p>

                        <div className="flex flex-col space-y-3 mb-8">
                            <a href="mailto:trendywear61@gmail.com" className="font-body text-sm text-charcoal-400 hover:text-white transition-colors flex items-center gap-3">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>trendywear61@gmail.com</span>
                            </a>
                            <a href="https://chat.whatsapp.com/FWNFZSUDK52DjF8YOdu4L4?mode=gi_t" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-charcoal-400 hover:text-white transition-colors flex items-center gap-3">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                    <path d="M11.5 0C5.159 0 0 5.159 0 11.5c0 2.013.527 3.9 1.455 5.54L.02 23l6.107-1.401C7.69 22.484 9.556 23 11.5 23 17.841 23 23 17.841 23 11.5S17.841 0 11.5 0zm0 21.09c-1.88 0-3.63-.508-5.129-1.393l-.367-.219-3.808.873.89-3.72-.24-.383C1.979 14.79 1.41 13.18 1.41 11.5c0-5.566 4.524-10.09 10.09-10.09 5.565 0 10.09 4.524 10.09 10.09S17.065 21.09 11.5 21.09z" />
                                </svg>
                                <span>Join WhatsApp Group</span>
                            </a>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center space-x-3">
                            {[
                                { icon: 'instagram', url: 'https://www.instagram.com/trendy_wear_003?igsh=MW5oeGdiNDBqb3RnNw==', label: 'Instagram' },
                            ].map((social) => (
                                <motion.a
                                    key={social.icon}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3 }}
                                    className="w-10 h-10 border border-charcoal-700 flex items-center justify-center text-charcoal-400 hover:text-white hover:border-white transition-all duration-300"
                                >
                                    <i className={`fab fa-${social.icon} text-sm`} />
                                    <span className="sr-only">{social.label}</span>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="lg:col-span-2">
                            <h4 className="font-body font-black text-white uppercase tracking-widest text-[10px] mb-6">{title}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="font-body text-charcoal-400 hover:text-white font-medium transition-colors duration-200 text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter */}
                    <div className="lg:col-span-2">
                        <h4 className="font-body font-black text-white uppercase tracking-widest text-[10px] mb-6">Newsletter</h4>
                        <p className="font-body text-charcoal-400 text-sm font-medium mb-5 leading-relaxed">
                            Early access to new drops & exclusive member offers.
                        </p>
                        <form className="relative">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-charcoal-800 border border-charcoal-700 text-white py-3.5 px-4 font-body text-sm focus:border-beige-400 outline-none transition-all placeholder:text-charcoal-500"
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-2 w-full py-3 bg-white text-charcoal-900 font-body font-bold text-[10px] uppercase tracking-widest hover:bg-beige-100 transition-colors"
                            >
                                Subscribe
                            </motion.button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-body text-charcoal-500 text-[10px] font-bold tracking-widest uppercase">
                        © {currentYear} Trendy Wear. All Rights Reserved.
                    </p>
                    <div className="flex items-center space-x-6">
                        {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item) => (
                            <a key={item} href="#" className="font-body text-charcoal-500 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
