import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../../context/ReportContext';
import { 
  ArrowLeft, MapPin, ThumbsUp, Plus, 
  Search, MessageSquare, X, Send, BellRing, User,
  TrendingUp, Award
} from 'lucide-react';

const CommunityFeed = () => {
  const navigate = useNavigate();
  const { reports } = useReports();
  const [activeTab, setActiveTab] = useState('Reported Issues');
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const feedReports = useMemo(() => {
    return [...reports]
      .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase()))
      .reverse();
  }, [reports, searchQuery]);

  const triggerNotification = (userName) => {
    setNotification(`Following ${userName}'s issue`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050d0a] text-gray-200 font-sans selection:bg-emerald-500/30 relative overflow-x-hidden">
      
      {/* --- FLOATING NOTIFICATION --- */}
      {notification && (
        <div className="fixed bottom-10 right-6 md:top-10 md:right-10 z-[100] animate-in slide-in-from-right duration-500">
          <div className="bg-[#08100d] border border-emerald-500/40 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 backdrop-blur-xl">
            <div className="bg-emerald-500/20 p-2 rounded-full animate-pulse">
              <BellRing size={18} className="text-emerald-500" />
            </div>
            <p className="text-xs font-bold text-white pr-4">{notification}</p>
          </div>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#050d0a]/80 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4 md:gap-8">
          <button onClick={() => navigate('/')} className="p-2.5 bg-white/5 hover:bg-emerald-500/20 rounded-full transition-all text-gray-400 hover:text-emerald-400">
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by issue or location..." 
              className="w-full bg-[#0a1a14] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:ring-1 ring-emerald-500/50 transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 grid grid-cols-12 gap-6 md:gap-10">
        
        {/* --- LEFT SIDEBAR (Hidden on small mobile, visible on tablets+) --- */}
        <aside className="col-span-12 lg:col-span-3 space-y-6 hidden md:block">
          <div className="bg-[#08100d] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-emerald-500" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">District Impact</h3>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between text-[10px] font-bold uppercase">
                 <span className="text-gray-500">Live Resolution Rate</span>
                 <span className="text-emerald-400">84%</span>
               </div>
               <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full w-[84%]" />
               </div>
            </div>
          </div>

          <div className="bg-[#08100d] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
                <Award size={16} className="text-emerald-500" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Top Reporters</h3>
            </div>
            <div className="space-y-6">
               <ContributorItem name="Jane Doe" level="Guardian" points="1.2k" />
               <ContributorItem name="Sana Siddiqui" level="Active Reporter" points="750" />
            </div>
          </div>
        </aside>

        {/* --- MAIN FEED --- */}
        <section className="col-span-12 lg:col-span-9 space-y-6">
          <div className="flex gap-6 md:gap-10 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
            {['Reported Issues', 'Community Ideas'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`text-[11px] md:text-xs font-black uppercase tracking-[0.2em] relative pb-2 transition-all ${activeTab === tab ? 'text-emerald-400' : 'text-gray-600'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />}
              </button>
            ))}
          </div>

          <div className="space-y-6 md:space-y-8">
            {feedReports.length > 0 ? feedReports.map((report, i) => (
              <FeedCard 
                key={report.id || i} 
                report={report} 
                onFollow={() => triggerNotification(report.user || 'Citizen')} 
              />
            )) : (
              <div className="py-32 text-center border border-dashed border-white/10 rounded-[3rem] bg-[#08100d]/30">
                <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={24} className="text-gray-600" />
                </div>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">No community reports found</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; }`}} />
    </div>
  );
};

// --- FEED CARD ---

const FeedCard = ({ report, onFollow }) => {
  const [likes, setLikes] = useState(() => Math.floor(Math.random() * 200) + 5);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]); // Removed demo "hellos"

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([...comments, { user: "You", text: commentText }]);
    setCommentText("");
  };

  return (
    <div className="bg-[#08100d] border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden hover:border-emerald-500/20 transition-all duration-500 group shadow-2xl">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="w-full lg:w-[350px] h-64 lg:h-auto shrink-0 relative overflow-hidden bg-black">
          <img 
            src={report.img} 
            className="w-full h-full object-cover filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" 
            alt="Issue" 
            onError={(e) => e.target.src = "/pothole.jpeg"}
          />
          <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md shadow-2xl ${report.status === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-[#0a1a14] text-emerald-400'}`}>
            {report.status || 'PENDING'}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-between">
          <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10">
                        <User size={14} className="text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">
                        {report.user || 'Anonymous Citizen'}
                    </span>
                </div>
                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{report.time || 'Recently'}</span>
              </div>
              
              <h3 className="text-xl md:text-3xl font-black text-white tracking-tighter leading-tight italic">
                {report.title}
              </h3>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                <MapPin size={12} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[200px]">
                    {report.location}
                </span>
              </div>
              
              <p className="text-sm text-gray-500 leading-relaxed italic font-light line-clamp-2">
                "{report.desc}"
              </p>
          </div>

          <div className="flex flex-wrap justify-between items-center mt-8 pt-8 border-t border-white/5 gap-4">
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => { setLikes(prev => isLiked ? prev - 1 : prev + 1); setIsLiked(!isLiked); }} 
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isLiked ? 'text-emerald-500 scale-110' : 'text-gray-500 hover:text-white'}`}
                >
                  <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} className="transition-transform" /> {likes}
                </button>
                <button 
                  onClick={() => setShowComments(!showComments)} 
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${showComments ? 'text-blue-400' : 'text-gray-500 hover:text-white'}`}
                >
                  <MessageSquare size={18} /> {comments.length}
                </button>
              </div>
              <button 
                onClick={onFollow} 
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
              >
                <Plus size={16} /> Follow Updates
              </button>
          </div>
        </div>
      </div>

      {/* --- COMMENTS DRAWER --- */}
      {showComments && (
        <div className="bg-black/40 p-6 md:p-10 border-t border-white/5 animate-in slide-in-from-top-4 duration-300">
           <div className="flex justify-between items-center mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Citizen Discussion</h4>
              <button onClick={() => setShowComments(false)} className="p-1 hover:bg-white/5 rounded-full"><X size={16} className="text-gray-500 hover:text-white"/></button>
           </div>
           
           <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar mb-8">
              {comments.length > 0 ? comments.map((c, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
                  <p className="text-[9px] font-black text-emerald-500 uppercase">{c.user}</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{c.text}</p>
                </div>
              )) : (
                <p className="text-[9px] text-gray-700 uppercase font-black tracking-widest py-4">No comments yet. Start the conversation.</p>
              )}
           </div>
           
           <form onSubmit={handleAddComment} className="flex gap-3">
              <input 
                type="text" 
                value={commentText} 
                onChange={(e) => setCommentText(e.target.value)} 
                placeholder="Share your thoughts..." 
                className="flex-1 bg-[#050d0a] border border-white/5 rounded-xl p-4 text-xs text-white outline-none focus:border-emerald-500 transition-all shadow-inner" 
              />
              <button type="submit" className="bg-emerald-600 p-4 rounded-xl text-white hover:bg-emerald-500 transition-all shadow-lg"><Send size={18} /></button>
           </form>
        </div>
      )}
    </div>
  );
};

const ContributorItem = ({ name, level, points }) => (
  <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-3 rounded-2xl transition-all">
    <div className="flex items-center gap-4">
       <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-sm text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
         {name.charAt(0)}
       </div>
       <div>
          <p className="text-xs font-black text-white leading-none">{name}</p>
          <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1.5">{level}</p>
       </div>
    </div>
    <div className="text-right">
        <p className="text-[10px] font-mono text-emerald-500 font-bold">{points}</p>
        <p className="text-[7px] text-gray-700 uppercase font-black">Points</p>
    </div>
  </div>
);

export default CommunityFeed;