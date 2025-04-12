import React from "react";
import "./hortasCadastradas.css";

const hortas = [
  {
    id: 1,
    nome: "Horta do João",
    cultura: "Alface, Tomate, Cenoura",
    inicioPlantio: "2025-03-20",
    tamanho: "15m²",
    localizacao: "Curitiba - PR",
  },
  {
    id: 2,
    nome: "Horta Escolar",
    cultura: "Milho, Abobrinha",
    inicioPlantio: "2025-02-10",
    tamanho: "30m²",
    localizacao: "Colégio Agrícola - RS",
  },
];

const HortasCadastradas = () => {
  return (
    <div className="hortas-container">
      <h1>🌿 Hortas Cadastradas</h1>
      <div className="hortas-grid">
        {hortas.map((horta) => (
          <div key={horta.id} className="horta-card">
            <div className="horta-info">
              <h2>{horta.nome}</h2>
              <p><strong>Culturas:</strong> {horta.cultura}</p>
              <p><strong>Início do Plantio:</strong> {horta.inicioPlantio}</p>
              <p><strong>Tamanho:</strong> {horta.tamanho}</p>
              <p><strong>Localização:</strong> {horta.localizacao}</p>
              <div className="horta-actions">
                <button className="editar">✏️ Editar</button>
                <button className="excluir">🗑️ Excluir</button>
              </div>
            </div>

            {/* Modelo visual da horta - você pode substituir esse HTML pelo seu componente existente */}
            <div className="horta-modelo">
              <p><strong>Modelo da Horta:</strong></p>
              <div className="modelo-exemplo">
                {/* Aqui entra o seu componente visual da horta ou um placeholder */}
                <div className="canteiro">Canteiro A</div>
                <div className="canteiro">Canteiro B</div>
                <div className="canteiro">Canteiro C</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HortasCadastradas;
