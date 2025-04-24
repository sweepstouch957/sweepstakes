// components/PhoneInput.tsx
import React from "react";
import InputMask from "react-input-mask";

interface PhoneInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PhoneInput({ value, onChange }: PhoneInputProps) {
  return (
    <InputMask
      mask="(999) 999-9999"
      maskChar=""
      value={value}
      onChange={onChange}
      pattern="\(\d{3}\) \d{3}-\d{4}"
      required
    >
      {(inputProps) => (
        <input
          {...inputProps}
          type="tel"
          placeholder="Phone Number (USA)"
          className="p-3 border border-[#16286a] text-[#16286a] rounded focus:outline-none focus:ring-2 focus:ring-[#b64991] w-full"
        />
      )}
    </InputMask>
  );
}
