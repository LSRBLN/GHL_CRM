import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Conversations from "./pages/Conversations";
import Opportunities from "./pages/Opportunities";
import CalendarPage from "./pages/CalendarPage";
import Marketing from "./pages/Marketing";
import Automation from "./pages/Automation";
import Payments from "./pages/Payments";
import Reporting from "./pages/Reporting";
import Prospecting from "./pages/Prospecting";
import AuditReportPage from "./pages/AuditReportPage";
import OfferPage from "./pages/OfferPage";
import {
  Sites,
  Reputation,
  MediaStorage,
  Memberships,
  Marketplace,
  SettingsPage,
} from "./pages/PlaceholderPages";

const Layout = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const location = useLocation();

  // Check if conversations page needs full width
  const isFullWidth = location.pathname === "/conversations";

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Sidebar />
      <Header sidebarExpanded={sidebarExpanded} />
      <main
        className={`pt-[56px] transition-all duration-200 ${
          sidebarExpanded ? "ml-[220px]" : "ml-[60px]"
        }`}
      >
        <div className={isFullWidth ? "p-0" : "p-6"}>{children}</div>
      </main>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prospecting" element={<Prospecting />} />
            <Route path="/report" element={<AuditReportPage />} />
            <Route path="/conversations" element={<Conversations />} />
            <Route path="/calendars" element={<CalendarPage />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/automation" element={<Automation />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/memberships" element={<Memberships />} />
            <Route path="/media" element={<MediaStorage />} />
            <Route path="/reputation" element={<Reputation />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
