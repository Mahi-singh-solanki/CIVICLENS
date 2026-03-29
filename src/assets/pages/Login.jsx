import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, ShieldCheck, Mail } from 'lucide-react';

const Login = () => {
  const [loginData, setLoginData] = useState({ 
    identifier: '', 
    password: '', 
    otp: '' 
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // 1. Function to trigger OTP
  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!loginData.identifier) return alert("Please enter your Email or Username");
    
    // Simulate sending OTP
    alert("OTP sent to your registered device! (Use 123456 for demo)");
    setIsOtpSent(true);
  };

  // 2. Main Login / Verify Function - MARKED AS ASYNC
  const handleLogin = async (e) => {
    e.preventDefault();
    const { identifier, password, otp } = loginData;

    try {
      // NOTE: If you are using a real backend, uncomment this section:
      /*
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, otp }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem("role", data.user_role); 
        login(data.user);
        navigate(data.user_role === "Normal User" ? "/user-home" : "/");
        return;
      }
      */

      // --- LOCAL STORAGE MOCK LOGIC (For development) ---
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => 
        (u.email === identifier || u.username === identifier)
      );

      if (!foundUser) return alert("Account not found. Please check your credentials.");

      const completeLogin = (user) => {
        // This ensures the Chatbot sees the role
        localStorage.setItem("role", user.role); 
        login(user);

        // Redirect based on role
        if (user.role === "Normal User") {
          navigate("/");
        } else if (user.role === "Admin") {
          navigate("/");
        } else if (user.role === "Government Authority") {
          navigate("/");
        } else {
          navigate("/");
        }
      };

      if (isOtpSent) {
        if (otp === '123456') { 
          completeLogin(foundUser);
        } else {
          alert("Invalid OTP code.");
        }
      } else {
        if (foundUser.password === password) {
          completeLogin(foundUser);
        } else {
          alert("Incorrect password.");
        }
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050d0a] flex flex-col items-center justify-center font-instrument overflow-x-hidden p-4">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-[-20%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-green-900/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Top Logo */}
      <div className="absolute top-6 md:top-8 left-6 md:left-12">
        <h1 
          className="text-white text-xl md:text-2xl font-bold tracking-widest cursor-pointer uppercase italic" 
          onClick={() => navigate('/')}
        >
          CIVICLENS
        </h1>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl transition-all duration-500 mt-12 md:mt-0">
        
        <div className="text-center mb-8 md:mb-10">
            <h2 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-tighter italic">
            {isOtpSent ? "Verify Identity" : "Welcome Back"}
            </h2>
            <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest mt-2">
                {isOtpSent ? "Enter the 6-digit code" : "Login to your account"}
            </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
                type="text"
                placeholder="Email or Username"
                className="w-full bg-[#0a1a14]/50 border border-white/10 p-4 pl-12 rounded-xl text-white placeholder:text-gray-600 focus:border-emerald-500 outline-none transition-all text-sm"
                required
                disabled={isOtpSent}
                value={loginData.identifier}
                onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
            />
          </div>

          {!isOtpSent ? (
            <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                type="password"
                placeholder="Password"
                className="w-full bg-[#0a1a14]/50 border border-white/10 p-4 pl-12 rounded-xl text-white placeholder:text-gray-600 focus:border-emerald-500 outline-none transition-all text-sm"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
            </div>
          ) : (
            <input
              type="text"
              placeholder="0 0 0 0 0 0"
              maxLength="6"
              className="w-full bg-[#0a1a14]/50 border border-white/10 p-4 rounded-xl text-white text-center text-2xl tracking-[0.4em] focus:border-emerald-500 outline-none transition-all font-mono"
              required
              value={loginData.otp}
              onChange={(e) => setLoginData({ ...loginData, otp: e.target.value })}
            />
          )}

          <div className="flex flex-col gap-4 pt-4">
            <button
              type="submit"
              className="w-full bg-[#00592E] hover:bg-emerald-600 text-white py-4 md:py-5 rounded-xl font-black text-sm md:text-base uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-95 italic"
            >
              {isOtpSent ? "Finish Login" : "Sign In"}
            </button>

            {!isOtpSent && (
              <button
                type="button"
                onClick={handleRequestOtp}
                className="text-[10px] md:text-xs text-emerald-500 font-bold hover:text-white transition-colors py-2 uppercase tracking-widest"
              >
                Login with Secure OTP
              </button>
            )}
            
            {isOtpSent && (
              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="text-[10px] md:text-xs text-gray-500 py-2 flex items-center justify-center gap-2 hover:text-gray-300 transition-colors uppercase tracking-widest font-bold"
              >
                <ArrowLeft size={12} /> Back to Password
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-600 text-[10px] md:text-xs uppercase tracking-widest">
                Don't have an account? 
                <button 
                    onClick={() => navigate('/signup')} 
                    className="text-white ml-2 font-black hover:underline"
                >
                    Create One
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;