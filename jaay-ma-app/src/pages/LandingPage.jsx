
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { Button, Card } from '../components/ui/core';
import Footer from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';

const LandingPage = ({ setSelectedProduct, products = [] }) => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    // Bannières Pub
    const [banners, setBanners] = useState([]);
    useEffect(() => {
        fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/banners')
            .then(res => res.json())
            .then(data => setBanners(data))
            .catch(err => console.error("Erreur chargement des bannières:", err));
    }, []);

    // Extract unique categories
    const categories = [...new Set(products.map(p => p.category))];

    return (
        <div className="w-full overflow-hidden">
            {/* 1. HERO SECTION: Full Screen, Bold Typography */}
            <section className="relative h-screen w-full flex items-center justify-center bg-[#F4F2ED] overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 z-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                <motion.div style={{ y: y1 }} className="absolute px-4 text-[20vw] font-black text-white leading-none tracking-tighter mix-blend-difference pointer-events-none select-none z-10 w-full text-center">
                    JAAY-MA
                </motion.div>

                <div className="container mx-auto px-6 relative z-20 flex flex-col items-center text-center pt-20 md:pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 max-w-4xl"
                    >
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 md:p-12 rounded-3xl shadow-xl">
                            <h1 className="text-5xl md:text-8xl font-display font-medium text-black tracking-tight mb-8 leading-[1.1] md:leading-tight">
                                Le Futur du <br /> <span className="text-primary italic">Shopping</span>.
                            </h1>
                            <p className="text-lg md:text-xl text-black max-w-2xl mx-auto font-bold leading-relaxed tracking-wide">
                                Une expérience d'achat repensée. Plus fluide, plus rapide, plus immersif. Bienvenue sur la marketplace de nouvelle génération.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex gap-4"
                    >
                        <Button size="lg" className="rounded-full text-lg px-10" onClick={() => navigate('/shop')}>Explorer la collection</Button>
                        <Button variant="outline" size="lg" className="rounded-full text-lg px-8 backdrop-blur-sm">En savoir plus</Button>
                    </motion.div>
                </div>

                {/* Floating Elements (Products) */}
                <motion.div style={{ y: y2, x: 100 }} className="absolute right-[10%] top-[20%] w-64 h-80 rounded-2xl bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80')] bg-cover shadow-2xl rotate-6 hidden lg:block" />
                <motion.div style={{ y: y1, x: -100 }} className="absolute left-[10%] bottom-[20%] w-56 h-72 rounded-2xl bg-[url('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80')] bg-cover shadow-2xl -rotate-3 hidden lg:block" />
            </section>

            {/* SECTION PUBLICITE (Bannières Uploadées depuis l'Admin) */}
            {banners.length > 0 && (
                <section className="bg-white py-12">
                    <div className="container mx-auto px-6">
                        <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory no-scrollbar">
                            {banners.map(banner => (
                                <div key={banner.id} className="min-w-full md:min-w-[80%] lg:min-w-[60%] snap-center shrink-0 rounded-3xl overflow-hidden shadow-lg border border-neutral-100">
                                    <img src={banner.imageUrl} alt="Publicité" className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-700 hover:scale-105" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 2. TICKER: Infinite Brand Scroll */}
            <section className="py-12 border-y border-neutral-200 bg-white overflow-hidden">
                <div className="flex gap-16 animate-marquee whitespace-nowrap opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {['APPLE', 'SAMSUNG', 'NIKE', 'SONY', 'ADIDAS', 'DYSON', 'LG', 'CANON', 'BOSE', 'APPLE', 'SAMSUNG', 'NIKE', 'SONY'].map((brand, i) => (
                        <span key={i} className="text-4xl font-bold tracking-tighter text-neutral-300 font-display">{brand}</span>
                    ))}
                </div>
            </section>

            {/* 3. POPULAR / TRENDING (Moved to Top) */}
            <section className="py-24 bg-white border-b border-neutral-100">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-display font-medium text-black">Les Plus <span className="text-primary italic">Populaires</span>.</h2>
                            <p className="text-neutral-500 mt-2">Ce que tout le monde s'arrache en ce moment.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-full w-12 h-12 flex items-center justify-center p-0"><ArrowRight className="rotate-180 w-5 h-5" /></Button>
                            <Button variant="outline" className="rounded-full w-12 h-12 flex items-center justify-center p-0"><ArrowRight className="w-5 h-5" /></Button>
                        </div>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar">
                        {products.slice(0, 8).map((product, i) => ( // Showing top 8 for carousel feel
                            <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                                <Card
                                    className="hover:shadow-xl transition-all duration-500 group cursor-pointer h-full border border-neutral-100"
                                    onClick={() => { setSelectedProduct(product); navigate(`/product/${product.id}`); }}
                                >
                                    <div className="relative aspect-[4/5] bg-neutral-50 overflow-hidden rounded-t-xl mb-4">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                                        {/* Supprimé la numérotation ici selon la demande */}
                                    </div>
                                    <div className="px-2 pb-2">
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-1">{product.brand}</p>
                                                <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors truncate">{product.name}</h3>
                                            </div>
                                            <span className="font-bold text-sm bg-black text-white px-2 py-1 rounded shrink-0">{new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumSignificantDigits: 3 }).format(product.price)}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. NEW: ALL PRODUCTS CATEGORIZED (Alibaba Style) */}
            <section className="py-24 bg-neutral-50">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-medium">Notre <span className="text-neutral-400">Catalogue</span></h2>
                        <Button size="lg" className="rounded-full" onClick={() => navigate('/shop')}>Voir tout le catalogue</Button>
                    </div>

                    <div className="space-y-20">
                        {categories.map((category) => (
                            <div key={category}>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-px bg-neutral-200 flex-1"></div>
                                    <h3 className="text-2xl font-bold uppercase tracking-wider min-w-fit">{category}</h3>
                                    <div className="h-px bg-neutral-200 flex-1"></div>
                                    <Button variant="ghost" size="sm" className="whitespace-nowrap rounded-full" onClick={() => navigate('/shop')}>Voir plus</Button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {products.filter(p => p.category === category).slice(0, 4).map((product) => (
                                        <Card
                                            key={product.id}
                                            className="hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white border-0"
                                            onClick={() => { setSelectedProduct(product); navigate(`/product/${product.id}`); }}
                                        >
                                            <div className="relative aspect-square bg-[#F9F9F9] overflow-hidden rounded-t-lg mb-4">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
                                                {product.tag && (
                                                    <span className="absolute top-2 left-2 bg-black/5 text-black text-[10px] font-bold px-2 py-1 uppercase rounded-sm">
                                                        {product.tag}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="px-4 pb-4">
                                                <h4 className="font-semibold text-md mb-1 truncate">{product.name}</h4>
                                                <p className="text-neutral-500 text-sm mb-2">{product.brand}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-lg">{new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumSignificantDigits: 3 }).format(product.price)}</span>
                                                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                                        <ArrowRight className="w-4 h-4 -rotate-45" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. CURATED COLLECTIONS (Moved to Bottom) */}
            <section className="py-24 bg-white border-t border-neutral-100">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className="text-4xl md:text-5xl font-display font-medium">Collections <span className="text-neutral-400">Exclusives</span></h2>
                        <Button variant="ghost" className="hidden md:flex" onClick={() => navigate('/shop')}>Tout explorer <ArrowRight className="ml-2 w-4 h-4" /></Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px] md:h-[600px]">
                        {/* Large Item */}
                        <Card className="md:col-span-2 md:row-span-2 relative overflow-hidden group p-0 border-0 bg-black text-white">
                            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Tech" />
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-3xl font-bold mb-2">High Tech</h3>
                                <p className="text-neutral-300 mb-4">Les dernières innovations à portée de main.</p>
                                <Button variant="secondary" size="sm" className="rounded-full">Acheter</Button>
                            </div>
                        </Card>

                        {/* Tall Item */}
                        <Card className="md:col-span-1 md:row-span-2 relative overflow-hidden group p-0 border-0 bg-[#F4F4F5]">
                            <img src="https://images.unsplash.com/photo-1507680436348-1dc881270875?w=500&q=80" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700" alt="Fashion" />
                            <div className="absolute top-0 left-0 p-6">
                                <h3 className="text-2xl font-bold text-black">Mode Homme</h3>
                                <p className="text-sm font-medium text-neutral-500 mt-1">Nouvelle Saison</p>
                            </div>
                        </Card>

                        {/* Small Items */}
                        <Card className="md:col-span-1 bg-blue-50 border-0 flex flex-col justify-center items-center text-center p-8 group cursor-pointer hover:bg-blue-100 transition-colors">
                            <Zap className="w-10 h-10 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-blue-900">Ventes Flash</h3>
                            <p className="text-blue-700 text-sm">-50% ce soir</p>
                        </Card>
                        <Card className="md:col-span-1 bg-orange-50 border-0 flex flex-col justify-center items-center text-center p-8 group cursor-pointer hover:bg-orange-100 transition-colors">
                            <Star className="w-10 h-10 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-orange-900">Best Sellers</h3>
                            <p className="text-orange-700 text-sm">Validés par tous</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 4. VALUE PROPOSITION: Clean & Trust */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: <ShieldCheck />, title: "Garantie Totale", desc: "Chaque produit est vérifié. Satisfait ou remboursé. Sans question." },
                            { icon: <TrendingUp />, title: "Prix Équitables", desc: "Direct fournisseur. Pas d'intermédiaires inutiles. Juste le bon prix." },
                            { icon: <Zap />, title: "Livraison Éclair", desc: "Commandé avant 14h, livré le lendemain. Partout au Sénégal." }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6 text-black">
                                    {React.cloneElement(item.icon, { size: 32 })}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-neutral-500 leading-relaxed max-w-xs">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. FOOTER */}
            <Footer />
        </div>
    );
};

export default LandingPage;
