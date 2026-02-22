// Mock data for GoHighLevel CRM clone

export const currentUser = {
  id: '1',
  name: 'Max Mustermann',
  email: 'phnxvision@gmail.com',
  avatar: null,
  initials: 'MM',
  role: 'Agency Admin',
  company: 'PHNX Vision',
  location: 'PHNX Vision Agency',
};

export const stats = {
  totalContacts: 2847,
  newContacts: 184,
  activeConversations: 47,
  appointmentsToday: 12,
  tasksOverdue: 8,
  tasksDueToday: 15,
  totalRevenue: 148750,
  monthlyRevenue: 32450,
  pipelineValue: 287500,
  wonDeals: 23,
  lostDeals: 7,
  openDeals: 34,
  emailsSent: 12480,
  emailOpenRate: 24.8,
  clickRate: 3.2,
  unsubscribeRate: 0.4,
};

export const revenueData = [
  { month: 'Jan', revenue: 18500, target: 20000 },
  { month: 'Feb', revenue: 22300, target: 20000 },
  { month: 'Mär', revenue: 19800, target: 22000 },
  { month: 'Apr', revenue: 28400, target: 25000 },
  { month: 'Mai', revenue: 31200, target: 28000 },
  { month: 'Jun', revenue: 32450, target: 30000 },
];

export const pipelineStages = [
  { id: '1', name: 'Neue Anfrage', count: 12, value: 48000, color: '#6366F1' },
  { id: '2', name: 'Qualifiziert', count: 8, value: 64000, color: '#3B82F6' },
  { id: '3', name: 'Angebot gesendet', count: 6, value: 72000, color: '#F59E0B' },
  { id: '4', name: 'Verhandlung', count: 5, value: 55000, color: '#10B981' },
  { id: '5', name: 'Gewonnen', count: 3, value: 48500, color: '#22C55E' },
];

export const contacts = [
  { id: '1', name: 'Anna Schmidt', email: 'anna.schmidt@email.de', phone: '+49 171 2345678', company: 'Schmidt GmbH', tags: ['VIP', 'Kunde'], lastActivity: '2025-07-15T10:30:00', status: 'active', source: 'Website', assignedTo: 'Max Mustermann', created: '2025-01-12' },
  { id: '2', name: 'Thomas Weber', email: 'thomas.weber@techfirm.de', phone: '+49 172 3456789', company: 'TechFirm AG', tags: ['Lead'], lastActivity: '2025-07-14T14:20:00', status: 'active', source: 'Facebook', assignedTo: 'Max Mustermann', created: '2025-02-23' },
  { id: '3', name: 'Lisa Müller', email: 'lisa.mueller@startup.io', phone: '+49 173 4567890', company: 'StartUp.io', tags: ['Prospect', 'Follow-up'], lastActivity: '2025-07-14T09:15:00', status: 'active', source: 'Google Ads', assignedTo: 'Sarah Klein', created: '2025-03-05' },
  { id: '4', name: 'Michael Braun', email: 'm.braun@braun-consulting.de', phone: '+49 174 5678901', company: 'Braun Consulting', tags: ['Kunde'], lastActivity: '2025-07-13T16:45:00', status: 'active', source: 'Empfehlung', assignedTo: 'Max Mustermann', created: '2025-01-30' },
  { id: '5', name: 'Julia Fischer', email: 'julia@fischer-marketing.de', phone: '+49 175 6789012', company: 'Fischer Marketing', tags: ['Lead', 'Warm'], lastActivity: '2025-07-13T11:00:00', status: 'active', source: 'LinkedIn', assignedTo: 'Sarah Klein', created: '2025-04-18' },
  { id: '6', name: 'Stefan Koch', email: 'stefan.koch@koch-bau.de', phone: '+49 176 7890123', company: 'Koch Bau GmbH', tags: ['Prospect'], lastActivity: '2025-07-12T08:30:00', status: 'inactive', source: 'Website', assignedTo: 'Max Mustermann', created: '2025-05-02' },
  { id: '7', name: 'Maria Wagner', email: 'maria@wagner-design.de', phone: '+49 177 8901234', company: 'Wagner Design', tags: ['Kunde', 'Premium'], lastActivity: '2025-07-11T15:20:00', status: 'active', source: 'Empfehlung', assignedTo: 'Sarah Klein', created: '2025-02-14' },
  { id: '8', name: 'Frank Becker', email: 'frank.becker@becker-it.de', phone: '+49 178 9012345', company: 'Becker IT', tags: ['Lead'], lastActivity: '2025-07-10T13:10:00', status: 'active', source: 'Google Ads', assignedTo: 'Max Mustermann', created: '2025-06-01' },
  { id: '9', name: 'Sandra Hoffmann', email: 's.hoffmann@hoffmann-law.de', phone: '+49 179 0123456', company: 'Hoffmann Kanzlei', tags: ['VIP', 'Kunde'], lastActivity: '2025-07-09T10:00:00', status: 'active', source: 'Empfehlung', assignedTo: 'Max Mustermann', created: '2025-01-05' },
  { id: '10', name: 'Peter Schulz', email: 'peter@schulz-auto.de', phone: '+49 170 1234567', company: 'Schulz Automobile', tags: ['Prospect'], lastActivity: '2025-07-08T17:30:00', status: 'inactive', source: 'Facebook', assignedTo: 'Sarah Klein', created: '2025-05-22' },
];

