import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Star, Filter, Check, X } from 'lucide-react';
import { groceryItems, groceryCategories } from '../data/grocery';
import { useCart } from '../context/CartContext';

// Design Constants
const COLORS = {
    primaryGreen: '#4C8C6A',
    ctaLime: '#B6DE6F',
    pageBg: '#FFF6E8', // Harmony with Brand Cream
    border: '#E8D8C8',  // Brand Divider
    primaryText: '#1F3D2B', // Keeping Green for Grocery Identity
    secondaryText: '#8C7768', // Brand Muted
    mutedText: '#8C7768', // Brand Muted
    star: '#B65A2A', // Brand Primary (Rust) for stars? Or keep star color. Let's make stars slightly rust-tinted to match theme.
    white: '#FFFFFF'
};

const Grocery = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState(50);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const { addToCart } = useCart(); // Intentionally kept for future use even if lint warns

    const filteredItems = groceryItems.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen pt-24 pb-12 font-sans" style={{ backgroundColor: COLORS.pageBg, color: COLORS.primaryText }}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-8">

                {/* Header & Breadcrumbs (Simplified) */}
                <div className="mb-8 pl-1">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" style={{ color: COLORS.primaryText }}>Organic Grocery Market</h1>
                    <p className="text-lg" style={{ color: COLORS.secondaryText }}>Fresh, authentic ingredients delivered to your door.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 relative">

                    {/* Sticky Sidebar Filter */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-28 space-y-8 bg-white p-6 rounded-[20px] border" style={{ borderColor: COLORS.border }}>

                            {/* Filter Header */}
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Filter className="w-4 h-4" /> Filters
                                </h3>
                                <button className="text-sm font-medium hover:underline" style={{ color: COLORS.secondaryText }}>Clear</button>
                            </div>

                            {/* Categories */}
                            <div>
                                <h4 className="font-bold text-sm mb-4 uppercase tracking-wider" style={{ color: COLORS.secondaryText }}>Categories</h4>
                                <div className="space-y-3">
                                    {groceryCategories.map(category => (
                                        <label key={category} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategory === category ? 'bg-primary-green border-primary-green' : 'bg-white'}`}
                                                style={{ borderColor: selectedCategory === category ? COLORS.primaryGreen : COLORS.border, backgroundColor: selectedCategory === category ? COLORS.primaryGreen : 'transparent' }}>
                                                {selectedCategory === category && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="category"
                                                className="hidden"
                                                checked={selectedCategory === category}
                                                onChange={() => setSelectedCategory(category)}
                                            />
                                            <span className={`text-sm transition-colors ${selectedCategory === category ? 'font-bold' : 'font-medium'}`}
                                                style={{ color: selectedCategory === category ? COLORS.primaryGreen : COLORS.secondaryText }}>
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="font-bold text-sm mb-4 uppercase tracking-wider" style={{ color: COLORS.secondaryText }}>Price Range</h4>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4C8C6A]"
                                />
                                <div className="flex justify-between text-sm mt-2 font-medium" style={{ color: COLORS.secondaryText }}>
                                    <span>$0</span>
                                    <span>${priceRange}</span>
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div>
                                <h4 className="font-bold text-sm mb-4 uppercase tracking-wider" style={{ color: COLORS.secondaryText }}>Rating</h4>
                                <div className="space-y-2">
                                    {[5, 4, 3, 2].map(stars => (
                                        <div key={stars} className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < stars ? 'fill-current' : 'text-gray-200'}`}
                                                        style={{ color: i < stars ? COLORS.star : undefined }}
                                                        strokeWidth={0} />
                                                ))}
                                            </div>
                                            <span className="text-xs font-medium pt-0.5" style={{ color: COLORS.secondaryText }}>& Up</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">

                        {/* Toolbar: Search, Active Filters, Sort */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">

                            {/* Search */}
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: COLORS.mutedText }} />
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-full text-sm font-medium focus:outline-none focus:ring-2 transition-shadow"
                                    style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}`, color: COLORS.primaryText, '--tw-ring-color': COLORS.primaryGreen } as any}
                                />
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-bold border transition-colors hover:border-[#4C8C6A]"
                                style={{ color: COLORS.primaryText, borderColor: COLORS.border }}
                            >
                                <Filter className="w-4 h-4" /> Filters
                            </button>


                        </div>

                        {/* Active Filters (Mobile/Desktop) */}
                        {selectedCategory !== 'All' && (
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-all"
                                    style={{ backgroundColor: `${COLORS.primaryGreen}15`, color: COLORS.primaryGreen }}>
                                    {selectedCategory}
                                    <button onClick={() => setSelectedCategory('All')}><X className="w-3 h-3 ml-1" /></button>
                                </span>
                            </div>
                        )}

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group relative bg-white rounded-[20px] border p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                        style={{ borderColor: COLORS.border }}
                                    >
                                        <Link to={`/grocery/${item.id}`} className="block">
                                            {/* Image Area */}
                                            <div className="relative aspect-[4/3] mb-4 rounded-2xl overflow-hidden bg-[#F4F6F5] flex items-center justify-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className={`w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105 ${!item.inStock ? 'opacity-50 grayscale' : ''}`}
                                                />
                                                {item.isBestSeller && (
                                                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                                                        style={{ backgroundColor: COLORS.star, color: COLORS.primaryText }}>
                                                        Best Seller
                                                    </div>
                                                )}
                                                {!item.inStock && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                                                        <span className="bg-gray-900 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                                            Out of Stock
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-2">
                                                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: COLORS.mutedText }}>
                                                    {item.category.split(' ')[0]} {/* Simplified category display */}
                                                </p>
                                                <h3 className="font-bold text-lg leading-snug line-clamp-2 min-h-[3rem]" style={{ color: COLORS.primaryText }}>
                                                    {item.name}
                                                </h3>

                                                {/* Rating Placeholder */}
                                                <div className="flex gap-1 pb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className="w-3 h-3 fill-current"
                                                            style={{ color: i < 4 ? COLORS.star : COLORS.border }}
                                                            strokeWidth={0} />
                                                    ))}
                                                    <span className="text-xs ml-1" style={{ color: COLORS.mutedText }}>(24)</span>
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="flex items-center justify-between mt-4 pt-2 border-t border-dashed" style={{ borderColor: COLORS.border }}>

                                            <div className="flex flex-col">
                                                {/* Price Logic: Show discounted style if random condition or just standard */}
                                                <span className="text-xl font-bold" style={{ color: COLORS.primaryText }}>
                                                    {item.price || '$14.99'}
                                                </span>
                                                {/* Mock stricken price for visual effect since data doesn't have it yet */}
                                                {item.price && <span className="text-xs line-through" style={{ color: COLORS.mutedText }}>$18.50</span>}
                                            </div>

                                            <button
                                                disabled={!item.inStock}
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent navigation
                                                    item.inStock && addToCart({ ...item, quantity: 1 } as any);
                                                }}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${!item.inStock
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'hover:shadow-md active:scale-95'
                                                    }`}
                                                style={item.inStock ? { backgroundColor: COLORS.ctaLime, color: COLORS.primaryText } : {}}
                                            >
                                                <ShoppingBag className="w-4 h-4" />
                                                Add
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Footer / Pagination hint */}
                        <div className="mt-16 text-center">
                            <button className="px-8 py-3 rounded-full font-bold text-sm border hover:bg-white transition-colors"
                                style={{ borderColor: COLORS.border, color: COLORS.secondaryText }}>
                                Load More Products
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer Overlay */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="fixed inset-0 bg-black z-40 lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-80 bg-white z-50 p-6 shadow-2xl overflow-y-auto lg:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-xl flex items-center gap-2" style={{ color: COLORS.primaryText }}>
                                    Filters
                                </h3>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-6 h-6" style={{ color: COLORS.secondaryText }} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Categories */}
                                <div>
                                    <h4 className="font-bold text-sm mb-4 uppercase tracking-wider" style={{ color: COLORS.secondaryText }}>Categories</h4>
                                    <div className="space-y-3">
                                        {groceryCategories.map(category => (
                                            <label key={category} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategory === category ? 'bg-primary-green border-primary-green' : 'bg-white'}`}
                                                    style={{ borderColor: selectedCategory === category ? COLORS.primaryGreen : COLORS.border, backgroundColor: selectedCategory === category ? COLORS.primaryGreen : 'transparent' }}>
                                                    {selectedCategory === category && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="mobile-category"
                                                    className="hidden"
                                                    checked={selectedCategory === category}
                                                    onChange={() => setSelectedCategory(category)}
                                                />
                                                <span className={`text-sm transition-colors ${selectedCategory === category ? 'font-bold' : 'font-medium'}`}
                                                    style={{ color: selectedCategory === category ? COLORS.primaryGreen : COLORS.secondaryText }}>
                                                    {category}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h4 className="font-bold text-sm mb-4 uppercase tracking-wider" style={{ color: COLORS.secondaryText }}>Price Range</h4>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4C8C6A]"
                                    />
                                    <div className="flex justify-between text-sm mt-2 font-medium" style={{ color: COLORS.secondaryText }}>
                                        <span>$0</span>
                                        <span>${priceRange}</span>
                                    </div>
                                </div>

                                {/* Star Rating */}
                                <div>
                                    <h4 className="font-bold text-sm mb-4 uppercase tracking-wider" style={{ color: COLORS.secondaryText }}>Rating</h4>
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2].map(stars => (
                                            <div key={stars} className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < stars ? 'fill-current' : 'text-gray-200'}`}
                                                            style={{ color: i < stars ? COLORS.star : undefined }}
                                                            strokeWidth={0} />
                                                    ))}
                                                </div>
                                                <span className="text-xs font-medium pt-0.5" style={{ color: COLORS.secondaryText }}>& Up</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t" style={{ borderColor: COLORS.border }}>
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="w-full py-3 rounded-full font-bold text-white shadow-lg transition-transform active:scale-95"
                                    style={{ backgroundColor: COLORS.primaryGreen }}
                                >
                                    Show Results
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Grocery;
