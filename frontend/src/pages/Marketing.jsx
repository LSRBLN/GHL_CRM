import React, { useState } from 'react';
import {
  Mail,
  Plus,
  Send,
  FileText,
  Clock,
  Eye,
  MousePointerClick,
  MoreHorizontal,
  Search,
  Filter,
  BarChart3,
  Edit,
  Copy,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { marketingEmails, stats } from '../data/mockData';

const statusConfig = {
  sent: { label: 'Gesendet', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Entwurf', color: 'bg-gray-100 text-gray-700' },
  scheduled: { label: 'Geplant', color: 'bg-blue-100 text-blue-700' },
};

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('emails');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Marketing</h1>
          <p className="text-sm text-gray-500 mt-0.5">E-Mail-Kampagnen und Social Media Management</p>
        </div>
        <Button size="sm" className="text-sm gap-1.5 bg-blue-600 hover:bg-blue-700">
          <Plus size={14} />
          Neue Kampagne
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Send size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Gesendet</p>
                <p className="text-lg font-bold text-gray-900">{stats.emailsSent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <Eye size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Öffnungsrate</p>
                <p className="text-lg font-bold text-gray-900">{stats.emailOpenRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <MousePointerClick size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Klickrate</p>
                <p className="text-lg font-bold text-gray-900">{stats.clickRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                <TrendingUp size={16} className="text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Abmelderate</p>
                <p className="text-lg font-bold text-gray-900">{stats.unsubscribeRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="emails" className="w-full">
        <TabsList>
          <TabsTrigger value="emails" className="gap-1.5">
            <Mail size={14} />
            E-Mail-Kampagnen
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-1.5">
            <FileText size={14} />
            Vorlagen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emails" className="mt-4">
          {/* Search & Filter */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Kampagnen suchen..." className="pl-9 h-9 text-sm" />
            </div>
            <Button variant="outline" size="sm" className="text-sm gap-1.5">
              <Filter size={14} />
              Filter
            </Button>
          </div>

          {/* Email Campaigns Table */}
          <Card className="border border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kampagne</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gesendet</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Geöffnet</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Geklickt</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Datum</th>
                    <th className="w-10 px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {marketingEmails.map((email) => {
                    const status = statusConfig[email.status];
                    return (
                      <tr key={email.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Mail size={14} className="text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{email.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{email.sent.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{email.opened.toLocaleString()}</span>
                            {email.sent > 0 && (
                              <span className="text-xs text-gray-400">
                                ({((email.opened / email.sent) * 100).toFixed(1)}%)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{email.clicked}</span>
                            {email.sent > 0 && (
                              <span className="text-xs text-gray-400">
                                ({((email.clicked / email.sent) * 100).toFixed(1)}%)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(email.date).toLocaleDateString('de-DE')}
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal size={16} className="text-gray-400" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem className="gap-2 cursor-pointer"><BarChart3 size={14} /> Statistiken</DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer"><Edit size={14} /> Bearbeiten</DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer"><Copy size={14} /> Duplizieren</DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-red-600 cursor-pointer"><Trash2 size={14} /> Löschen</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Willkommens-Mail', 'Newsletter Vorlage', 'Angebots-Mail', 'Follow-up Vorlage', 'Termin-Bestätigung', 'Feedback-Anfrage'].map((template, idx) => (
              <Card key={idx} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="h-32 bg-gray-50 rounded-lg mb-3 flex items-center justify-center border border-gray-100">
                    <FileText size={32} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{template}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Zuletzt bearbeitet: vor {idx + 1} Tagen</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;
