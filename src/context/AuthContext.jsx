import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const temToken = localStorage.getItem('token');

        if(temToken) {
            setToken(temToken)
        }
    }, [])

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}