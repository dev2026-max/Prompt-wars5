import React, { useState } from 'react';
import { IndianRupee, PieChart as PieIcon, BarChart2, AlertCircle, TrendingDown } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const COLORS = [
  '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', 
  '#3B82F6', '#6366F1', '#14B8A6', '#F97316', '#64748B'
];

export default function BudgetChart({ budgetData }) {
  const [chartView, setChartView] = useState('pie'); // 'pie' or 'bar'

  if (!budgetData || !budgetData.categories || budgetData.categories.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center border border-purple-500/20">
        <IndianRupee className="w-12 h-12 text-amber-400 mx-auto mb-3 opacity-60" />
        <h3 className="text-lg font-bold text-white">No Budget Allocation Generated</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
          Set your target budget in the Event Planner to generate dynamic category allocations and visual charts.
        </p>
      </div>
    );
  }

  const { total, currency = 'INR', categories, disclaimer } = budgetData;

  const chartData = categories.map((cat, i) => ({
    name: cat.category,
    value: Number(cat.amount),
    percentage: cat.percentage,
    color: COLORS[i % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-purple-500/40 text-xs shadow-xl">
          <p className="font-bold text-white">{data.name}</p>
          <p className="text-amber-400 font-semibold mt-1">
            {currency} {Number(data.value).toLocaleString('en-IN')}
          </p>
          <p className="text-gray-300">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-amber-400" />
            <span>Smart Budget Planner</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Data-backed cost distribution designed to maximize guest experience while avoiding overspending.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 bg-purple-950/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setChartView('pie')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              chartView === 'pie'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Donut Chart</span>
          </button>
          <button
            onClick={() => setChartView('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              chartView === 'bar'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Bar Chart</span>
          </button>
        </div>
      </div>

      {/* Main Budget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Column */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <span className="text-xs text-gray-400 font-medium">TOTAL ESTIMATED BUDGET</span>
            <div className="text-3xl font-extrabold text-amber-400 font-['Outfit'] mt-1">
              {currency} {Number(total).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'pie' ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d1f4d" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af" 
                    tick={{ fontSize: 10 }} 
                    angle={-35} 
                    textAnchor="end" 
                    interval={0}
                  />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-2">
            Hover over chart segments to inspect itemized breakdowns.
          </p>
        </div>

        {/* Categories Table Column */}
        <div className="lg:col-span-7 space-y-3">
          {categories.map((cat, idx) => {
            const color = COLORS[idx % COLORS.length];
            return (
              <div
                key={idx}
                className="glass-card rounded-xl p-3.5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500/30 transition"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{cat.category}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-purple-300">
                        {cat.percentage}%
                      </span>
                    </div>
                    {cat.notes && (
                      <p className="text-xs text-gray-400 mt-0.5 leading-snug">{cat.notes}</p>
                    )}
                  </div>
                </div>

                <div className="text-right sm:flex-shrink-0">
                  <span className="text-sm font-bold text-amber-300 font-['Outfit']">
                    {currency} {Number(cat.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      {disclaimer && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300/80">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
          <span>{disclaimer}</span>
        </div>
      )}
    </div>
  );
}
