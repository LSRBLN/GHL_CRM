import React, { useState } from 'react';
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Mail,
  MessageCircle,
  Hash,
  ChevronDown,
  Star,
  Clock,
  User,
  Tag,
  FileText,
  Calendar,
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { conversations } from '../data/mockData';

const channelIcons = {
  sms: MessageCircle,
  email: Mail,
  whatsapp: Hash,
};

const Conversations = () => {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredConversations = conversations.filter(
    (c) =>
      c.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (messageInput.trim()) {
      setMessageInput('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-56px)] -m-6 -mt-6">
      {/* Conversation List */}
      <div className="w-[340px] border-r border-gray-200 bg-white flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Konversationen</h2>
            <Badge variant="secondary" className="text-xs">
              {conversations.reduce((s, c) => s + c.unread, 0)} neu
            </Badge>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Konversationen suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <div className="flex gap-1 mt-2">
            {['all', 'unread', 'starred'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  activeFilter === f
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? 'Alle' : f === 'unread' ? 'Ungelesen' : 'Markiert'}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => {
            const ChannelIcon = channelIcons[conv.channel] || MessageCircle;
            const isSelected = selectedConversation?.id === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`flex items-start gap-3 px-3 py-3 border-b border-gray-100 cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-50 border-l-2 border-l-blue-500' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
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
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <ChannelIcon size={12} className="text-gray-400 flex-shrink-0" />
                    <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                  </div>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-1">
                    {conv.unread}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat Header */}
          <div className="h-[60px] px-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                {selectedConversation.contact.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{selectedConversation.contact.name}</p>
                <p className="text-xs text-gray-500">{selectedConversation.contact.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors">
                <Phone size={16} />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors">
                <Video size={16} />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors">
                <Star size={16} />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-center">
              <span className="text-[11px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {new Date(selectedConversation.messages[0]?.time).toLocaleDateString('de-DE', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
            </div>
            {selectedConversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {new Date(msg.time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Nachricht eingeben..."
                  className="w-full min-h-[40px] max-h-[120px] px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  rows={1}
                />
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-md hover:bg-gray-100 text-gray-400 transition-colors">
                  <Paperclip size={18} />
                </button>
                <button className="p-2 rounded-md hover:bg-gray-100 text-gray-400 transition-colors">
                  <Smile size={18} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!messageInput.trim()}
                  className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <p className="text-sm">Wählen Sie eine Konversation aus</p>
        </div>
      )}

      {/* Right Panel - Contact Details */}
      {selectedConversation && (
        <div className="w-[280px] border-l border-gray-200 bg-white flex-shrink-0 overflow-y-auto">
          <div className="p-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600 mx-auto mb-2">
                {selectedConversation.contact.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <p className="text-sm font-semibold text-gray-900">{selectedConversation.contact.name}</p>
              <p className="text-xs text-gray-500">{selectedConversation.contact.company}</p>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full grid grid-cols-3 h-9">
                <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
                <TabsTrigger value="activity" className="text-xs">Aktivität</TabsTrigger>
                <TabsTrigger value="notes" className="text-xs">Notizen</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-3">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-gray-600">{selectedConversation.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-gray-600">{selectedConversation.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-gray-400" />
                    <span className="text-gray-600">{selectedConversation.contact.company}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Tag size={14} className="text-gray-400 mt-0.5" />
                    <div className="flex gap-1 flex-wrap">
                      {selectedConversation.contact.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[11px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="activity" className="mt-3">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Clock size={14} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-700">Letzte Aktivität</p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedConversation.contact.lastActivity).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-700">Erstellt am</p>
                      <p className="text-xs text-gray-500">{selectedConversation.contact.created}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notes" className="mt-3">
                <div className="text-center py-6">
                  <FileText size={24} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Noch keine Notizen vorhanden</p>
                  <button className="text-xs text-blue-600 mt-1 hover:underline">Notiz hinzufügen</button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversations;
