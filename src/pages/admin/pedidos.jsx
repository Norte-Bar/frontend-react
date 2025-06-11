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
		<div className="p-8 bg-gray-50 min-h-screen">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-4xl font-extrabold text-gray-900">Pedidos</h1>
				<button onClick={() => abreDialogDeCadastro()} className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition cursor-pointer">
					Cadastrar Pedido
				</button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{pedidos.map((pedido) => (
					<div key={pedido.id} className="relative bg-white border border-gray-200 rounded-3xl p-6 shadow hover:shadow-lg transition">
						<div className="space-y-2">
							<p className="text-sm text-gray-500">Pedido #{pedido.id}</p>
							<p className="text-lg font-semibold text-gray-800">Mesa: {pedido.mesa.numero}</p>
							<p className="text-gray-700">Funcionário: {pedido.funcionario.nome}</p>
							<p className={`font-medium ${pedido.status === "entregue" ? "text-green-600" : "text-yellow-600"}`}>Status: {pedido.status}</p>
						</div>

						<div className="absolute top-4 right-4 flex gap-3">
							<button onClick={() => abrirModalComidas(pedido)} title="Ver comidas">
								<UtensilsCrossed className="w-6 h-6 text-green-600 hover:text-green-800 transition cursor-pointer" />
							</button>
							<button onClick={() => abreDialogDeEdicao(pedido)} title="Editar">
								<Pencil className="w-6 h-6 text-blue-600 hover:text-blue-800 transition cursor-pointer" />
							</button>
							<button onClick={() => handleDelete(pedido.id)} title="Excluir">
								<Trash2 className="w-6 h-6 text-red-600 hover:text-red-800 transition cursor-pointer" />
							</button>
						</div>
					</div>
				))}
			</div>

			{pedidoSelecionado && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" onClick={fecharModal}>
					<div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
						<button onClick={fecharModal} className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold" aria-label="Fechar">
							×
						</button>

						<h2 className="text-2xl font-bold mb-4 text-gray-900">Comidas do Pedido #{pedidoSelecionado.id}</h2>

						{pedidoSelecionado.comidas.length > 0 ? (
							<ul className="divide-y divide-gray-200">
								{pedidoSelecionado.comidas.map((comida) => (
									<li key={comida.id} className="py-3">
										<p className="text-lg font-semibold text-gray-800">{comida.nome}</p>
										<p className="text-sm text-gray-600">{comida.descricao}</p>
										<div className="flex justify-between text-sm mt-1 text-gray-700">
											<span>Tipo: {comida.tipo}</span>
											<span>R$ {comida.preco.toFixed(2)}</span>
										</div>
									</li>
								))}
							</ul>
						) : (
							<p className="text-gray-600">Nenhuma comida cadastrada neste pedido.</p>
						)}
					</div>
				</div>
			)}

			{mostrarDialog && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setMostrarDialog(false)}>
					<div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl mx-4" onClick={(e) => e.stopPropagation()}>
						<h2 className="text-2xl font-bold mb-4 text-gray-900">Novo Pedido</h2>

						{/* Formulário */}
						<div className="space-y-4">
							<div>
								<label className="block mb-1 font-medium">Mesa</label>
								<select className="w-full border rounded-lg p-2" value={form.mesa_id} onChange={(e) => setForm({ ...form, mesa_id: parseInt(e.target.value) })}>
									<option value="">Selecione</option>
									{mesas.map((m) => (
										<option key={m.id} value={m.id}>
											Mesa {m.numero}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block mb-1 font-medium">Status</label>
								<select className="w-full border rounded-lg p-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
									<option value="">Selecione</option>
									{statusPedido.map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block mb-2 font-medium">Comidas</label>
								<div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1">
									{comidas.map((comida) => (
										<label key={comida.id} className="flex items-center gap-2">
											<input type="checkbox" checked={form.comidas.includes(comida.id)} onChange={() => toggleComida(comida.id)} />
											<span>{comida.nome}</span>
										</label>
									))}
								</div>
							</div>
						</div>

						<div className="flex justify-end mt-6 gap-3">
							<button onClick={() => setMostrarDialog(false)} className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100">
								Cancelar
							</button>
							<button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow">
								Cadastrar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
