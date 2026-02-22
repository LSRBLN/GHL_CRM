import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  MapPin,
  Star,
  Plus,
  Filter,
  ChevronDown,
  Users,
  Info,
  Globe,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  UserPlus,
  Columns3,
  StarHalf,
  FileText,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { radiusOptions } from '../data/prospectingData';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Star rating component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} size={14} className="fill-amber-400 text-amber-400" />
      ))}
      {hasHalf && (
        <div className="relative">
          <Star size={14} className="text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-[7px]">
            <Star size={14} className="fill-amber-400 text-amber-400" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} size={14} className="text-gray-300" />
      ))}
    </div>
  );
};

// Online Presence Icons
const OnlinePresenceIcons = ({ presence }) => (
  <div className="flex items-center gap-1.5">
    <TooltipProvider delayDuration={100}>
      {/* Google Business */}
      <Tooltip>
        <TooltipTrigger>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
            presence.google ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill={presence.google ? '#4285F4' : '#9CA3AF'} />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill={presence.google ? '#34A853' : '#9CA3AF'} />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill={presence.google ? '#FBBC05' : '#9CA3AF'} />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill={presence.google ? '#EA4335' : '#9CA3AF'} />
            </svg>
          </div>
        </TooltipTrigger>
        <TooltipContent><span className="text-xs">Google Business</span></TooltipContent>
      </Tooltip>

      {/* Facebook */}
      <Tooltip>
        <TooltipTrigger>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
            presence.facebook ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill={presence.facebook ? '#1877F2' : '#9CA3AF'}>
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        </TooltipTrigger>
        <TooltipContent><span className="text-xs">Facebook</span></TooltipContent>
      </Tooltip>

      {/* Instagram */}
      <Tooltip>
        <TooltipTrigger>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
            presence.instagram ? 'bg-pink-100' : 'bg-gray-100'
          }`}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill={presence.instagram ? '#E4405F' : '#9CA3AF'}>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </div>
        </TooltipTrigger>
        <TooltipContent><span className="text-xs">Instagram</span></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

const Prospecting = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('gastro');
  const [location, setLocation] = useState('Wedding, Wedding, 13 Berlin, Deutschland');
  const [radius, setRadius] = useState('5');
  const [selectedRows, setSelectedRows] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [savedLeads, setSavedLeads] = useState(new Set());

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === businesses.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(businesses.map((b) => b.id));
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setSearchError(null);
    try {
      const res = await axios.post(`${API}/prospecting/search`, {
        keyword: searchTerm,
        location: location,
        radius: parseInt(radius),
      });
      // Map snake_case to camelCase for frontend compatibility
      const mapped = res.data.businesses.map((b) => ({
        ...b,
        onlinePresence: b.online_presence || {},
        conversionRate: b.conversion_rate || 50,
        conversionLabel: b.conversion_label || 'Mäßig',
        hasWebsite: b.has_website !== undefined ? b.has_website : !!b.website,
        reviewCount: b.review_count || 0,
      }));
      setBusinesses(mapped);
      setHasSearched(true);
      setSearchError(null);
    } catch (err) {
      console.error('Search error:', err);
      setBusinesses([]);
      setSearchError('Suche fehlgeschlagen. Bitte erneut versuchen.');
      setHasSearched(true);
    }
    setLoading(false);
  };

  const handleAddLead = async (biz) => {
    try {
      await axios.post(`${API}/prospecting/leads`, {
        name: biz.name,
        address: biz.address,
        phone: biz.phone,
        website: biz.website,
        rating: biz.rating,
        review_count: biz.reviewCount || biz.review_count || 0,
        category: biz.category,
        conversion_rate: biz.conversionRate || biz.conversion_rate || 50,
        online_presence: biz.onlinePresence || biz.online_presence || {},
      });
      setSavedLeads((prev) => new Set([...prev, biz.id]));
    } catch (err) {
      console.error('Save lead error:', err);
    }
  };

  const handleViewReport = (biz) => {
    const params = new URLSearchParams({
      name: biz.name,
      address: biz.address,
      phone: biz.phone || '',
      website: biz.website || '',
      rating: biz.rating.toString(),
      reviews: (biz.reviewCount || biz.review_count || 0).toString(),
    });
    navigate(`/report?${params.toString()}`);
  };

  const handleCreateOffer = (biz) => {
    const params = new URLSearchParams({
      name: biz.name,
      address: biz.address,
      phone: biz.phone || '',
      website: biz.website || '',
      rating: biz.rating.toString(),
      reviews: (biz.reviewCount || biz.review_count || 0).toString(),
      score: (biz.conversionRate || biz.conversion_rate || 50).toString(),
    });
    navigate(`/offer?${params.toString()}`);
  };

  const getConversionColor = (label) => {
    if (label === 'Wahrscheinlicher') return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-orange-100 text-orange-700 border-orange-200';
  };

  const getConversionBarColor = (rate) => {
    if (rate >= 70) return 'bg-green-500';
    if (rate >= 50) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900" data-testid="prospecting-page-title">Marketing-Audit-Bericht</h1>
        <p className="text-sm text-gray-500 mt-0.5" data-testid="prospecting-page-subtitle">
          Teilen Sie diesen Bericht mit Ihren Kunden, um Ihre Dienstleistungen zu verkaufen.
        </p>
      </div>

      {/* Search Form */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-end gap-4">
            {/* Search Term */}
            <div className="flex-[2]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Suchbegriff / Firmenname
              </label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="z.B. gastro, restaurant, friseur..."
                className="h-10"
                data-testid="prospecting-search-input"
              />
            </div>

            {/* Location */}
            <div className="flex-[2]">
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1.5">
                Standort
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={13} className="text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="text-xs">Geben Sie eine Stadt oder Adresse ein</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Stadt, Adresse..."
                className="h-10"
                data-testid="prospecting-location-input"
              />
            </div>

            {/* Radius */}
            <div className="w-[160px]">
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1.5">
                Radius
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={13} className="text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="text-xs">Suchradius um den Standort</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <Select value={radius} onValueChange={setRadius}>
                <SelectTrigger className="h-10" data-testid="prospecting-radius-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {radiusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
              data-testid="prospecting-search-button"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Suchen'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      {hasSearched && (
        <>
          <div className="w-full h-[220px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d19426.552856862635!2d13.3489!3d52.5422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sde!2sde!4v1690000000000!5m2!1sde!2sde"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              data-testid="prospecting-map-iframe"
            />
          </div>

          {searchError && (
            <div
              className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
              data-testid="prospecting-search-error"
            >
              {searchError}
            </div>
          )}

          {!searchError && businesses.length === 0 && (
            <div
              className="mt-3 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
              data-testid="prospecting-no-results"
            >
              Keine Ergebnisse gefunden. Versuchen Sie einen anderen Suchbegriff oder Standort.
            </div>
          )}

          {/* Results Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-800" data-testid="prospecting-results-summary">
                Wählen Sie ein Unternehmen aus, um einen Marketing-Auditbericht zu erstellen
              </p>
              <Badge
                variant="secondary"
                className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                data-testid="prospecting-results-count"
              >
                {businesses.length} Unternehmen
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"
                data-testid="prospecting-selected-count"
              >
                {selectedRows.length}/15 Zeilen ausgewählt
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-sm gap-1.5 h-8 text-gray-600" data-testid="prospecting-filter-button">
                <Filter size={13} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-sm gap-1.5 h-8 text-gray-600"
                data-testid="prospecting-columns-button"
              >
                <Columns3 size={13} />
                Spalten verwalten
                <ChevronDown size={12} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-sm gap-1.5 h-8 text-gray-600"
                data-testid="prospecting-add-multi-button"
              >
                <UserPlus size={13} />
                Mehrere Interessenten hinzufügen
              </Button>
            </div>
          </div>

          {/* Results Table */}
          <Card className="border border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="w-10 px-3 py-3">
                      <Checkbox
                        checked={selectedRows.length === businesses.length && businesses.length > 0}
                        onCheckedChange={toggleSelectAll}
                        data-testid="prospecting-select-all-checkbox"
                      />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[240px]">
                      Unternehmen
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Konversionsrate
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info size={12} className="text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <span className="text-xs">Geschätzte Wahrscheinlichkeit der Kundengewinnung</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Online-Präsenz
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info size={12} className="text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <span className="text-xs">Vorhandene Online-Profile des Unternehmens</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Bewertung
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[200px]">
                      Aktivitäten
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {businesses.map((biz) => (
                    <tr
                      key={biz.id}
                      className={`hover:bg-gray-50 transition-colors group ${
                        selectedRows.includes(biz.id) ? 'bg-blue-50/50' : ''
                      }`}
                      data-testid={`prospecting-row-${biz.id}`}
                    >
                      <td className="px-3 py-4">
                        <Checkbox
                          checked={selectedRows.includes(biz.id)}
                          onCheckedChange={() => toggleRow(biz.id)}
                          data-testid={`prospecting-row-checkbox-${biz.id}`}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0 mt-0.5">
                            <Users size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight" data-testid={`prospecting-business-name-${biz.id}`}>{biz.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                              <p className="text-xs text-gray-500 leading-tight" data-testid={`prospecting-business-address-${biz.id}`}>{biz.address}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-800">{biz.conversionRate}%</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${getConversionColor(biz.conversionLabel)}`}>
                            {biz.conversionLabel}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <OnlinePresenceIcons presence={biz.onlinePresence} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-gray-800">{biz.rating}</span>
                          <StarRating rating={biz.rating} />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{biz.reviewCount} Bewertungen</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm ${
                          biz.hasWebsite ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {biz.hasWebsite ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium border border-gray-200 whitespace-nowrap">
                          {biz.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewReport(biz)}
                            className="text-xs text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 whitespace-nowrap transition-colors px-2 py-1 rounded hover:bg-blue-50"
                            title="Audit-Bericht anzeigen"
                          >
                            <Eye size={13} />
                            Bericht
                          </button>
                          <button
                            onClick={() => handleCreateOffer(biz)}
                            className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1 whitespace-nowrap transition-colors px-2 py-1 rounded hover:bg-green-50"
                            title="Angebot erstellen"
                          >
                            <FileText size={13} />
                            Angebot
                          </button>
                          {savedLeads.has(biz.id) ? (
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1 whitespace-nowrap px-2 py-1">
                              <CheckCircle2 size={13} />
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAddLead(biz)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 whitespace-nowrap transition-colors px-2 py-1 rounded hover:bg-blue-50"
                            >
                              <Plus size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Prospecting;
