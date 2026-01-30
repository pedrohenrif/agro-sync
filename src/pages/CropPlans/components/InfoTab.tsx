import React from 'react';

const InfoTab = ({ formData, setFormData }: any) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Converte para número se for o campo de duração
    const finalValue = name === 'durationDays' ? Number(value) : value;
    
    setFormData({ ...formData, [name]: finalValue });
  };

  return (
    <div className="tab-panel animate-in">
      <div className="form-group">
        <label>Nome do Plano de Cultivo</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          className="form-input" 
          placeholder="Ex: Alface Americana - Ciclo Verão" 
        />
      </div>

      <div className="form-group">
        <label>Cultura Principal</label>
        <input 
          type="text" 
          name="culture" 
          value={formData.culture} 
          onChange={handleChange} 
          className="form-input" 
          placeholder="Ex: Alface" 
        />
      </div>

      <div className="form-group">
        <label>Duração Estimada (Dias)</label>
        <input 
          type="number" 
          name="durationDays" 
          value={formData.durationDays} 
          onChange={handleChange} 
          className="form-input" 
        />
      </div>

      <div className="form-group">
        <label>Descrição e Observações</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          className="form-textarea" 
          rows={4}
          placeholder="Descreva detalhes do manejo ou recomendações técnicas..."
        />
      </div>
    </div>
  );
};

export default InfoTab;