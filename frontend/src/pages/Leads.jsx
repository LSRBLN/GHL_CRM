import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Search,
  Filter,
  Trash2,
  Save,
  Download,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Tag,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const statusStages = [
  'New',
  'Prospect',
  'Contacted',
  'Offer Sent',
  'Qualified',
  'Negotiation',
  'Won',
  'Lost',
];

const Leads = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    status: 'New',
    tags: '',
    notes: '',
  });

  const fetchContacts = async ({ nextPage = page, nextSearch = searchQuery, nextStatus = statusFilter } = {}) => {
    setLoading(true);
    setActionError(null);
    try {
      const res = await axios.get(`${API}/contacts`, {
        params: {
          page: nextPage,
          limit: 10,
          search: nextSearch || undefined,
          status: nextStatus !== 'all' ? nextStatus : undefined,
        },
      });
      setContacts(res.data.contacts || []);
      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      console.error('Load contacts error:', err);
      setActionError('Kontakte konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };

  const fetchContactDetails = async (contactId) => {
    setDetailLoading(true);
    setActionError(null);
    try {
      const res = await axios.get(`${API}/contacts/${contactId}`);
      setSelectedContact(res.data);
      setEditForm({
        name: res.data.name || '',
        address: res.data.address || '',
        phone: res.data.phone || '',
        email: res.data.email || '',
        status: res.data.status || 'New',
        tags: (res.data.tags || []).join(', '),
        notes: res.data.notes || '',
      });
    } catch (err) {
      console.error('Contact detail error:', err);
      setActionError('Kontakt konnte nicht geladen werden.');
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts({ nextPage: 1, nextSearch: searchQuery, nextStatus: statusFilter });
    setPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchContacts({ nextPage: page });
  }, [page]);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleStatusUpdate = async (contactId, status) => {
    try {
      const res = await axios.put(`${API}/contacts/${contactId}`, { status });
      setContacts((prev) => prev.map((c) => (c.id === contactId ? res.data : c)));
      if (selectedContact?.id === contactId) {
        setSelectedContact(res.data);
        setEditForm((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      console.error('Status update error:', err);
      setActionError('Status konnte nicht aktualisiert werden.');
    }
  };

  const handleSave = async () => {
    if (!selectedContact) return;
    setSaveLoading(true);
    setActionError(null);
    try {
      const payload = {
        name: editForm.name,
        address: editForm.address,
        phone: editForm.phone,
        email: editForm.email,
        status: editForm.status,
        tags: editForm.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      const res = await axios.put(`${API}/contacts/${selectedContact.id}`, payload);
      setSelectedContact(res.data);
      setContacts((prev) => prev.map((c) => (c.id === res.data.id ? res.data : c)));
    } catch (err) {
      console.error('Save contact error:', err);
      setActionError('Kontakt konnte nicht gespeichert werden.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedContact) return;
    setDeleteLoading(true);
    setActionError(null);
    try {
      await axios.delete(`${API}/contacts/${selectedContact.id}`);
      setContacts((prev) => prev.filter((c) => c.id !== selectedContact.id));
      setSelectedContact(null);
    } catch (err) {
      console.error('Delete contact error:', err);
      setActionError('Kontakt konnte nicht gelöscht werden.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = () => {
    if (!selectedContact) return;
    const blob = new Blob([JSON.stringify(selectedContact, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedContact.name || 'kontakt'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const timeline = useMemo(() => {
    if (!selectedContact?.timeline) return [];
    return [...selectedContact.timeline].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [selectedContact]);

  return (
    <div className="space-y-5" data-testid="leads-page">
      <div>
        <h1 className="text-xl font-bold text-gray-900" data-testid="leads-title">Lead-Verwaltung</h1>
        <p className="text-sm text-gray-500" data-testid="leads-subtitle">
          Verwalten Sie alle Kontakte, Status und Aktivitäten an einem Ort.
        </p>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-4 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1 flex items-center gap-2">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Name, Adresse, Telefon oder E-Mail"
              className="h-10"
              data-testid="leads-search-input"
            />
            <Button
              onClick={handleSearch}
              className="h-10 gap-2"
              data-testid="leads-search-button"
            >
              <Search size={14} />
              Suchen
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-[200px]" data-testid="leads-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                {statusStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {actionError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2" data-testid="leads-error">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Kontakte</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table data-testid="leads-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Letzte Aktivität</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-sm text-gray-500 py-8">
                      Lädt...
                    </TableCell>
                  </TableRow>
                ) : contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-sm text-gray-500 py-8">
                      Keine Kontakte gefunden.
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      onClick={() => fetchContactDetails(contact.id)}
                      className="cursor-pointer"
                      data-testid={`leads-row-${contact.id}`}
                    >
                      <TableCell data-testid={`leads-name-${contact.id}`}>{contact.name}</TableCell>
                      <TableCell data-testid={`leads-address-${contact.id}`}>{contact.address}</TableCell>
                      <TableCell data-testid={`leads-phone-${contact.id}`}>{contact.phone || '-'}</TableCell>
                      <TableCell data-testid={`leads-email-${contact.id}`}>{contact.email || '-'}</TableCell>
                      <TableCell data-testid={`leads-score-${contact.id}`}>{contact.score || 0}%</TableCell>
                      <TableCell>
                        <Select
                          value={contact.status || 'New'}
                          onValueChange={(value) => handleStatusUpdate(contact.id, value)}
                        >
                          <SelectTrigger className="h-8" data-testid={`leads-status-select-${contact.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusStages.map((stage) => (
                              <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell data-testid={`leads-tags-${contact.id}`}>
                        <div className="flex flex-wrap gap-1">
                          {(contact.tags || []).map((tagItem) => (
                            <Badge key={tagItem} variant="secondary" className="text-[10px]">{tagItem}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell data-testid={`leads-last-activity-${contact.id}`}>
                        {contact.last_activity ? new Date(contact.last_activity).toLocaleDateString('de-DE') : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <span className="text-xs text-gray-500" data-testid="leads-pagination-info">
                Seite {page} von {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  data-testid="leads-pagination-prev"
                >
                  <ChevronLeft size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  data-testid="leads-pagination-next"
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Kontaktansicht</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedContact ? (
              <p className="text-sm text-gray-500" data-testid="leads-detail-empty">
                Wählen Sie einen Kontakt aus, um Details zu sehen.
              </p>
            ) : detailLoading ? (
              <p className="text-sm text-gray-500">Lädt...</p>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Name</label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                      data-testid="leads-detail-name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Adresse</label>
                    <Input
                      value={editForm.address}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                      data-testid="leads-detail-address"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Telefon</label>
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                        data-testid="leads-detail-phone"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">E-Mail</label>
                      <Input
                        value={editForm.email}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                        data-testid="leads-detail-email"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Status</label>
                      <Select
                        value={editForm.status}
                        onValueChange={(value) => setEditForm((prev) => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger data-testid="leads-detail-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusStages.map((stage) => (
                            <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Tags</label>
                      <Input
                        value={editForm.tags}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, tags: e.target.value }))}
                        placeholder="lead, hot-lead"
                        data-testid="leads-detail-tags"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Tag size={14} /> Timeline
                  </h4>
                  {timeline.length === 0 ? (
                    <p className="text-xs text-gray-500">Keine Aktivitäten vorhanden.</p>
                  ) : (
                    <div className="space-y-2" data-testid="leads-timeline">
                      {timeline.map((item) => (
                        <div key={item.id} className="p-2 border rounded-lg">
                          <p className="text-xs font-semibold text-gray-800">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.details}</p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {item.created_at ? new Date(item.created_at).toLocaleString('de-DE') : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex flex-wrap gap-2">
                  <Button
                    className="gap-1.5"
                    onClick={handleSave}
                    disabled={saveLoading}
                    data-testid="leads-save-button"
                  >
                    <Save size={14} />
                    {saveLoading ? 'Speichern...' : 'Speichern'}
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-1.5"
                    onClick={handleExport}
                    data-testid="leads-export-button"
                  >
                    <Download size={14} /> Exportieren
                  </Button>
                  <Button
                    variant="destructive"
                    className="gap-1.5"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    data-testid="leads-delete-button"
                  >
                    <Trash2 size={14} />
                    {deleteLoading ? 'Löschen...' : 'Löschen'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leads;
