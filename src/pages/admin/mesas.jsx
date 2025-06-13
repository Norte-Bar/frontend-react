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
		<div className="min-h-screen bg-gray-50">
			{error && (
				<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-sm flex items-center gap-3 max-w-md w-full mx-4">
					<AlertCircle className="w-5 h-5 flex-shrink-0" />
					<span className="font-medium flex-1">{error}</span>
					<button onClick={clearError} className="w-6 h-6 text-red-600 hover:text-red-800 transition-colors">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			)}

			{/* Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-8 py-6">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<rect x="3" y="12" width="18" height="3" rx="1.5" strokeWidth="2" />
									<circle cx="6" cy="18" r="2" strokeWidth="2" />
									<circle cx="18" cy="18" r="2" strokeWidth="2" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12V8a4 4 0 118 0v4" />
								</svg>
							</div>
							<h1 className="text-3xl font-semibold text-gray-900">Gerenciar Mesas</h1>
						</div>
						<button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" onClick={() => openForm()} disabled={loading}>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
							Nova Mesa
						</button>
					</div>
				</div>
			</div>

			

			{/* Content */}
			<div className="max-w-7xl mx-auto px-6 py-6">
				{loading && (
					<div className="flex items-center justify-center py-12">
						<div className="text-center">
							<Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
							<p className="text-gray-600">Carregando mesas...</p>
						</div>
					</div>
				)}

				{!loading && mesas.length > 0 && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{mesas.map((mesa) => (
							<div key={mesa.id} className="group bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
								{/* Status Badge */}
								<div className="flex items-center justify-between mb-3">
									<span className="text-lg font-semibold text-gray-900">Mesa {mesa.numero}</span>
									<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${mesa.status === true ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{mesa.status === true ? "Disponível" : "Ocupada"}</span>
								</div>

								{/* Mesa Info */}
								<div className="space-y-2 mb-4">
									<div className="flex items-center text-sm text-gray-600">
										<span>ID: #{mesa.id}</span>
									</div>
									<div className="flex items-center text-sm text-gray-600">
										<span>Capacidade: {mesa.capacidade} pessoas</span>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
									<button onClick={() => openForm(mesa)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={submitting}>
										<Pencil className="w-3 h-3" />
										Editar
									</button>
									<button onClick={() => handleDelete(mesa.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={submitting}>
										<Trash2 className="w-3 h-3" />
										Excluir
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Empty State */}
				{!loading && mesas.length === 0 && (
					<div className="text-center py-12">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<rect x="3" y="12" width="18" height="3" rx="1.5" strokeWidth="2" />
								<circle cx="6" cy="18" r="2" strokeWidth="2" />
								<circle cx="18" cy="18" r="2" strokeWidth="2" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12V8a4 4 0 118 0v4" />
							</svg>
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma mesa cadastrada</h3>
						<p className="text-gray-600 mb-4">Comece adicionando sua primeira mesa</p>
						<button onClick={() => openForm()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
							Adicionar Mesa
						</button>
					</div>
				)}
			</div>

			{/* Modal */}
			{showDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<div className="absolute inset-0 bg-black/50" onClick={() => !submitting && setShowDialog(false)}></div>

					{/* Modal Content */}
					<div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
						{/* Close Button */}
						<button onClick={() => setShowDialog(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={submitting}>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>

						{/* Header */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold text-gray-900">{selectedMesa ? "Editar Mesa" : "Nova Mesa"}</h2>
							<p className="text-gray-600 text-sm mt-1">{selectedMesa ? "Atualize as informações da mesa" : "Adicione uma nova mesa ao sistema"}</p>
						</div>

						{/* Form */}
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Número da Mesa</label>
								<input
									type="number"
									min={1}
									value={form.numero}
									onChange={(e) => setForm({ ...form, numero: e.target.value })}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
									placeholder="Ex: 1"
									disabled={submitting}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Capacidade</label>
								<input
									type="number"
									min={1}
									value={form.capacidade}
									onChange={(e) => setForm({ ...form, capacidade: e.target.value })}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
									placeholder="Ex: 4 pessoas"
									disabled={submitting}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
								<select
									value={form.status}
									onChange={(e) => setForm({ ...form, status: e.target.value })}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
									disabled={submitting}>
									<option value={true}>Disponível</option>
									<option value={false}>Ocupada</option>
								</select>
							</div>

							<button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={submitting}>
								{submitting ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										{selectedMesa ? "Atualizando..." : "Criando..."}
									</>
								) : (
									<>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
