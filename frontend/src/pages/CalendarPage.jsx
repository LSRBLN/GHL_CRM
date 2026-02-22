import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Video,
  Phone,
  MapPin,
  MoreHorizontal,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { calendarEvents, appointments } from '../data/mockData';

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 15));
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 15));
  const [view, setView] = useState('week');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = new Date();

  const hours = Array.from({ length: 12 }, (_, i) => i + 7);

  const getWeekDates = () => {
    const d = new Date(selectedDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();

  const getEventsForDate = (date) => {
    return calendarEvents.filter((e) => {
      const eventDate = new Date(e.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventPosition = (event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const startMinutes = (start.getHours() - 7) * 60 + start.getMinutes();
    const duration = (end - start) / (1000 * 60);
    return { top: `${startMinutes}px`, height: `${duration}px` };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Kalender</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {MONTHS[month]} {year}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                view === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Monat
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                view === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Woche
            </button>
          </div>
          <Button variant="outline" size="sm" className="text-sm gap-1.5">
            <Settings size={14} />
            Kalender-Einstellungen
          </Button>
          <Button size="sm" className="text-sm gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Plus size={14} />
            Neuer Termin
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Mini Calendar */}
        <div className="w-[260px] flex-shrink-0">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100">
                  <ChevronLeft size={16} className="text-gray-500" />
                </button>
                <span className="text-sm font-semibold text-gray-800">
                  {MONTHS[month]} {year}
                </span>
                <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100">
                  <ChevronRight size={16} className="text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-0">
                {DAYS.map((day) => (
                  <div key={day} className="text-center text-[11px] font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
                {Array.from({ length: startDay }, (_, i) => (
                  <div key={`empty-${i}`} className="text-center py-1" />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const date = new Date(year, month, i + 1);
                  const isToday = date.toDateString() === today.toDateString();
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  const hasEvents = getEventsForDate(date).length > 0;

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={`text-center py-1 text-xs rounded-md transition-colors relative ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : isToday
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                      {hasEvents && !isSelected && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card className="border border-gray-200 shadow-sm mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-900">Heutige Termine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-1 h-8 rounded-full bg-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{apt.title}</p>
                      <p className="text-[11px] text-gray-500">{apt.time} · {apt.duration}</p>
                    </div>
                    {apt.type === 'video' && <Video size={12} className="text-blue-500" />}
                    {apt.type === 'phone' && <Phone size={12} className="text-green-500" />}
                    {apt.type === 'in-person' && <MapPin size={12} className="text-amber-500" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Week View */}
        <Card className="flex-1 border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {/* Week Header */}
            <div className="grid grid-cols-8 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="w-16 border-r border-gray-100" />
              {weekDates.map((date, idx) => {
                const isToday = date.toDateString() === today.toDateString();
                const isSelected = date.toDateString() === selectedDate.toDateString();
                return (
                  <div
                    key={idx}
                    className={`text-center py-2 border-r border-gray-100 ${
                      isToday ? 'bg-blue-50' : ''
                    }`}
                  >
                    <p className="text-[11px] text-gray-500">{DAYS[idx]}</p>
                    <p className={`text-sm font-semibold ${
                      isToday ? 'text-blue-600' : isSelected ? 'text-blue-600' : 'text-gray-800'
                    }`}>
                      {date.getDate()}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-8 relative">
              {/* Time Labels */}
              <div className="border-r border-gray-100">
                {hours.map((hour) => (
                  <div key={hour} className="h-[60px] flex items-start justify-end pr-2 pt-0">
                    <span className="text-[11px] text-gray-400 -mt-1.5">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
              </div>

              {/* Day Columns */}
              {weekDates.map((date, dayIdx) => (
                <div key={dayIdx} className="relative border-r border-gray-100">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-[60px] border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                    />
                  ))}
                  {/* Events */}
                  {getEventsForDate(date).map((event) => {
                    const pos = getEventPosition(event);
                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 rounded-md px-2 py-1 text-xs cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
                        style={{
                          ...pos,
                          backgroundColor: event.color + '20',
                          borderLeft: `3px solid ${event.color}`,
                          color: event.color,
                        }}
                      >
                        <p className="font-medium truncate text-gray-800" style={{ fontSize: '11px' }}>
                          {event.title}
                        </p>
                        <p className="truncate opacity-75" style={{ fontSize: '10px' }}>
                          {new Date(event.start).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
