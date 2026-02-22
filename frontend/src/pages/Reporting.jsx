import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { stats, revenueData } from '../data/mockData';

const reportMetrics = [
  { label: 'Konversionsrate', value: '3.8%', change: '+0.5%', up: true },
  { label: 'Durchschn. Deal-Wert', value: '€11.875', change: '+€1.200', up: true },
  { label: 'Kundenakquise-Kosten', value: '€145', change: '-€23', up: true },
  { label: 'LTV pro Kunde', value: '€8.400', change: '+€600', up: true },
];

const channelData = [
  { channel: 'Website', leads: 342, conversions: 28, rate: '8.2%', revenue: 42000 },
  { channel: 'Google Ads', leads: 256, conversions: 18, rate: '7.0%', revenue: 31500 },
  { channel: 'Facebook', leads: 189, conversions: 12, rate: '6.3%', revenue: 22800 },
  { channel: 'Empfehlung', leads: 98, conversions: 15, rate: '15.3%', revenue: 38000 },
  { channel: 'LinkedIn', leads: 67, conversions: 4, rate: '6.0%', revenue: 14450 },
];

const Reporting = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reporting</h1>
          <p className="text-sm text-gray-500 mt-0.5">Übersicht und Analysen</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-sm gap-1.5">
            <Filter size={14} />
            Zeitraum: Letzte 30 Tage
          </Button>
          <Button variant="outline" size="sm" className="text-sm gap-1.5">
            <Download size={14} />
            Bericht exportieren
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {reportMetrics.map((metric, idx) => (
          <Card key={idx} className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
              <p className="text-xl font-bold text-gray-900">{metric.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                metric.up ? 'text-green-600' : 'text-red-500'
              }`}>
                {metric.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span>{metric.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900">Umsatzentwicklung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-[220px]">
            {revenueData.map((item, idx) => {
              const max = Math.max(...revenueData.map((d) => d.revenue));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">€{(item.revenue / 1000).toFixed(0)}k</span>
                  <div className="w-full flex gap-1 items-end h-[170px]">
                    <div
                      className="flex-1 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors"
                      style={{ height: `${(item.revenue / max) * 100}%` }}
                    />
                    <div
                      className="flex-1 bg-gray-200 rounded-t-sm"
                      style={{ height: `${(item.target / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-500">{item.month}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Channel Performance */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900">Kanal-Performance</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kanal</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Leads</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Konversionen</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rate</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Umsatz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {channelData.map((ch, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{ch.channel}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{ch.leads}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{ch.conversions}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: ch.rate }} />
                      </div>
                      <span className="text-xs text-gray-500">{ch.rate}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">€{ch.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Reporting;
