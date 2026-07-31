import { useState, useEffect } from 'react';
import { Loader2, CreditCard, Lock, X, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

export default function PaymentModal({ isOpen, onClose, onSuccess, amount }: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setName('');
      setStatus('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv || !name) return;
    
    setStatus('processing');
    
    // Simulate 3D secure and processing time
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2500);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = val;
    if (val.length > 0) {
      const parts = val.match(/.{1,4}/g);
      if (parts) {
        formatted = parts.join(' ');
      }
    }
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4);
    }
    if (val.length <= 5) {
      setExpiry(val);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">

      <div className="w-full h-full flex flex-col overflow-y-auto p-8">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Lock className="text-blue-600" size={18} />
            </div>
            <div>
              <h3 className="font-black text-dark text-lg">Paiement Sécurisé</h3>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Simulation CMI</p>
            </div>
          </div>
          {status === 'idle' && (
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-8">
          {status === 'processing' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="text-blue-600 animate-pulse" size={24} />
                </div>
              </div>
              <h4 className="text-xl font-black text-dark mb-2">Authentification...</h4>
              <p className="text-sm text-gray-500 font-medium">Connexion à votre banque (3D Secure)</p>
            </div>
          ) : status === 'success' ? (
             <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-in zoom-in">
                <CheckCircle2 className="text-green-500" size={48} />
              </div>
              <h4 className="text-xl font-black text-dark mb-2">Paiement Réussi</h4>
              <p className="text-sm text-gray-500 font-medium">Génération de votre billet en cours...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Montant à payer</span>
                <span className="text-3xl font-black text-dark">{amount} <span className="text-xl">MAD</span></span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Titulaire de la carte</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom complet"
                    className="w-full h-14 px-5 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 text-sm font-medium transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Numéro de carte</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000"
                      className="w-full h-14 pl-12 pr-5 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 text-sm font-medium transition-colors font-mono"
                    />
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expiration</label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/AA"
                      className="w-full h-14 px-5 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 text-sm font-medium transition-colors font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">CVC</label>
                    <input
                      type="password"
                      required
                      value={cvv}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if(val.length <= 4) setCvv(val);
                      }}
                      placeholder="123"
                      className="w-full h-14 px-5 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 text-sm font-medium transition-colors font-mono"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 mt-4 bg-dark hover:bg-black text-white font-black text-lg rounded-xl shadow-xl hover:-translate-y-0.5 transition-all">
                  Payer {amount} MAD
                </Button>
                
                <p className="text-[10px] text-center text-gray-400 font-semibold uppercase tracking-widest mt-4">
                  Paiement sécurisé par simulation
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
