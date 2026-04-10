import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Sparkles, AtSign, X, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { auth, db } from "../services/firebase";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const provider = new GoogleAuthProvider();
const Signup = ({ swap, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleGoogleSignUp = () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
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
        console.log("SIGNUP", error);
        setLoading(false);
      });
    console.log("Google Sign Up Triggered");
  };

  const generateHandle = (email, uid) => {
    const prefix = email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const shortId = uid.slice(-4);
    return `${prefix}_${shortId}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const username = generateHandle(user.email, user.uid);
        const userData = {
          uid: user.uid,
          displayName: formData.name,
          email: user.email,
          photoURL: `https://openclipart.org/detail/346569/default-silhouette-avatar`,
          username: username,
          joinedProjects: [],
          preferences: {},
        };
        await setDoc(doc(db, "users", user.uid), userData);
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
        console.log("SIGNUP", error);
        setLoading(false);
      });
    console.log("Signing up with:", formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[400px] bg-white rounded-[4px] p-6 shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-arca-gray hover:text-arca-dark transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-full max-w-[340px] mx-auto">
          <h2 className="text-xl font-bold text-arca-dark mb-6 text-center">Create account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[13px] font-bold text-arca-gray uppercase tracking-wider mb-2 ml-0.5">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-arca-gray group-focus-within:text-arca-blue transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Tushar"
                  className="w-full pl-10 pr-4 py-2 bg-[#F4F5F7] border-2 border-[#DFE1E6] rounded-[3px] text-arca-dark focus:bg-white focus:border-arca-blue outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[13px] font-bold text-arca-gray uppercase tracking-wider mb-2 ml-0.5">
                Work Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-arca-gray group-focus-within:text-arca-blue transition-colors"
                  size={16}
                />
                <input
                  type="email"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2 bg-[#F4F5F7] border-2 border-[#DFE1E6] rounded-[3px] text-arca-dark focus:bg-white focus:border-arca-blue outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-bold text-arca-gray uppercase tracking-wider mb-2 ml-0.5">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-arca-gray group-focus-within:text-arca-blue transition-colors"
                  size={16}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Strong password"
                  className="w-full pl-10 pr-12 py-2 bg-[#F4F5F7] border-2 border-[#DFE1E6] rounded-[3px] text-arca-dark focus:bg-white focus:border-arca-blue outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-arca-gray hover:text-arca-dark p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-arca-blue hover:bg-arca-hover text-white font-bold py-2.5 rounded-[3px] transition-all flex items-center justify-center gap-2 mt-2 shadow-sm disabled:opacity-50"
            >
              <Sparkles size={16} /> {loading ? "Creating..." : "Create your Arca"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-[#DFE1E6]"></div>
            <span className="flex-shrink mx-4 text-[10px] font-extrabold text-arca-gray uppercase tracking-[0.2em]">OR PROVIDER</span>
            <div className="flex-grow border-t border-[#DFE1E6]"></div>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 py-2 border-2 border-[#DFE1E6] rounded-[3px] bg-white hover:bg-gray-50 transition-colors mb-4 shadow-sm group"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l3.66-2.82z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.82c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-bold text-arca-dark">
              Sign up with Google
            </span>
          </button>

          <div className="mt-6 pt-4 border-t border-[#DFE1E6] text-center">
            <p className="text-sm text-arca-gray font-medium">
              Already have an account?{' '}
              <button 
                onClick={swap}
                className="text-arca-blue font-bold hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
