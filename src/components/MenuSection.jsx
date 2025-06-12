// src/components/MenuSection.jsx

import React from 'react';
import MenuItem from './MenuItem'; // Importa o MenuItem
import './MenuSection.css'; // Importa os estilos específicos do MenuSection

function MenuSection({ title, items }) {
  return (
    <section className="menu-section">
      <h2 className="menu-section-title">{title}</h2>
      <div className="menu-items-grid">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default MenuSection;