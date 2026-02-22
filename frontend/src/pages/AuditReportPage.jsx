import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Globe,
  Smartphone,
  Monitor,
  MessageSquare,
  Shield,
  Search,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Download,
  Share2,
  Printer,
  FileText,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Zap,
  BarChart3,
  Users,
  Eye,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Score circle component
const ScoreCircle = ({ score, size = 120, strokeWidth = 8, label, testId }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 81) return '#22C55E';
    if (s >= 61) return '#3B82F6';
    if (s >= 41) return '#F59E0B';
    if (s >= 21) return '#EF4444';
    return '#DC2626';
  };

  const getLabel = (s) => {
    if (s >= 81) return 'Exzellent';
    if (s >= 61) return 'Gut';
    if (s >= 41) return 'Mittel';
    if (s >= 21) return 'Schlecht';
    return 'Schlecht';
  };

  return (
    <div className="flex flex-col items-center" data-testid={testId}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: getColor(score) }}>
            {score}%
          </span>
        </div>
      </div>
      <span className="text-sm font-semibold mt-2" style={{ color: getColor(score) }}>
        {label || getLabel(score)}
      </span>
    </div>
  );
};

// Score bar component
const ScoreBar = ({ label, score, maxScore = 100 }) => {
  const getColor = (s) => {
    if (s >= 70) return 'bg-green-500';
    if (s >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-800">{score}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-full rounded-full ${getColor(score)} transition-all duration-700`}
          style={{ width: `${(score / maxScore) * 100}%` }}
        />
      </div>
    </div>
  );
};

// Status icon
const StatusIcon = ({ detected }) =>
  detected ? (
    <CheckCircle2 size={20} className="text-green-500" />
  ) : (
    <XCircle size={20} className="text-red-500" />
  );

// Listing status badge
const ListingStatusBadge = ({ status }) => {
  if (status.includes('bereinstimmung') && !status.includes('Unvollst') && !status.includes('Keine')) {
    return <Badge className="bg-green-100 text-green-700 text-[11px]">{status}</Badge>;
  }
  if (status.includes('Unvollst')) {
    return <Badge className="bg-amber-100 text-amber-700 text-[11px]">{status}</Badge>;
  }
  return <Badge className="bg-red-100 text-red-700 text-[11px]">{status}</Badge>;
};

const AuditReportPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    critical: true,
    techStack: true,
    google: true,
    listings: false,
    reputation: true,
    website: true,
    seo: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const fetchReport = async () => {
      const reportId = searchParams.get('id');
      const businessName = searchParams.get('name');

      if (reportId) {
        try {
          const res = await axios.get(`${API}/prospecting/report/${reportId}`);
          setReport(res.data);
        } catch (err) {
          setError('Bericht nicht gefunden');
        }
      } else if (businessName) {
        try {
          const res = await axios.post(`${API}/prospecting/report`, {
            business_name: businessName,
            address: searchParams.get('address') || '',
            phone: searchParams.get('phone') || '',
            website: searchParams.get('website') || '',
            rating: parseFloat(searchParams.get('rating') || '0'),
            review_count: parseInt(searchParams.get('reviews') || '0'),
          });
          setReport(res.data);
        } catch (err) {
          setError('Fehler beim Erstellen des Berichts');
        }
      }
      setLoading(false);
    };
    fetchReport();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Bericht wird erstellt...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <XCircle size={48} className="text-red-400 mb-4" />
        <p className="text-gray-700 font-medium" data-testid="audit-report-error-message">{error || 'Bericht nicht verfügbar'}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/prospecting')}
          data-testid="audit-report-error-back-button"
        >
          Zurück zur Suche
        </Button>
      </div>
    );
  }

  const seoHasCompetitors = report.seo?.competitors?.length > 0;
  const seoRankingDisplay =
    report.seo?.avg_ranking && report.seo.avg_ranking !== '—'
      ? report.seo.avg_ranking
      : 'Nicht verfügbar';

  const SectionHeader = ({ title, score, section, icon: Icon }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-t-lg"
      data-testid={`audit-section-toggle-${section}`}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon size={20} className="text-blue-600" />}
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {score !== undefined && (
          <div className="flex items-center gap-2 ml-2">
            <div className="w-16 bg-gray-100 rounded-full h-2">
              <div
                className={`h-full rounded-full transition-all ${
                  score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-700">{score}%</span>
          </div>
        )}
      </div>
      {expandedSections[section] ? (
        <ChevronUp size={18} className="text-gray-400" />
      ) : (
        <ChevronDown size={18} className="text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/prospecting')}
          className="gap-1.5"
          data-testid="audit-report-back-button"
        >
          <ArrowLeft size={14} />
          Zurück
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" data-testid="audit-report-print-button">
            <Printer size={14} />
            Drucken
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" data-testid="audit-report-share-button">
            <Share2 size={14} />
            Teilen
          </Button>
          <Button
            size="sm"
            className="gap-1.5 bg-green-600 hover:bg-green-700"
            onClick={() => {
              if (report) {
                const params = new URLSearchParams({
                  name: report.business_name,
                  address: report.address,
                  phone: report.phone || '',
                  website: report.website || '',
                  rating: report.rating.toString(),
                  reviews: report.review_count.toString(),
                  score: report.overall_score.toString(),
                  report_id: report.id || '',
                });
                navigate(`/offer?${params.toString()}`);
              }
            }}
            data-testid="audit-report-create-offer-button"
          >
            <FileText size={14} />
            Angebot erstellen
          </Button>
          <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700" data-testid="audit-report-download-button">
            <Download size={14} />
            PDF Download
          </Button>
        </div>
      </div>

      {/* Report Header Card */}
      <Card className="border border-gray-200 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium mb-1" data-testid="audit-report-agency-name">{report.agency_name}</p>
              <h1 className="text-2xl font-bold text-white mb-1" data-testid="audit-report-title">Marketing-Audit-Bericht</h1>
              <p className="text-gray-400 text-sm" data-testid="audit-report-date">
                Erstellt am {new Date(report.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right text-sm text-gray-400">
              <p className="flex items-center gap-1.5 justify-end" data-testid="audit-report-agency-phone">
                <Phone size={12} /> {report.agency_phone}
              </p>
              <p className="flex items-center gap-1.5 justify-end mt-1" data-testid="audit-report-agency-email">
                <Mail size={12} /> {report.agency_email}
              </p>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Users size={28} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900" data-testid="audit-report-business-name">{report.business_name}</h2>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500" data-testid="audit-report-business-address">
                <MapPin size={13} /> {report.address}
              </div>
              {report.phone && (
                <div className="flex items-center gap-1 mt-0.5 text-sm text-gray-500" data-testid="audit-report-business-phone">
                  <Phone size={13} /> {report.phone}
                </div>
              )}
              {report.website && (
                <div className="flex items-center gap-1 mt-0.5 text-sm text-blue-600" data-testid="audit-report-business-website">
                  <Globe size={13} /> {report.website}
                </div>
              )}
            </div>
            <ScoreCircle score={report.overall_score} size={130} label="Gesamtscore" testId="audit-report-overall-score" />
          </div>

          {/* Score explanation */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">
              <strong>Wie wird der Gesamtscore berechnet?</strong> Dieser Score gibt einen umfassenden Überblick über Ihre Online-Präsenz.
            </p>
            <div className="flex gap-1">
              {[
                { range: '0-20%', label: 'Schlecht', color: 'bg-red-500' },
                { range: '21-40%', label: 'Schlecht', color: 'bg-red-400' },
                { range: '41-60%', label: 'Mittel', color: 'bg-amber-400' },
                { range: '61-80%', label: 'Gut', color: 'bg-blue-500' },
                { range: '81-100%', label: 'Exzellent', color: 'bg-green-500' },
              ].map((item, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className={`h-2 rounded-full ${item.color} mb-1`} />
                  <p className="text-[10px] text-gray-500">{item.range}</p>
                  <p className="text-[10px] font-medium text-gray-700">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Info */}
      <Card className="border border-gray-200 shadow-sm">
        <SectionHeader title="Kritische Infos" section="critical" icon={AlertTriangle} />
        {expandedSections.critical && (
          <CardContent className="pt-0 pb-5 px-5">
            <p className="text-sm text-gray-500 mb-4">
              Wichtige Geschäftsinformationen, die Leistung und Reputation beeinflussen können:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { num: '01', title: 'SMS-Nummer', status: report.critical_info.sms_enabled, text: report.critical_info.sms_text, icon: Smartphone },
                { num: '02', title: 'Website-Hosting', status: !!report.website, text: report.critical_info.hosting_text, icon: Globe },
                { num: '03', title: 'Chat-Widget', status: report.critical_info.chat_widget, text: report.critical_info.chat_widget_text, icon: MessageSquare },
                { num: '04', title: 'Bewertungsantworten', status: report.critical_info.review_response_rate > 50, text: report.critical_info.review_response_text, icon: Star },
              ].map((item) => (
                <div
                  key={item.num}
                  className={`p-4 rounded-lg border ${item.status ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                  data-testid={`audit-report-critical-card-${item.num}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.status ? 'bg-green-100' : 'bg-red-100'}`}>
                      <item.icon size={16} className={item.status ? 'text-green-600' : 'text-red-600'} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-mono">{item.num}</span>
                        <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tech Stack */}
      <Card className="border border-gray-200 shadow-sm">
        <SectionHeader title="Tech-Stack-Analyse" section="techStack" icon={Zap} />
        {expandedSections.techStack && (
          <CardContent className="pt-0 pb-5 px-5">
            <p className="text-sm text-gray-500 mb-4">
              Dieser Bericht analysiert wichtige Marketingtechnologien auf Ihrer Website.
            </p>
            <div className="space-y-3">
              {report.tech_stack.map((tech, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  data-testid={`audit-report-tech-item-${idx}`}
                >
                  <StatusIcon detected={tech.detected} />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{tech.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{tech.description}</p>
                  </div>
                  <Badge className={`text-[11px] ${tech.detected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {tech.detected ? 'Erkannt' : 'Nicht erkannt'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Google Profile */}
      <Card className="border border-gray-200 shadow-sm">
        <SectionHeader title="Google-Profil" score={report.google_profile.score} section="google" icon={Search} />
        {expandedSections.google && (
          <CardContent className="pt-0 pb-5 px-5">
            <div className="flex items-center gap-4 mb-4">
              <ScoreCircle score={report.google_profile.score} size={80} strokeWidth={6} testId="audit-report-google-score" />
              <div>
                <p className="text-sm text-gray-700">
                  {report.google_profile.verified
                    ? `Ihr Unternehmen ${report.business_name} wurde erfolgreich verifiziert.`
                    : 'Ihr Google-Unternehmensprofil ist noch nicht verifiziert.'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusIcon detected={report.google_profile.verified} />
                  <span className="text-sm font-medium">{report.google_profile.verified ? 'Verifiziert' : 'Nicht verifiziert'}</span>
                </div>
              </div>
            </div>
            {report.google_profile.details && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Fotos', value: report.google_profile.details.photos || 0, ok: (report.google_profile.details.photos || 0) > 5 },
                  { label: 'Öffnungszeiten', value: report.google_profile.details.hours ? 'Vorhanden' : 'Fehlt', ok: report.google_profile.details.hours },
                  { label: 'Beschreibung', value: report.google_profile.details.description ? 'Vorhanden' : 'Fehlt', ok: report.google_profile.details.description },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${item.ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                    data-testid={`audit-report-google-detail-${idx}`}
                  >
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Listings */}
      <Card className="border border-gray-200 shadow-sm">
        <SectionHeader title="Einträge" score={report.listings.score} section="listings" icon={Globe} />
        {expandedSections.listings && (
          <CardContent className="pt-0 pb-5 px-5">
            <div className="flex items-center gap-6 mb-4">
              <ScoreCircle score={report.listings.score} size={80} strokeWidth={6} testId="audit-report-listings-score" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-3">{report.listings.summary_text}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2 rounded bg-green-50 border border-green-200 text-center" data-testid="audit-report-listings-exact">
                    <p className="text-lg font-bold text-green-700">{report.listings.exact_matches}</p>
                    <p className="text-[10px] text-green-600">Exakte Treffer</p>
                  </div>
                  <div className="p-2 rounded bg-amber-50 border border-amber-200 text-center" data-testid="audit-report-listings-partial">
                    <p className="text-lg font-bold text-amber-700">{report.listings.partial_matches}</p>
                    <p className="text-[10px] text-amber-600">Teilweise</p>
                  </div>
                  <div className="p-2 rounded bg-red-50 border border-red-200 text-center" data-testid="audit-report-listings-none">
                    <p className="text-lg font-bold text-red-700">{report.listings.no_matches}</p>
                    <p className="text-[10px] text-red-600">Keine</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Detailed listing table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Plattform</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Anzeigename</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Telefon</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Anschrift</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.listings.details.slice(0, 15).map((entry, idx) => (
                    <tr key={idx} className="hover:bg-gray-50" data-testid={`audit-report-listing-row-${idx}`}>
                      <td className="px-3 py-2 font-medium text-gray-800 text-xs" data-testid={`audit-report-listing-platform-${idx}`}>
                        {entry.platform}
                      </td>
                      <td className="px-3 py-2 text-gray-600 text-xs truncate max-w-[150px]" data-testid={`audit-report-listing-name-${idx}`}>
                        {entry.display_name}
                      </td>
                      <td className="px-3 py-2 text-gray-600 text-xs" data-testid={`audit-report-listing-phone-${idx}`}>
                        {entry.phone}
                      </td>
                      <td className="px-3 py-2 text-gray-600 text-xs truncate max-w-[150px]" data-testid={`audit-report-listing-address-${idx}`}>
                        {entry.address}
                      </td>
                      <td className="px-3 py-2" data-testid={`audit-report-listing-status-${idx}`}>
                        <ListingStatusBadge status={entry.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Reputation */}
      <Card className="border border-gray-200 shadow-sm">
        <SectionHeader title="Analyse Ihrer Reputation" score={report.reputation.score} section="reputation" icon={Star} />
        {expandedSections.reputation && (
          <CardContent className="pt-0 pb-5 px-5">
            <div className="flex items-start gap-6 mb-4">
              <ScoreCircle score={report.reputation.score} size={80} strokeWidth={6} testId="audit-report-reputation-score" />
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
                    <p className="text-xs text-gray-500">Analysierte Bewertungen</p>
                    <p className="text-xl font-bold text-gray-800" data-testid="audit-report-reputation-total-analyzed">{report.reputation.total_reviews_analyzed}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-center">
                    <p className="text-xs text-green-600">Positive</p>
                    <p className="text-xl font-bold text-green-700" data-testid="audit-report-reputation-positive-count">{report.reputation.positive_reviews}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-center">
                    <p className="text-xs text-red-600">Negative</p>
                    <p className="text-xl font-bold text-red-700" data-testid="audit-report-reputation-negative-count">{report.reputation.negative_reviews}</p>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">GMB-Bewertungen</p>
                    <p className="text-lg font-bold text-gray-800" data-testid="audit-report-reputation-gmb-reviews">{report.reputation.total_gmb_reviews >= 1000 ? `${(report.reputation.total_gmb_reviews / 1000).toFixed(1)}K` : report.reputation.total_gmb_reviews}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">GMB-Bewertung</p>
                    <div className="flex items-center justify-center gap-1">
                      <p className="text-lg font-bold text-gray-800" data-testid="audit-report-reputation-gmb-rating">{report.reputation.gmb_rating}</p>
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">FB-Bewertungen</p>
                    <p className="text-lg font-bold text-gray-800" data-testid="audit-report-reputation-fb-reviews">{report.reputation.total_fb_reviews}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Sample reviews */}
            {report.reputation.sample_reviews.length > 0 && (
              <div className="mt-4" data-testid="audit-report-sample-reviews">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Positive Bewertungen</h4>
                <div className="space-y-2">
                  {report.reputation.sample_reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-green-50 rounded-lg border border-green-200"
                      data-testid={`audit-report-sample-review-${idx}`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: parseInt(review.rating) }).map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 italic">"{review.text}"</p>
                      <p className="text-xs text-gray-500 mt-1">— {review.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Website Performance */}
      <Card className="border border-gray-200 shadow-sm">
        <SectionHeader title="Website-Performance" score={report.website_performance.score} section="website" icon={Monitor} />
        {expandedSections.website && (
          <CardContent className="pt-0 pb-5 px-5">
            {report.website ? (
              <>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Mobile */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Smartphone size={16} className="text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700">Mobil</span>
                    </div>
                    <ScoreCircle score={report.website_performance.mobile_score} size={90} strokeWidth={6} testId="audit-report-mobile-score" />
                    <p className="text-xs text-gray-500 mt-2">Ladezeit: {report.website_performance.mobile_speed}s</p>
                  </div>
                  {/* Desktop */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Monitor size={16} className="text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700">Desktop</span>
                    </div>
                    <ScoreCircle score={report.website_performance.desktop_score} size={90} strokeWidth={6} testId="audit-report-desktop-score" />
                    <p className="text-xs text-gray-500 mt-2">Ladezeit: {report.website_performance.desktop_speed}s</p>
                  </div>
                </div>
                <Separator className="mb-4" />
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Seitenbericht</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500">Mobilbericht</p>
                    <div className="flex items-center gap-2 text-sm">
                      <XCircle size={14} className="text-red-500" />
                      <span className="text-gray-700">{report.website_performance.mobile_issues} Sollte behoben werden</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle size={14} className="text-amber-500" />
                      <span className="text-gray-700">{report.website_performance.mobile_warnings} Erwägen Sie eine Behebung</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={14} className="text-green-500" />
                      <span className="text-gray-700">{report.website_performance.mobile_passed} Test erfolgreich</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500">Desktop-Bericht</p>
                    <div className="flex items-center gap-2 text-sm">
                      <XCircle size={14} className="text-red-500" />
                      <span className="text-gray-700">{report.website_performance.desktop_issues} Sollte behoben werden</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle size={14} className="text-amber-500" />
                      <span className="text-gray-700">{report.website_performance.desktop_warnings} Erwägen Sie eine Behebung</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={14} className="text-green-500" />
                      <span className="text-gray-700">{report.website_performance.desktop_passed} Test erfolgreich</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <XCircle size={32} className="text-red-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Keine Website gefunden. Eine Website ist entscheidend für Ihre Online-Präsenz.</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* SEO Analysis */}
      <Card className="border border-gray-200 shadow-sm">
        <SectionHeader title="SEO-Analyse" score={report.seo.score} section="seo" icon={BarChart3} />
        {expandedSections.seo && (
          <CardContent className="pt-0 pb-5 px-5">
            <div className="flex items-start gap-6 mb-4">
              <ScoreCircle score={report.seo.score} size={80} strokeWidth={6} testId="audit-report-seo-score" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2" data-testid="audit-report-seo-description">
                  Dies ist Ihr durchschnittliches Ranking auf Google Maps, wenn jemand nach "{report.seo.keyword_used}" in meiner Nähe sucht.
                </p>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500">Ihr Rang</p>
                  <p className="text-2xl font-bold text-gray-800" data-testid="audit-report-seo-ranking">{seoRankingDisplay}</p>
                </div>
              </div>
            </div>
            {/* Competitor table */}
            <h4
              className="text-sm font-semibold text-gray-900 mb-2"
              data-testid="audit-report-seo-competitor-title"
            >
              Rang-Tracker
            </h4>
            {seoHasCompetitors ? (
              <div className="overflow-x-auto" data-testid="audit-report-seo-competitor-table">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">#</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Firmenname</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Fotos</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Bewertungen</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Bewertung</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {report.seo.competitors.map((comp, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50"
                        data-testid={`audit-report-seo-competitor-row-${idx}`}
                      >
                        <td
                          className="px-3 py-2 text-gray-500 text-xs"
                          data-testid={`audit-report-seo-competitor-rank-${idx}`}
                        >
                          {idx + 1}
                        </td>
                        <td
                          className="px-3 py-2 font-medium text-gray-800 text-xs"
                          data-testid={`audit-report-seo-competitor-name-${idx}`}
                        >
                          {comp.name}
                        </td>
                        <td
                          className="px-3 py-2 text-gray-600 text-xs"
                          data-testid={`audit-report-seo-competitor-photos-${idx}`}
                        >
                          {comp.photos}
                        </td>
                        <td
                          className="px-3 py-2 text-gray-600 text-xs"
                          data-testid={`audit-report-seo-competitor-reviews-${idx}`}
                        >
                          {comp.reviews}
                        </td>
                        <td
                          className="px-3 py-2"
                          data-testid={`audit-report-seo-competitor-rating-${idx}`}
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-800">{comp.rating}</span>
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                data-testid="audit-report-seo-no-data"
              >
                Keine Wettbewerbsdaten verfügbar. Bitte später erneut prüfen.
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* CTA */}
      <Card className="border-2 border-blue-200 bg-blue-50 shadow-sm">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2" data-testid="audit-report-cta-title">Bereit, Ihre Online-Präsenz zu verbessern?</h3>
          <p className="text-sm text-gray-600 mb-4" data-testid="audit-report-cta-description">
            Kontaktieren Sie {report.agency_name} für eine kostenlose Beratung und maßgeschneiderte Lösungen.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 gap-1.5" data-testid="audit-report-cta-call-button">
              <Phone size={14} />
              Jetzt kontaktieren
            </Button>
            <Button variant="outline" className="gap-1.5" data-testid="audit-report-cta-email-button">
              <Mail size={14} />
              E-Mail senden
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditReportPage;