export const conversations = [
  {
    id: '1',
    contact: contacts[0],
    channel: 'sms',
    unread: 2,
    lastMessage: 'Vielen Dank für das Angebot! Wann können wir uns treffen?',
    lastMessageTime: '2025-07-15T10:30:00',
    messages: [
      { id: 'm1', sender: 'contact', text: 'Hallo, ich interessiere mich für Ihre Dienstleistungen.', time: '2025-07-15T09:00:00' },
      { id: 'm2', sender: 'user', text: 'Hallo Anna! Vielen Dank für Ihr Interesse. Ich sende Ihnen gerne ein Angebot zu.', time: '2025-07-15T09:15:00' },
      { id: 'm3', sender: 'user', text: 'Hier ist unser aktuelles Angebot für die Marketing-Beratung.', time: '2025-07-15T09:30:00' },
      { id: 'm4', sender: 'contact', text: 'Vielen Dank für das Angebot! Wann können wir uns treffen?', time: '2025-07-15T10:30:00' },
    ],
  },
  {
    id: '2',
    contact: contacts[1],
    channel: 'email',
    unread: 0,
    lastMessage: 'Ich werde die Unterlagen heute noch durchsehen.',
    lastMessageTime: '2025-07-14T14:20:00',
    messages: [
      { id: 'm5', sender: 'user', text: 'Hallo Thomas, hier sind die angeforderten Unterlagen.', time: '2025-07-14T12:00:00' },
      { id: 'm6', sender: 'contact', text: 'Ich werde die Unterlagen heute noch durchsehen.', time: '2025-07-14T14:20:00' },
    ],
  },
  {
    id: '3',
    contact: contacts[2],
    channel: 'whatsapp',
    unread: 1,
    lastMessage: 'Super, freue mich auf den Termin am Freitag!',
    lastMessageTime: '2025-07-14T09:15:00',
    messages: [
      { id: 'm7', sender: 'user', text: 'Hallo Lisa, sollen wir einen Termin für Freitag vereinbaren?', time: '2025-07-13T16:00:00' },
      { id: 'm8', sender: 'contact', text: 'Super, freue mich auf den Termin am Freitag!', time: '2025-07-14T09:15:00' },
    ],
  },
  {
    id: '4',
    contact: contacts[3],
    channel: 'sms',
    unread: 0,
    lastMessage: 'Die neue Kampagne läuft hervorragend. Danke für die Unterstützung!',
    lastMessageTime: '2025-07-13T16:45:00',
    messages: [
      { id: 'm9', sender: 'contact', text: 'Die neue Kampagne läuft hervorragend. Danke für die Unterstützung!', time: '2025-07-13T16:45:00' },
    ],
  },
  {
    id: '5',
    contact: contacts[4],
    channel: 'email',
    unread: 3,
    lastMessage: 'Können Sie mir bitte nochmal den Link zum Onboarding-Portal schicken?',
    lastMessageTime: '2025-07-13T11:00:00',
    messages: [
      { id: 'm10', sender: 'contact', text: 'Können Sie mir bitte nochmal den Link zum Onboarding-Portal schicken?', time: '2025-07-13T11:00:00' },
    ],
  },
];

