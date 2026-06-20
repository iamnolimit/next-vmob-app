'use client';

interface ChartBarProps {
  data: { name: string; nilai: number }[];
  title?: string;
}

const BAR_MAX_HEIGHT = 96; // px (h-24)

export default function ChartBar({ data, title }: ChartBarProps) {
  const max = Math.max(...data.map((d) => d.nilai));

  const formatShort = (n: number) => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
  };

  return (
    <div className="bg-white rounded-2xl p-4 mx-4 mb-4 ios-shadow">
      {title && <p className="text-sm font-semibold text-gray-700 mb-4">{title}</p>}

      {/* items-end: semua bar rata bawah */}
      <div className="flex items-end gap-2">
        {data.map((item, i) => {
          // hitung tinggi pixel absolut agar % tidak bergantung pada parent
          const barPx = max > 0
            ? Math.max(Math.round((item.nilai / max) * BAR_MAX_HEIGHT), 4)
            : 4;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-gray-500 leading-none">
                {formatShort(item.nilai)}
              </span>
              <div
                className="w-full rounded-t-lg transition-all duration-500"
                style={{
                  height: barPx,
                  background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
                }}
              />
              <span className="text-[9px] text-gray-500 font-medium leading-none">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
