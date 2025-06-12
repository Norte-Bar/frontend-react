// src/pages/CardapioPage.jsx

import React from 'react';
import menuData from './data'; // Importa os dados do cardápio
import MenuSection from '../components/MenuSection'; // Importa o componente de seção
import '../components/Menu.css'; // Importa os estilos gerais do cardápio

function cardapio() {
  return (
    <div className="menu-container">
      <h1 className="menu-title">Nosso Cardápio Digital</h1>

      <MenuSection title="Entradas" items={menuData.entradas} />
      <MenuSection title="Pratos Principais" items={menuData.pratosPrincipais} />
      <MenuSection title="Bebidas" items={menuData.bebidas} />
      <MenuSection title="Sobremesas" items={menuData.sobremesas} />
    </div>
  );
}

export default cardapio;