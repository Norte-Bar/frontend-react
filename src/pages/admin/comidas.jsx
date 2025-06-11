import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Comidas() {
	const [comidas, setComidas] = useState([]);
	const [selectedComida, setSelectedComida] = useState(null);
	const [showDialog, setShowDialog] = useState(false);
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

    if(tokenTaExpirado()) {
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

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-4xl font-extrabold text-gray-900">Comidas</h1>
				<button className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition" onClick={() => openForm()}>
					Cadastrar Comida
				</button>
			</div>

			<div className="overflow-x-auto bg-white rounded-xl shadow">
				<table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Nome</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Descrição</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Preço</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Tipo</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Status</th>
							<th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">Ações</th>
						</tr>
					</thead>
					<tbody>
						{comidas.map((comida) => (
							<tr key={comida.id} className="hover:bg-gray-50 transition">
								<td className="px-4 py-3 border-b border-gray-200">{comida.nome}</td>
								<td className="px-4 py-3 border-b border-gray-200 text-sm text-gray-700">{comida.descricao}</td>
								<td className="px-4 py-3 border-b border-gray-200">R$ {Number(comida.preco).toFixed(2)}</td>
								<td className="px-4 py-3 border-b border-gray-200 capitalize">{comida.tipo}</td>
								<td className="px-4 py-3 border-b border-gray-200">
									<span className={`font-semibold ${comida.status ? "text-green-600" : "text-red-600"}`}>{comida.status ? "Ativa" : "Inativa"}</span>
								</td>
								<td className="px-4 py-3 border-b border-gray-200 text-center">
									<div className="flex items-center justify-center gap-4">
										<Pencil className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => openForm(comida)} />
										<Trash2 className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer" onClick={() => handleDelete(comida.id)} />
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{showDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition" onClick={() => setShowDialog(false)}>
					<div className="relative w-full max-w-xl bg-white rounded-2xl p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
						<button onClick={() => setShowDialog(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">
							×
						</button>

						<h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedComida ? "Editar Comida" : "Cadastrar Comida"}</h2>

						<div className="space-y-5">
							<div>
								<label className="block text-sm font-medium text-gray-700">Nome</label>
								<input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" />
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">Descrição</label>
								<textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" />
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">Preço</label>
									<input type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" />
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">Tipo</label>
									<select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition">
										<option value="">Selecione um tipo</option>
										<option value="bebida">Bebida</option>
										<option value="entrada">Entrada</option>
										<option value="prato principal">Prato Principal</option>
										<option value="sobremesa">Sobremesa</option>
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">Status</label>
								<select value={form.status ? "1" : "0"} onChange={(e) => setForm({ ...form, status: e.target.value === "1" })} className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition">
									<option value="1">Ativa</option>
									<option value="0">Inativa</option>
								</select>
							</div>

							<button onClick={handleSubmit} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
								Salvar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
