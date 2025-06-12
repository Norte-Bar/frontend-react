import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Mesas() {
	const [mesas, setMesas] = useState([]);
	const [selectedMesa, setSelectedMesa] = useState(null);
	const [showDialog, setShowDialog] = useState(false);
	const [form, setForm] = useState({ numero: "", capacidade: "", status: true });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const { token, logout, tokenTaExpirado } = useAuth();
	const api = "http://localhost:8080";
	const navigate = useNavigate();

	if (tokenTaExpirado()) {
		logout();
		navigate("/admin");
	}

	useEffect(() => {
		fetchMesas();
	}, [token]);

	const fetchMesas = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(api + "/mesa", {
				headers: { Authorization: `Bearer ${token}` },
			});

			// Verifica se a resposta foi bem-sucedida
			if (!response.ok) {
				throw new Error(`Erro ${response.status}: Falha ao carregar mesas`);
			}

			const data = await response.json();
			setMesas(data);
		} catch (err) {
			console.error("Erro ao buscar mesas:", err);
			setError(err.message);
			setMesas([]); // Limpa a lista em caso de erro
		} finally {
			setLoading(false);
		}
	};

	const openForm = (mesa = null) => {
		setSelectedMesa(mesa);
		setForm(
			mesa || {
				numero: "",
				capacidade: "",
				status: "0",
			}
		);
		setShowDialog(true);
	};

	const handleSubmit = async () => {
		setSubmitting(true);
		setError(null);

		try {
			const method = selectedMesa ? "PUT" : "POST";
			const url = selectedMesa ? `${api}/mesa/${selectedMesa.id}` : `${api}/mesa`;

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ ...form, id: selectedMesa?.id }),
			});

			if (!response.ok) {
				throw new Error(`Erro ${response.status}: Falha ao salvar mesa`);
			}

			// Sucesso! Atualiza a lista e fecha o modal
			await fetchMesas();
			setShowDialog(false);

			// Limpa o formulário
			setForm({ numero: "", capacidade: "", status: true });
			setSelectedMesa(null);
		} catch (err) {
			console.error("Erro ao salvar mesa:", err);
			setError(err.message);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Tem certeza que deseja excluir esta mesa?")) {
			return;
		}

		setError(null);

		try {
			const response = await fetch(`${api}/mesa/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!response.ok) {
				throw new Error(`Erro ${response.status}: Falha ao excluir mesa`);
			}

			await fetchMesas();
		} catch (err) {
			console.error("Erro ao excluir mesa:", err);
			setError(err.message);
		}
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
			{error && (
				<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-lg border border-red-400/30 flex items-center gap-3 max-w-md w-full mx-4">
					<AlertCircle className="w-5 h-5 flex-shrink-0" />
					<span className="font-medium flex-1">{error}</span>
					<button onClick={clearError} className="w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors duration-200">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			)}

			{/* Header */}
			<div className="bg-slate-800/70 backdrop-blur-md border-b border-slate-600/30 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-8 py-6">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<rect x="3" y="12" width="18" height="3" rx="1.5" strokeWidth="2" />
									<circle cx="6" cy="18" r="2" strokeWidth="2" />
									<circle cx="18" cy="18" r="2" strokeWidth="2" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12V8a4 4 0 118 0v4" />
								</svg>
							</div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Gerenciar Mesas</h1>
						</div>
						<button
							className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
							onClick={() => openForm()}
							disabled={loading}>
							<svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
							Nova Mesa
						</button>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-8 py-8">
				{loading && (
					<div className="flex items-center justify-center py-16">
						<div className="text-center">
							<Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
							<p className="text-slate-400 font-medium">Carregando mesas...</p>
						</div>
					</div>
				)}

				{!loading && mesas.length > 0 && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{mesas.map((mesa) => (
							<div key={mesa.id} className="group relative bg-slate-800/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg hover:shadow-2xl border border-slate-600/40 transition-all duration-300 hover:transform hover:scale-105">
								{/* Status Badge */}
								<div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-lg flex items-center justify-center ${mesa.status === true ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-red-500 to-pink-500"}`}>
									<div className="w-3 h-3 bg-white rounded-full"></div>
								</div>

								{/* Mesa Icon */}
								<div className="flex items-center gap-4 mb-4">
									<div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${mesa.status === true ? "bg-gradient-to-r from-emerald-900/30 to-teal-900/30" : "bg-gradient-to-r from-red-900/30 to-pink-900/30"}`}>
										<svg className={`w-7 h-7 ${mesa.status === true ? "text-emerald-400" : "text-red-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<rect x="3" y="12" width="18" height="3" rx="1.5" strokeWidth="2" />
											<circle cx="6" cy="18" r="2" strokeWidth="2" />
											<circle cx="18" cy="18" r="2" strokeWidth="2" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12V8a4 4 0 118 0v4" />
										</svg>
									</div>
									<div>
										<h3 className="text-2xl font-bold text-white">Mesa {mesa.numero}</h3>
										<p className="text-slate-400 text-sm">#{mesa.id}</p>
									</div>
								</div>

								{/* Mesa Info */}
								<div className="space-y-3 mb-6">
									<div className="flex items-center gap-3">
										<div className="w-2 h-2 bg-slate-400 rounded-full"></div>
										<span className="text-slate-300">
											Capacidade: <span className="font-semibold text-white">{mesa.capacidade} pessoas</span>
										</span>
									</div>
									<div className="flex items-center gap-3">
										<div className={`w-2 h-2 rounded-full ${mesa.status === true ? "bg-emerald-500" : "bg-red-500"}`}></div>
										<span className={`font-semibold ${mesa.status === true ? "text-emerald-400" : "text-red-400"}`}>{mesa.status === true ? "Disponível" : "Ocupada"}</span>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									<button
										onClick={() => openForm(mesa)}
										className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={submitting}>
										<Pencil className="w-4 h-4" />
										<span className="text-sm font-medium">Editar</span>
									</button>
									<button
										onClick={() => handleDelete(mesa.id)}
										className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={submitting}>
										<Trash2 className="w-4 h-4" />
										<span className="text-sm font-medium">Excluir</span>
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Empty State */}
				{!loading && mesas.length === 0 && (
					<div className="text-center py-16">
						<div className="w-24 h-24 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
							<svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<rect x="3" y="12" width="18" height="3" rx="1.5" strokeWidth="2" />
								<circle cx="6" cy="18" r="2" strokeWidth="2" />
								<circle cx="18" cy="18" r="2" strokeWidth="2" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12V8a4 4 0 118 0v4" />
							</svg>
						</div>
						<h3 className="text-2xl font-bold text-slate-200 mb-2">Nenhuma mesa cadastrada</h3>
						<p className="text-slate-400 mb-6">Comece adicionando sua primeira mesa</p>
						<button onClick={() => openForm()} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
							Adicionar Mesa
						</button>
					</div>
				)}
			</div>

			{/* Modal */}
			{showDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={() => !submitting && setShowDialog(false)}></div>

					{/* Modal Content */}
					<div className="relative bg-slate-800/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-600/40 transform transition-all duration-300 scale-100" onClick={(e) => e.stopPropagation()}>
						{/* Close Button */}
						<button onClick={() => setShowDialog(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed" disabled={submitting}>
							<svg className="w-5 h-5 text-slate-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>

						{/* Header */}
						<div className="mb-8">
							<div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
								<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<rect x="3" y="12" width="18" height="3" rx="1.5" strokeWidth="2" />
									<circle cx="6" cy="18" r="2" strokeWidth="2" />
									<circle cx="18" cy="18" r="2" strokeWidth="2" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12V8a4 4 0 118 0v4" />
								</svg>
							</div>
							<h2 className="text-3xl font-bold text-center text-white">{selectedMesa ? "Editar Mesa" : "Nova Mesa"}</h2>
							<p className="text-slate-400 text-center mt-2">{selectedMesa ? "Atualize as informações da mesa" : "Adicione uma nova mesa ao sistema"}</p>
						</div>

						{/* Form */}
						<div className="space-y-6">
							<div>
								<label className="block text-sm font-semibold text-slate-200 mb-3">Número da Mesa</label>
								<div className="relative">
									<input
										type="number"
										min={1}
										value={form.numero}
										onChange={(e) => setForm({ ...form, numero: e.target.value })}
										className="w-full bg-slate-700/70 border-2 border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-400 focus:bg-slate-700 transition-all duration-200 text-white font-medium placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
										placeholder="Ex: 1"
										disabled={submitting}
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-semibold text-slate-200 mb-3">Capacidade</label>
								<div className="relative">
									<input
										type="number"
										min={1}
										value={form.capacidade}
										onChange={(e) => setForm({ ...form, capacidade: e.target.value })}
										className="w-full bg-slate-700/70 border-2 border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-400 focus:bg-slate-700 transition-all duration-200 text-white font-medium placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
										placeholder="Ex: 4 pessoas"
										disabled={submitting}
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-semibold text-slate-200 mb-3">Status</label>
								<div className="relative">
									<select
										value={form.status}
										onChange={(e) => setForm({ ...form, status: e.target.value })}
										className="w-full bg-slate-700/70 border-2 border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-400 focus:bg-slate-700 transition-all duration-200 text-white font-medium appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={submitting}>
										<option value={true}>Disponível</option>
										<option value={false}>Ocupada</option>
									</select>
									<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
										<svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</div>
								</div>
							</div>

							<button
								onClick={handleSubmit}
								className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
								disabled={submitting}>
								{submitting ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										{selectedMesa ? "Atualizando..." : "Criando..."}
									</>
								) : (
									<>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										{selectedMesa ? "Atualizar Mesa" : "Criar Mesa"}
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
