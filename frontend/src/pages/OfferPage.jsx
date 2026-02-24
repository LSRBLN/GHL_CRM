import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Users,
  TrendingUp,
  Eye,
  DollarSign,
  Award,
  Clock,
  Phone,
  Mail,
  Globe,
  MapPin,
  Download,
  Share2,
  Printer,
  ChevronRight,
  Shield,
  Sparkles,
  Target,
  Zap,
  Check,
  ArrowUpRight,
  Send,
  Upload,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const benefitIcons = {
  'users': Users,
  'trending-up': TrendingUp,
  'eye': Eye,
  'dollar-sign': DollarSign,
  'award': Award,
  'clock': Clock,
};

const severityColors = {
  kritisch: 'bg-red-100 text-red-700 border-red-200',
  hoch: 'bg-orange-100 text-orange-700 border-orange-200',
  mittel: 'bg-amber-100 text-amber-700 border-amber-200',
};

const OfferPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [emailHtml, setEmailHtml] = useState('');
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [optimizingEmail, setOptimizingEmail] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [attachPdf, setAttachPdf] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchOffer = async () => {
      const offerId = searchParams.get('id');
      const businessName = searchParams.get('name');

      if (offerId) {
        try {
          const res = await axios.get(`${API}/prospecting/offer/${offerId}`);
          setOffer(res.data);
        } catch (err) {
          setError('Angebot nicht gefunden');
        }
      } else if (businessName) {
        try {
          const res = await axios.post(`${API}/prospecting/offer`, {
            business_name: businessName,
            address: searchParams.get('address') || '',
            phone: searchParams.get('phone') || '',
            website: searchParams.get('website') || '',
            rating: parseFloat(searchParams.get('rating') || '0'),
            review_count: parseInt(searchParams.get('reviews') || '0'),
            overall_score: parseInt(searchParams.get('score') || '50'),
            report_id: searchParams.get('report_id') || null,
          });
          setOffer(res.data);
        } catch (err) {
          setError('Fehler beim Erstellen des Angebots');
        }
      }
      setLoading(false);
    };
    fetchOffer();
  }, [searchParams]);

  useEffect(() => {
    if (!offer) return;
    setEmailSubject((prev) => prev || `Angebot für ${offer.business_name}`);
    const paramEmail = searchParams.get('email') || '';
    setEmailTo((prev) => prev || paramEmail);
  }, [offer, searchParams]);

  useEffect(() => {
    if (!emailModalOpen) return;
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(`${API}/email/templates`);
        setEmailTemplates(res.data.templates || []);
      } catch (err) {
        console.error('Template fetch error:', err);
      }
    };
    fetchTemplates();
  }, [emailModalOpen]);

  useEffect(() => {
    if (!selectedTemplateId) return;
    const template = emailTemplates.find((t) => t.id === selectedTemplateId);
    if (template) {
      setEmailSubject(template.subject || emailSubject);
      setEmailHtml(template.html || '');
    }
  }, [selectedTemplateId, emailTemplates]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500" data-testid="offer-loading-text">Angebot wird erstellt...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <XCircle size={48} className="text-red-400 mb-4" />
        <p className="text-gray-700 font-medium">{error || 'Angebot nicht verfügbar'}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/prospecting')}>
          Zurück zur Suche
        </Button>
      </div>
    );
  }

  const totalSavings = offer.total_price - (offer.discount_price || offer.total_price);
  const contactId = searchParams.get('contact_id');
  const reportId = searchParams.get('report_id');

  const handleTemplateUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadingTemplate(true);
    setEmailError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(`${API}/email/templates/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEmailTemplates((prev) => [res.data, ...prev]);
      setSelectedTemplateId(res.data.id);
    } catch (err) {
      console.error('Template upload error:', err);
      setEmailError('Template konnte nicht hochgeladen werden.');
    } finally {
      setUploadingTemplate(false);
      event.target.value = '';
    }
  };

  const handleOptimizeEmail = async () => {
    if (!emailSubject || !emailHtml) {
      setEmailError('Betreff und HTML müssen gefüllt sein.');
      return;
    }
    setOptimizingEmail(true);
    setEmailError(null);
    try {
      const res = await axios.post(`${API}/llm/optimize`, {
        subject: emailSubject,
        html: emailHtml,
      });
      setEmailSubject(res.data.subject || emailSubject);
      setEmailHtml(res.data.html || emailHtml);
    } catch (err) {
      console.error('Optimize error:', err);
      setEmailError('Optimierung fehlgeschlagen.');
    } finally {
      setOptimizingEmail(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailTo || !emailSubject || !emailHtml) {
      setEmailError('Bitte Empfänger, Betreff und Inhalt ausfüllen.');
      return;
    }
    setSendingEmail(true);
    setEmailError(null);
    setEmailSuccess(null);
    try {
      await axios.post(`${API}/email/send-offer`, {
        to_email: emailTo,
        subject: emailSubject,
        html: emailHtml,
        contact_id: contactId || null,
        report_id: reportId || offer.report_id || null,
        attach_report_pdf: attachPdf,
      });
      setEmailSuccess('E-Mail wurde gesendet.');
    } catch (err) {
      console.error('Send email error:', err);
      setEmailError('E-Mail konnte nicht gesendet werden.');
    } finally {
      setSendingEmail(false);
    }
  };
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1.5"
          data-testid="offer-back-button"
        >
          <ArrowLeft size={14} />
          Zurück
        </Button>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setEmailModalOpen(true)}
            data-testid="offer-email-open-button"
          >
            <Send size={14} /> Angebot per E-Mail senden
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" data-testid="offer-print-button">
            <Printer size={14} /> Drucken
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" data-testid="offer-share-button">
            <Share2 size={14} /> Teilen
          </Button>
          <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700" data-testid="offer-download-button">
            <Download size={14} /> PDF Download
          </Button>
        </div>
      </div>

      {/* Offer Header */}
      <Card className="border border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/10 rounded-full -ml-10 -mb-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-blue-400" />
              <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">
                Individuelles Angebot
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Maßgeschneidertes Marketing-Paket
            </h1>
            <p className="text-gray-400 text-base">
              für <span className="text-white font-semibold" data-testid="offer-business-name">{offer.business_name}</span>
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
              <span className="flex items-center gap-1" data-testid="offer-business-address"><MapPin size={12} /> {offer.address}</span>
              {offer.phone && (
                <span className="flex items-center gap-1" data-testid="offer-business-phone"><Phone size={12} /> {offer.phone}</span>
              )}
            </div>
          </div>
        </div>

        {/* Agency Info Bar */}
        <div className="flex items-center justify-between px-8 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">PV</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900" data-testid="offer-agency-name">{offer.agency_name}</p>
              <p className="text-xs text-gray-500" data-testid="offer-agency-email">{offer.agency_email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Gültig bis</p>
            <p className="text-sm font-semibold text-gray-900" data-testid="offer-valid-until">{offer.valid_until}</p>
          </div>
        </div>
      </Card>

      {/* Current Situation - Problems */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            <CardTitle className="text-lg">Ihre aktuelle Situation</CardTitle>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Unsere Analyse hat folgende Verbesserungsbereiche identifiziert:
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {offer.problems.map((problem, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${severityColors[problem.severity] || 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {problem.severity === 'kritisch' ? (
                      <XCircle size={18} className="text-red-500" />
                    ) : problem.severity === 'hoch' ? (
                      <AlertTriangle size={18} className="text-orange-500" />
                    ) : (
                      <AlertTriangle size={18} className="text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold">{problem.area}</span>
                      <Badge className={`text-[10px] ${
                        problem.severity === 'kritisch' ? 'bg-red-200 text-red-800' :
                        problem.severity === 'hoch' ? 'bg-orange-200 text-orange-800' :
                        'bg-amber-200 text-amber-800'
                      }`}>
                        {problem.severity}
                      </Badge>
                    </div>
                    <p className="text-sm">{problem.text}</p>
                    <p className="text-xs mt-1 opacity-75 font-medium">{problem.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Score comparison */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-xs text-gray-500 mb-1">Aktueller Score</p>
                <p className="text-3xl font-bold text-red-500">{offer.overall_score}%</p>
              </div>
              <div className="flex items-center gap-2 px-4">
                <ChevronRight size={20} className="text-gray-300" />
                <ChevronRight size={20} className="text-gray-400" />
                <ChevronRight size={20} className="text-green-500" />
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-gray-500 mb-1">Ziel nach Optimierung</p>
                <p className="text-3xl font-bold text-green-500">85%+</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits / Mehrwert */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-blue-600" />
            <CardTitle className="text-lg">Ihr Mehrwert</CardTitle>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Mit unseren Maßnahmen erreichen Sie folgende Verbesserungen:
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offer.benefits.map((benefit, idx) => {
              const Icon = benefitIcons[benefit.icon] || Zap;
              const colors = [
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600',
                'from-purple-500 to-purple-600',
                'from-amber-500 to-amber-600',
                'from-cyan-500 to-cyan-600',
                'from-rose-500 to-rose-600',
              ];
              return (
                <div key={idx} className="flex gap-4 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow bg-white">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-gray-900">{benefit.title}</h4>
                      <span className="text-lg font-bold text-green-600 flex items-center">
                        {benefit.metric}
                        <ArrowUpRight size={14} className="ml-0.5" />
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Services / Leistungen */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-blue-600" />
            <CardTitle className="text-lg">Unsere Leistungen für Sie</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {offer.services.map((service, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-bold text-gray-900">{service.name}</h4>
                    <span className="text-sm font-bold text-gray-800 whitespace-nowrap ml-4">
                      €{service.price.toLocaleString('de-DE', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <Separator className="my-6" />
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Gesamtpaket</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-gray-400 line-through text-lg">
                    €{offer.total_price.toLocaleString('de-DE', { minimumFractionDigits: 0 })}
                  </span>
                  <span className="text-3xl font-bold text-white">
                    €{(offer.discount_price || offer.total_price).toLocaleString('de-DE', { minimumFractionDigits: 0 })}
                  </span>
                </div>
                {totalSavings > 0 && (
                  <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    Sie sparen €{totalSavings.toLocaleString('de-DE', { minimumFractionDigits: 0 })} (15% Rabatt)
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Gültig bis</p>
                <p className="text-sm font-semibold">{offer.valid_until}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Shield size={12} />
                  <span>100% Zufriedenheitsgarantie</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Note */}
      {offer.custom_note && (
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-gray-700 italic">"{offer.custom_note}"</p>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <Card className="border-2 border-blue-200 bg-blue-50 shadow-sm">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Bereit durchzustarten?
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
            Kontaktieren Sie uns jetzt für ein unverbindliches Beratungsgespräch.
            Gemeinsam bringen wir Ihr Unternehmen auf Erfolgskurs.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 gap-1.5 px-6 h-11 text-base">
              <Phone size={16} />
              Jetzt anrufen
            </Button>
            <Button variant="outline" className="gap-1.5 px-6 h-11 text-base border-blue-300 text-blue-700 hover:bg-blue-100">
              <Mail size={16} />
              E-Mail senden
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            {offer.agency_phone} · {offer.agency_email}
          </p>
        </CardContent>
      </Card>

      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="max-w-3xl" data-testid="offer-email-modal">
          <DialogHeader>
            <DialogTitle>Angebot per E-Mail senden</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Betreff</label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Betreff eingeben"
                  data-testid="offer-email-subject-input"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">An</label>
                <Input
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="kunde@beispiel.de"
                  data-testid="offer-email-to-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Vorlage</label>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger data-testid="offer-email-template-select">
                    <SelectValue placeholder="Vorlage wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <div>
                  <Button
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingTemplate}
                    data-testid="offer-email-template-upload-button"
                  >
                    {uploadingTemplate ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    Neues Template hochladen
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.html"
                    className="hidden"
                    onChange={handleTemplateUpload}
                    data-testid="offer-email-template-file-input"
                  />
                </div>
                <Button
                  variant="outline"
                  className="gap-1.5"
                  onClick={handleOptimizeEmail}
                  disabled={optimizingEmail}
                  data-testid="offer-email-optimize-button"
                >
                  {optimizingEmail ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  Mit KI optimieren
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">HTML Inhalt</label>
              <Textarea
                rows={6}
                value={emailHtml}
                onChange={(e) => setEmailHtml(e.target.value)}
                placeholder="HTML Inhalt einfügen"
                data-testid="offer-email-html-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Live HTML Vorschau</label>
              <div
                className="border border-gray-200 rounded-lg p-3 min-h-[120px] bg-white"
                data-testid="offer-email-html-preview"
                dangerouslySetInnerHTML={{ __html: emailHtml }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={attachPdf}
                onCheckedChange={(value) => setAttachPdf(Boolean(value))}
                data-testid="offer-email-attach-pdf-checkbox"
              />
              <span className="text-sm text-gray-700">Audit-Bericht als echtes PDF anhängen</span>
            </div>

            {emailError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2" data-testid="offer-email-error">
                {emailError}
              </div>
            )}
            {emailSuccess && (
              <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2" data-testid="offer-email-success">
                {emailSuccess}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={handleSendEmail}
              className="bg-green-600 hover:bg-green-700 gap-1.5"
              disabled={sendingEmail}
              data-testid="offer-email-send-button"
            >
              {sendingEmail ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              Angebot senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfferPage;
