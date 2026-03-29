import React, { useState, useRef } from 'react';
import { useReports } from '../../context/ReportContext'; 
import { useAuth } from '../../context/AuthContext'; 
import { X, UploadCloud, MapPin, Tag, AlignLeft, User } from 'lucide-react';

const ReportModal = ({ isOpen, onClose }) => {
    const { addReport } = useReports();
    const { user } = useAuth(); 
    
    const [formData, setFormData] = useState({
        name: user?.username || '', 
        email: user?.email || '',
        category: '',
        location: '',
        problem: '',
        image: null
    });
    
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result); 
                setFormData({ ...formData, image: file });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newReport = {
            id: `CL-${Date.now()}`, 
            title: formData.category,
            location: formData.location,
            user: user?.username || formData.name || "Citizen", 
            desc: formData.problem,
            img: preview || "/pothole.jpeg",
            status: 'PENDING', 
            time: new Date().toLocaleDateString()
        };
        addReport(newReport);
        alert("Report Submitted Successfully!");
        setFormData({ name: '', email: '', category: '', location: '', problem: '', image: null });
        setPreview(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-hidden">
            
            <div className="bg-[#08100d] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden text-white animate-in zoom-in-95 duration-300">
                
                {/* --- MODAL HEADER --- */}
                <div className="relative flex justify-between items-center p-6 md:p-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                            Submit Report
                        </h2>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold mt-1">Citizen Engagement Portal</p>
                    </div>
                    <button 
                        className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-all group" 
                        onClick={onClose}
                    >
                        <X size={20} className="transition-transform group-hover:rotate-90" />
                    </button>
                </div>

                {/* --- FORM CONTENT --- */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 max-h-[75vh] overflow-y-auto no-scrollbar">
                    
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] uppercase font-black text-emerald-500 tracking-widest ml-1">
                            <User size={12} /> Full Name
                        </label>
                        <input 
                            className="w-full bg-[#050d0a] border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500/50 focus:ring-4 ring-emerald-500/5 transition-all placeholder:text-gray-700 shadow-inner" 
                            type="text" required placeholder="Sana Siddiqui"
                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        />
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] uppercase font-black text-emerald-500 tracking-widest ml-1">
                            <Tag size={12} /> Issue Category
                        </label>
                        <select 
                            className="w-full bg-[#050d0a] border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500/50 transition-all cursor-pointer shadow-inner appearance-none" 
                            required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="" disabled className="text-gray-800">Select category</option>
                            <option value="Water Issues">Water Issues</option>
                            <option value="Road Conditions">Road Conditions</option>
                            <option value="Garbage Dumping">Garbage Dumping</option>
                        </select>
                    </div>

                    {/* Location Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] uppercase font-black text-emerald-500 tracking-widest ml-1">
                            <MapPin size={12} /> Location
                        </label>
                        <input 
                            className="w-full bg-[#050d0a] border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500/50 focus:ring-4 ring-emerald-500/5 transition-all shadow-inner" 
                            type="text" required placeholder="Street name or landmark..."
                            value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                        />
                    </div>

                    {/* Details Textarea */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] uppercase font-black text-emerald-500 tracking-widest ml-1">
                            <AlignLeft size={12} /> Problem Details
                        </label>
                        <textarea 
                            className="w-full bg-[#050d0a] border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500/50 transition-all resize-none min-h-[100px] shadow-inner" 
                            rows="3" required placeholder="Describe the situation in detail..."
                            value={formData.problem} onChange={(e) => setFormData({ ...formData, problem: e.target.value })} 
                        />
                    </div>

                    {/* Evidence Upload */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-emerald-500 tracking-widest ml-1">Evidence Evidence</label>
                        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
                        <div 
                            className="group relative border-2 border-dashed border-white/10 hover:border-emerald-500/40 rounded-3xl h-32 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-[#050d0a] shadow-inner" 
                            onClick={() => fileInputRef.current.click()}
                        >
                            {preview ? (
                                <div className="relative w-full h-full">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-[10px] font-black uppercase tracking-widest">Change Image</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud className="text-emerald-500/50 group-hover:text-emerald-500 transition-colors mb-2" size={32} />
                                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Tap to upload photo</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-[1.5rem] uppercase tracking-[0.3em] text-[11px] shadow-[0_10px_25px_-5px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] mt-4"
                    >
                        Submit Official Report
                    </button>
                </form>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1em; }
            `}} />
        </div>
    );
};

export default ReportModal;