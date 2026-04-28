'use client';
import { CreditCard, Wallet, AlertTriangle, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

interface PaymentSectionProps {
  onSelect: (method: 'card' | 'cash') => void;
}

export default function PaymentSection({ onSelect }: PaymentSectionProps) {
  const [method, setMethod] = useState<'card' | 'cash'>('card');

  const handleSelect = (m: 'card' | 'cash') => {
    setMethod(m);
    onSelect(m);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded border border-gray-900 flex items-center justify-center shrink-0">
          <Lock size={18} className="text-gray-900" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Mode de paiement</h2>
      </div>

      <div className="space-y-4">
        {/* Card Payment */}
        <div 
          onClick={() => handleSelect('card')}
          className={cn(
            "p-5 rounded-xl border cursor-pointer transition-all",
            method === 'card' ? "border-gray-900 bg-white" : "border-gray-200 bg-white hover:border-gray-300"
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "w-4 h-4 rounded-full border flex items-center justify-center",
              method === 'card' ? "border-gray-900" : "border-gray-300"
            )}>
              {method === 'card' && <div className="w-2 h-2 rounded-full bg-gray-900" />}
            </div>
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-gray-900" />
              <span className="text-sm font-semibold text-gray-900">Carte bancaire</span>
            </div>
          </div>
          
          {method === 'card' && (
            <div className="pl-7 pr-2">
              <div className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                <AlertTriangle size={14} className="shrink-0 mt-0.5 text-gray-900" />
                <p>
                  Le paiement est requis dans les 20 prochaines minutes pour garantir votre réservation. 
                  Si le paiement n'est pas reçu, votre réservation pourrait être annulée ou rencontrer d'autres problèmes. Veuillez effectuer le paiement dès que possible pour éviter toute interruption.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cash Payment (Hidden or minimal to match Figma if not shown, but I will keep it styled same way) */}
        <div 
          onClick={() => handleSelect('cash')}
          className={cn(
            "p-5 rounded-xl border cursor-pointer transition-all",
            method === 'cash' ? "border-gray-900 bg-white" : "border-gray-200 bg-white hover:border-gray-300"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-4 h-4 rounded-full border flex items-center justify-center",
              method === 'cash' ? "border-gray-900" : "border-gray-300"
            )}>
              {method === 'cash' && <div className="w-2 h-2 rounded-full bg-gray-900" />}
            </div>
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-gray-900" />
              <span className="text-sm font-semibold text-gray-900">Espèce</span>
            </div>
          </div>
          
          {method === 'cash' && (
            <div className="pl-7 pr-2 mt-3">
              <div className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                <AlertTriangle size={14} className="shrink-0 mt-0.5 text-gray-900" />
                <p>
                  Vous allez recevoir un code Fatourati que devez payer dans une agence 
                  <span className="font-semibold text-gray-900"> CASHPLUS, FAWATIR, DAMANE CASH</span> ou 
                  <span className="font-semibold text-gray-900"> MT CASH</span> aujourd'hui (Expire dans 30 minutes).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
