import React, { useState } from 'react';
import { locations } from '../../utilities/polygon';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Map, AlertTriangle, BarChart3, FileClock,
    LogOut, UserPlus, Trash2, CheckCircle2, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// --- CONSTANTS ---
const DEPARTMENTS = ['Infrastructure', 'Public Safety', 'Environment', 'Healthcare', 'Transport', 'Education'];
const ZONES = ['North Sector', 'Central District', 'South Harbour', 'West Heights', 'Industrial Zone', 'Green Valley'];

const AUTHORITY_ICONS = {
    Infrastructure: '💧',
    'Public Safety': '🛡️',
    Environment: '🌿',
    Healthcare: '➕',
    Transport: '🚌',
    Education: '📚',
};

const EMPTY_FORM = {
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    level: 'Municipal',
    jurisdictions: [],
    role: 'Government Authority',
};

// --- SUB-COMPONENTS ---
const NavItem = ({ icon, label, active, onClick, badge }) => (
    <div
        onClick={() => onClick(label)}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all group relative overflow-hidden
            ${active ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
        {active && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />}
        <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
        <span className="text-sm font-bold tracking-wide flex-1">{label}</span>
        {badge > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg">
                {badge}
            </span>
        )}
    </div>
);

const PerformanceBar = ({ value }) => {
    const color = value >= 90 ? 'bg-emerald-500' : value >= 70 ? 'bg-blue-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="flex items-center gap-3">
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
            </div>
            <span className="text-sm font-bold text-white">{value}%</span>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        Active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        'Pending Review': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        Inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider ${styles[status] || styles.Inactive}`}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 align-middle" />
            {status}
        </span>
    );
};

// --- MAIN COMPONENT ---
const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');

    // --- STATE INITIALIZATION ---
    const [authorities, setAuthorities] = useState(() => {
        const stored = JSON.parse(localStorage.getItem('users') || '[]');
        const govUsers = stored.filter(u => u.role === 'Government Authority');

        if (govUsers.length === 0) {
            const mockAuthorities = [
                { id: 1, name: 'Municipal Water Board', email: 'water@gov.in', password: 'pass', phone: '+91-9800001111', department: 'Infrastructure', level: 'Municipal', jurisdictions: ['Central District', 'North Sector'], performance: 94, status: 'Active', role: 'Government Authority' },
                { id: 2, name: 'Civil Defense Unit', email: 'defense@gov.in', password: 'pass', phone: '+91-9800002222', department: 'Public Safety', level: 'Zonal', jurisdictions: ['West Heights', 'Industrial Zone'], performance: 88, status: 'Active', role: 'Government Authority' },
                { id: 3, name: 'Environmental Agency', email: 'env@gov.in', password: 'pass', phone: '+91-9800003333', department: 'Environment', level: 'Regional', jurisdictions: ['Green Valley', 'North Sector'], performance: 62, status: 'Pending Review', role: 'Government Authority' },
            ];
            localStorage.setItem('users', JSON.stringify([...stored, ...mockAuthorities]));
            return mockAuthorities;
        }
        return govUsers;
    });

    const [areaAssignments, setAreaAssignments] = useState(() => {
        return JSON.parse(localStorage.getItem('authorityAssignments') || '{}');
    });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newAuth, setNewAuth] = useState(EMPTY_FORM);
    const [authPage, setAuthPage] = useState(1);
    const AUTH_PER_PAGE = 4;

    const [escalations, setEscalations] = useState([
        { id: 101, title: 'Dangerous Pothole', location: 'Indiranagar, Bangalore', date: '2024-02-18', severity: 'High', description: 'Large pothole causing accidents near metro station.' },
        { id: 102, title: 'Broken Streetlight', location: 'Koramangala 4th Block', date: '2024-02-15', severity: 'Medium', description: 'Streetlight pole leaning dangerously.' },
    ]);

    // --- MOCK ANALYTICS ---
    const analyticsStats = [
        { label: 'Total Reports', value: 1248, change: '+12%', positive: true },
        { label: 'Resolved Issues', value: 892, change: '+5%', positive: true },
        { label: 'Pending Reports', value: 315, change: '-2%', positive: false },
        { label: 'Escalations', value: escalations.length, change: '+8%', positive: false },
    ];
    const chartBars = [35, 55, 40, 70, 50, 85, 65];
    const systemLogs = [
        { id: 1, type: 'auth', message: 'Admin login successful', time: '2 mins ago' },
        { id: 2, type: 'action', message: 'New authority added: north_zone_auth@gov.in', time: '15 mins ago' },
    ];
    const logIcon = {
        auth: <Shield size={14} className="text-blue-400" />,
        action: <CheckCircle2 size={14} className="text-emerald-400" />,
        error: <AlertTriangle size={14} className="text-red-400" />,
        system: <FileClock size={14} className="text-purple-400" />,
    };

    // --- HANDLERS ---
    const handleAddAuthority = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email === newAuth.email)) {
            alert('An account with this email already exists.');
            return;
        }
        const entry = { ...newAuth, id: Date.now(), performance: 0, status: 'Active' };
        const updated = [...users, entry];
        localStorage.setItem('users', JSON.stringify(updated));
        setAuthorities(updated.filter(u => u.role === 'Government Authority'));
        setNewAuth(EMPTY_FORM);
        setIsFormOpen(false);
    };

    const handleDeleteAuthority = (email) => {
        if (!window.confirm('Remove this authority account?')) return;
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updated = users.filter(u => u.email !== email);
        localStorage.setItem('users', JSON.stringify(updated));
        setAuthorities(updated.filter(u => u.role === 'Government Authority'));
    };

    const handleResolveEscalation = (id) => {
        if (window.confirm('Mark this escalation as resolved?')) {
            setEscalations(prev => prev.filter(e => e.id !== id));
        }
    };

    // --- BACKEND API INTEGRATION ---
    const handleAssignJurisdiction = async (authId, email, name) => {
        const selectedAreaName = areaAssignments[email];
        if (!selectedAreaName) {
            alert("Please select a district from the dropdown.");
            return;
        }

        const matchedLocation = locations.find(loc => loc.area === selectedAreaName);
        
        if (!matchedLocation) {
            alert("Error: Location coordinates not found.");
            return;
        }

        console.log("🚀 SENDING THIS POLYGON TO BACKEND FOR", name, ":");
        console.log(JSON.stringify(matchedLocation.polygon, null, 2));

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/jurisdiction/${authId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify({
                    jurisdiction: matchedLocation.polygon
                })
            });

            if (response.ok) {
                localStorage.setItem('authorityAssignments', JSON.stringify(areaAssignments));
                alert(`Successfully assigned ${selectedAreaName} coordinates to ${name}!`);
            } else {
                const errorData = await response.json();
                alert(`Backend Error: ${errorData.detail || 'Failed to assign jurisdiction'}`);
            }
        } catch (error) {
            console.error("Failed to connect to backend:", error);
            alert("Network Error: Could not reach the server.");
        }
    };

    const totalPages = Math.ceil(authorities.length / AUTH_PER_PAGE);
    const pagedAuthorities = authorities.slice((authPage - 1) * AUTH_PER_PAGE, authPage * AUTH_PER_PAGE);

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* 4 Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {analyticsStats.map((stat, i) => (
                                <div key={i} className="bg-[#16221d] p-6 rounded-2xl border border-white/5 shadow-2xl hover:border-emerald-500/30 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                    <div className="text-4xl font-black text-white group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                        
                        {/* RESTORED: Chart and Logs Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-[#16221d] p-8 rounded-3xl border border-white/5 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <BarChart3 className="text-emerald-500" /> Resolution Trends
                                </h3>
                                <div className="h-64 flex items-end justify-between gap-4 px-4 bg-[#0b1410] rounded-xl border border-white/5 pt-4">
                                    {chartBars.map((h, i) => (
                                        <div key={i} className="w-full bg-emerald-500/20 rounded-t-lg h-full flex items-end overflow-hidden">
                                            <div className="w-full bg-emerald-500 hover:bg-emerald-400 transition-all duration-500 rounded-t-lg" style={{ height: `${h}%` }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[#16221d] p-8 rounded-3xl border border-white/5 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <FileClock className="text-orange-500" /> Recent Logs
                                </h3>
                                <div className="space-y-4">
                                    {systemLogs.map(log => (
                                        <div key={log.id} className="flex items-start gap-4 p-4 bg-[#0b1410] rounded-xl border border-white/5">
                                            <div className="mt-0.5">{logIcon[log.type]}</div>
                                            <div>
                                                <p className="text-sm text-gray-300">{log.message}</p>
                                                <span className="text-[10px] text-gray-500 uppercase font-bold">{log.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Manage Authorities':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-white">Government Authorities</h2>
                                <p className="text-gray-400 text-sm mt-1">Configure administrative entities and service jurisdictions.</p>
                            </div>
                            <button onClick={() => setIsFormOpen(v => !v)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg">
                                <UserPlus size={16} /> New Authority
                            </button>
                        </div>
                        <div className={`grid gap-8 ${isFormOpen ? 'grid-cols-1 lg:grid-cols-[420px_1fr]' : 'grid-cols-1'}`}>
                            {isFormOpen && (
                                <form onSubmit={handleAddAuthority} className="bg-[#16221d] p-8 rounded-3xl border border-emerald-500/30 shadow-2xl h-fit space-y-5">
                                    <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2"><UserPlus size={16} /> Register New</h3>
                                    
                                    <input type="text" required placeholder="Authority Name" value={newAuth.name} onChange={e => setNewAuth({...newAuth, name: e.target.value})} className="w-full bg-[#0b1410] border border-gray-700 rounded-xl p-3.5 text-white text-sm focus:border-emerald-500 outline-none" />
                                    <input type="email" required placeholder="Contact Email" value={newAuth.email} onChange={e => setNewAuth({...newAuth, email: e.target.value})} className="w-full bg-[#0b1410] border border-gray-700 rounded-xl p-3.5 text-white text-sm focus:border-emerald-500 outline-none" />
                                    <input type="password" required placeholder="Set Password" value={newAuth.password} onChange={e => setNewAuth({...newAuth, password: e.target.value})} className="w-full bg-[#0b1410] border border-gray-700 rounded-xl p-3.5 text-white text-sm focus:border-emerald-500 outline-none" />
                                    
                                    <select 
                                        required
                                        value={newAuth.department} 
                                        onChange={e => setNewAuth({...newAuth, department: e.target.value})}
                                        className="w-full bg-[#0b1410] border border-gray-700 rounded-xl p-3.5 text-white text-sm focus:border-emerald-500 outline-none"
                                    >
                                        <option value="" disabled>Select Department</option>
                                        {DEPARTMENTS.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>

                                    <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase transition-all hover:bg-emerald-500">Confirm</button>
                                </form>
                            )}
                            <div className="bg-[#16221d] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                                <table className="w-full text-left">
                                    <thead className="bg-[#0b1410]">
                                        <tr>
                                            {['Authority', 'Performance', 'Status', 'Actions'].map(h => (
                                                <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {pagedAuthorities.map((auth, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-5">
                                                    <p className="font-bold text-white text-sm">{auth.name || auth.email}</p>
                                                    <p className="text-[11px] text-gray-500">{auth.department}</p>
                                                </td>
                                                <td className="px-6 py-5"><PerformanceBar value={auth.performance} /></td>
                                                <td className="px-6 py-5"><StatusBadge status={auth.status} /></td>
                                                <td className="px-6 py-5">
                                                    <button onClick={() => handleDeleteAuthority(auth.email)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'Assign Areas':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-[#16221d] p-6 rounded-2xl border border-white/5 shadow-lg">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Zone Assignments</h2>
                                <p className="text-gray-400 text-sm mt-1">Bind map polygons to authority accounts.</p>
                            </div>
                        </div>
                        {authorities.map((auth) => (
                            <div key={auth.email} className="bg-[#16221d] p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:border-emerald-500/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="text-xl">{AUTHORITY_ICONS[auth.department] || '🏛️'}</div>
                                    <div>
                                        <h3 className="font-bold text-white">{auth.name || auth.email}</h3>
                                        <p className="text-xs text-gray-500 mt-1">ID: {auth.id || 'Pending DB Sync'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 w-1/2 justify-end">
                                    <select 
                                        className="bg-[#0b1410] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm w-2/3 outline-none focus:border-emerald-500 transition-colors"
                                        value={areaAssignments[auth.email] || ''} 
                                        onChange={e => setAreaAssignments({...areaAssignments, [auth.email]: e.target.value})}
                                    >
                                        <option value="">-- Select Map Polygon --</option>
                                        {locations.map((loc, index) => (
                                            <option key={index} value={loc.area}>
                                                {loc.area}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    <button 
                                        onClick={() => handleAssignJurisdiction(auth.id, auth.email, auth.name)} 
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-lg font-bold uppercase text-xs tracking-wider transition-all"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'Monitor Escalations':
                return (
                    <div className="space-y-6">
                        {escalations.map(esc => (
                            <div key={esc.id} className="bg-[#16221d] p-8 rounded-3xl border-l-4 border-l-red-500 border border-white/5 shadow-xl">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded">{esc.severity}</span>
                                        <h3 className="text-2xl font-bold text-white mt-2">{esc.title}</h3>
                                        <p className="text-gray-400 mt-2">{esc.description}</p>
                                    </div>
                                    <button onClick={() => handleResolveEscalation(esc.id)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-400 transition-colors">Resolve</button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="flex h-screen bg-[#0b1410] overflow-hidden font-sans text-gray-200">
            {/* --- SIDEBAR --- */}
            <aside className="w-72 bg-[#08100d] border-r border-gray-800 flex flex-col shrink-0 z-20 shadow-2xl">
                <div className="h-24 flex flex-col justify-center px-8 border-b border-white/5">
                    <h1 className="text-2xl font-black text-white tracking-widest leading-none">CIVICLENS</h1>
                    <p className="text-[10px] font-bold text-emerald-500 tracking-[0.2em] mt-1 uppercase">System Admin Portal</p>
                </div>
                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'Overview'} onClick={setActiveTab} />
                    <NavItem icon={<Users size={20} />} label="Manage Authorities" active={activeTab === 'Manage Authorities'} onClick={setActiveTab} />
                    <NavItem icon={<Map size={20} />} label="Assign Areas" active={activeTab === 'Assign Areas'} onClick={setActiveTab} />
                    <NavItem icon={<AlertTriangle size={20} />} label="Monitor Escalations" active={activeTab === 'Monitor Escalations'} onClick={setActiveTab} badge={escalations.length} />
                </nav>
                <div className="p-6 border-t border-gray-800">
                    <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all border border-red-500/20">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0b1410]">
                <header className="px-10 py-8 border-b border-white/5 bg-[#0b1410]/80 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">{activeTab}</h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Management Console</p>
                </header>
                <div className="flex-1 overflow-y-auto p-10 pb-20 relative">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;