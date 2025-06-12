import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [token, setToken] = useState(null);
	const [idLogado, setIdLogado] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const temToken = localStorage.getItem("token");

		if (temToken) {
			if (!tokenEstaExpirado(temToken)) {
				setToken(temToken);
				try {
					setIdLogado(jwtDecode(temToken).id);
				} catch (error) {
					console.error("Erro ao decodificar token:", error);
					logout();
				}
			} else {
				// Token expirado, remove do localStorage
				localStorage.removeItem("token");
			}
		}

		setIsLoading(false);
	}, []);

	const tokenEstaExpirado = (tokenToCheck = token) => {
		if (!tokenToCheck) return true;

		try {
			const decoded = jwtDecode(tokenToCheck);
			const now = Math.floor(Date.now() / 1000);
			return decoded.exp < now;
		} catch (error) {
			return true;
		}
	};

	const login = (newToken) => {
		if (!newToken) {
			console.error("Token inválido fornecido para login");
			return;
		}

		try {
			const decoded = jwtDecode(newToken);

			localStorage.setItem("token", newToken);
			setToken(newToken);
			setIdLogado(decoded.id);
		} catch (error) {
			console.error("Erro ao processar token no login:", error);
			throw new Error("Token inválido");
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken(null);
		setIdLogado(null);
	};

	const isAuthenticated = token && !tokenEstaExpirado();

	return <AuthContext.Provider value={{ token, idLogado, login, logout, tokenTaExpirado: tokenEstaExpirado, isAuthenticated, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth deve ser usado dentro de um AuthProvider");
	}
	return context;
}
