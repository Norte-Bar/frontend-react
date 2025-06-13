import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle, BookmarkCheck, Loader2, Pencil, Trash2 } from "lucide-react";

export default function Reservas() {
	const [reservas, setReservas] = useState([]);
	const [selectReserva, setSelectReserva] = useState(null);
	const [showDialog, setShowDialog] = useState(false);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [form, setForm] = useState({
		cliente_nome: "",
		numero_pessoas: 1,
		data_reserva: "",
		status_reserva: "",
	});
	const { token, logout, tokenTaExpirado } = useAuth();
	const api = "http://localhost:8080";
	const navigate = useNavigate();

	const clearError = () => setError("");

	if (tokenTaExpirado()) {
		logout();
		navigate("/admin");
	}

	useEffect(() => {
		fetchReservas();
	}, [token]);

	const fetchReservas = async () => {
		setLoading(true);
		fetch(api + "/reserva", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then(setReservas)
			.finally(setLoading(false));
	};

	const openForm = (reserva = null) => {
		setSelectReserva(reserva);
		setForm({ ...reserva });
		setShowDialog(true);
	};

	const handleSubmit = async () => {
		setError(null);
		setSubmitting(true);

		try {
			const method = "PUT";
			const url = `${api}/reserva/${selectReserva.id}`;

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ ...form, id: selectReserva?.id }),
			});

			if (!response.ok) {
				throw new Error(`Erro ${response.status}: Falha ao salvar mesa`);
			}

			await fetchReservas();
		} catch (error) {
			console.error("Erro ao atualizar reserva:", error);
			setError(error.message);
		} finally {
			setShowDialog(false);
			setSubmitting(false);
			setForm({});
			setSelectReserva(null);
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Tem certeza que deseja excluir esta mesa?")) {
			return;
		}
		setSubmitting(true);
		setError(null);

		try {
			const response = await fetch(`${api}/reserva/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!response.ok) {
				throw new Error(`Erro ${response.status}: Falha ao excluir reserva`);
			}

			await fetchReservas();
			setSubmitting(false);
		} catch (err) {
			console.error("Erro ao excluir reserva:", err);
			setError(err.message);
		}
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

			<div className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-8 py-6">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
								<BookmarkCheck className="w-8 h-8 text-white mx-auto mb-1" />
							</div>
							<h1 className="text-3xl font-semibold text-gray-900">Gerenciar Reservas</h1>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-8 py-8">
				{/* Tabela */}
				{!loading && reservas.length > 0 && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="bg-gray-50 border-b border-gray-200">
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Cliente Nome</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Qtd. Pessoas</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Data</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
										<th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Ações</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{reservas.map((reserva, index) => (
										<tr key={reserva.id} className="group hover:bg-gray-50 transition-all duration-200">
											<td className="px-6 py-4">
												<div className="text-gray-700 text-sm max-w-xs">{reserva.cliente_nome}</div>
											</td>
											<td className="px-6 py-4">
												<div className="text-gray-700 text-sm max-w-xs">{reserva.numero_pessoas}</div>
											</td>
											<td className="px-6 py-4">
												<div className="text-gray-700 text-sm max-w-xs">
													{new Date(reserva.data_reserva).toLocaleString("pt-BR", {
														day: "2-digit",
														month: "2-digit",
														year: "numeric",
														hour: "2-digit",
														minute: "2-digit",
														second: "2-digit",
													})}
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<div className={`w-3 h-3 rounded-full ${reserva.status_reserva ? "bg-green-500" : "bg-red-500"}`}></div>
													<span className={`font-medium ${reserva.status_reserva ? "text-green-700" : "text-red-700"}`}>{reserva.status_reserva ? "Ativo" : "Inativo"}</span>
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center justify-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
													<button onClick={() => openForm(reserva)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-105 cursor-pointer" title="Editar">
														<Pencil className="w-4 h-4" />
													</button>
													<button onClick={() => handleDelete(reserva.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-105 cursor-pointer" title="Excluir">
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>

			{/* Modal */}
			{showDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<div className="absolute inset-0 bg-black/50" onClick={() => !submitting && setShowDialog(false)}></div>

					{/* Modal Content */}
					<div className="relative bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl border border-gray-200 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
						{/* Close Button */}
						<button onClick={() => setShowDialog(false)} className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed" disabled={submitting}>
							<svg className="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>

						{/* Header */}
						<div className="mb-8">
							<div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<BookmarkCheck className="w-8 h-8 text-indigo-600" />
							</div>
							<h2 className="text-3xl font-bold text-center text-gray-900">{selectReserva ? "Editar Reserva" : "Nova Comida"}</h2>
							<p className="text-gray-600 text-center mt-2">{selectReserva ? "Atualize as informações da reserva" : "Adicione uma nova comida ao cardápio"}</p>
						</div>

						{/* Form */}
						<div className="space-y-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<div className="lg:col-span-2">
									<label className="block text-sm font-semibold text-gray-700 mb-3">Nome do Cliente</label>
									<input
										type="text"
										value={form.cliente_nome}
										onChange={(e) => setForm({ ...form, cliente_nome: e.target.value })}
										className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 font-medium placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
										placeholder="Ex: Pizza Margherita"
										disabled={true}
									/>
								</div>

								<div className="lg:col-span-2">
									<label className="block text-sm font-semibold text-gray-700 mb-3">Qtd. Pessoas</label>
									<input
										type="number"
										value={form.numero_pessoas}
										onChange={(e) => setForm({ ...form, numero_pessoas: e.target.value })}
										className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 font-medium placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
										disabled={submitting}
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-3">Data</label>
									<input
										type="datetime-local"
										value={form.data_reserva || ""}
										onChange={(e) =>
											setForm({
												...form,
												data_reserva: e.target.value,
											})
										}
										className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 font-medium placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
										disabled={submitting}
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-3">Tipo</label>
									<select
										value={form.status_reserva ? "1" : "0"}
										onChange={(e) => setForm({ ...form, status_reserva: e.target.value === "1" })}
										className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
										disabled={submitting}>
										<option value="1">✓ Ativo</option>
										<option value="0">✗ Inativo</option>
									</select>
								</div>
							</div>

							<button
								onClick={handleSubmit}
								className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg font-semibold text-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
								disabled={submitting}>
								{submitting ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										{selectReserva ? "Atualizando..." : "Criando..."}
									</>
								) : (
									<>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										{selectReserva ? "Atualizar Reserva" : "Criar Comida"}
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
