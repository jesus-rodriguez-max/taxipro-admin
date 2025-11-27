interface StatusFilterProps {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function StatusFilter({ options, selected, onChange, label = 'Estado' }: StatusFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
