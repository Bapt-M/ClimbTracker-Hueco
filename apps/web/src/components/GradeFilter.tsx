import { useState } from 'react';

interface GradeFilterProps {
  selectedGrades: string[];
  onGradesChange: (grades: string[]) => void;
}

interface ColorGrade {
  color: string;
  label: string;
  fontainebleau: string;
  grades: string[];
  textColor: string;
}

// Les couleurs SONT les grades
const COLOR_GRADES: ColorGrade[] = [
  {
    color: '#86efac',
    label: 'Débutant',
    fontainebleau: '3-4a',
    grades: ['3a', '3b', '3c', '4a'],
    textColor: 'text-green-900',
  },
  {
    color: '#22c55e',
    label: 'Débutant+',
    fontainebleau: '4b-4c',
    grades: ['4b', '4c'],
    textColor: 'text-white',
  },
  {
    color: '#7dd3fc',
    label: 'Intermédiaire-',
    fontainebleau: '5a-5b',
    grades: ['5a', '5b'],
    textColor: 'text-blue-900',
  },
  {
    color: '#3b82f6',
    label: 'Intermédiaire',
    fontainebleau: '5c-6a',
    grades: ['5c', '6a'],
    textColor: 'text-white',
  },
  {
    color: '#a855f7',
    label: 'Intermédiaire+',
    fontainebleau: '6a+-6b',
    grades: ['6a+', '6b'],
    textColor: 'text-white',
  },
  {
    color: '#ec4899',
    label: 'Confirmé-',
    fontainebleau: '6b+-6c',
    grades: ['6b+', '6c'],
    textColor: 'text-white',
  },
  {
    color: '#ef4444',
    label: 'Confirmé',
    fontainebleau: '6c+',
    grades: ['6c+'],
    textColor: 'text-white',
  },
  {
    color: '#f97316',
    label: 'Confirmé+',
    fontainebleau: '7a',
    grades: ['7a'],
    textColor: 'text-white',
  },
  {
    color: '#eab308',
    label: 'Avancé',
    fontainebleau: '7a-7b',
    grades: ['7a+', '7b'],
    textColor: 'text-yellow-900',
  },
  {
    color: '#e5e7eb',
    label: 'Expert',
    fontainebleau: '7b+-7c',
    grades: ['7b+', '7c'],
    textColor: 'text-gray-900',
  },
  {
    color: '#6b7280',
    label: 'Expert+',
    fontainebleau: '7c+-8b',
    grades: ['7c+', '8a', '8a+', '8b'],
    textColor: 'text-white',
  },
];

export const GradeFilter = ({
  selectedGrades,
  onGradesChange,
}: GradeFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleColorGrade = (grades: string[]) => {
    // Check if all grades in this color are selected
    const allSelected = grades.every(g => selectedGrades.includes(g));

    if (allSelected) {
      // Remove all grades from this color
      onGradesChange(selectedGrades.filter((g) => !grades.includes(g)));
    } else {
      // Add all grades from this color
      const newGrades = [...selectedGrades];
      grades.forEach(g => {
        if (!newGrades.includes(g)) {
          newGrades.push(g);
        }
      });
      onGradesChange(newGrades);
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
            trending_up
          </span>
          <span className="text-[11px] font-medium text-mono-900 dark:text-white">
            Niveaux
          </span>
          {selectedGrades.length > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-mono-900 dark:bg-white text-white dark:text-black">
              {selectedGrades.length}
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
          <div className="grid grid-cols-3 gap-2">
            {COLOR_GRADES.map((colorGrade) => {
              const allSelected = colorGrade.grades.every(g => selectedGrades.includes(g));

              return (
                <button
                  key={colorGrade.color}
                  onClick={() => handleToggleColorGrade(colorGrade.grades)}
                  style={{
                    backgroundColor: allSelected ? colorGrade.color : undefined,
                  }}
                  className={`flex flex-col items-center justify-center px-2 py-3 rounded-lg transition-all ${
                    allSelected
                      ? `${colorGrade.textColor} shadow-md scale-[1.02]`
                      : 'bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700'
                  }`}
                >
                  {/* Color dot */}
                  {!allSelected && (
                    <div
                      className="w-4 h-4 rounded-full mb-1"
                      style={{ backgroundColor: colorGrade.color }}
                    />
                  )}

                  {/* Label */}
                  <span className={`text-[13px] font-bold ${!allSelected && 'text-mono-900 dark:text-white'}`}>
                    {colorGrade.label}
                  </span>

                  {/* Fontainebleau equivalent */}
                  <span className={`text-[9px] opacity-80 ${!allSelected && 'text-mono-600 dark:text-mono-300'}`}>
                    {colorGrade.label}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedGrades.length > 0 && (
            <button
              onClick={() => onGradesChange([])}
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
