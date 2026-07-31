import { Link, useRouterState } from '@tanstack/react-router';
import { COMPANY_INFO, NAV_LINKS } from '#/lib/constants';
import { Phone } from 'lucide-react';

export default function Footer() {
  const router = useRouterState();

  if (router.location.pathname.startsWith('/booking/payment')) {
    return null;
  }

  return (
    <footer className="bg-gray-light border-t border-gray-border mt-20">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex flex-col mb-4">
              <img 
                src="/images/logo-pullman.png" 
                alt="Pullman du Sud" 
                className="h-16 w-auto object-contain self-start"
              />
            </div>
            <p className="text-xs text-gray-body leading-relaxed mb-4">
              {COMPANY_INFO.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-body mb-3">
              <Phone size={14} />
              <span>{COMPANY_INFO.phone}</span>
            </div>
          </div>

          {/* Liens Utiles */}
          <div>
            <h4 className="text-sm font-semibold text-dark mb-4">Liens Utiles</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map(
                (item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="text-sm text-gray-body hover:text-primary transition-colors no-underline"
                    >
                      {item.label}
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
            © {new Date().getFullYear()} {COMPANY_INFO.name} | Tous droits réservés.
          </p>
          <p className="text-xs text-gray-body">
            Powered by <span className="font-semibold text-primary">marKoub.ma</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
