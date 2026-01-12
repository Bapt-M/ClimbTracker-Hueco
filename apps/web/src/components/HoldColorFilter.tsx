import { useState } from 'react';

interface HoldColorFilterProps {
  selectedColors: string[];
  onColorsChange: (colors: string[]) => void;
}

interface ColorConfig {
  name: string;
  category: string;
  hex: string;
}

const HOLD_COLORS: ColorConfig[] = [
  { name: 'Rouge', category: 'red', hex: '#ef4444' },
  { name: 'Bleu', category: 'blue', hex: '#3b82f6' },
  { name: 'Vert', category: 'green', hex: '#22c55e' },
  { name: 'Jaune', category: 'yellow', hex: '#eab308' },
  { name: 'Orange', category: 'orange', hex: '#f97316' },
  { name: 'Violet', category: 'purple', hex: '#a855f7' },
  { name: 'Rose', category: 'pink', hex: '#ec4899' },
  { name: 'Noir', category: 'black', hex: '#1f2937' },
  { name: 'Blanc', category: 'white', hex: '#f3f4f6' },
  { name: 'Gris', category: 'grey', hex: '#6b7280' },
];

export const HoldColorFilter = ({
  selectedColors,
  onColorsChange,
}: HoldColorFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleColor = (category: string) => {
    if (selectedColors.includes(category)) {
      onColorsChange(selectedColors.filter((c) => c !== category));
    } else {
      onColorsChange([...selectedColors, category]);
    }
  };

  return (
    <div className="w-full bg-white/60 dark:bg-mono-900 backdrop-blur-md border border-mono-200/50 dark:border-mono-800 rounded-xl shadow-card overflow-hidden">
      {/* Header - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-mono-600 dark:text-mono-300">
            palette
          </span>
          <span className="text-[11px] font-medium text-mono-900 dark:text-white">
            Couleurs des prises
          </span>
          {selectedColors.length > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-mono-900 dark:bg-white text-white dark:text-black">
              {selectedColors.length}
            </span>
          )}
        </div>
        <span className={`material-symbols-outlined text-[18px] text-mono-600 dark:text-mono-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Content - Collapsible */}
      {isOpen && (
        <div className="px-3 pb-3 pt-1">
          <div className="grid grid-cols-5 gap-2">
            {HOLD_COLORS.map((color) => {
              const isSelected = selectedColors.includes(color.category);
              return (
                <button
                  key={color.category}
                  onClick={() => handleToggleColor(color.category)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all hover:bg-mono-100 dark:hover:bg-mono-800"
                  title={color.name}
                >
                  <div
                    className={`w-8 h-8 rounded-full transition-all ${
                      isSelected
                        ? 'ring-4 ring-mono-900 dark:ring-white scale-110'
                        : 'ring-2 ring-mono-300 dark:ring-mono-600'
                    }`}
                    style={{
                      backgroundColor: color.hex,
                      border: color.category === 'white' ? '2px solid #e5e7eb' : 'none',
                    }}
                  />
                  <span className="text-[9px] text-mono-600 dark:text-mono-300 font-medium">
                    {color.name}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedColors.length > 0 && (
            <button
              onClick={() => onColorsChange([])}
              className="mt-2 w-full text-[10px] text-mono-500 dark:text-mono-400 hover:text-mono-900 dark:hover:text-white py-1"
            >
              Réinitialiser
            </button>
          )}
        </div>
      )}
    </div>
  );
};
