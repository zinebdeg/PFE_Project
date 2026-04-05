'use client';
import { CreditCard, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react';
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
    <div className="bg-white p-8 rounded-[32px] border border-gray-border shadow-sm mb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-[8px] bg-dark text-white flex items-center justify-center">
          <CreditCard size={16} />
        </div>
        <h2 className="text-xl font-black text-dark">Mode de paiement</h2>
      </div>

      <div className="space-y-4">
        {/* Card Payment */}
        <div 
          onClick={() => handleSelect('card')}
          className={cn(
            "p-6 rounded-[24px] border-2 cursor-pointer transition-all",
            method === 'card' ? "border-primary bg-primary/5" : "border-gray-border bg-white hover:border-gray-body/30"
          )}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
              method === 'card' ? "border-primary bg-primary" : "border-gray-border"
            )}>
              {method === 'card' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-dark" />
              <span className="text-lg font-bold text-dark">Carte bancaire</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pl-9">
            <div className="flex items-start gap-2 text-[11px] text-dark leading-tight">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <p>
                Le paiement est requis dans les 20 prochaines minutes pour garantir votre réservation. 
                Si le paiement n'est pas reçu, votre réservation pourrait être annulée.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-italic font-black text-blue tracking-tighter">VISA</span>
              <span className="font-italic font-black text-red tracking-tighter">Mastercard</span>
              <span className="font-black text-dark">CMI</span>
            </div>
          </div>
        </div>

        {/* Cash Payment */}
        <div 
          onClick={() => handleSelect('cash')}
          className={cn(
            "p-6 rounded-[24px] border-2 cursor-pointer transition-all",
            method === 'cash' ? "border-primary bg-primary/5" : "border-gray-border bg-white hover:border-gray-body/30"
          )}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
              method === 'cash' ? "border-primary bg-primary" : "border-gray-border"
            )}>
              {method === 'cash' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <div className="flex items-center gap-2">
              <Wallet size={20} className="text-dark" />
              <span className="text-lg font-bold text-dark">Espèce</span>
            </div>
          </div>
          
          <div className="pl-9">
            <p className="text-[11px] text-gray-body leading-tight">
              Vous allez recevoir un code Fatourati que devez payer dans une agence 
              <span className="font-bold text-dark"> CASHPLUS, FAWATIR, DAMANE CASH</span> ou 
              <span className="font-bold text-dark"> MT CASH</span> aujourd'hui (Expire dans 30 minutes).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
