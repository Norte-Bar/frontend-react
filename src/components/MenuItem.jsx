// src/components/MenuItem.jsx

import React from 'react';
import './MenuItem.css';

function MenuItem({ item }) {
  // Isso garante que a altura definida em data.js será usada
  const imageContainerStyle = {
    maxHeight: item.imageHeight || '180px', // Usa a altura do item ou um padrão
  };

  const imageStyle = {
    objectFit: item.objectFit || 'cover', // Usa o object-fit do item ou um padrão
  };

  return (
    <div className="menu-item">
      {item.imagem && (
        <div className="menu-item-image-container" style={imageContainerStyle}>
          <img src={item.imagem} alt={item.nome} className="menu-item-image" style={imageStyle} />
        </div>
      )}
      <h3 className="menu-item-name">{item.nome}</h3>
      <p className="menu-item-description">{item.descricao}</p>
      <p className="menu-item-price">R$ {item.preco.toFixed(2)}</p>
    </div>
  );
}

export default MenuItem;