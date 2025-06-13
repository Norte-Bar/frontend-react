import React from 'react';
import menuData from './data';
import MenuSection from '../components/MenuSection';

function Cardapio() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 font-sans bg-gradient-to-br from-[#12263a] to-[#1e3a5f] rounded-2xl shadow-xl">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-white mb-12 border-b-4 border-[#b8b15b] pb-4 shadow-sm">
        Nosso Cardápio Digital
      </h1>

      <MenuSection title="Entradas" items={menuData.entradas} />
      <MenuSection title="Pratos Principais" items={menuData.pratosPrincipais} />
      <MenuSection title="Bebidas" items={menuData.bebidas} />
      <MenuSection title="Sobremesas" items={menuData.sobremesas} />
    </div>
  );
}

export default Cardapio;