export const appointments = [
  { id: '1', title: 'Strategiegespräch', contact: 'Anna Schmidt', time: '09:00', duration: '60 min', type: 'video', status: 'confirmed' },
  { id: '2', title: 'Onboarding-Call', contact: 'Lisa Müller', time: '10:30', duration: '30 min', type: 'phone', status: 'confirmed' },
  { id: '3', title: 'Kampagnen-Review', contact: 'Michael Braun', time: '13:00', duration: '45 min', type: 'video', status: 'pending' },
  { id: '4', title: 'Erstgespräch', contact: 'Stefan Koch', time: '14:30', duration: '30 min', type: 'in-person', status: 'confirmed' },
  { id: '5', title: 'Reporting-Meeting', contact: 'Sandra Hoffmann', time: '16:00', duration: '60 min', type: 'video', status: 'confirmed' },
];

export const tasks = [
  { id: '1', title: 'Follow-up Email an Thomas Weber senden', dueDate: '2025-07-15', priority: 'high', status: 'pending', assignedTo: 'Max Mustermann', contact: 'Thomas Weber' },
  { id: '2', title: 'Angebot für Fischer Marketing erstellen', dueDate: '2025-07-15', priority: 'high', status: 'pending', assignedTo: 'Max Mustermann', contact: 'Julia Fischer' },
  { id: '3', title: 'Social Media Posts für nächste Woche planen', dueDate: '2025-07-16', priority: 'medium', status: 'pending', assignedTo: 'Sarah Klein', contact: null },
  { id: '4', title: 'CRM Daten bereinigen', dueDate: '2025-07-17', priority: 'low', status: 'pending', assignedTo: 'Max Mustermann', contact: null },
  { id: '5', title: 'Reporting für Q2 finalisieren', dueDate: '2025-07-14', priority: 'high', status: 'overdue', assignedTo: 'Max Mustermann', contact: null },
  { id: '6', title: 'Neue Landing Page überprüfen', dueDate: '2025-07-14', priority: 'medium', status: 'overdue', assignedTo: 'Sarah Klein', contact: 'Maria Wagner' },
];

export const opportunities = [
  { id: '1', name: 'Website Relaunch', contact: 'Anna Schmidt', company: 'Schmidt GmbH', value: 12000, stage: 'Angebot gesendet', probability: 70, assignedTo: 'Max Mustermann', created: '2025-06-01', expected: '2025-08-15' },
  { id: '2', name: 'SEO Paket Premium', contact: 'Thomas Weber', company: 'TechFirm AG', value: 8500, stage: 'Qualifiziert', probability: 50, assignedTo: 'Max Mustermann', created: '2025-06-15', expected: '2025-09-01' },
  { id: '3', name: 'Social Media Management', contact: 'Lisa Müller', company: 'StartUp.io', value: 4800, stage: 'Neue Anfrage', probability: 30, assignedTo: 'Sarah Klein', created: '2025-07-01', expected: '2025-08-30' },
  { id: '4', name: 'Google Ads Kampagne', contact: 'Michael Braun', company: 'Braun Consulting', value: 15000, stage: 'Verhandlung', probability: 85, assignedTo: 'Max Mustermann', created: '2025-05-10', expected: '2025-07-30' },
  { id: '5', name: 'E-Mail Marketing Automation', contact: 'Julia Fischer', company: 'Fischer Marketing', value: 6200, stage: 'Qualifiziert', probability: 45, assignedTo: 'Sarah Klein', created: '2025-06-20', expected: '2025-09-15' },
  { id: '6', name: 'Branding Paket', contact: 'Maria Wagner', company: 'Wagner Design', value: 18000, stage: 'Gewonnen', probability: 100, assignedTo: 'Sarah Klein', created: '2025-04-05', expected: '2025-07-01' },
  { id: '7', name: 'Content Marketing Strategie', contact: 'Frank Becker', company: 'Becker IT', value: 9500, stage: 'Neue Anfrage', probability: 25, assignedTo: 'Max Mustermann', created: '2025-07-10', expected: '2025-10-01' },
  { id: '8', name: 'Lead Gen Funnel', contact: 'Sandra Hoffmann', company: 'Hoffmann Kanzlei', value: 22000, stage: 'Angebot gesendet', probability: 60, assignedTo: 'Max Mustermann', created: '2025-05-20', expected: '2025-08-20' },
];

