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
      <div className="flex bg-white/20 backdrop-blur-md p-1 rounded-full border border-white/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={`flex-1 px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'bg-white text-[#4f6dfa] shadow-[0_2px_8px_rgba(0,0,0,0.15)]'
                  : 'text-white/80 hover:text-white'
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
