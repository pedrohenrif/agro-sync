import React, { useState } from "react";

const PerimetroSecao = () => {
  const [perimeter, setPerimeter] = useState(10);
  const plants = ["Tomate", "Alface", "Cenoura", "Manjericão"];
  
  return (
    <div className="flex flex-col items-center p-6 bg-green-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Minha Horta</h1>
      
      {/* Área da horta */}
      <div className="bg-white p-6 shadow-lg rounded-2xl w-full max-w-2xl text-center">
        <h2 className="text-xl font-bold mb-4">Visualização da Horta</h2>
        <div className="border-4 border-green-500 rounded-lg p-12 text-lg font-semibold mb-4">
          Perímetro: {perimeter} m²
        </div>
        <input
          type="range"
          min="5"
          max="50"
          value={perimeter}
          onChange={(e) => setPerimeter(Number(e.target.value))}
          className="w-full mt-2"
        />
      </div>
      
      {/* Informações adicionais */}
      <div className="bg-white p-6 shadow-lg rounded-2xl w-full max-w-2xl text-center mt-6">
        <h3 className="text-lg font-semibold">Configurações da Horta</h3>
        <div className="flex justify-around mt-4">
          <button className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700">Informações</button>
          <button className="bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-700">Previsão do Tempo</button>
          <button className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-700">Alertas</button>
        </div>
      </div>
      
      {/* Seleção de Plantas */}
      <div className="bg-white p-6 shadow-lg rounded-2xl w-full max-w-2xl text-center mt-6">
        <h3 className="text-lg font-semibold">Selecione uma Planta:</h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {plants.map((plant) => (
            <button
              key={plant}
              className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-700"
            >
              {plant}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerimetroSecao;
