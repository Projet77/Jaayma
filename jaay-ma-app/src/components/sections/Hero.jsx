import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary-200/50 rounded-full blur-3xl opacity-50 animate-float"></div>
            <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-secondary-200/50 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '1s' }}></div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Content */}
                    <div className="flex-1 text-center lg:text-left animate-slide-up">
                        <h1 className="text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 via-primary-500 to-secondary-500 mb-6 leading-tight">
                            Découvrez le futur <br /> du e-commerce
                        </h1>
                        <p className="text-lg text-surface-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                            Une expérience d'achat fluide, moderne et sécurisée pour vendre et acheter vos produits préférés en toute simplicité.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button size="lg" variant="primary">Explorer les offres</Button>
                            <Button size="lg" variant="outline">En savoir plus</Button>
                        </div>

                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-surface-500">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-surface-900">10k+</span>
                                <span className="text-sm">Produits</span>
                            </div>
                            <div className="w-px h-10 bg-surface-300"></div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-surface-900">5k+</span>
                                <span className="text-sm">Vendeurs</span>
                            </div>
                            <div className="w-px h-10 bg-surface-300"></div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-surface-900">4.9/5</span>
                                <span className="text-sm">Satisfaction</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual/Image Placeholder */}
                    <div className="flex-1 relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="relative z-10">
                            <Card className="w-full max-w-md mx-auto aspect-square flex items-center justify-center bg-white/40 border-white/50">
                                <div className="text-center p-8">
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-primary-500 to-secondary-400 rounded-2xl mb-6 shadow-neon"></div>
                                    <h3 className="text-xl font-bold text-surface-800 mb-2">Produit Vedette</h3>
                                    <p className="text-surface-500">Une présentation visuelle époustouflante de vos meilleurs articles.</p>
                                </div>
                            </Card>
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary-100 to-secondary-100 rounded-full blur-3xl -z-10"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
