import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mainMenus, subMenus, menuItems, categoryImages } from '../data/menu';
import { useCart } from '../context/CartContext';
// import { Leaf, Flame, WheatOff } from 'lucide-react'; // Icons removed in redesign

const Menu = () => {
    const [activeMainMenu, setActiveMainMenu] = useState(mainMenus[0]);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
    const { addToCart } = useCart();

    // Get sub-categories for the active main menu
    const currentSubMenus = subMenus[activeMainMenu] || [];

    // Filter items based on active sub-menu (if selected)
    const filteredItems = activeSubMenu
        ? menuItems.filter(item => item.category === activeSubMenu && item.mainMenu === activeMainMenu)
        : [];

    return (
        <div className="min-h-screen bg-brand-cream font-serif text-brand-brown">

            {/* Editorial Header */}
            <div className="pt-16 pb-8 px-6 md:px-16 max-w-7xl mx-auto text-center md:text-left">
                <h1 className="text-5xl md:text-[56px] font-bold leading-tight mb-4 tracking-tight text-brand-secondary">
                    Our Menu
                </h1>
                <p className="text-brand-muted text-lg md:text-xl max-w-2xl font-light italic">
                    Fresh, authentic, and simple vegetarian dishes made with love.
                </p>
            </div>

            {/* Main Menu Tabs (Level 1) */}
            <div className="px-6 md:px-16 pb-8">
                <div className="flex space-x-8 border-b border-brand-divider w-full justify-center md:justify-start">
                    {mainMenus.map((menu) => (
                        <button
                            key={menu}
                            onClick={() => {
                                setActiveMainMenu(menu);
                                setActiveSubMenu(null); // Reset sub-menu on main menu change
                            }}
                            className={`
                        pb-4 text-lg font-medium transition-all duration-300 relative font-sans
                        ${activeMainMenu === menu
                                    ? 'text-brand-primary'
                                    : 'text-brand-muted hover:text-brand-primary'}
                    `}
                        >
                            {menu}
                            {activeMainMenu === menu && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Breadcrumb / Back Button (Level 2 Navigation) */}
            {activeSubMenu && (
                <div className="px-6 md:px-16 pb-6 max-w-[1400px] mx-auto">
                    <button
                        onClick={() => setActiveSubMenu(null)}
                        className="flex items-center text-brand-muted hover:text-brand-primary transition-colors font-sans"
                    >
                        ← Back to Categories
                    </button>
                    <h2 className="text-3xl font-bold mt-4 text-brand-secondary">{activeSubMenu}</h2>
                </div>
            )}

            {/* Content Area */}
            <div className="px-6 md:px-16 pb-20 max-w-[1400px] mx-auto">
                <AnimatePresence mode="wait">

                    {/* View 1: Directory Grid (Sub-Categories) */}
                    {!activeSubMenu && (
                        <motion.div
                            key="directory"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        >
                            {currentSubMenus.map((subMenu) => (
                                <motion.div
                                    key={subMenu}
                                    onClick={() => setActiveSubMenu(subMenu)}
                                    className="group cursor-pointer rounded-[20px] overflow-hidden relative aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-brand-secondary/20 group-hover:bg-brand-secondary/10 transition-colors z-10" />
                                    <img
                                        src={categoryImages[subMenu]}
                                        alt={subMenu}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.9] sepia-[0.2]"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <div className="bg-brand-cream/90 backdrop-blur-sm px-6 py-3 rounded-full border border-brand-divider text-brand-secondary font-bold text-lg shadow-sm">
                                            {subMenu}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {currentSubMenus.length === 0 && (
                                <div className="col-span-full text-center py-20 text-brand-muted">
                                    <p>Coming Soon</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* View 2: Items Grid (Specific Dishes) */}
                    {activeSubMenu && (
                        <motion.div
                            key="items"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8"
                        >
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-[20px] border border-brand-divider p-6 flex flex-col items-center text-center h-full hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 relative group"
                                >
                                    {/* Circular Image */}
                                    <div className="w-40 h-40 rounded-full overflow-hidden mb-6 shadow-md border-4 border-brand-cream group-hover:scale-105 transition-transform duration-500">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Badges */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                                        {item.isVegan && (
                                            <span className="bg-brand-green/10 text-brand-green text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border border-brand-green/20">Vegan</span>
                                        )}
                                        {item.isSpicy && (
                                            <span className="bg-red-50 text-red-600 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border border-red-100">Spicy</span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 font-serif text-brand-secondary">{item.name}</h3>
                                    <p className="text-brand-muted text-sm leading-relaxed mb-6 line-clamp-3 font-sans">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto w-full flex flex-col gap-2 md:flex-row items-center md:justify-between pt-4 border-t border-brand-divider/50">
                                        <span className="text-lg font-bold text-brand-primary">{item.price}</span>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="px-5 py-2 rounded-full bg-brand-primary text-white text-sm font-bold hover:bg-brand-secondary transition-all duration-300 shadow-md hover:shadow-lg w-full md:w-auto"
                                        >
                                            Add to Order
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredItems.length === 0 && (
                                <div className="col-span-full text-center py-20 text-brand-muted">
                                    <p>No items found in this category yet.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

        </div>
    );
};

export default Menu;
