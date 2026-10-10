'use client';

import * as React from 'react';

interface RadioGroupContextType {
  value: string;
  onChange: (value: string) => void;
  name: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextType | undefined>(undefined);

export function RadioGroup({
  value,
  onValueChange,
  defaultValue = '',
  name: explicitName,
  children,
  className = '',
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  name?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [internalVal, setInternalVal] = React.useState(defaultValue);
  const currentVal = value !== undefined ? value : internalVal;
  const onChange = onValueChange || setInternalVal;
  const name = explicitName || React.useId();

  return (
    <RadioGroupContext.Provider value={{ value: currentVal, onChange, name }}>
      <div role="radiogroup" className={`space-y-2 ${className}`}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({
  value,
  id,
  className = '',
  ...props
}: {
  value: string;
  id?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const context = React.useContext(RadioGroupContext);
  const checked = context?.value === value;

  return (
    <input
      type="radio"
      id={id}
      name={context?.name}
      value={value}
      checked={checked}
      onChange={() => context?.onChange(value)}
      className={`h-4 w-4 text-teal-600 border-slate-300 focus:ring-teal-500 cursor-pointer ${className}`}
      {...props}
    />
  );
}
