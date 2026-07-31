"use client";

const bars = [
  { date: "27 Jun", height: 65, topPct: 60 },
  { date: "28 Jun", height: 40, topPct: 50 },
  { date: "29 Jun", height: 55, topPct: 60 },
  { date: "30 Jun", empty: true },
  { date: "1 Jul", height: 90, topPct: 70, featured: true },
  { date: "2 Jul", empty: true },
  { date: "3 Jul", height: 45, topPct: 60 },
  { date: "4 Jul", height: 42, topPct: 60 },
];

export default function BarChart() {
  return (
    <div className="mt-4 flex flex-1">
      <div className="flex flex-col justify-between pr-4 text-xs text-gray-400" style={{ height: 200 }}>
        <span>1.0</span><span>0.9</span><span>0.8</span><span>0.7</span>
        <span>0.6</span><span>0.5</span><span>0.4</span><span>0.3</span>
        <span>0.2</span><span>0.1</span>
      </div>
      <div className="flex flex-1 items-end justify-around pl-8" style={{ height: 200 }}>
        {bars.map((bar) => {
          if (bar.empty) {
            return (
              <div key={bar.date} className="flex flex-col items-center">
                <div
                  className="relative flex w-8 flex-col justify-end rounded-2xl border-2 border-dashed border-gray-200 bg-transparent"
                  style={{ height: 200 }}
                >
                  <div
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ top: bar.date === "30 Jun" ? "25%" : "40%" }}
                  >
                    <div className="h-2 w-2 rounded-full border-2 border-gray-300 bg-white" />
                  </div>
                </div>
                <span className="mt-2 text-xs text-gray-500">{bar.date}</span>
              </div>
            );
          }
          return (
            <div key={bar.date} className="flex flex-col items-center">
              {bar.featured && (
                <div className="-mb-1 z-10 rounded-full bg-yellow-accent px-3 py-1 text-xs font-bold text-black shadow-sm">
                  32%
                </div>
              )}
              <div
                className={`relative flex w-8 flex-col justify-end rounded-2xl border-2 border-dashed border-gray-200 bg-transparent ${
                  bar.featured ? "w-10 border-none bg-gray-100" : ""
                }`}
                style={{ height: bar.featured ? 220 : 200 }}
              >
                <div
                  className="absolute bottom-0 w-full overflow-hidden rounded-2xl"
                  style={{ height: `${bar.height}%` }}
                >
                  <div
                    className="relative w-full bg-gray-900"
                    style={{ height: `${bar.topPct}%` }}
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full border-2 border-white bg-transparent" />
                      {bar.featured && (
                        <span className="mt-2 text-[10px] font-bold text-white">87%</span>
                      )}
                    </div>
                  </div>
                  <div
                    className="w-full bg-yellow-accent"
                    style={{ height: `${100 - bar.topPct}%` }}
                  />
                </div>
              </div>
              <span
                className={`mt-2 text-xs ${bar.featured ? "font-bold text-gray-900" : "text-gray-500"}`}
              >
                {bar.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
