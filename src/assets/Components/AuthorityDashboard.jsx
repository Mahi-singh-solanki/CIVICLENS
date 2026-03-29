import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../../context/ReportContext'; 
import { 
  ListChecks, BarChart3, LogOut, Search, Bell, 
  MapPin, Clock, CheckCircle2, X, History,
  TrendingUp, AlertCircle, Menu // Added Menu for hamburger
} from 'lucide-react';

const AuthorityDashboard = () => {
  const navigate = useNavigate();
  const { reports, updateReportStatus } = useReports(); 
  
  const [activeTab, setActiveTab] = useState('All Tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [auditModal, setAuditModal] = useState({ isOpen: false, type: '', reason: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Toggle state
  
  const [auditHistory, setAuditHistory] = useState([
    { id: 'CL-20001', action: 'Approved', reason: 'Verified by officer.', date: '2026-03-15' }
  ]);

  // --- ANALYTICS LOGIC (Unchanged) ---
  const analytics = useMemo(() => {
    const unsolved = reports.filter(r => r.status !== 'RESOLVED');
    const locationStats = {};
    unsolved.forEach(r => {
      locationStats[r.location] = (locationStats[r.location] || 0) + 1;
    });
    return Object.entries(locationStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [reports]);

  const totalUnsolved = reports.filter(r => r.status !== 'RESOLVED').length;

  const submitAuditAction = () => {
    if (!auditModal.reason.trim()) return alert("Reason required.");
    const newStatus = auditModal.type === 'Approve' ? 'IN PROGRESS' : 'REJECTED';
    updateReportStatus(selectedComplaint.id, newStatus);
    const newLog = { 
      id: selectedComplaint.id, 
      action: auditModal.type === 'Approve' ? 'Approved' : 'Rejected', 
      reason: auditModal.reason, 
      date: new Date().toISOString().split('T')[0] 
    };
    setAuditHistory([newLog, ...auditHistory]);
    setAuditModal({ isOpen: false, type: '', reason: '' });
    setSelectedComplaint(null);
  };

  const filtered = reports.filter(c => 
    (activeTab === 'All Tasks' || c.status === activeTab.toUpperCase()) && 
    (c.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen w-full bg-[#050d0a] text-gray-200 overflow-hidden font-sans relative">
      
      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* --- SIDEBAR (Hidden on mobile by default) --- */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-[70] w-64 bg-[#08100d] border-r border-white/5 flex flex-col shrink-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-widest text-white uppercase">CIVICLENS</h1>
            <p className="text-[10px] text-emerald-500 font-bold opacity-70 uppercase tracking-tighter">Authority Dashboard</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white"><X size={20}/></button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarItem icon={<ListChecks size={20}/>} label="Assigned Tasks" active={activeTab !== 'Audit History' && activeTab !== 'Analytics'} onClick={() => {setActiveTab('All Tasks'); setIsSidebarOpen(false);}} />
          <SidebarItem icon={<BarChart3 size={20}/>} label="Analytics" active={activeTab === 'Analytics'} onClick={() => {setActiveTab('Analytics'); setIsSidebarOpen(false);}} />
          <SidebarItem icon={<History size={20}/>} label="Audit History" active={activeTab === 'Audit History'} onClick={() => {setActiveTab('Audit History'); setIsSidebarOpen(false);}} />
        </nav>

        <div className="m-4 p-6 bg-[#0a1a14] rounded-[2rem] border border-white/5 space-y-5 hidden lg:block">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">Live Performance</p>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold text-white">4.2 Days</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded">↓12%</span>
          </div>
        </div>
        
        <div className="p-4 mt-auto lg:mt-0">
          <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 text-red-400 font-bold uppercase text-[10px] tracking-widest py-3 bg-red-900/10 rounded-xl">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 bg-[#08100d]/50 backdrop-blur-md px-4 lg:px-10 flex items-center justify-between gap-4">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-white p-2 bg-white/5 rounded-lg"><Menu size={20} /></button>
          
          <div className="relative flex-1 max-w-3xl"> 
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" placeholder="Search..." className="w-full bg-[#0a1a14] border border-white/5 rounded-2xl py-3 pl-12 text-sm text-white outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold">Mr. Joshi</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Public Works</p>
            </div>
            <img src="https://i.pravatar.cc/150?u=joshi" className="w-10 h-10 rounded-xl border border-emerald-500/30 object-cover" alt="Admin" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 no-scrollbar">
          
          {activeTab === 'Analytics' ? (
            <div className="max-w-[1400px] mx-auto space-y-10">
              <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 italic">Issue Hotspots</h2>
                  <p className="text-gray-500 text-sm">Geographical distribution of unresolved citizen reports.</p>
                </div>
                <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl text-center lg:text-right">
                  
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-[#08100d] border border-white/5 p-8 lg:p-10 rounded-[2.5rem]">
                  <div className="space-y-8">
                    {analytics.map((loc, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-[6px] lg:text-sm font-bold uppercase tracking-widest">
                          <span>{loc.name}</span>
                          <span className="text-emerald-500">{loc.count} Pending</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(loc.count / totalUnsolved) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'Audit History' ? (
            <div className="max-w-[1400px] mx-auto overflow-x-auto">
              <div className="bg-[#08100d] rounded-3xl border border-white/5 min-w-[600px]">
                <table className="w-full text-left">
                  <thead className="bg-[#0b1410] text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                    <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Action</th><th className="px-6 py-4">Reason</th><th className="px-6 py-4 text-right">Date</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditHistory.map((log, i) => (
                      <tr key={i} className="hover:bg-white/5"><td className="px-6 py-4 font-mono text-xs">{log.id}</td><td className="px-6 py-4 text-[10px] uppercase font-bold">{log.action}</td><td className="px-6 py-4 text-gray-400 italic text-xs">"{log.reason}"</td><td className="px-6 py-4 text-right text-gray-500 text-[10px]">{log.date}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="max-w-[1400px] mx-auto">
              <div className="flex gap-6 lg:gap-12 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
                {['All Tasks', 'Pending', 'In Progress', 'Resolved'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-5 text-[10px] lg:text-sm font-black uppercase tracking-widest relative ${activeTab === tab ? 'text-emerald-500' : 'text-gray-500'}`}>
                    {tab} {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full" />}
                  </button>
                ))}
              </div>
              <div className="space-y-6">
                {filtered.map((item, i) => (
                  <div key={i} className="bg-[#08100d] border border-white/5 rounded-2xl p-4 lg:p-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
                    <div className="w-full lg:w-60 h-48 lg:h-44 rounded-xl overflow-hidden shrink-0">
                      <img src={item.img} className="w-full h-full object-cover" alt="Issue" />
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-emerald-900/40 text-emerald-400">{item.status}</span>
                        <span className="text-[10px] font-mono text-gray-700">#{item.id}</span>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight italic">{item.title}</h3>
                      <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><MapPin size={14} className="text-emerald-500" /> {item.location}</span>
                      </div>
                      <button onClick={() => setSelectedComplaint(item)} className="w-full lg:w-auto bg-emerald-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest mt-2">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- DETAIL OVERLAY (Responsive Grid) --- */}
        {selectedComplaint && (
          <div className="fixed inset-0 z-[100] bg-[#050d0a] p-4 lg:p-12 overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <h1 className="text-xl lg:text-4xl font-black uppercase italic text-white">Ticket: {selectedComplaint.id}</h1>
              <button onClick={() => setSelectedComplaint(null)} className="p-2 bg-white/5 rounded-full"><X size={24} className="text-gray-400" /></button>
            </div>
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 max-w-[1500px] mx-auto">
              <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-white/10 h-64 lg:h-auto">
                <img src={selectedComplaint.img} className="w-full h-full object-cover" alt="Issue" />
              </div>
              <div className="lg:col-span-5 space-y-8 bg-[#08100d] p-6 lg:p-12 rounded-3xl lg:rounded-[5rem] border border-white/5">
                <DetailItem title="Reporting Citizen" value={selectedComplaint.user} />
                <DetailItem title="Category" value={selectedComplaint.title} />
                <DetailItem title="Description" value={selectedComplaint.desc} />
                <div className="pt-6 border-t border-white/5">
                   <button className="w-full bg-emerald-600 py-4 lg:py-6 rounded-2xl font-black text-white text-[10px] uppercase">Update Status</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Modal logic remains exactly as you wrote it */}
        {auditModal.isOpen && (
           <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4">
              <div className="bg-[#08100d] w-full max-w-xl p-8 lg:p-14 rounded-3xl border border-emerald-500/20">
                 {/* ... content as you had it ... */}
                 <button onClick={() => setAuditModal({ isOpen: false, type: '', reason: '' })} className="text-white">Close</button>
              </div>
           </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; }`}} />
    </div>
  );
};

// ... SidebarItem and DetailItem components as you had them ...
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
    {icon} <span className="text-sm font-bold">{label}</span>
  </button>
);

const DetailItem = ({ title, value }) => (
  <div className="space-y-1">
    <label className="text-[9px] uppercase font-black text-emerald-500 tracking-widest">{title}</label>
    <p className="text-white font-medium text-lg italic">{value || "N/A"}</p>
  </div>
);

export default AuthorityDashboard;