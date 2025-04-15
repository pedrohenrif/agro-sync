import React, { useState } from "react";
import "./editGardenModal.css";

interface Garden {
  id: number;
  name: string;
  crop: string;
  plantingDate: string;
  sizeInM2: number;
  location: string;
}

interface EditGardenModalProps {
  garden: Garden;
  onClose: () => void;
  onSave: (updatedGarden: Garden) => void;
}

const EditGardenModal = ({ garden, onClose, onSave }: EditGardenModalProps) => {
  const [formData, setFormData] = useState<Garden>({ ...garden });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "sizeInM2" ? Number(value) : value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Horta</h2>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome da Horta"
        />
        <input
          type="text"
          name="crop"
          value={formData.crop}
          onChange={handleChange}
          placeholder="Alface"
        />
        <input
          type="date"
          name="plantingDate"
          value={formData.plantingDate.split("T")[0]}
          onChange={handleChange}
        />
        <input
          type="number"
          name="sizeInM2"
          value={formData.sizeInM2}
          onChange={handleChange}
          placeholder="Tamanho (m²)"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Localização"
        />

        <div className="modal-buttons">
          <button onClick={handleSubmit} className="save">💾 Salvar</button>
          <button onClick={onClose} className="cancel">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default EditGardenModal;
