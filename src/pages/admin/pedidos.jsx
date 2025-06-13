import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, UtensilsCrossed } from "lucide-react";

export default function Pedidos() {
	const [pedidos, setPedidos] = useState([]);
	const [comidas, setComidas] = useState([]);
	const [mesas, setMesas] = useState([]);
	const [form, setForm] = useState({
		mesa_id: "",
		funcionario_id: "",
		status: "",
		comidas: [],
	});
	const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
	const [mostrarDialog, setMostrarDialog] = useState(false);
	const [editando, setEditando] = useState(false);
	const { token, idLogado, logout, tokenTaExpirado } = useAuth();
	const api = "http://localhost:8080";
	const statusPedido = ["solicitado", "fazendo", "pronto", "entregue"];
	const navigate = useNavigate();

	function verificaTokenExpirado() {
		if (tokenTaExpirado()) {
			logout();
			navigate("/admin");
		}
	}

	useEffect(() => {
		fetchPedidos();
		fetchComidas();
		fetchMesas();
	}, [token]);

	const fetchPedidos = () => {
		fetch(api + "/pedido", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then(verificaTokenExpirado())
			.then(setPedidos)
			.catch((err) => console.error("Erro ao buscar pedidos:", err));
	};

	const fetchComidas = () => {
		fetch(api + "/comida", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then(setComidas)
			.catch((err) => console.error("Erro ao buscar comidas:", err));
	};

	const fetchMesas = () => {
		fetch(api + "/mesa", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then(setMesas)
			.catch((err) => console.error("Erro ao buscar mesas:", err));
	};

	const abrirModalComidas = (pedido) => {
		setPedidoSelecionado(pedido);
	};

	const fecharModal = () => {
		setPedidoSelecionado(null);
	};

	const toggleComida = (comidaId) => {
		setForm((prev) => {
			const comidas = prev.comidas.includes(comidaId) ? prev.comidas.filter((id) => id !== comidaId) : [...prev.comidas, comidaId];
			return { ...prev, comidas };
		});
	};

	const abreDialogDeCadastro = () => {
		setForm({ mesa_id: "", funcionario_id: idLogado, status: "", comidas: [] });
		setEditando(false);
		setMostrarDialog(true);
	};

	const abreDialogDeEdicao = (pedido) => {
		setForm({
			mesa_id: pedido.mesa.id,
			funcionario_id: pedido.funcionario.id,
			status: pedido.status,
			comidas: pedido.comidas.map((c) => c.id),
			id: pedido.id, // necessário para update
		});
		setEditando(true);
		setMostrarDialog(true);
	};

	const handleSubmit = async () => {
		try {
			const method = editando ? "PUT" : "POST";
			const url = editando ? `${api}/pedido/${form.id}` : `${api}/pedido`;

			const res = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(form),
			});
			if (!res.ok) throw new Error("Erro ao salvar pedido");
			await res.json();
			setMostrarDialog(false);
			setForm({ mesa_id: "", funcionario_id: "", status: "", comidas: [] });
			setEditando(false);
			fetchPedidos();
		} catch (err) {
			console.error(err);
		}
	};

	const handleDelete = async (id) => {
		if (!confirm(`Tem certeza que deseja excluir o pedido #${id}?`)) return;

		try {
			const res = await fetch(`${api}/pedido/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) throw new Error("Erro ao deletar pedido");
			fetchPedidos();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-8 py-6">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
								</svg>
							</div>
							<h1 className="text-3xl font-semibold text-gray-900"> Gerenciar Pedidos</h1>
						</div>
						<button onClick={() => abreDialogDeCadastro()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
							Cadastrar Pedido
						</button>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-6 py-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{pedidos.map((pedido) => (
						<div key={pedido.id} className="group bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
							<div className="flex items-start justify-between mb-3">
								<div>
									<span className="text-sm text-gray-500">Pedido #{pedido.id}</span>
									<h3 className="text-lg font-semibold text-gray-900">Mesa {pedido.mesa.numero}</h3>
								</div>
								<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pedido.status === "entregue" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{pedido.status}</span>
							</div>

							<div className="space-y-2 mb-4">
								<p className="text-sm text-gray-600">Funcionário: {pedido.funcionario.nome}</p>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<button onClick={() => abrirModalComidas(pedido)} className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors" title="Ver comidas">
									<UtensilsCrossed className="w-3 h-3" />
									Comidas
								</button>
								<button onClick={() => abreDialogDeEdicao(pedido)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors" title="Editar">
									<Pencil className="w-3 h-3" />
									Editar
								</button>
								<button onClick={() => handleDelete(pedido.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors" title="Excluir">
									<Trash2 className="w-3 h-3" />
									Excluir
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Modal de Comidas */}
			{pedidoSelecionado && (
				<div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={fecharModal}>
					<div className="relative bg-white rounded-lg p-6 w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
						<button onClick={fecharModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fechar">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>

						<div className="mb-6">
							<h2 className="text-xl font-semibold text-gray-900">Comidas do Pedido #{pedidoSelecionado.id}</h2>
						</div>

						{pedidoSelecionado.comidas.length > 0 ? (
							<div className="space-y-3">
								{pedidoSelecionado.comidas.map((comida) => (
									<div key={comida.id} className="border-b border-gray-100 pb-3 last:border-b-0">
										<h3 className="font-medium text-gray-900">{comida.nome}</h3>
										<p className="text-sm text-gray-600 mt-1">{comida.descricao}</p>
										<div className="flex justify-between items-center mt-2">
											<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{comida.tipo}</span>
											<span className="font-medium text-gray-900">R$ {comida.preco.toFixed(2)}</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-600 text-center py-4">Nenhuma comida cadastrada neste pedido.</p>
						)}
					</div>
				</div>
			)}

			{/* Modal de Cadastro/Edição */}
			{mostrarDialog && (
				<div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setMostrarDialog(false)}>
					<div className="relative bg-white rounded-lg p-6 w-full max-w-xl shadow-xl" onClick={(e) => e.stopPropagation()}>
						<div className="mb-6">
							<h2 className="text-xl font-semibold text-gray-900">Novo Pedido</h2>
						</div>

						{/* Formulário */}
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Mesa</label>
								<select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={form.mesa_id} onChange={(e) => setForm({ ...form, mesa_id: parseInt(e.target.value) })}>
									<option value="">Selecione uma mesa</option>
									{mesas.map((m) => (
										<option key={m.id} value={m.id}>
											Mesa {m.numero}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
								<select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
									<option value="">Selecione o status</option>
									{statusPedido.map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Comidas</label>
								<div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
									{comidas.map((comida) => (
										<label key={comida.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
											<input type="checkbox" checked={form.comidas.includes(comida.id)} onChange={() => toggleComida(comida.id)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
											<span className="text-sm text-gray-700">{comida.nome}</span>
										</label>
									))}
								</div>
							</div>
						</div>

						<div className="flex justify-end mt-6 gap-3">
							<button onClick={() => setMostrarDialog(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
								Cancelar
							</button>
							<button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
								Cadastrar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
