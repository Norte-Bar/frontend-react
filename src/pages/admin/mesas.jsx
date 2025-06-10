import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";

export default function Mesas() {
	const [mesas, setMesas] = useState([]);
	const [selectedMesa, setSelectedMesa] = useState(null);
	const [showDialog, setShowDialog] = useState(false);
	const [form, setForm] = useState({ numero: "", capacidade: "", status: "0" });
	const { token } = useAuth();
	const api = "http://localhost:8080/";

	useEffect(() => {
		fetch(api + "mesa", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then(setMesas);
	}, [token]);

	const fetchMesas = () => {
		fetch(api + "mesa", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then(setMesas);
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

	const handleSubmit = () => {
		const method = selectedMesa ? "PUT" : "POST";
		const url = selectedMesa ? `/api/mesas/${selectedMesa.id}` : "/api/mesas";

		fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ ...form, id: selectedMesa?.id }),
		}).then(() => {
			fetchMesas();
			setShowDialog(false);
		});
	};

	const handleDelete = (id) => {
		if (confirm("Tem certeza que deseja excluir esta mesa?")) {
			fetch(`/api/mesas/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			}).then(() => fetchMesas());
		}
	};

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-4xl font-extrabold text-gray-900">Mesas</h1>
				<button className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition" onClick={() => openForm()}>
					Cadastrar Mesa
				</button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
				{mesas.map((mesa) => (
					<div key={mesa.id} className="relative p-6 border border-gray-200 rounded-3xl shadow-sm bg-white hover:shadow-lg transition cursor-default">
						<div className="space-y-3">
							<div className="text-2xl font-semibold text-gray-800">Mesa {mesa.numero}</div>
							<div className="text-gray-600 text-lg">Capacidade: {mesa.capacidade}</div>
							<div className={`font-semibold ${mesa.status === "1" ? "text-red-600" : "text-green-600"}`}>{mesa.status === "1" ? "Ocupada" : "Disponível"}</div>
						</div>

						<div className="absolute top-4 right-4 flex gap-4">
							<Pencil className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-800 transition" onClick={() => openForm(mesa)} />
							<Trash2 className="w-6 h-6 text-red-600 cursor-pointer hover:text-red-800 transition" onClick={() => handleDelete(mesa.id)} />
						</div>
					</div>
				))}
			</div>

			{showDialog && (
				<div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50" onClick={() => setShowDialog(false)}>
					<div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
						<h2 className="text-3xl font-bold mb-6 text-gray-900">{selectedMesa ? "Editar Mesa" : "Cadastrar Mesa"}</h2>

						<div className="space-y-5">
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">Número</label>
								<input type="number" min={1} value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" />
							</div>

							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">Capacidade</label>
								<input type="number" min={1} value={form.capacidade} onChange={(e) => setForm({ ...form, capacidade: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" />
							</div>

							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">Status</label>
								<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition">
									<option value="0">Disponível</option>
									<option value="1">Ocupada</option>
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
