import { Check, X } from 'lucide-react';
import { PasswordValidation } from '@/types/auth';

interface PasswordRequirementsProps {
  validation: PasswordValidation;
  show: boolean;
}

interface RequirementItemProps {
  met: boolean;
  text: string;
}

function RequirementItem({ met, text }: RequirementItemProps) {
  return (
    <div className={`flex items-center gap-2 text-sm transition-colors ${met ? 'text-emerald-600' : 'text-red-500'}`}>
      {met ? (
        <Check className="h-4 w-4" />
      ) : (
        <X className="h-4 w-4" />
      )}
      <span>{text}</span>
    </div>
  );
}

export function PasswordRequirements({ validation, show }: PasswordRequirementsProps) {
  if (!show) return null;

  return (
    <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
      <p className="text-sm font-medium text-slate-700 mb-2">Password requirements:</p>
      <RequirementItem 
        met={validation.minLength} 
        text="At least 8 characters long" 
      />
      <RequirementItem 
        met={validation.hasUppercase} 
        text="At least one capital letter (A-Z)" 
      />
      <RequirementItem 
        met={validation.hasLowercase} 
        text="At least one lowercase letter (a-z)" 
      />
      <RequirementItem 
        met={validation.hasNumber} 
        text="At least one number (0-9)" 
      />
      <RequirementItem 
        met={validation.hasSpecialChar} 
        text="At least one special character (! @ # $ % ^ & * ( ) +)" 
      />
    </div>
  );
}
