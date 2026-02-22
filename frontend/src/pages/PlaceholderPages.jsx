import React from 'react';
import { Globe, Star, FolderOpen, Award, Store, Settings, Construction } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const PlaceholderPage = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
      <Icon size={28} className="text-gray-400" />
    </div>
    <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
    <p className="text-sm text-gray-500 text-center max-w-md">{description}</p>
    <div className="flex items-center gap-2 mt-4">
      <Construction size={14} className="text-amber-500" />
      <span className="text-sm text-amber-600 font-medium">In Entwicklung</span>
    </div>
  </div>
);

export const Sites = () => (
  <PlaceholderPage
    icon={Globe}
    title="Sites"
    description="Erstellen und verwalten Sie Ihre Websites, Funnels und Landing Pages."
  />
);

export const Reputation = () => (
  <PlaceholderPage
    icon={Star}
    title="Reputation"
    description="Überwachen und verwalten Sie Ihre Online-Bewertungen und Reputation."
  />
);

export const MediaStorage = () => (
  <PlaceholderPage
    icon={FolderOpen}
    title="Media Storage"
    description="Verwalten Sie Ihre Bilder, Videos und Dateien an einem zentralen Ort."
  />
);

export const Memberships = () => (
  <PlaceholderPage
    icon={Award}
    title="Memberships"
    description="Erstellen und verwalten Sie Mitgliederbereiche und Online-Kurse."
  />
);

export const Marketplace = () => (
  <PlaceholderPage
    icon={Store}
    title="App Marketplace"
    description="Entdecken und installieren Sie Apps und Integrationen für Ihr CRM."
  />
);

export const SettingsPage = () => (
  <PlaceholderPage
    icon={Settings}
    title="Einstellungen"
    description="Verwalten Sie Ihre Account-Einstellungen, Integrationen und Benutzer."
  />
);
