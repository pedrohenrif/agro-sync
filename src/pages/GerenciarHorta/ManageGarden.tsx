// ARQUIVO: src/pages/GerenciarHorta/ManageGarden.tsx

import React, { useState } from "react";
import "./ManageGarden.css"; // Importa o CSS refatorado
import api from '../../service/api';
import { toast } from 'react-toastify'; // Para notificações

// Interface para definir a estrutura dos dados do formulário
interface GardenFormData {
  name: string;
  crop: string;
  plantingDate: string;
  sizeInM2: string; // Manter como string no estado para o input type="number"
  location: string;
}

const ManageGarden = () => {
  // Estado para controlar os campos do formulário
  const [formData, setFormData] = useState<GardenFormData>({
    name: "",
    crop: "",
    plantingDate: "",
    sizeInM2: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Função para atualizar o estado quando um campo muda
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Converte sizeInM2 para número antes de enviar
    const payload = {
      ...formData,
      sizeInM2: Number(formData.sizeInM2) || 0, // Converte para número, ou 0 se inválido
      userId: 1, // Mantenha como fixo por enquanto ou pegue do contexto de auth
      isActive: true,
    };

    try {
      // Usa a instância 'api' e o endpoint correto
      const response = await api.post("/manager-garden/created-garden", payload);
      
      toast.success("Horta criada com sucesso!"); // Notificação de sucesso
      console.log(response.data); // Log da resposta (opcional)
      
      // Limpa o formulário após o sucesso
      setFormData({ 
        name: "", 
        crop: "", 
        plantingDate: "", 
        sizeInM2: "", 
        location: "" 
      });

    } catch (error: any) {
      console.error("Erro ao criar a horta:", error);
      // Tenta pegar a mensagem de erro da API, senão mostra uma genérica
      const errorMessage = error.response?.data?.message || "Erro de rede ou servidor.";
      toast.error(`Falha ao criar a horta: ${errorMessage}`); // Notificação de erro
    } finally {
      setIsLoading(false); // Reabilita o botão
    }
  };

  return (
    // Container principal da página
    <div className="manage-garden-container">
      {/* Título da página */}
      <h1 className="manage-garden-title">
        <span role="img" aria-label="seedling">🌿</span> Adicionar Novo Canteiro
      </h1>

      {/* Formulário de cadastro */}
      <form className="manage-garden-form" onSubmit={handleSubmit}>
        
        {/* Campo: Nome da Horta */}
        <div className="form-group">
          <label htmlFor="name">Nome do Canteiro:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Ex: Canteiro Principal"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="form-input"
          />
        </div>

        {/* Campo: Cultura */}
        <div className="form-group">
          <label htmlFor="crop">O que você está plantando?</label>
          <input
            type="text"
            id="crop"
            name="crop"
            placeholder="Ex: Alface, Tomate Cereja"
            value={formData.crop}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="form-input"
          />
        </div>

        {/* Campo: Data de Início */}
        <div className="form-group">
          <label htmlFor="plantingDate">Data de início do plantio:</label>
          <input
            type="date"
            id="plantingDate"
            name="plantingDate"
            value={formData.plantingDate}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="form-input"
          />
        </div>

        {/* Campo: Tamanho */}
        <div className="form-group">
          <label htmlFor="sizeInM2">Tamanho do canteiro (m²):</label>
          <input
            type="number"
            id="sizeInM2"
            name="sizeInM2"
            placeholder="Ex: 10.5"
            value={formData.sizeInM2}
            onChange={handleInputChange}
            required
            min="0" // Impede valores negativos
            step="0.1" // Permite decimais
            disabled={isLoading}
            className="form-input"
          />
        </div>

        {/* Campo: Localização (Opcional) */}
        <div className="form-group">
          <label htmlFor="location">Localização (opcional):</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Ex: Fundo do quintal, Vaso na varanda"
            value={formData.location}
            onChange={handleInputChange}
            disabled={isLoading}
            className="form-input"
          />
        </div>

        {/* Botão de Envio */}
        <button type="submit" className="manage-garden-submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Adicionar Canteiro"}
        </button>
      </form>
    </div>
  );
};

export default ManageGarden;