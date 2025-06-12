import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
	const [credenciais, setCredenciais] = useState({
		usuario: "",
		senha: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/admin/dashboard", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	useEffect(() => {
		if (error && (credenciais.usuario || credenciais.senha)) {
			setError("");
		}
	}, [credenciais, error]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCredenciais((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		// Validações básicas
		if (!credenciais.usuario.trim() || !credenciais.senha.trim()) {
			setError("Por favor, preencha todos os campos");
			return;
		}

		setError("");
		setLoading(true);

		const basicAuthHeader = "Basic " + btoa(`${credenciais.usuario.trim()}:${credenciais.senha}`);

		try {
			const response = await fetch("http://localhost:8080/authenticate", {
				method: "POST",
				headers: {
					Authorization: basicAuthHeader,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error("Usuário ou senha incorretos");
				} else if (response.status >= 500) {
					throw new Error("Erro interno do servidor. Tente novamente.");
				} else {
					throw new Error("Erro na conexão. Verifique sua internet.");
				}
			}

			const token = await response.text();
			
			if (!token) {
				throw new Error("Token não recebido do servidor");
			}

			login(token);
			navigate("/admin/dashboard", { replace: true });

		} catch (error) {
			console.error("Erro no login:", error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	if (isAuthenticated) {
		return null;
	}

	return (
			<div className="min-h-screen flex bg-gray-200 items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8">
					{/* Header */}
					<div className="text-center">
						<div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mb-6 shadow-lg">
							<svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
						<h2 className="text-3xl font-bold text-gray-900 mb-2">
							Área Administrativa
						</h2>
						<p className="text-gray-600">
							Faça login para acessar o painel
						</p>
					</div>

					{/* Formulário */}
					<div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Campo Usuário */}
							<div>
								<label htmlFor="usuario" className="block text-sm font-semibold text-gray-700 mb-2">
									Usuário
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
									</div>
									<input
										type="text"
										id="usuario"
										name="usuario"
										value={credenciais.usuario}
										onChange={handleChange}
										required
										className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
										placeholder="Digite seu usuário"
										disabled={loading}
									/>
								</div>
							</div>

							{/* Campo Senha */}
							<div>
								<label htmlFor="senha" className="block text-sm font-semibold text-gray-700 mb-2">
									Senha
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
									</div>
									<input
										type={showPassword ? "text" : "password"}
										id="senha"
										name="senha"
										value={credenciais.senha}
										onChange={handleChange}
										required
										className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
										placeholder="Digite sua senha"
										disabled={loading}
									/>
									<button
										type="button"
										onClick={togglePasswordVisibility}
										className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
										disabled={loading}
									>
										{showPassword ? (
											<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 8.464m5.656 5.656l1.415 1.415m-1.415-1.415l1.415 1.415M14.828 14.828L12 12m2.828 2.828L12 12m0 0L9.172 9.172" />
											</svg>
										) : (
											<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										)}
									</button>
								</div>
							</div>

							{/* Mensagem de Erro */}
							{error && (
								<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
									<svg className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<div>
										<p className="text-sm font-medium text-red-800">Erro no login</p>
										<p className="text-sm text-red-600">{error}</p>
									</div>
								</div>
							)}

							{/* Botão de Submit */}
							<button
								type="submit"
								disabled={loading}
								className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
							>
								{loading ? (
									<>
										<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Entrando...
									</>
								) : (
									<>
										<svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
										</svg>
										Entrar no Sistema
									</>
								)}
							</button>
						</form>
					</div>

					{/* Footer */}
					<div className="text-center">
						<p className="text-sm text-gray-500">
							© 2025 Norte Bar - Sistema Administrativo
						</p>
					</div>
				</div>
			</div>
	);
}

export default Login;