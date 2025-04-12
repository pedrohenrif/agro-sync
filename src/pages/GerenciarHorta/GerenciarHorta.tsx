import React, { useState } from "react";
import "./GerenciarHorta.css";


const GerenciarHorta = () => {
    const [formType, setFormType] = useState<"tem_horta" | "quer_ajuda" | null>(null);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Formulário enviado!");
    };

    return (
        <div className="horta-container">
            <h1 className="horta-title">Gerenciar Horta 🌿</h1>
            {!formType && (
                <div className="horta-options">
                    <button onClick={() => setFormType("tem_horta")} className="horta-button">
                        Já tenho uma horta
                    </button>
                    <button onClick={() => setFormType("quer_ajuda")} className="horta-button">
                        Quero ajuda para começar
                    </button>
                </div>
            )}

            {formType === "tem_horta" && (
                <form className="horta-form" onSubmit={handleFormSubmit}>
                    <label>
                        O que você está plantando?
                        <input type="text" name="plantio" required />
                    </label>

                    <label>
                        Data de início do plantio:
                        <input type="date" name="inicio_plantio" required />
                    </label>

                    <label>
                        Tamanho da plantação (m²):
                        <input type="number" name="tamanho" required />
                    </label>

                    <label>
                        Quantidade estimada de colheita (kg):
                        <input type="number" name="quantidade" />
                    </label>

                    <label>
                        Localização da plantação:
                        <input type="text" name="localizacao" />
                    </label>

                    <label>
                        Tem sistema de irrigação?
                        <select name="irrigacao">
                            <option value="sim">Sim</option>
                            <option value="nao">Não</option>
                        </select>
                    </label>

                    <button type="submit" className="horta-submit">Enviar</button>
                </form>
            )}

            {formType === "quer_ajuda" && (
                <form className="horta-form" onSubmit={handleFormSubmit}>
                    <label>
                        Qual seu nível de experiência?
                        <select name="experiencia">
                            <option value="iniciante">Iniciante</option>
                            <option value="intermediario">Intermediário</option>
                            <option value="avancado">Avançado</option>
                        </select>
                    </label>

                    <label>
                        Tem um espaço para plantio?
                        <select name="espaco">
                            <option value="sim">Sim</option>
                            <option value="nao">Não</option>
                        </select>
                    </label>

                    <label>
                        Tipo de solo disponível:
                        <input type="text" name="solo" />
                    </label>

                    <label>
                        Qual seu objetivo com a horta?
                        <textarea name="objetivo" rows={3} />
                    </label>

                    <button type="submit" className="horta-submit">Solicitar ajuda</button>
                </form>
            )}
        </div>
    );
};

export default GerenciarHorta;
