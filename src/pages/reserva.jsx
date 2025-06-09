import { useState } from "react";
import { Link } from "react-router-dom";

function Reserva() {
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    fone: "",
    mesas: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);
  
  };

  return (
    <>

      <main className="bg-[#F9FAEA] min-h-screen flex justify-center items-center p-8">
        <div className="flex gap-8">
          {/* Aqui é form de reserva */}
          <div className="bg-[#0D2A45] p-8 rounded-md shadow-md text-white w-[350px] h-[400px]">
            <h2 className="text-center text-lg mb-4">RESERVAS</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nome"
                placeholder="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-2 py-1 rounded-sm text-white"
              />
              <input
                type="email"
                name="email"
                placeholder="e-mail"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-2 py-1 rounded-sm text-white"
              />
              <input
                type="text"
                name="fone"
                placeholder="fone"
                value={formData.fone}
                onChange={handleChange}
                className="w-full px-2 py-1 rounded-sm text-white"
              />
              <input
                type="text"
                name="mesas"
                placeholder="mesas"
                value={formData.mesas}
                onChange={handleChange}
                className="w-full px-2 py-1 bg-yellow-300 rounded-sm text-[#0D2A45]"
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-1 rounded-sm hover:bg-red-700 transition"
              >
                enviar
              </button>
            </form>
          </div>

          {/* div do carrossel */}
          <div className="bg-[#0D2A45] p-8 rounded-md shadow-md flex items-center justify-center w-[200px]">
            <div className="bg-gray-500 text-white text-center py-8 px-4">
              MENU<br />PRINCIPAL
            </div>
          </div>
        </div>
      </main>


    </>
  )
}

export default Reserva;
