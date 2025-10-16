import React, { useState } from "react";
import "./ManageGarden.css";
import api from '../../service/api';

const ManageGarden = () => {
    const [formType, setFormType] = useState<"has_garden" | "needs_help" | null>(null);

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
      
        if (formType === "has_garden") {
          const form = event.target as HTMLFormElement;
          const formData = new FormData(form);
      
          const payload = {
            name: formData.get("name"), 
            crop: formData.get("crop") as string,
            plantingDate: formData.get("planting_start_date") as string,
            sizeInM2: Number(formData.get("size")),
            location: formData.get("location") as string,
            userId: 1, 
            isActive: true,
          };
      
          try {
            const response = await api.post("/manager-garden/created-garden", payload);
      
            const data = response.data; 

            alert("Horta criada com sucesso!");
            console.log(data);
          } catch (error) {
            alert("Erro de rede ou servidor.");
            console.error(error);
          }
        } else {
          alert("Formulário de ajuda ainda não implementado.");
        }
      };

    return (
        <div className="garden-container">
            <h1 className="garden-title">Gerenciar Horta 🌿</h1>

            {!formType && (
                <div className="garden-options">
                    <button onClick={() => setFormType("has_garden")} className="garden-button">
                        Já tenho uma horta
                    </button>
                    <button onClick={() => setFormType("needs_help")} className="garden-button">
                        Quero ajuda para começar
                    </button>
                </div>
            )}

            {formType === "has_garden" && (
                <form className="garden-form" onSubmit={handleFormSubmit}>
                    <label>
                        Nome da sua Horta
                        <input type="text" name="name" placeholder="Horta AgroSync" required />
                    </label>
                    <label>
                        O que você está plantando?
                        <input type="text" name="crop" required />
                    </label>

                    <label>
                        Data de início do plantio:
                        <input type="date" name="planting_start_date" required />
                    </label>

                    <label>
                        Tamanho da plantação (m²):
                        <input type="number" name="size" required />
                    </label>

                    <label>
                        Quantidade estimada de colheita (kg):
                        <input type="number" name="estimated_yield" />
                    </label>

                    <label>
                        Localização da plantação:
                        <input type="text" name="location" />
                    </label>

                    <label>
                        Tem sistema de irrigação?
                        <select name="irrigation">
                            <option value="sim">Sim</option>
                            <option value="nao">Não</option>
                        </select>
                    </label>

                    <button type="submit" className="garden-submit">Enviar</button>
                </form>
            )}

            {formType === "needs_help" && (
                <form className="garden-form" onSubmit={handleFormSubmit}>
                    <label>
                        Qual seu nível de experiência?
                        <select name="experience_level">
                            <option value="iniciante">Iniciante</option>
                            <option value="intermediario">Intermediário</option>
                            <option value="avancado">Avançado</option>
                        </select>
                    </label>

                    <label>
                        Tem um espaço para plantio?
                        <select name="has_space">
                            <option value="sim">Sim</option>
                            <option value="nao">Não</option>
                        </select>
                    </label>

                    <label>
                        Tipo de solo disponível:
                        <input type="text" name="soil_type" />
                    </label>

                    <label>
                        Qual seu objetivo com a horta?
                        <textarea name="goal" rows={3} />
                    </label>

                    <button type="submit" className="garden-submit">Solicitar ajuda</button>
                </form>
            )}
        </div>
    );
};

export default ManageGarden;
