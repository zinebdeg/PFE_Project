import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export const COUNTRIES = [
  { code: 'MA', dialCode: '+212', flag: '🇲🇦', name: 'Maroc' },
  { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'France' },
  { code: 'ES', dialCode: '+34', flag: '🇪🇸', name: 'Espagne' },
  { code: 'BE', dialCode: '+32', flag: '🇧🇪', name: 'Belgique' },
  { code: 'IT', dialCode: '+39', flag: '🇮🇹', name: 'Italie' },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Allemagne' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'Royaume-Uni' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'États-Unis' },
  { code: 'CA', dialCode: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: 'CH', dialCode: '+41', flag: '🇨🇭', name: 'Suisse' },
];

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (e: any) => void;
  name: string;
}

export function PhoneInput({ 
  value, 
  onChange, 
  name, 
  className,
  placeholder = "Ex: 655667788",
  ...props 
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (!value) return COUNTRIES[0];
    const matched = COUNTRIES.find(c => value.startsWith(c.dialCode));
    return matched || COUNTRIES[0];
  });
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      const matched = COUNTRIES.find(c => value.startsWith(c.dialCode));
      if (matched && matched.code !== selectedCountry.code) {
        setSelectedCountry(matched);
      }
    }
  }, [value, selectedCountry.code]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^\d\s]/g, ''); // only allow digits and spaces
    onChange({ target: { name, value: selectedCountry.dialCode + ' ' + raw } });
  };
  
  const handleCountryChange = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setIsOpen(false);
    
    // Ensure value is a string before calling replace
    const safeValue = value || '';
    const rawLocal = safeValue.replace(selectedCountry.dialCode, '').trim();
    
    onChange({ target: { name, value: country.dialCode + (rawLocal ? ' ' + rawLocal : '') } });
  };

  const safeValue = value || '';
  const localValue = safeValue.replace(selectedCountry.dialCode, '').trim();

  return (
    <div className={cn("relative flex items-center h-14 rounded-2xl border border-gray-200 bg-gray-50/50 focus-within:border-yellow-500 focus-within:ring-2 focus-within:ring-yellow-500/20 transition-all", className)}>
      <div className="relative h-full flex items-center" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 h-full pl-4 pr-3 text-sm font-medium hover:bg-gray-100/50 rounded-l-2xl transition-colors"
        >
          <span className="text-xl leading-none">{selectedCountry.flag}</span>
          <span className="text-gray-700">{selectedCountry.dialCode}</span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden py-2">
            <div className="max-h-60 overflow-y-auto">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCountryChange(c)}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left transition-colors text-sm"
                >
                  <span className="text-xl">{c.flag}</span>
                  <span className="font-medium text-gray-900 flex-1">{c.name}</span>
                  <span className="text-gray-500">{c.dialCode}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-6 w-[1px] bg-gray-300 mx-1 shrink-0" />

      <input
        {...props}
        name={name}
        type="tel"
        placeholder={placeholder}
        value={localValue}
        onChange={handleNumberChange}
        className="flex-1 h-full w-full bg-transparent px-3 outline-none text-sm font-medium"
      />
    </div>
  );
}
