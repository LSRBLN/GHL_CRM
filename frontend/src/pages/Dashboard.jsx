import React from 'react';
import {
  Users,
  CalendarDays,
  CheckSquare,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Video,
  Phone,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { stats, revenueData, appointments, tasks, pipelineStages, conversations } from '../data/mockData';

const StatCard = ({ icon: Icon, label, value, change, changeType, color }) => (
  <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-gray-500 font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${
              changeType === 'up' ? 'text-green-600' : 'text-red-500'
            }`}>
              {changeType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const RevenueChart = () => {
  const maxRevenue = Math.max(...revenueData.map((d) => Math.max(d.revenue, d.target)));

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">Umsatz-Übersicht</CardTitle>
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400">
            <MoreHorizontal size={16} />
          </button>
        </div>
        <div className="flex items-center gap-4 mt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-500">Umsatz</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <span className="text-xs text-gray-500">Ziel</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-end gap-3 h-[180px]">
          {revenueData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-1 items-end h-[150px]">
                <div
                  className="flex-1 bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-600"
                  style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                  title={`€${item.revenue.toLocaleString()}`}
                />
                <div
                  className="flex-1 bg-gray-200 rounded-t-sm"
                  style={{ height: `${(item.target / maxRevenue) * 100}%` }}
                  title={`Ziel: €${item.target.toLocaleString()}`}
                />
              </div>
              <span className="text-[11px] text-gray-500">{item.month}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const PipelineWidget = () => {
  const totalValue = pipelineStages.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">Pipeline-Übersicht</CardTitle>
          <span className="text-sm font-semibold text-gray-900">€{totalValue.toLocaleString()}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pipelineStages.map((stage) => (
            <div key={stage.id} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 truncate">{stage.name}</span>
                  <span className="text-sm font-medium text-gray-900">€{stage.value.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(stage.value / totalValue) * 100}%`,
                      backgroundColor: stage.color,
                    }}
                  />
                </div>
              </div>
              <Badge variant="secondary" className="text-[11px] ml-1">
                {stage.count}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AppointmentsWidget = () => (
  <Card className="border border-gray-200 shadow-sm">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-base font-semibold text-gray-900">Heutige Termine</CardTitle>
        <Badge variant="secondary" className="text-xs">{appointments.length}</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="w-10 text-center">
              <p className="text-sm font-semibold text-gray-900">{apt.time}</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{apt.title}</p>
              <p className="text-xs text-gray-500">{apt.contact} · {apt.duration}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {apt.type === 'video' && <Video size={14} className="text-blue-500" />}
              {apt.type === 'phone' && <Phone size={14} className="text-green-500" />}
              {apt.type === 'in-person' && <MapPin size={14} className="text-amber-500" />}
              <span
                className={`w-2 h-2 rounded-full ${
                  apt.status === 'confirmed' ? 'bg-green-500' : 'bg-amber-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const TasksWidget = () => (
  <Card className="border border-gray-200 shadow-sm">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-base font-semibold text-gray-900">Aufgaben</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="text-[11px]">
            {tasks.filter((t) => t.status === 'overdue').length} überfällig
          </Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-1.5">
        {tasks.slice(0, 5).map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div
              className={`w-4 h-4 rounded border-2 mt-0.5 flex-shrink-0 ${
                task.status === 'overdue' ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 truncate">{task.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {task.status === 'overdue' && (
                  <span className="text-[11px] text-red-500 flex items-center gap-0.5">
                    <AlertCircle size={10} /> Überfällig
                  </span>
                )}
                <span className="text-[11px] text-gray-400">{task.dueDate}</span>
                {task.priority === 'high' && (
                  <Badge variant="destructive" className="text-[10px] h-4 px-1">Hoch</Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const RecentConversationsWidget = () => (
  <Card className="border border-gray-200 shadow-sm">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-base font-semibold text-gray-900">Letzte Konversationen</CardTitle>
        <Badge variant="secondary" className="text-xs">
          {conversations.reduce((sum, c) => sum + c.unread, 0)} ungelesen
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-1">
        {conversations.slice(0, 4).map((conv) => (
          <div
            key={conv.id}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
              {conv.contact.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm truncate ${conv.unread > 0 ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {conv.contact.name}
                </p>
                <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">
                  {new Date(conv.lastMessageTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
            </div>
            {conv.unread > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {conv.unread}
              </span>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Willkommen zurück, Max</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Hier ist ein Überblick über Ihre heutigen Aktivitäten.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Kontakte"
          value={stats.totalContacts.toLocaleString()}
          change="+12.5% diesen Monat"
          changeType="up"
          color="bg-blue-500"
        />
        <StatCard
          icon={CalendarDays}
          label="Termine heute"
          value={stats.appointmentsToday}
          change="3 mehr als gestern"
          changeType="up"
          color="bg-green-500"
        />
        <StatCard
          icon={CheckSquare}
          label="Offene Aufgaben"
          value={stats.tasksDueToday}
          change={`${stats.tasksOverdue} überfällig`}
          changeType="down"
          color="bg-amber-500"
        />
        <StatCard
          icon={DollarSign}
          label="Monatsumsatz"
          value={`€${stats.monthlyRevenue.toLocaleString()}`}
          change="+8.3% zum Vormonat"
          changeType="up"
          color="bg-emerald-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart />
        <PipelineWidget />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AppointmentsWidget />
        <TasksWidget />
        <RecentConversationsWidget />
      </div>
    </div>
  );
};

export default Dashboard;
