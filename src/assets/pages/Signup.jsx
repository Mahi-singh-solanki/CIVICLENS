import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, SendHorizontal, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [view, setView] = useState('signup'); 
  const [step, setStep] = useState(1); // 'step' is now used below
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Normal User'
  });

  const [forgotEmail, setForgotEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.find(u => u.email === formData.email)) {
      alert("Email already exists!");
      return;
    }
    const newUser = { ...formData, username: `${formData.firstName}${formData.surname}`.toLowerCase() };
    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
    alert("Signup Successful!");
    navigate('/login');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2); // Using setStep to move to OTP
    } else {
      alert(`Reset link sent to ${forgotEmail}`);
      setView('signup');
      setStep(1);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050d0a] flex flex-col items-center justify-center font-instrument overflow-x-hidden p-4">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-green-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Logo */}
      <div className="absolute top-6 md:top-8 left-6 md:left-12">
        <h1 className="text-white text-xl md:text-2xl font-bold tracking-widest cursor-pointer uppercase italic" onClick={() => navigate('/')}>
          CIVICLENS
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-[#08100d]/60 backdrop-blur-xl border border-white/5 p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl transition-all duration-500 mt-16 md:mt-0">
        
        {view === 'signup' ? (
          <>
            <h2 className="text-white text-3xl md:text-5xl font-bold text-center mb-8 md:mb-10 uppercase tracking-tight italic">SIGN UP</h2>
            <form onSubmit={handleSignupSubmit} className="space-y-4 md:space-y-6">
              
              <div className="flex flex-col md:flex-row gap-4">
                <input type="text" name="firstName" placeholder="Enter Name" className="w-full md:w-1/2 bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all" required onChange={handleChange} />
                <input type="text" name="surname" placeholder="Enter Surname" className="w-full md:w-1/2 bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all" required onChange={handleChange} />
              </div>

              <input type="email" name="email" placeholder="Enter Email" className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all" required onChange={handleChange} />
              
              <div className="relative w-full">
                <input 
                  type={showPass ? "text" : "password"} 
                  name="password" 
                  placeholder="Enter Password" 
                  autoComplete="new-password"
                  className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all pr-12" 
                  required 
                  onChange={handleChange} 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative w-full">
                <input 
                  type={showConfirmPass ? "text" : "password"} 
                  name="confirmPassword" 
                  placeholder="Confirm Password" 
                  autoComplete="new-password"
                  className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all pr-12" 
                  required 
                  onChange={handleChange} 
                />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="text-left">
                <button type="button" onClick={() => setView('forgot')} className="text-[10px] md:text-xs text-gray-400 hover:text-emerald-400 transition-colors bg-transparent uppercase font-bold tracking-widest">Forgot Password?</button>
              </div>

              <button type="submit" className="w-full border border-white/40 py-3 md:py-4 rounded-xl text-white text-lg md:text-xl font-semibold hover:bg-white hover:text-black transition-all active:scale-[0.98] uppercase tracking-widest italic">Sign Up</button>

              <div className="text-center md:text-right pt-4">
                <p className="text-gray-400 text-[10px] md:text-sm uppercase tracking-widest">
                  Already Signed in? <br className="hidden md:block" />
                  <button type="button" onClick={() => navigate('/login')} className="text-white hover:underline font-black cursor-pointer ml-1 md:ml-0">Try Logging in</button>
                </p>
              </div>
            </form>
          </>
        ) : (
          <div className="max-w-md mx-auto py-2 transition-all">
            <button onClick={() => {setView('signup'); setStep(1);}} className="text-gray-400 hover:text-white flex items-center gap-2 text-[10px] uppercase tracking-widest mb-6 md:mb-8 transition-colors"><ArrowLeft size={14} /> Back to Signup</button>
            <h2 className="text-white text-2xl md:text-4xl font-bold mb-4 uppercase tracking-tight italic">
               {step === 1 ? "Reset Access" : "Verify OTP"}
            </h2>
            <form onSubmit={handleForgotSubmit} className="space-y-4 md:space-y-6">
              {step === 1 ? (
                <input type="email" placeholder="Enter Email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all" required />
              ) : (
                <input type="text" maxLength="6" placeholder="Enter 6-digit OTP" className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white text-center text-xl tracking-[0.5em] focus:border-emerald-500 outline-none transition-all" required />
              )}
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 md:py-4 rounded-xl text-white text-[10px] md:text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                {step === 1 ? "Send OTP" : "Verify OTP"} <SendHorizontal size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;