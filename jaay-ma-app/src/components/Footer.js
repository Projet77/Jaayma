
import React from 'react';
import { Icons } from '../icons';

const Footer = ({ setCurrentView }) => (
  <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Jaay-ma</h3>
              <p className="text-gray-400">Votre marché en ligne</p>
            </div>
          </div>
          <p className="text-gray-400 mb-4">
            La plateforme e-commerce numéro 1 au Sénégal, offrant des produits de qualité à des prix abordables.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Icons.Facebook />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Icons.Twitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Icons.Instagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Icons.WhatsApp />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Liens utiles</h4>
          <ul className="space-y-2">
            <li><button onClick={() => setCurrentView('home')} className="text-gray-400 hover:text-white transition-colors">Accueil</button></li>
            <li><button onClick={() => setCurrentView('categories')} className="text-gray-400 hover:text-white transition-colors">Catégories</button></li>
            <li><button onClick={() => setCurrentView('deals')} className="text-gray-400 hover:text-white transition-colors">Promotions</button></li>
            <li><button onClick={() => setCurrentView('about')} className="text-gray-400 hover:text-white transition-colors">À propos</button></li>
            <li><button onClick={() => setCurrentView('contact')} className="text-gray-400 hover:text-white transition-colors">Contact</button></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Services clients</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Suivi de commande</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Retours et remboursements</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Livraison</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Paiement sécurisé</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-400">
              <Icons.Phone className="mr-2" />
              +221 77 123 45 67
            </li>
            <li className="flex items-center text-gray-400">
              <Icons.User className="mr-2" />
              support@jaay-ma.sn
            </li>
            <li className="text-gray-400">
              Avenue Cheikh Anta Diop, Dakar, Sénégal
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-8 pt-8 text-center">
        <p className="text-gray-400">
          © 2024 Jaay-ma. Tous droits réservés. | 
          <button onClick={() => alert('Conditions générales')} className="text-gray-400 hover:text-white mx-2">CGV</button> | 
          <button onClick={() => alert('Politique de confidentialité')} className="text-gray-400 hover:text-white mx-2">Confidentialité</button> | 
          <button onClick={() => alert('Cookies')} className="text-gray-400 hover:text-white mx-2">Cookies</button>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
