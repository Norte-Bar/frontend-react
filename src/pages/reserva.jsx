import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


function Reserva() {
  // Estados do componente
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    fone: "",
    mesas: ""
  });

  // Effect para fonte dos ícones do Google
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Dados dos cards do carrossel
  const cards = [
    {
      id: 1,
      title: "Menu Principal",
      subtitle: "Pratos especiais da casa",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
      route: "/menu-principal"
    },
    {
      id: 2,
      title: "Bebidas",
      subtitle: "Drinks e coquetéis autorais",
      image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop",
      route: "/bebidas"
    },
    {
      id: 3,
      title: "Sobremesa",
      subtitle: "Doces irresistíveis",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
      route: "/sobremesas"
    }
  ];

  // Manipulação do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);
  };

  // Funções de navegação do menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Funções de navegação do carrossel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % cards.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleCardClick = (route) => {
    console.log(`Navegando para: ${route}`);
  };

  return (
    <main className="flex min-h-screen relative">
      {/* Header com título e menu hambúrguer */}
      <div className="absolute top-4 left-6 flex items-center gap-4 z-20">
        {/* Botão hambúrguer */}
        <button
          onClick={toggleMenu}
          className="flex flex-col justify-center items-center w-8 h-8 space-y-1 hover:opacity-75 transition-opacity"
        >
          <div className={`w-6 h-0.5 bg-[#12263A] transition-all duration-300 ${
            isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
          }`}></div>
          <div className={`w-6 h-0.5 bg-[#12263A] transition-all duration-300 ${
            isMenuOpen ? 'opacity-0' : ''
          }`}></div>
          <div className={`w-6 h-0.5 bg-[#12263A] transition-all duration-300 ${
            isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
          }`}></div>
        </button>
        
        <h1 className="text-[#12263A] text-3xl font-semibold">
          NORTE BAR
        </h1>
      </div>

      {/* Área clicável invisível para fechar o menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-10"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#FCFFED] border-r-2 border-[#12263A] z-15 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 pt-20">
          <nav className="space-y-4">
            <button 
              className="block w-full text-left px-4 py-3 text-[#12263A] hover:bg-[#B8B15B] hover:text-white transition-all duration-200 rounded-sm font-medium"
              onClick={toggleMenu}
            >
              SOBRE
            </button>
            <button 
              className="block w-full text-left px-4 py-3 text-[#12263A] hover:bg-[#BD4B2C] hover:text-white transition-all duration-200 rounded-sm font-medium"
              onClick={toggleMenu}
            >
              RESERVAS
            </button>
            <button 
              className="block w-full text-left px-4 py-3 text-[#12263A] hover:bg-[#B8B15B] hover:text-white transition-all duration-200 rounded-sm font-medium"
              onClick={toggleMenu}
            >
              CARDÁPIO
            </button>
          </nav>
        </div>
      </div>

      {/* Seção do Formulário */}
      <div className="bg-[#FCFFED] w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-xs">
          <h2 className="text-[#12263A] text-xl text-center mb-4">RESERVAS</h2>
          <div onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="nome"
              placeholder="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full border border-[#12263A] px-3 py-2 rounded-sm text-[#12263A] focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="e-mail"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-[#12263A] px-3 py-2 rounded-sm text-[#12263A] focus:outline-none"
            />
            <input
              type="text"
              name="fone"
              placeholder="fone"
              value={formData.fone}
              onChange={handleChange}
              className="w-full border border-[#12263A] px-3 py-2 rounded-sm text-[#12263A] focus:outline-none"
            />
            <input
              type="text"
              name="mesas"
              placeholder="mesas"
              value={formData.mesas}
              onChange={handleChange}
              className="w-full bg-[#B8B15B] px-3 py-2 rounded-sm text-[#12263A] placeholder:text-[#12263A] focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-[#BD4B2C] text-white px-6 py-2 rounded-sm hover:bg-[#a63f25] transition"
              >
                enviar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seção do Carrossel */}
      <div className="bg-[#0F1D2B] w-1/2 flex flex-col items-center justify-center p-8 overflow-hidden">
        <h2 className="text-[#FCFFED] text-xl mb-8 tracking-wide">CARDÁPIO</h2>
        
        <div className="relative w-full max-w-xs overflow-hidden">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {cards.map((card, index) => (
                <div key={card.id} className="flex-shrink-0 px-2 w-full flex justify-center">
                  <div 
                    className={`bg-[#FCFFED] rounded-xl p-0 cursor-pointer overflow-hidden shadow-md max-w-[260px] w-full transition-all duration-300 hover:shadow-lg ${
                      index === currentSlide ? 'opacity-100' : 'opacity-60'
                    }`} 
                    onClick={() => { 
                      setCurrentSlide(index); 
                      handleCardClick(card.route); 
                    }}
                  >
                    <div className="h-40 overflow-hidden rounded-t-xl">
                      <img 
                        src={card.image} 
                        alt={card.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="text-[#12263A] text-base font-medium">
                        {card.title}
                      </h3>
                      <p className="text-sm text-[#12263A]/70">
                        {card.subtitle}
                      </p>
                      <button className="mt-2 inline-flex items-center text-sm text-[#12263A] border border-[#12263A]/20 rounded-full px-3 py-1 hover:bg-[#12263A]/10 transition">
                        <span className="mr-2">Ver cardápio</span>
                        <span className="material-symbols-outlined text-base">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Controles de navegação */}
          <div className="flex justify-between items-center mt-4 w-full">
            <button
              onClick={prevSlide}
              className="w-6 h-6 bg-[#FCFFED] border border-[#12263A] flex items-center justify-center text-[#12263A] hover:bg-[#12263A] hover:text-[#FCFFED] transition-all duration-300 rounded-sm text-sm"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
            
            <div className="flex space-x-1">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-[#BD4B2C]' 
                      : 'bg-[#FCFFED] opacity-30 hover:opacity-60'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              className="w-6 h-6 bg-[#FCFFED] border border-[#12263A] flex items-center justify-center text-[#12263A] hover:bg-[#12263A] hover:text-[#FCFFED] transition-all duration-300 rounded-sm text-sm"
            >
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Reserva;