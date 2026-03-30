import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../../context/ReportContext'; 
import { 
  ListChecks, LogOut, Search, MapPin, X, History, 
  Clock, CheckCircle2, Ban, Menu, ShieldAlert, CheckSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


const AuthorityDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { reports, updateReportStatus } = useReports(); 
  
  const [activeTab, setActiveTab] = useState('All Tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [auditHistory, setAuditHistory] = useState([
    { id: 'CL-20001', action: 'Approved', reason: 'Verified by officer.', date: '2026-03-15' }
  ]);

  const handleAction = (id, newStatus, actionLabel) => {
    updateReportStatus(id, newStatus);
    const newLog = { 
      id, 
      action: actionLabel, 
      reason: `Status updated to ${newStatus} by Authority.`, 
      date: new Date().toISOString().split('T')[0] 
    };
    setAuditHistory([newLog, ...auditHistory]);
    setSelectedComplaint(null);
  };

  const filtered = reports.filter(c => 
    (activeTab === 'All Tasks' || c.status === activeTab.toUpperCase()) && 
    (c.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen w-full bg-[#050d0a] text-gray-200 overflow-hidden font-instrument relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/5 blur-[120px] rounded-full pointer-events-none" />

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-[70] w-64 bg-[#08100d] border-r border-white/5 flex flex-col shrink-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 pb-4 flex justify-between items-center">
          {/* BRANDED LOGO SECTION */}
          <div className="flex flex-col gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex items-center gap-2">
               <img src="/images/logo.png" alt="Logo" className="h-6 w-auto" />
               <h1 className="text-lg font-bold tracking-widest text-white uppercase italic">CIVICLENS</h1>
            </div>
            <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest pl-8">Authority Terminal</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white"><X size={20}/></button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1">
          <SidebarItem icon={<ListChecks size={18}/>} label="Assigned Tasks" active={activeTab !== 'Audit History'} onClick={() => {setActiveTab('All Tasks'); setIsSidebarOpen(false);}} />
          <SidebarItem icon={<History size={18}/>} label="Audit History" active={activeTab === 'Audit History'} onClick={() => {setActiveTab('Audit History'); setIsSidebarOpen(false);}} />
        </nav>
        
        <div className="p-6 border-t border-gray-800">
           <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all border border-red-500/20">
              <LogOut size={16} /> Logout
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 bg-[#08100d]/50 backdrop-blur-md px-4 lg:px-10 flex items-center justify-between gap-4 sticky top-0 z-50">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-white p-2 bg-white/5 rounded-lg"><Menu size={20} /></button>
          
          <div className="relative flex-1 max-w-xl"> 
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
            <input type="text" placeholder="Search title of the complaint" className="w-full bg-[#0a1a14] border border-white/10 rounded-xl py-2.5 pl-11 text-[11px] text-white outline-none focus:border-[#00592E] transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          
          <div className="flex items-center gap-3 pl-4 border-l border-white/5">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-white uppercase italic">Officer Joshi</p>
              <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Public Works Unit</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#00592E]/20 border border-[#00592E]/40 flex items-center justify-center text-emerald-400 font-bold">OJ</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 no-scrollbar">
          
          {activeTab !== 'Audit History' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 animate-in fade-in slide-in-from-top-2 duration-500">
              <QuickStat icon={<ShieldAlert size={16} className="text-orange-500"/>} label="Pending Tasks" value={reports.filter(r => r.status === 'PENDING').length} />
              <QuickStat icon={<CheckSquare size={16} className="text-emerald-500"/>} label="Completed" value={reports.filter(r => r.status === 'RESOLVED').length} />
            </div>
          )}

          {activeTab === 'Audit History' ? (
            <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
              <div className="bg-[#08100d] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-[#0b1410] text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                    <tr><th className="px-6 py-5">UID</th><th className="px-6 py-5">Action Protocol</th><th className="px-6 py-5">System Remarks</th><th className="px-6 py-5 text-right">Timestamp</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditHistory.map((log, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5 font-mono text-[10px] opacity-40">#{log.id}</td>
                        <td className="px-6 py-5 text-[9px] font-black uppercase tracking-tighter text-white">{log.action}</td>
                        <td className="px-6 py-5 text-gray-500 italic text-[10px]">"{log.reason}"</td>
                        <td className="px-6 py-5 text-right text-gray-600 text-[9px] font-bold uppercase">{log.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
              <div className="flex gap-8 border-b border-white/5 mb-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                {['All Tasks', 'Pending', 'In Progress', 'Resolved'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-[13px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === tab ? 'text-white' : 'text-gray-700 hover:text-gray-400'}`}>
                    {tab} {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00592E] shadow-[0_0_15px_rgba(0,89,46,0.5)]" />}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 pb-20">
                {filtered.map((item, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 group hover:border-[#00592E]/30 hover:bg-white/[0.04] transition-all cursor-pointer" onClick={() => setSelectedComplaint(item)}>
                    <div className="w-full sm:w-32 h-24 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/5 bg-black/40">
                      <img src={item.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt="Issue" />
                    </div>
                    <div className="flex-1 flex justify-between items-center w-full">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-sm border ${item.status === 'RESOLVED' ? 'bg-[#00592E]/20 text-emerald-400 border-[#00592E]/30' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>{item.status}</span>
                          <span className="text-[8px] font-mono opacity-20">ID:{item.id}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase italic tracking-tight group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                        <div className="flex items-center gap-2 text-[9px] text-gray-600 font-bold uppercase"><MapPin size={10} className="text-emerald-500/40" /> {item.location}</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-full group-hover:bg-[#00592E] group-hover:text-white transition-all shadow-lg">
                        <ListChecks size={16} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DETAIL OVERLAY */}
        {selectedComplaint && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-6 animate-in zoom-in-95 duration-300">
            <div className="max-w-4xl w-full bg-[#050d0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Protocol_Registry_#{selectedComplaint.id}</h2>
                <button onClick={() => setSelectedComplaint(null)} className="p-2 hover:bg-white/10 rounded-lg transition-all"><X size={18}/></button>
              </div>
              
              <div className="flex flex-col lg:flex-row h-auto lg:h-[550px]">
                <div className="flex-1 bg-black/40 p-6 lg:p-10 flex items-center justify-center">
                  <img src={selectedComplaint.img} className="max-w-full max-h-full rounded-2xl border border-white/10 shadow-2xl" alt="Evidence" />
                </div>
                
                <div className="w-full lg:w-96 border-l border-white/5 p-6 lg:p-10 flex flex-col justify-between bg-[#08100d]">
                  <div className="space-y-6 lg:space-y-8">
                    <MiniDetail label="Reporting Unit" value={selectedComplaint.user} />
                    <MiniDetail label="Classification" value={selectedComplaint.title} />
                    <MiniDetail label="Location Data" value={selectedComplaint.location} />
                    <MiniDetail label="Evidence Note" value={selectedComplaint.desc} />
                  </div>
                  
                  <div className="space-y-3 pt-6">
                    {selectedComplaint.status === 'PENDING' && (
                      <button onClick={() => handleAction(selectedComplaint.id, 'IN PROGRESS', 'Accepted')} className="w-full bg-[#00592E] py-4 rounded-xl text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-emerald-500/20">
                        <Clock size={12}/> Accept Task
                      </button>
                    )}
                    {selectedComplaint.status === 'IN PROGRESS' && (
                      <button onClick={() => handleAction(selectedComplaint.id, 'RESOLVED', 'Completed')} className="w-full bg-[#00592E] py-4 rounded-xl text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-emerald-500/20">
                        <CheckCircle2 size={12}/> Mark Resolved
                      </button>
                    )}
                    {selectedComplaint.status !== 'RESOLVED' && (
                      <button onClick={() => handleAction(selectedComplaint.id, 'REJECTED', 'Rejected')} className="w-full bg-red-900/10 text-red-500/60 hover:text-red-500 border border-red-500/10 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        <Ban size={12}/> Reject Protocol
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; }`}} />
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all ${active ? 'bg-[#00592E]/10 text-emerald-400 border border-[#00592E]/20 shadow-xl' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'}`}>
    {icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const QuickStat = ({ icon, label, value }) => (
  <div className="bg-[#08100d] border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:border-[#00592E]/20 transition-all">
    <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
    <div>
      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-bold text-white italic leading-tight">{value}</p>
    </div>
  </div>
);

const MiniDetail = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest opacity-40">{label}</p>
    <p className="text-xs font-bold text-white uppercase italic tracking-tight leading-relaxed">{value || "N/A"}</p>
  </div>
);

export default AuthorityDashboard;