import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ChefHat, Filter, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Comidas() {
	const [comidas, setComidas] = useState([]);
	const [selectedComida, setSelectedComida] = useState(null);
	const [showDialog, setShowDialog] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("");
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [form, setForm] = useState({
		nome: "",
		descricao: "",
		preco: "",
		tipo: "",
		status: true,
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
		fetchComidas();
	}, [token]);

	const fetchComidas = () => {
		setLoading(true);
		fetch(api + "/comida", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then(setComidas)
			.then(setLoading(false));
	};

	const openForm = (comida = null) => {
		setSelectedComida(comida);
		setForm(
			comida
				? {
						...comida,
						status: comida.status,
				  }
				: {
						nome: "",
						descricao: "",
						preco: "",
						tipo: "",
						status: true,
				  }
		);
		setShowDialog(true);
	};

	const handleSubmit = () => {
		setSubmitting(true);
		const method = selectedComida ? "PUT" : "POST";
		const url = selectedComida ? `${api}/comida/${selectedComida.id}` : `${api}/comida`;

		fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ ...form, preco: parseFloat(form.preco), status: form.status === true }),
		}).then(() => {
			fetchComidas();
			setShowDialog(false);
			setSubmitting(false);
		});
	};

	const handleDelete = (id) => {
		if (confirm("Tem certeza que deseja excluir esta comida?")) {
			setSubmitting(true);
			fetch(`${api}/comida/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			}).then(() => {
				fetchComidas();
				setSubmitting(false);
			});
		}
	};

	const filteredComidas = comidas.filter((comida) => {
		const matchesSearch = comida.nome.toLowerCase().includes(searchTerm.toLowerCase()) || comida.descricao.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesFilter = filterType === "" || comida.tipo === filterType;
		return matchesSearch && matchesFilter;
	});

	const getTypeColor = (tipo) => {
		const colors = {
			bebida: "bg-blue-50 text-blue-700 border-blue-200",
			entrada: "bg-green-50 text-green-700 border-green-200",
			"prato principal": "bg-orange-50 text-orange-700 border-orange-200",
			sobremesa: "bg-purple-50 text-purple-700 border-purple-200",
		};
		return colors[tipo] || "bg-gray-50 text-gray-700 border-gray-200";
	};

	const getTypeIcon = (tipo) => {
		const icons = {
			bebida: "🥤",
			entrada: "🥗",
			"prato principal": "🍽️",
			sobremesa: "🍰",
		};
		return icons[tipo] || "🍴";
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{error && (
				<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border-red-200 text-red-800 px-6 py-4 rounded-lg shadow-sm border flex items-center gap-3 max-w-md w-full mx-4">
					<AlertCircle className="w-5 h-5 flex-shrink-0" />
					<span className="font-medium flex-1">{error}</span>
					<button onClick={clearError} className="w-6 h-6 text-red-400 hover:text-red-600 rounded-full flex items-center justify-center transition-colors duration-200">
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
							<div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
								<ChefHat className="w-6 h-6 text-white" />
							</div>
							<h1 className="text-3xl font-semibold text-gray-900">Gerenciar Comidas</h1>
						</div>
						<button
							className="group relative bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
							onClick={() => openForm()}
							disabled={loading}>
							<Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
							Nova Comida
						</button>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-8 py-8">
				{/* Filtros */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
					<div className="flex flex-col lg:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Buscar por nome ou descrição..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
							/>
						</div>

						<div className="lg:w-64 relative">
							<Filter className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<select
								value={filterType}
								onChange={(e) => setFilterType(e.target.value)}
								className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer">
								<option value="">Todos os tipos</option>
								<option value="bebida">🥤 Bebidas</option>
								<option value="entrada">🥗 Entradas</option>
								<option value="prato principal">🍽️ Pratos Principais</option>
								<option value="sobremesa">🍰 Sobremesas</option>
							</select>
							<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
								<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						</div>
					</div>
				</div>

				{loading && (
					<div className="flex items-center justify-center py-16">
						<div className="text-center">
							<Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
							<p className="text-gray-600 font-medium">Carregando comidas...</p>
						</div>
					</div>
				)}

				{/* Tabela */}
				{!loading && filteredComidas.length > 0 && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="bg-gray-50 border-b border-gray-200">
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Comida</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Descrição</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Preço</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Tipo</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
										<th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Ações</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{filteredComidas.map((comida, index) => (
										<tr key={comida.id} className="group hover:bg-gray-50 transition-all duration-200">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<div className="text-2xl">{getTypeIcon(comida.tipo)}</div>
													<div>
														<div className="font-semibold text-gray-900 text-lg">{comida.nome}</div>
														<div className="text-gray-500 text-sm">#{comida.id}</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="text-gray-700 text-sm max-w-xs">{comida.descricao}</div>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-1">
													<span className="text-xl font-bold text-green-600">R$ {Number(comida.preco).toFixed(2)}</span>
												</div>
											</td>
											<td className="px-6 py-4">
												<span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(comida.tipo)}`}>{comida.tipo.toUpperCase()}</span>
											</td>

											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<div className={`w-3 h-3 rounded-full ${comida.status ? "bg-green-500" : "bg-red-500"}`}></div>
													<span className={`font-medium ${comida.status ? "text-green-700" : "text-red-700"}`}>{comida.status ? "Ativo" : "Inativo"}</span>
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center justify-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
													<button onClick={() => openForm(comida)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-105" title="Editar">
														<Pencil className="w-4 h-4" />
													</button>
													<button onClick={() => handleDelete(comida.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-105" title="Excluir">
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

				{/* Empty State */}
				{!loading && filteredComidas.length === 0 && (
					<div className="text-center py-16">
						<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<ChefHat className="w-12 h-12 text-gray-400" />
						</div>
						<h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma comida encontrada</h3>
						<p className="text-gray-600 mb-6">Tente ajustar os filtros ou adicione uma nova comida</p>
						<button onClick={() => openForm()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 font-medium">
							Adicionar Comida
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
								<ChefHat className="w-8 h-8 text-indigo-600" />
							</div>
							<h2 className="text-3xl font-bold text-center text-gray-900">{selectedComida ? "Editar Comida" : "Nova Comida"}</h2>
							<p className="text-gray-600 text-center mt-2">{selectedComida ? "Atualize as informações da comida" : "Adicione uma nova comida ao cardápio"}</p>
						</div>

						{/* Form */}
						<div className="space-y-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<div className="lg:col-span-2">
									<label className="block text-sm font-semibold text-gray-700 mb-3">Nome da Comida</label>
									<input
										type="text"
										value={form.nome}
										onChange={(e) => setForm({ ...form, nome: e.target.value })}
										className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 font-medium placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
										placeholder="Ex: Pizza Margherita"
										disabled={submitting}
									/>
								</div>

								<div className="lg:col-span-2">
									<label className="block text-sm font-semibold text-gray-700 mb-3">Descrição</label>
									<textarea
										value={form.descricao}
										onChange={(e) => setForm({ ...form, descricao: e.target.value })}
										rows={3}
										className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
										placeholder="Descreva os ingredientes e características do prato..."
										disabled={submitting}
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-3">Preço (R$)</label>
									<input
										type="number"
										step="0.01"
										value={form.preco}
										onChange={(e) => setForm({ ...form, preco: e.target.value })}
										className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 font-medium placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
										placeholder="0.00"
										disabled={submitting}
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-3">Tipo</label>
									<select
										value={form.tipo}
										onChange={(e) => setForm({ ...form, tipo: e.target.value })}
										className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
										disabled={submitting}>
										<option value="">Selecione um tipo</option>
										<option value="bebida">🥤 Bebida</option>
										<option value="entrada">🥗 Entrada</option>
										<option value="prato principal">🍽️ Prato Principal</option>
										<option value="sobremesa">🍰 Sobremesa</option>
									</select>
								</div>

								<div className="lg:col-span-2">
									<label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
									<select
										value={form.status ? "1" : "0"}
										onChange={(e) => setForm({ ...form, status: e.target.value === "1" })}
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
										{selectedComida ? "Atualizando..." : "Criando..."}
									</>
								) : (
									<>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										{selectedComida ? "Atualizar Comida" : "Criar Comida"}
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
