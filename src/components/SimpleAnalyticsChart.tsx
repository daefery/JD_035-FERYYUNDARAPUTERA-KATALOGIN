import React from "react";

interface SimpleAnalyticsChartProps {
  title: string;
  data: Array<{ name: string; value: number }>;
  type?: "bar" | "line" | "pie";
}

const SimpleAnalyticsChart: React.FC<SimpleAnalyticsChartProps> = ({
  title,
  data,
  type = "bar",
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>

      {type === "bar" && (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-24 text-sm text-slate-300 truncate">
                {item.name}
              </div>
              <div className="flex-1 bg-slate-700 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
              <div className="w-12 text-sm text-white font-medium text-right">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {type === "line" && (
        <div className="relative h-64">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <polyline
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              points={data
                .map(
                  (item, index) =>
                    `${(index / (data.length - 1)) * 380 + 10},${
                      200 - (item.value / maxValue) * 180 + 10
                    }`
                )
                .join(" ")}
            />
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            {data.map((item, index) => (
              <circle
                key={index}
                cx={(index / (data.length - 1)) * 380 + 10}
                cy={200 - (item.value / maxValue) * 180 + 10}
                r="4"
                fill="#8B5CF6"
              />
            ))}
          </svg>
        </div>
      )}

      {type === "pie" && (
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {data.map((item, index) => {
                const percentage =
                  (item.value / data.reduce((sum, d) => sum + d.value, 0)) *
                  100;
                const startAngle = data
                  .slice(0, index)
                  .reduce(
                    (sum, d) =>
                      sum +
                      (d.value /
                        data.reduce((total, item) => total + item.value, 0)) *
                        360,
                    0
                  );
                const endAngle = startAngle + (percentage / 100) * 360;

                const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

                const largeArcFlag = percentage > 50 ? 1 : 0;

                return (
                  <path
                    key={index}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={`hsl(${(index * 60) % 360}, 70%, 60%)`}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {data.reduce((sum, item) => sum + item.value, 0)}
                </div>
                <div className="text-sm text-slate-300">Total</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleAnalyticsChart;
