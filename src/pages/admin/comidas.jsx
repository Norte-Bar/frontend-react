import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ChefHat, Clock, DollarSign, Filter, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
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
		fetch(api + "/comida", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then(setComidas);
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
		});
	};

	const handleDelete = (id) => {
		if (confirm("Tem certeza que deseja excluir esta comida?")) {
			fetch(`${api}/comida/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			}).then(() => fetchComidas());
		}
	};

	const filteredComidas = comidas.filter((comida) => {
		const matchesSearch = comida.nome.toLowerCase().includes(searchTerm.toLowerCase()) || comida.descricao.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesFilter = filterType === "" || comida.tipo === filterType;
		return matchesSearch && matchesFilter;
	});

	const getTypeColor = (tipo) => {
		const colors = {
			bebida: "bg-blue-500/20 text-blue-400 border-blue-400/30",
			entrada: "bg-green-500/20 text-green-400 border-green-400/30",
			"prato principal": "bg-orange-500/20 text-orange-400 border-orange-400/30",
			sobremesa: "bg-purple-500/20 text-purple-400 boFrder-purple-400/30",
		};
		return colors[tipo] || "bg-slate-500/20 text-slate-400 border-slate-400/30";
	};

	const getTypeIcon = (tipo) => {
		switch (tipo) {
			case "bebida":
				return "🥤";
			case "entrada":
				return "🥗";
			case "prato principal":
				return "🍽️";
			case "sobremesa":
				return "🍰";
			default:
				return "🍴";
		}
	};

	// return (
	// 	<div className="p-8 bg-gray-50 min-h-screen">
	// 		<div className="flex justify-between items-center mb-8">
	// 			<h1 className="text-4xl font-extrabold text-gray-900">Comidas</h1>
	// 			<button className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition" onClick={() => openForm()}>
	// 				Cadastrar Comida
	// 			</button>
	// 		</div>

	// 		<div className="overflow-x-auto bg-white rounded-xl shadow">
	// 			<table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
	// 				<thead className="bg-gray-100">
	// 					<tr>
	// 						<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Nome</th>
	// 						<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Descrição</th>
	// 						<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Preço</th>
	// 						<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Tipo</th>
	// 						<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Status</th>
	// 						<th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">Ações</th>
	// 					</tr>
	// 				</thead>
	// 				<tbody>
	// 					{comidas.map((comida) => (
	// 						<tr key={comida.id} className="hover:bg-gray-50 transition">
	// 							<td className="px-4 py-3 border-b border-gray-200">{comida.nome}</td>
	// 							<td className="px-4 py-3 border-b border-gray-200 text-sm text-gray-700">{comida.descricao}</td>
	// 							<td className="px-4 py-3 border-b border-gray-200">R$ {Number(comida.preco).toFixed(2)}</td>
	// 							<td className="px-4 py-3 border-b border-gray-200 capitalize">{comida.tipo}</td>
	// 							<td className="px-4 py-3 border-b border-gray-200">
	// 								<span className={`font-semibold ${comida.status ? "text-green-600" : "text-red-600"}`}>{comida.status ? "Ativa" : "Inativa"}</span>
	// 							</td>
	// 							<td className="px-4 py-3 border-b border-gray-200 text-center">
	// 								<div className="flex items-center justify-center gap-4">
	// 									<Pencil className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => openForm(comida)} />
	// 									<Trash2 className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer" onClick={() => handleDelete(comida.id)} />
	// 								</div>
	// 							</td>
	// 						</tr>
	// 					))}
	// 				</tbody>
	// 			</table>
	// 		</div>

	// 		{showDialog && (
	// 			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition" onClick={() => setShowDialog(false)}>
	// 				<div className="relative w-full max-w-xl bg-white rounded-2xl p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
	// 					<button onClick={() => setShowDialog(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">
	// 						×
	// 					</button>

	// 					<h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedComida ? "Editar Comida" : "Cadastrar Comida"}</h2>

	// 					<div className="space-y-5">
	// 						<div>
	// 							<label className="block text-sm font-medium text-gray-700">Nome</label>
	// 							<input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" />
	// 						</div>

	// 						<div>
	// 							<label className="block text-sm font-medium text-gray-700">Descrição</label>
	// 							<textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" />
	// 						</div>

	// 						<div className="grid grid-cols-2 gap-4">
	// 							<div>
	// 								<label className="block text-sm font-medium text-gray-700">Preço</label>
	// 								<input type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" />
	// 							</div>

	// 							<div>
	// 								<label className="block text-sm font-medium text-gray-700">Tipo</label>
	// 								<select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition">
	// 									<option value="">Selecione um tipo</option>
	// 									<option value="bebida">Bebida</option>
	// 									<option value="entrada">Entrada</option>
	// 									<option value="prato principal">Prato Principal</option>
	// 									<option value="sobremesa">Sobremesa</option>
	// 								</select>
	// 							</div>
	// 						</div>

	// 						<div>
	// 							<label className="block text-sm font-medium text-gray-700">Status</label>
	// 							<select value={form.status ? "1" : "0"} onChange={(e) => setForm({ ...form, status: e.target.value === "1" })} className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition">
	// 								<option value="1">Ativa</option>
	// 								<option value="0">Inativa</option>
	// 							</select>
	// 						</div>

	// 						<button onClick={handleSubmit} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
	// 							Salvar
	// 						</button>
	// 					</div>
	// 				</div>
	// 			</div>
	// 		)}
	// 	</div>
	// );

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
							<div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
								<ChefHat className="w-6 h-6 text-white" />
							</div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Gerenciar Cardápio</h1>
						</div>
						<button
							className="group relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
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
				<div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-600/40 p-6 mb-8">
					<div className="flex flex-col lg:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
							<input
								type="text"
								placeholder="Buscar por nome ou descrição..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-12 pr-4 py-3 bg-slate-700/70 border-2 border-slate-600 rounded-2xl focus:outline-none focus:border-orange-400 focus:bg-slate-700 transition-all duration-200 text-white placeholder-slate-400"
							/>
						</div>

						<div className="lg:w-64 relative">
							<Filter className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
							<select
								value={filterType}
								onChange={(e) => setFilterType(e.target.value)}
								className="w-full pl-12 pr-4 py-3 bg-slate-700/70 border-2 border-slate-600 rounded-2xl focus:outline-none focus:border-orange-400 focus:bg-slate-700 transition-all duration-200 text-white appearance-none cursor-pointer">
								<option value="">Todos os tipos</option>
								<option value="bebida">🥤 Bebidas</option>
								<option value="entrada">🥗 Entradas</option>
								<option value="prato principal">🍽️ Pratos Principais</option>
								<option value="sobremesa">🍰 Sobremesas</option>
							</select>
							<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
								<svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						</div>
					</div>
				</div>

				{loading && (
					<div className="flex items-center justify-center py-16">
						<div className="text-center">
							<Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
							<p className="text-slate-400 font-medium">Carregando cardápio...</p>
						</div>
					</div>
				)}

				{/* Tabela */}
				{!loading && filteredComidas.length > 0 && (
					<div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-600/40 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="bg-slate-700/50 border-b border-slate-600/30">
										<th className="px-6 py-4 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">Comida</th>
										<th className="px-6 py-4 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">Descrição</th>
										<th className="px-6 py-4 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">Preço</th>
										<th className="px-6 py-4 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">Tipo</th>
										<th className="px-6 py-4 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">Status</th>
										<th className="px-6 py-4 text-center text-sm font-bold text-slate-200 uppercase tracking-wider">Ações</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-600/30">
									{filteredComidas.map((comida, index) => (
										<tr key={comida.id} className="group hover:bg-slate-700/30 transition-all duration-200">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<div className="text-2xl">{getTypeIcon(comida.tipo)}</div>
													<div>
														<div className="font-bold text-white text-lg">{comida.nome}</div>
														<div className="text-slate-400 text-sm">#{comida.id}</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="text-slate-300 text-sm max-w-xs">{comida.descricao}</div>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-1">
													<span className="text-2xl font-bold text-green-400">R$ {Number(comida.preco).toFixed(2)}</span>
												</div>
											</td>
											<td className="px-6 py-4">
												<span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(comida.tipo)}`}>{comida.tipo.toUpperCase()}</span>
											</td>
											
											
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<div className={`w-3 h-3 rounded-full ${comida.status ? "bg-emerald-500" : "bg-red-500"}`}></div>
													<span className={`font-semibold ${comida.status ? "text-emerald-400" : "text-red-400"}`}>{comida.status ? "Ativo" : "Inativo"}</span>
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
													<button onClick={() => openForm(comida)} className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-xl transition-all duration-200 transform hover:scale-105" title="Editar">
														<Pencil className="w-4 h-4" />
													</button>
													<button onClick={() => handleDelete(comida.id)} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-all duration-200 transform hover:scale-105" title="Excluir">
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
						<div className="w-24 h-24 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
							<ChefHat className="w-12 h-12 text-slate-300" />
						</div>
						<h3 className="text-2xl font-bold text-slate-200 mb-2">Nenhuma comida encontrada</h3>
						<p className="text-slate-400 mb-6">Tente ajustar os filtros ou adicione uma nova comida</p>
						<button onClick={() => openForm()} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold">
							Adicionar Comida
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
					<div className="relative bg-slate-800/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-slate-600/40 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
						{/* Close Button */}
						<button onClick={() => setShowDialog(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed" disabled={submitting}>
							<svg className="w-5 h-5 text-slate-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>

						{/* Header */}
						<div className="mb-8">
							<div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
								<ChefHat className="w-8 h-8 text-white" />
							</div>
							<h2 className="text-3xl font-bold text-center text-white">{selectedComida ? "Editar Comida" : "Nova Comida"}</h2>
							<p className="text-slate-400 text-center mt-2">{selectedComida ? "Atualize as informações da comida" : "Adicione uma nova comida ao cardápio"}</p>
						</div>

						{/* Form */}
						<div className="space-y-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<div className="lg:col-span-2">
									<label className="block text-sm font-semibold text-slate-200 mb-3">Nome da Comida</label>
									<input
										type="text"
										value={form.nome}
										onChange={(e) => setForm({ ...form, nome: e.target.value })}
										className="w-full bg-slate-700/70 border-2 border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-400 focus:bg-slate-700 transition-all duration-200 text-white font-medium placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
										placeholder="Ex: Pizza Margherita"
										disabled={submitting}
									/>
								</div>

								<div className="lg:col-span-2">
									<label className="block text-sm font-semibold text-slate-200 mb-3">Descrição</label>
									<textarea
										value={form.descricao}
										onChange={(e) => setForm({ ...form, descricao: e.target.value })}
										rows={3}
										className="w-full bg-slate-700/70 border-2 border-slate-600 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:border-orange-400 focus:bg-slate-700 transition-all duration-200 text-white placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
										placeholder="Descreva os ingredientes e características do prato..."
										disabled={submitting}
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-slate-200 mb-3">Preço (R$)</label>
									<input
										type="number"
										step="0.01"
										value={form.preco}
										onChange={(e) => setForm({ ...form, preco: e.target.value })}
										className="w-full bg-slate-700/70 border-2 border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-400 focus:bg-slate-700 transition-all duration-200 text-white font-medium placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
										placeholder="0.00"
										disabled={submitting}
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-slate-200 mb-3">Tipo</label>
									<select
										value={form.tipo}
										onChange={(e) => setForm({ ...form, tipo: e.target.value })}
										className="w-full bg-slate-700/70 border-2 border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-400 focus:bg-slate-700 transition-all duration-200 text-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={submitting}>
										<option value="">Selecione um tipo</option>
										<option value="bebida">🥤 Bebida</option>
										<option value="entrada">🥗 Entrada</option>
										<option value="prato principal">🍽️ Prato Principal</option>
										<option value="sobremesa">🍰 Sobremesa</option>
									</select>
								</div>

	

								<div className="lg:col-span-2">
									<label className="block text-sm font-semibold text-slate-200 mb-3">Status</label>
									<select
										value={form.status ? "1" : "0"}
										onChange={(e) => setForm({ ...form, status: e.target.value === "1" })}
										className="w-full bg-slate-700/70 border-2 border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-400 focus:bg-slate-700 transition-all duration-200 text-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={submitting}>
										<option value="1">✓ Ativo</option>
										<option value="0">✗ Inativo</option>
									</select>
								</div>
							</div>

							<button
								onClick={handleSubmit}
								className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
