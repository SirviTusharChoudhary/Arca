import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import AuthLoader from "../loaders/AuthLoader";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currUser) => {
            setUser(currUser);
            setLoading(false);
        })
        return () => unsub();
    }, []) 

    return <AuthContext.Provider value={{user, loading}}>{ loading ? <AuthLoader/> : children }</AuthContext.Provider>
} 

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
