import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, SendHorizontal, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [view, setView] = useState('signup'); // 'signup' or 'otp' or 'forgot'
  const [step, setStep] = useState(1); // Used for Forgot Password flow
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [otpValue, setOtpValue] = useState('');

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

  // --- SIGNUP FLOW WITH OTP ---
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

    // Step 1: Trigger OTP Alert
    alert(`OTP sent to ${formData.email}`);
    // Step 2: Switch to OTP view
    setView('otp');
  };

  const handleVerifySignupOtp = (e) => {
    e.preventDefault();
    if (otpValue.length < 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    // Step 3: Finalize Signup after OTP verification
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = { ...formData, username: `${formData.firstName}${formData.surname}`.toLowerCase() };
    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
    
    alert("OTP Verified! Signup Successful!");
    navigate('/login');
  };

  // --- FORGOT PASSWORD FLOW ---
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      alert(`OTP sent to ${forgotEmail}`);
      setStep(2); 
    } else {
      if (otpValue.length < 6) {
        alert("Please enter a valid 6-digit OTP");
        return;
      }
      alert(`Reset link sent to ${forgotEmail}`);
      setView('signup');
      setStep(1);
      setOtpValue('');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050d0a] flex flex-col items-center justify-center font-instrument overflow-x-hidden p-4">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-green-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Logo - UPDATED TO USE YOUR NEW LOGO IMAGE */}
      <div className="absolute top-6 md:top-8 left-6 md:left-12 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <img 
          src="/images/logo.png" 
          alt="CivicLens Logo" 
          className="h-8 md:h-10 w-auto object-contain" 
        />
        <h1 className="text-white text-xl md:text-2xl font-bold tracking-widest uppercase italic">
          CIVICLENS
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-[#08100d]/60 backdrop-blur-xl border border-white/5 p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl transition-all duration-500 mt-16 md:mt-0">
        
        {view === 'signup' && (
          <>
            <h2 className="text-white text-3xl md:text-5xl font-bold text-center mb-8 md:mb-10 uppercase tracking-tight ">SIGN UP</h2>
            <form onSubmit={handleSignupSubmit} className="space-y-4 md:space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <input type="text" name="firstName" placeholder="Enter Name" className="w-full md:w-1/2 bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all" required onChange={handleChange} />
                <input type="text" name="surname" placeholder="Enter Surname" className="w-full md:w-1/2 bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all" required onChange={handleChange} />
              </div>
              <input type="email" name="email" placeholder="Enter Email" className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all" required onChange={handleChange} />
              <div className="relative w-full">
                <input type={showPass ? "text" : "password"} name="password" placeholder="Enter Password" privacy="true" className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all pr-12" required onChange={handleChange} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative w-full">
                <input type={showConfirmPass ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" privacy="true" className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all pr-12" required onChange={handleChange} />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-left">
                <button type="button" onClick={() => setView('forgot')} className="text-[10px] md:text-xs text-gray-400 hover:text-emerald-400 transition-colors bg-transparent uppercase font-bold tracking-widest">Forgot Password?</button>
              </div>
              <button type="submit" className="w-full border border-white/40 py-3 md:py-4 rounded-xl text-white text-lg md:text-xl font-semibold hover:bg-white hover:text-black transition-all active:scale-[0.98] uppercase tracking-widest ">Sign Up</button>
              <div className="text-center md:text-right pt-4">
                <p className="text-gray-400 text-[10px] md:text-sm uppercase tracking-widest">
                  Already Signed in? <br className="hidden md:block" />
                  <button type="button" onClick={() => navigate('/login')} className="text-white hover:underline font-black cursor-pointer ml-1 md:ml-0">Try Logging in</button>
                </p>
              </div>
            </form>
          </>
        )}

        {view === 'otp' && (
          <div className="max-w-md mx-auto py-2 transition-all">
            <button onClick={() => setView('signup')} className="text-gray-400 hover:text-white flex items-center gap-2 text-[10px] uppercase tracking-widest mb-6 md:mb-8 transition-colors"><ArrowLeft size={14} /> Change Details</button>
            <h2 className="text-white text-2xl md:text-4xl font-bold mb-4 uppercase tracking-tight italic">Verify Email</h2>
            <p className="text-gray-400 mb-6 text-sm">We've sent a 6-digit code to {formData.email}</p>
            <form onSubmit={handleVerifySignupOtp} className="space-y-4 md:space-y-6">
              <input type="text" maxLength="6" placeholder="Enter OTP" value={otpValue} onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white text-center text-xl tracking-[0.5em] focus:border-emerald-500 outline-none transition-all" required />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 md:py-4 rounded-xl text-white text-[10px] md:text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                Complete Signup <SendHorizontal size={18} />
              </button>
            </form>
          </div>
        )}

        {view === 'forgot' && (
          <div className="max-w-md mx-auto py-2 transition-all">
            <button onClick={() => {setView('signup'); setStep(1); setOtpValue('');}} className="text-gray-400 hover:text-white flex items-center gap-2 text-[10px] uppercase tracking-widest mb-6 md:mb-8 transition-colors"><ArrowLeft size={14} /> Back to Signup</button>
            <h2 className="text-white text-2xl md:text-4xl font-bold mb-4 uppercase tracking-tight italic">{step === 1 ? "Reset Access" : "Verify OTP"}</h2>
            <form onSubmit={handleForgotSubmit} className="space-y-4 md:space-y-6">
              {step === 1 ? (
                <input type="email" placeholder="Enter Email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all" required />
              ) : (
                <input type="text" maxLength="6" placeholder="Enter OTP" value={otpValue} onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white text-center text-xl tracking-[0.5em] focus:border-emerald-500 outline-none transition-all" required />
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