export const calendarEvents = [
  { id: '1', title: 'Strategiegespräch - Anna Schmidt', start: '2025-07-15T09:00:00', end: '2025-07-15T10:00:00', type: 'meeting', color: '#3B82F6' },
  { id: '2', title: 'Onboarding-Call - Lisa Müller', start: '2025-07-15T10:30:00', end: '2025-07-15T11:00:00', type: 'call', color: '#10B981' },
  { id: '3', title: 'Kampagnen-Review - Michael Braun', start: '2025-07-15T13:00:00', end: '2025-07-15T13:45:00', type: 'meeting', color: '#3B82F6' },
  { id: '4', title: 'Erstgespräch - Stefan Koch', start: '2025-07-15T14:30:00', end: '2025-07-15T15:00:00', type: 'meeting', color: '#F59E0B' },
  { id: '5', title: 'Reporting-Meeting - Sandra Hoffmann', start: '2025-07-15T16:00:00', end: '2025-07-15T17:00:00', type: 'meeting', color: '#3B82F6' },
  { id: '6', title: 'Team Standup', start: '2025-07-16T09:00:00', end: '2025-07-16T09:15:00', type: 'internal', color: '#8B5CF6' },
  { id: '7', title: 'Newsletter versenden', start: '2025-07-17T10:00:00', end: '2025-07-17T10:30:00', type: 'task', color: '#EF4444' },
];

export const marketingEmails = [
  { id: '1', name: 'Juli Newsletter', status: 'sent', sent: 2480, opened: 612, clicked: 79, date: '2025-07-10' },
  { id: '2', name: 'Sommer-Angebot 2025', status: 'sent', sent: 1850, opened: 481, clicked: 62, date: '2025-07-05' },
  { id: '3', name: 'Webinar Einladung', status: 'draft', sent: 0, opened: 0, clicked: 0, date: '2025-07-16' },
  { id: '4', name: 'Kundenzufriedenheit Umfrage', status: 'scheduled', sent: 0, opened: 0, clicked: 0, date: '2025-07-18' },
];

export const workflows = [
  { id: '1', name: 'Neuer Lead - Willkommenssequenz', status: 'active', triggered: 342, enrolled: 289, completed: 201, type: 'automation' },
  { id: '2', name: 'Follow-up nach 7 Tagen', status: 'active', triggered: 156, enrolled: 145, completed: 98, type: 'automation' },
  { id: '3', name: 'Geburtstags-Grüße', status: 'active', triggered: 48, enrolled: 48, completed: 48, type: 'automation' },
  { id: '4', name: 'Termin-Erinnerung', status: 'active', triggered: 892, enrolled: 892, completed: 845, type: 'automation' },
  { id: '5', name: 'Inaktive Kontakte reaktivieren', status: 'paused', triggered: 67, enrolled: 52, completed: 12, type: 'automation' },
];

export const notifications = [
  { id: '1', title: 'Neuer Lead', message: 'Thomas Weber hat das Kontaktformular ausgefüllt', time: '5 Min', read: false },
  { id: '2', title: 'Termin bestätigt', message: 'Anna Schmidt hat den Termin für morgen bestätigt', time: '15 Min', read: false },
  { id: '3', title: 'Zahlung eingegangen', message: 'Maria Wagner - €3.500 Zahlung erhalten', time: '1 Std', read: false },
  { id: '4', title: 'Workflow abgeschlossen', message: 'Follow-up Sequenz für Lisa Müller beendet', time: '2 Std', read: true },
  { id: '5', title: 'Aufgabe fällig', message: 'Reporting für Q2 finalisieren - Überfällig', time: '3 Std', read: true },
];
