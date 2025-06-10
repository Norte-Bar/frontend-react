import { useState } from "react";
import MainContainer from "../../components/admin/mainContainer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import HeaderAdmin from "../../components/admin/headerAdmin";

function Login() {
	const [credenciais, setCredenciais] = useState({
		usuario: "",
		senha: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { token, login } = useAuth();
	const navigate = useNavigate();

	if (token) {
		navigate("/admin/dashboard");
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCredenciais((prev) => ({
			...prev,
			[name]: value,
		}));
		setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const basicAuthHeader = "Basic " + btoa(`${credenciais.usuario}:${credenciais.senha}`);

		try {
			const response = await fetch("http://localhost:8080/authenticate", {
				method: "POST",
				headers: {
					Authorization: basicAuthHeader,
				},
			});

			if (!response.ok) {
				throw new Error("Usuario/Senha incorretos!");
			}

			const token = await response.text();

			login(token);

			navigate("/admin/dashboard");
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{/* <header className={`bg-blue-950 p-4 flex justify-center items-center shadow-md`}>
				<h1 className="text-2xl font-semibold text-white">NORTE BAR</h1>
			</header> */}
			<MainContainer>
				<div className="max-w-xs mx-auto p-6 border rounded-lg shadow bg-white">
					<h2 className="text-xl font-bold mb-4 text-center">Login</h2>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
								Usuário
							</label>
							<input type="text" id="usuario" name="usuario" value={credenciais.usuario} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Digite seu usuário" />
						</div>

						<div>
							<label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
								Senha
							</label>
							<input type="password" id="senha" name="senha" value={credenciais.senha} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Digite sua senha" />
						</div>

						<button type="submit" disabled={loading} className="w-full mt-2 py-2 px-4 bg-blue-950 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer">
							{loading ? "Entrando..." : "Entrar"}
						</button>
					</form>

					{error && <div className="mb-4 p-2 text-sm text-red-600">{error}</div>}
				</div>
			</MainContainer>
		</>
	);
}

export default Login;
