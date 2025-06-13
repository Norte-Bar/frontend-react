import React from 'react';

function MenuItem({ item }) {
  const imageContainerStyle = {
    maxHeight: item.imageHeight || '180px',
  };

  const imageStyle = {
    objectFit: item.objectFit || 'cover',
  };

  return (
    <div className="bg-white border border-[#cbced0] rounded-xl p-4 shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
      {item.imagem && (
        <div
          className="overflow-hidden rounded-md w-full mb-4 flex justify-center items-center"
          style={imageContainerStyle}
        >
          <img
            src={item.imagem}
            alt={item.nome}
            className="w-full h-full transition-transform duration-500 hover:scale-110"
            style={imageStyle}
          />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#12263a]">{item.nome}</h3>

      {/* Descrição com nova cor e frase ajustada */}
      <p className="text-sm text-[#4a5568] mt-1 italic">
        {item.descricao || 'Delicioso e preparado com carinho.'}
      </p>

      <p className="text-[#b8b15b] font-bold text-lg mt-2">
        R$ {item.preco.toFixed(2)}
      </p>
    </div>
  );
}

export default MenuItem;