import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Mail,
  Phone,
  MessageSquare,
  Eye,
  Trash2,
  Edit,
  Tag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { contacts } from '../data/mockData';

const tagColors = {
  VIP: 'bg-purple-100 text-purple-700',
  Kunde: 'bg-green-100 text-green-700',
  Lead: 'bg-blue-100 text-blue-700',
  Prospect: 'bg-amber-100 text-amber-700',
  'Follow-up': 'bg-orange-100 text-orange-700',
  Warm: 'bg-red-100 text-red-700',
  Premium: 'bg-indigo-100 text-indigo-700',
};

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredContacts.length / perPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const toggleSelect = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === paginatedContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(paginatedContacts.map((c) => c.id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Kontakte</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {contacts.length} Kontakte insgesamt
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-sm gap-1.5">
            <Upload size={14} />
            Importieren
          </Button>
          <Button variant="outline" size="sm" className="text-sm gap-1.5">
            <Download size={14} />
            Exportieren
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="text-sm gap-1.5 bg-blue-600 hover:bg-blue-700">
                <Plus size={14} />
                Kontakt hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Neuen Kontakt erstellen</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Vorname</Label>
                    <Input placeholder="Vorname" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Nachname</Label>
                    <Input placeholder="Nachname" className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label>E-Mail</Label>
                  <Input type="email" placeholder="email@beispiel.de" className="mt-1.5" />
                </div>
                <div>
                  <Label>Telefon</Label>
                  <Input type="tel" placeholder="+49 ..." className="mt-1.5" />
                </div>
                <div>
                  <Label>Unternehmen</Label>
                  <Input placeholder="Firmenname" className="mt-1.5" />
                </div>
                <div>
                  <Label>Tags</Label>
                  <Input placeholder="Tags eingeben..." className="mt-1.5" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Abbrechen
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddDialog(false)}>
                  Speichern
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Kontakte suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="text-sm gap-1.5 text-gray-600">
              <Filter size={14} />
              Filter
              <ChevronDown size={12} />
            </Button>
            <Button variant="outline" size="sm" className="text-sm gap-1.5 text-gray-600">
              <Tag size={14} />
              Tags
            </Button>
            {selectedContacts.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-500">
                  {selectedContacts.length} ausgewählt
                </span>
                <Button variant="outline" size="sm" className="text-sm text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 size={14} />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card className="border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={selectedContacts.length === paginatedContacts.length && paginatedContacts.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  E-Mail
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Telefon
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Quelle
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Letzte Aktivität
                </th>
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => toggleSelect(contact.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                        {contact.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contact.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contact.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {contact.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            tagColors[tag] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contact.source}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(contact.lastActivity).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal size={16} className="text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Eye size={14} /> Ansehen
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Edit size={14} /> Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Mail size={14} /> E-Mail senden
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Phone size={14} /> Anrufen
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <MessageSquare size={14} /> Nachricht senden
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600 cursor-pointer">
                          <Trash2 size={14} /> Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Zeige {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filteredContacts.length)} von{' '}
            {filteredContacts.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft size={14} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 p-0 text-xs ${
                  page === currentPage ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Contacts;
