import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, SendHorizontal, ShieldCheck, Mail } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Apiclient from '../api/Api';
import { Slab } from "react-loading-indicators"
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [view, setView] = useState('signup');
  const [otpValue, setOtpValue] = useState('');
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: ''
  });

  const navigate = useNavigate();

  // Main Login Function
  const handleLogin = async (e) => {
    e.preventDefault();
    const { identifier, password } = loginData;

    setLoading(true); // START

    try {
      const response = await Apiclient.post("/user/login", {
        email: identifier,
        password: password
      });

      localStorage.setItem("Token", response.data.access_token);

      const res = await Apiclient.get("/user/me", {
        headers: {
          Authorization: `${response.data.access_token}`,
        },
      });

      localStorage.setItem("username", res.data.name);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      alert("An error occurred during login.");
    } finally {
      setLoading(false); // END (important)
    }
  };
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (step === 1) {
        // SEND OTP
        await Apiclient.post("/user/send-otp", {
          email: forgotEmail
        });

        alert(`OTP sent to ${forgotEmail}`);
        setStep(2);

      } else {
        // VALIDATE
        if (otpValue.length < 6) {
          alert("Invalid OTP");
          return;
        }

        if (!newPassword) {
          alert("Enter new password");
          return;
        }

        // UPDATE PASSWORD
        await Apiclient.put("/user/update-password", {
          email: forgotEmail,
          otp: otpValue,
          password: newPassword
        });

        alert("Password updated successfully");

        // RESET STATE
        setView('signup');
        setStep(1);
        setOtpValue('');
        setForgotEmail('');
        setNewPassword('');
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true); // START

    try {
      const token = credentialResponse.credential;

      const response = await Apiclient.post(
        'https://168.144.68.244.sslip.io/user/google',
        { verification_token: token },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      localStorage.setItem("Token", response.data.access_token);

      const res = await Apiclient.get("/user/me", {
        headers: {
          Authorization: `${response.data.access_token}`,
        },
      });

      localStorage.setItem("username", res.data.name);
      navigate("/");
    } catch (error) {
      console.error("Error during Google Login", error);
      alert("Network error during Google Login.");
    } finally {
      setLoading(false); // END
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050d0a] flex flex-col items-center justify-center font-instrument overflow-x-hidden p-4">

      {/* Background Glows */}
      <div className="absolute top-1/2 left-[-20%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-green-900/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Top Logo - UPDATED WITH LOGO IMAGE */}
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

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl transition-all duration-500 mt-12 md:mt-0">

        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-tighter">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest mt-2 font-semibold">
            Login to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Email or Username"
              className="w-full bg-[#0a1a14]/50 border border-white/10 p-4 pl-12 rounded-xl text-white placeholder:text-gray-600 focus:border-emerald-500 outline-none transition-all text-sm font-normal"
              required
              value={loginData.identifier}
              onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
            />
          </div>

          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-[#0a1a14]/50 border border-white/10 p-4 pl-12 rounded-xl text-white placeholder:text-gray-600 focus:border-emerald-500 outline-none transition-all text-sm font-normal"
              required
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
          </div>
          <div className="text-left">
            <button type="button" onClick={() => setView('forgot')} className="text-[10px] md:text-xs text-gray-400 hover:text-emerald-400 transition-colors bg-transparent uppercase font-bold tracking-widest">Forgot Password?</button>
          </div>
          <div className="flex flex-col gap-4 pt-4">
            <button
              type="submit"
              className="w-full bg-[#00592E] hover:bg-[#006e39] text-white py-4 md:py-5 rounded-xl font-black text-sm md:text-base uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 w-full border-t border-white/5 pt-6">
          <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest font-semibold mb-2">
            Or continue with
          </p>
          <div className="w-full flex justify-center scale-105">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.error('Google Login Failed');
                alert('Google Login encountered an error.');
              }}
              theme="filled_black"
              shape="pill"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-gray-600 text-[10px] md:text-xs uppercase tracking-widest font-semibold">
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
      {view === 'forgot' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

          {/* Modal */}
          <div className="relative z-50 w-full max-w-md bg-[#08100d] border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl">

            <button
              onClick={() => {
                setView('signup');
                setStep(1);
                setOtpValue('');
              }}
              className="text-gray-400 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest mb-6"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <h2 className="text-white text-2xl md:text-3xl font-bold mb-4 uppercase tracking-tight">
              {step === 1 ? "Reset Access" : "Verify OTP"}
            </h2>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {step === 1 ? (
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none"
                  required
                />
              ) : (
                <>
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="Enter OTP"
                    value={otpValue}
                    onChange={(e) =>
                      setOtpValue(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white text-center text-xl tracking-[0.5em] focus:border-emerald-500 outline-none"
                    required
                  />

                  <input
                    type="password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none"
                    required
                  />
                </>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl text-white text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {step === 1 ? "Send OTP" : "Verify OTP"}
                <SendHorizontal size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <Slab color="#006e39" size="medium" text="" textColor="" />
        </div>
      )}
    </div>
  );
};

export default Login;