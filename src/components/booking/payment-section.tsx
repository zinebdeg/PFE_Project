'use client';
import { CreditCard, Lock, Shield } from 'lucide-react';

interface PaymentSectionProps {
  onSelect: (method: 'card' | 'cash') => void;
}

export default function PaymentSection({ onSelect: _ }: PaymentSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded border border-gray-900 flex items-center justify-center shrink-0">
          <Lock size={18} className="text-gray-900" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Mode de paiement</h2>
      </div>

      <div className="p-5 rounded-xl border-2 border-gray-900 bg-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-4 h-4 rounded-full border border-gray-900 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-900" />
          </div>
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-gray-900" />
            <span className="text-sm font-semibold text-gray-900">Carte bancaire</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-md">VISA</span>
            <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-md">Mastercard</span>
          </div>
        </div>

        <div className="pl-7 pr-2 flex items-center gap-2 text-xs text-gray-500">
          <Shield size={13} className="shrink-0 text-green-500" />
          <p>Paiement 100% sécurisé. Vos données bancaires sont chiffrées et protégées.</p>
        </div>
      </div>
    </div>
  );
}
