'use client';

interface Tab {
  label: string;
  value: string;
}

interface TabSelectorProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
}

export default function TabSelector({ tabs, activeTab, onChange }: TabSelectorProps) {
  return (
    <div className="bg-white px-4 py-3 border-b border-gray-100">
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
