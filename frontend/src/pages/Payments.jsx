import React from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Download,
  Plus,
  MoreHorizontal,
  Receipt,
  Wallet,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const transactions = [
  { id: '1', contact: 'Maria Wagner', description: 'Branding Paket', amount: 3500, status: 'completed', date: '2025-07-14', method: 'Kreditkarte' },
  { id: '2', contact: 'Michael Braun', description: 'Google Ads Kampagne - Anzahlung', amount: 7500, status: 'completed', date: '2025-07-12', method: 'Überweisung' },
  { id: '3', contact: 'Sandra Hoffmann', description: 'Monatliche Beratung', amount: 2200, status: 'completed', date: '2025-07-10', method: 'Kreditkarte' },
  { id: '4', contact: 'Anna Schmidt', description: 'Website Relaunch - Rate 1', amount: 4000, status: 'pending', date: '2025-07-15', method: 'Rechnung' },
  { id: '5', contact: 'Thomas Weber', description: 'SEO Paket', amount: 1500, status: 'overdue', date: '2025-07-05', method: 'Rechnung' },
];

const statusConfig = {
  completed: { label: 'Bezahlt', color: 'bg-green-100 text-green-700' },
  pending: { label: 'Ausstehend', color: 'bg-amber-100 text-amber-700' },
  overdue: { label: 'Überfällig', color: 'bg-red-100 text-red-700' },
};

const Payments = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Zahlungen</h1>
          <p className="text-sm text-gray-500 mt-0.5">Verwalten Sie Ihre Zahlungen und Rechnungen</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-sm gap-1.5">
            <Download size={14} />
            Exportieren
          </Button>
          <Button size="sm" className="text-sm gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Plus size={14} />
            Neue Rechnung
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <DollarSign size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Gesamteinnahmen</p>
                <p className="text-lg font-bold text-gray-900">€148.750</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Wallet size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Diesen Monat</p>
                <p className="text-lg font-bold text-gray-900">€18.700</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Ausstehend</p>
                <p className="text-lg font-bold text-gray-900">€5.500</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                <Receipt size={16} className="text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Überfällig</p>
                <p className="text-lg font-bold text-gray-900">€1.500</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900">Letzte Transaktionen</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kontakt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Beschreibung</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Betrag</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Methode</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => {
                const status = statusConfig[tx.status];
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{tx.contact}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tx.description}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">€{tx.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tx.method}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(tx.date).toLocaleDateString('de-DE')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Payments;
