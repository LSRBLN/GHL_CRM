import React from 'react';
import {
  Zap,
  Plus,
  Play,
  Pause,
  MoreHorizontal,
  Users,
  CheckCircle2,
  ArrowRight,
  Clock,
  Search,
  Filter,
  Edit,
  Copy,
  Trash2,
  BarChart3,
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
import { workflows } from '../data/mockData';

const Automation = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Automations</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {workflows.length} Workflows · {workflows.filter((w) => w.status === 'active').length} aktiv
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-sm gap-1.5">
            <Filter size={14} />
            Filter
          </Button>
          <Button size="sm" className="text-sm gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Plus size={14} />
            Neuer Workflow
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Workflows suchen..." className="pl-9 h-9 text-sm" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                <Zap size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Gesamt ausgelöst</p>
                <p className="text-lg font-bold text-gray-900">
                  {workflows.reduce((s, w) => s + w.triggered, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Aktuell eingeschrieben</p>
                <p className="text-lg font-bold text-gray-900">
                  {workflows.reduce((s, w) => s + w.enrolled - w.completed, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle2 size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Abgeschlossen</p>
                <p className="text-lg font-bold text-gray-900">
                  {workflows.reduce((s, w) => s + w.completed, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="space-y-3">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    workflow.status === 'active' ? 'bg-green-50' : 'bg-gray-100'
                  }`}>
                    <Zap size={18} className={workflow.status === 'active' ? 'text-green-600' : 'text-gray-400'} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">{workflow.name}</h3>
                      <Badge
                        variant={workflow.status === 'active' ? 'default' : 'secondary'}
                        className={`text-[11px] ${
                          workflow.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {workflow.status === 'active' ? 'Aktiv' : 'Pausiert'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Zap size={11} /> {workflow.triggered} ausgelöst
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users size={11} /> {workflow.enrolled} eingeschrieben
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <CheckCircle2 size={11} /> {workflow.completed} abgeschlossen
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Progress Bar */}
                  <div className="w-24 hidden md:block">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-gray-400">Erfolgsrate</span>
                      <span className="text-[10px] font-medium text-gray-600">
                        {workflow.enrolled > 0 ? Math.round((workflow.completed / workflow.enrolled) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all"
                        style={{
                          width: `${workflow.enrolled > 0 ? (workflow.completed / workflow.enrolled) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {workflow.status === 'active' ? (
                      <Pause size={14} className="text-gray-500" />
                    ) : (
                      <Play size={14} className="text-green-600" />
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal size={14} className="text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="gap-2 cursor-pointer"><Edit size={14} /> Bearbeiten</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer"><BarChart3 size={14} /> Statistiken</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer"><Copy size={14} /> Duplizieren</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-600 cursor-pointer"><Trash2 size={14} /> Löschen</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Automation;
