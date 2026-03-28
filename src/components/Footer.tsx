import { Link } from '@tanstack/react-router';
import { COMPANY_INFO } from '#/lib/constants';
import { Phone, Instagram, Facebook, Youtube, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-light border-t border-gray-border mt-20">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex flex-col mb-4">
              <span className="text-sm font-bold text-primary tracking-wide uppercase">
                Pullman du Sud
              </span>
              <span className="text-[10px] text-gray-body">بولمان الجنوب</span>
            </div>
            <p className="text-xs text-gray-body leading-relaxed mb-4">
              {COMPANY_INFO.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-body mb-3">
              <Phone size={14} />
              <span>{COMPANY_INFO.phone}</span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              {[Facebook, Instagram, Youtube, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white border border-gray-border flex items-center justify-center text-gray-body hover:text-primary hover:border-primary transition-colors no-underline"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Liens Utiles */}
          <div>
            <h4 className="text-sm font-semibold text-dark mb-4">Liens Utiles</h4>
            <ul className="space-y-2">
              {['Accueil', 'Qui somme nous ?', 'Voyageurs', 'Touristique', 'Messagerie'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="text-sm text-gray-body hover:text-primary transition-colors no-underline"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h4 className="text-sm font-semibold text-dark mb-4">Aide</h4>
            <div className="space-y-2 text-sm text-gray-body">
              <p>{COMPANY_INFO.address}</p>
              <p>{COMPANY_INFO.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-border">
        <div className="container-app py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-body">
            © 2025 {COMPANY_INFO.name} | Tous droits réservés.
          </p>
          <p className="text-xs text-gray-body">
            Powered by <span className="font-semibold text-primary">marKoub.ma</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
