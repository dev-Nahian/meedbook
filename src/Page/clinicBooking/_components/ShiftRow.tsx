import { useState } from "react";

const SHIFTS = ["Morning shift", "Afternoon shift", "Evening shift"] as const;
export type ShiftType = (typeof SHIFTS)[number];

export interface ShiftRowProps {
  label: string;
  shift: string;
  onChange: (shift: ShiftType) => void;
  onRemove: () => void;
}

export default function ShiftRow({
  label,
  shift,
  onChange,
  onRemove,
}: ShiftRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full border px-4 py-2 rounded-lg text-sm text-left"
          >
            {shift}
          </button>

          {open && (
            <div className="absolute w-full bg-white border rounded-lg shadow z-10">
              {SHIFTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onChange(s);
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-sky-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-2 text-gray-400 hover:text-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
}