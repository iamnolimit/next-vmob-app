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
    <div className="px-4 py-2 mb-2">
      <div className="flex bg-gray-100/80 backdrop-blur-md p-1 rounded-full border border-gray-200/50">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={`flex-1 px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'bg-white text-[#0362fc] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
