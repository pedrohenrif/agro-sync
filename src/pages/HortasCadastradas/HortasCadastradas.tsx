import React, { useEffect, useState } from "react";
import "./hortasCadastradas.css";
import axios from "axios";

const HortasCadastradas = () => {
  const [hortas, setHortas] = useState([]);

  useEffect(() => {
    axios
    .get(`http://localhost:3000/AgroSync/manager-garden/get-gardens?userId=${1}`) // ajuste conforme sua porta/backend
      .then((response) => {
        setHortas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar hortas:", error);
      });
  }, []);

  return (
    <div className="hortas-container">
      <h1>🌿 Hortas Cadastradas</h1>
      <div className="hortas-grid">
        {hortas.map((horta: any) => (
          <div key={horta.id} className="horta-card">
            <div className="horta-info">
              <h2>{horta.name}</h2>
              <p><strong>Culturas:</strong> {horta.crop}</p>
              <p><strong>Início do Plantio:</strong> {new Date(horta.plantingDate).toLocaleDateString()}</p>
              <p><strong>Tamanho:</strong> {horta.sizeInM2}m²</p>
              <p><strong>Localização:</strong> {horta.location}</p>
              <div className="horta-actions">
                <button className="editar">✏️ Editar</button>
                <button className="excluir">🗑️ Excluir</button>
              </div>
            </div>

            <div className="horta-modelo">
              <p><strong>Modelo da Horta:</strong></p>
              <div className="modelo-exemplo">
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
