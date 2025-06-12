import { useState } from "react";
import { Link } from "react-router-dom";


function Header() {
    // Note: 'variavel' não está sendo usada neste snippet, pode ser removida se não for necessária.
    const [variavel, setVariavel] = useState(); 

  return (
    <>
      <header className="bg-gray-300 p-4 flex justify-between items-center"> 
        <h1 className="text-2xl font-semibold text-blue-950">
          NORTE BAR
        </h1>

        <nav className="flex gap-2">
            <Link to="/" className="border border-blue-950 text-blue-950 px-4 py-1 rounded-sm text-sm hover:bg-blue-950 hover:text-white transition">
              SOBRE 
          </Link>

          <Link to="/reserva" className="border border-blue-950 text-blue-950 px-4 py-1 rounded-sm text-sm hover:bg-blue-950 hover:text-white transition">
            RESERVA
          </Link>
          
          {/* Link para a página do cardápio */}
          <Link to="/cardapio" className="border border-blue-950 text-blue-950 px-4 py-1 rounded-sm text-sm hover:bg-blue-950 hover:text-white transition">
            CARDAPIO
          </Link>
        </nav>
    </header>
    </>
  )
}

export default Header;