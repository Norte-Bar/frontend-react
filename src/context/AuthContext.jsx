import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [idLogado, setIdLogado] = useState(null);

    useEffect(() => {
        const temToken = localStorage.getItem('token');

        if(temToken) {
            setToken(temToken);
            setIdLogado(jwtDecode(temToken).id);
        }
    }, [])

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setIdLogado(jwtDecode(newToken).id);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIdLogado(null);
    };

    const tokenTaExpirado = () => {
        try {
            const decoded = jwtDecode(token);
            const now = Math.floor(Date.now() / 1000);
            return decoded.exp < now
        } catch (error) {
            return true
        }
    }

    return (
        <AuthContext.Provider value={{ token, idLogado, login, logout, tokenTaExpirado }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}