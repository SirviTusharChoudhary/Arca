import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebase";
import AuthLoader from "../loaders/AuthLoader";
import { doc, onSnapshot } from "firebase/firestore";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
      if (currUser) {
        const userRef = doc(db, "users", currUser.uid);
        const unsubDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
          setLoading(false);
        });

        return () => unsubDoc();
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {loading ? <AuthLoader /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
