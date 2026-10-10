'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

export function Select({
  label,
  error,
  options,
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  children,
  className = '',
  id,
  ...props
}: SelectProps) {
  const [internalVal, setInternalVal] = React.useState(defaultValue as string);
  const [open, setOpen] = React.useState(false);
  const currentVal = controlledValue !== undefined ? (controlledValue as string) : internalVal;

  const handleValueChange = (val: string) => {
    setInternalVal(val);
    onValueChange?.(val);
    setOpen(false);
  };

  // If traditional select with options prop
  if (options && !children) {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
        )}
        <select
          id={selectId}
          value={currentVal}
          onChange={(e) => handleValueChange(e.target.value)}
          className={`block w-full rounded-md shadow-sm sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 border ${
            error
              ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:border-teal-500'
          } ${props.disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-900'} px-3 py-2 ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  // Compound component pattern
  return (
    <SelectContext.Provider value={{ value: currentVal, onValueChange: handleValueChange, open, setOpen }}>
      <div className={`relative w-full ${className}`}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => context?.setOpen((prev) => !prev)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 ${className}`}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectValue({
  placeholder = 'Select an option...',
}: {
  placeholder?: string;
}) {
  const context = React.useContext(SelectContext);
  return (
    <span className={context?.value ? 'text-slate-900' : 'text-slate-400'}>
      {context?.value || placeholder}
    </span>
  );
}

export function SelectContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(SelectContext);
  if (!context?.open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => context.setOpen(false)} />
      <div
        className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${className}`}
      >
        {children}
      </div>
    </>
  );
}

export function SelectItem({
  value,
  children,
  className = '',
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(SelectContext);
  const isSelected = context?.value === value;

  return (
    <div
      onClick={() => context?.onValueChange(value)}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 transition-colors ${
        isSelected ? 'bg-teal-50 text-teal-900 font-medium' : 'text-slate-900'
      } ${className}`}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-4 w-4 text-teal-600" />
        </span>
      )}
      {children}
    </div>
  );
}
