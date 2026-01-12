interface RouteTypeSelectorProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

const ROUTE_TYPES = [
  { value: 'réglette', label: 'Réglette' },
  { value: 'dévers', label: 'Dévers' },
  { value: 'dalle', label: 'Dalle' },
  { value: 'toit', label: 'Toit' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'arête', label: 'Arête' },
  { value: 'dièdre', label: 'Dièdre' },
  { value: 'technique', label: 'Technique' },
  { value: 'physique', label: 'Physique' },
  { value: 'résistance', label: 'Résistance' },
  { value: 'bloc', label: 'Bloc' },
  { value: 'continuous', label: 'Continuous' },
  { value: 'dynamic', label: 'Dynamic' },
  { value: 'static', label: 'Static' },
  { value: 'coordination', label: 'Coordination' },
  { value: 'balance', label: 'Balance' },
];

export const RouteTypeSelector = ({
  selectedTypes,
  onChange,
}: RouteTypeSelectorProps) => {
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter((t) => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="route-type-selector">
      <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
        Route Characteristics (select all that apply):
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {ROUTE_TYPES.map(({ value, label }) => (
          <label
            key={value}
            className={`
              flex items-center gap-2 px-3 py-2 border-2 rounded-xl cursor-pointer transition-all text-sm
              ${
                selectedTypes.includes(value)
                  ? 'bg-mono-900 dark:bg-white border-mono-900 dark:border-white text-white dark:text-black'
                  : 'bg-white dark:bg-mono-900 border-mono-200 dark:border-mono-800 text-mono-900 dark:text-white hover:border-mono-400 dark:hover:border-mono-600'
              }
            `}
          >
            <input
              type="checkbox"
              checked={selectedTypes.includes(value)}
              onChange={() => toggleType(value)}
              className="w-4 h-4"
            />
            <span className="font-medium">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
