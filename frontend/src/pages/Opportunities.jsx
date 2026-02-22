import React, { useState } from 'react';
import {
  Plus,
  MoreHorizontal,
  DollarSign,
  ChevronDown,
  Filter,
  GripVertical,
  User,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { opportunities, pipelineStages } from '../data/mockData';

const stageColors = {
  'Neue Anfrage': { bg: 'bg-indigo-50', border: 'border-indigo-200', header: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  'Qualifiziert': { bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Angebot gesendet': { bg: 'bg-amber-50', border: 'border-amber-200', header: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Verhandlung': { bg: 'bg-emerald-50', border: 'border-emerald-200', header: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Gewonnen': { bg: 'bg-green-50', border: 'border-green-200', header: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
};

const OpportunityCard = ({ opp }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
    <div className="flex items-start justify-between mb-2">
      <p className="text-sm font-medium text-gray-900 truncate pr-2">{opp.name}</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-0.5 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal size={14} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem className="text-sm cursor-pointer">Bearbeiten</DropdownMenuItem>
          <DropdownMenuItem className="text-sm cursor-pointer">Verschieben</DropdownMenuItem>
          <DropdownMenuItem className="text-sm text-red-600 cursor-pointer">Löschen</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className="flex items-center gap-1.5 mb-2">
      <DollarSign size={13} className="text-gray-400" />
      <span className="text-sm font-semibold text-gray-800">€{opp.value.toLocaleString()}</span>
    </div>
    <div className="flex items-center gap-1.5 mb-1.5">
      <User size={12} className="text-gray-400" />
      <span className="text-xs text-gray-600">{opp.contact}</span>
    </div>
    <div className="flex items-center gap-1.5 mb-2">
      <Calendar size={12} className="text-gray-400" />
      <span className="text-xs text-gray-500">Erwartet: {new Date(opp.expected).toLocaleDateString('de-DE')}</span>
    </div>
    <div className="flex items-center justify-between">
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${opp.probability}%` }}
        />
      </div>
      <span className="text-[11px] text-gray-500 ml-2 flex-shrink-0">{opp.probability}%</span>
    </div>
  </div>
);

const Opportunities = () => {
  const [view, setView] = useState('kanban');
  const stages = ['Neue Anfrage', 'Qualifiziert', 'Angebot gesendet', 'Verhandlung', 'Gewonnen'];

  const totalValue = opportunities.reduce((sum, o) => sum + o.value, 0);
  const totalDeals = opportunities.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalDeals} Deals · Gesamtwert: €{totalValue.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                view === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Liste
            </button>
          </div>
          <Button variant="outline" size="sm" className="text-sm gap-1.5">
            <Filter size={14} />
            Filter
          </Button>
          <Button size="sm" className="text-sm gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Plus size={14} />
            Neuer Deal
          </Button>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="flex gap-1 items-center">
        {stages.map((stage, idx) => {
          const stageOpps = opportunities.filter((o) => o.stage === stage);
          const stageValue = stageOpps.reduce((sum, o) => sum + o.value, 0);
          const colors = stageColors[stage];
          return (
            <React.Fragment key={stage}>
              <div className={`flex-1 px-3 py-2 rounded-lg ${colors.bg} ${colors.border} border`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  <span className={`text-xs font-medium ${colors.text}`}>{stage}</span>
                </div>
                <p className="text-sm font-bold text-gray-800 mt-0.5">€{stageValue.toLocaleString()}</p>
                <p className="text-[11px] text-gray-500">{stageOpps.length} Deals</p>
              </div>
              {idx < stages.length - 1 && <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Kanban Board */}
      {view === 'kanban' ? (
        <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: '500px' }}>
          {stages.map((stage) => {
            const stageOpps = opportunities.filter((o) => o.stage === stage);
            const colors = stageColors[stage];

            return (
              <div key={stage} className="w-[280px] flex-shrink-0">
                <div className={`${colors.header} rounded-t-lg px-3 py-2 border ${colors.border} border-b-0`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                      <span className={`text-sm font-semibold ${colors.text}`}>{stage}</span>
                    </div>
                    <Badge variant="secondary" className="text-[11px] h-5">
                      {stageOpps.length}
                    </Badge>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-b-lg border border-gray-200 border-t-0 p-2 space-y-2 min-h-[400px]">
                  {stageOpps.map((opp) => (
                    <OpportunityCard key={opp.id} opp={opp} />
                  ))}
                  <button className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1">
                    <Plus size={14} />
                    Deal hinzufügen
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Deal</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kontakt</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Wert</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phase</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Wahrscheinlichkeit</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Erwartet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {opportunities.map((opp) => {
                  const colors = stageColors[opp.stage];
                  return (
                    <tr key={opp.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{opp.name}</p>
                        <p className="text-xs text-gray-500">{opp.company}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{opp.contact}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">€{opp.value.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.bg} ${colors.text}`}>
                          {opp.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5">
                            <div className="h-full rounded-full bg-blue-500" style={{ width: `${opp.probability}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{opp.probability}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(opp.expected).toLocaleDateString('de-DE')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Opportunities;
