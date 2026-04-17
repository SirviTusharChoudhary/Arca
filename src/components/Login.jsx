import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Sparkles , X } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth, db } from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const provider = new GoogleAuthProvider();

const Login = ({swap, onClose}) => {
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleGoogleSignIn = async () => {
      setLoading(true);
      await signInWithPopup(auth, provider)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            const generateHandle = (email, uid) => {
                const prefix = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "").substring(0,20);
                return `${prefix}_${uid.slice(-4)}`;
            };
            const username = generateHandle(user.email, user.uid);
            const userData = {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              username: username,
              joinedProjects: [],
              preferences: {},
            };
            await setDoc(userRef, userData);
        }
        
        setLoading(false);
        const savedPath = sessionStorage.getItem("redirectPath");
        if (savedPath) {
            nav(savedPath);
            sessionStorage.removeItem("redirectPath");
        }
        else {
            nav(`/dashboard/${userCredential.user.uid}`)
        }
    })
    .catch((error) => {
        alert(error);
        console.log("Login" , error);
        setLoading(false);
    })
    console.log("Google Sign In Triggered");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const savedPath = sessionStorage.getItem("redirectPath");
        if (savedPath) {
            nav(savedPath);
            sessionStorage.removeItem("redirectPath");
        }
        else {
            nav(`/dashboard/${userCredential.user.uid}`)
        }
    })
    .catch ((error) => {
        alert(error);
        console.log("Login", error);
        setLoading(false);
    })
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-lg p-6 shadow-2xl relative border border-gray-200 dark:border-slate-800"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="w-full max-w-[340px] mx-auto">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">Log in to Arca</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-0.5">
                Work Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-500 outline-none transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-0.5">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-500 outline-none transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 p-1 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-md transition-all flex items-center justify-center gap-2 mt-2 shadow-sm disabled:opacity-50 active:scale-95"
            >
              <Sparkles size={16} /> {loading ? "Loading..." : "Login to Arca"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">OR PROVIDER</span>
            <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-2 border border-gray-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors mb-4 shadow-sm group"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l3.66-2.82z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.82c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Continue with Google</span>
          </button>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-800 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
              Don't have an account?{' '}
              <button 
                onClick={swap}
                className="text-blue-600 dark:text-blue-500 font-bold hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;