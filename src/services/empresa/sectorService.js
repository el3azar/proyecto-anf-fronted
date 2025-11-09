// src/services/sectorService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/sectores';

export const getSectores = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los sectores:", error.response?.data || error.message);
    throw error;
  }
};

export const createSector = async (sectorData) => {
  try {
    const response = await axios.post(API_URL, sectorData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el sector:", error.response?.data || error.message);
    throw error;
  }
};



export const updateSector = async (id, sectorData) => {
  try {
    // La petición PUT incluye el ID del sector en la URL
    const response = await axios.put(`${API_URL}/${id}`, sectorData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el sector con ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// --- FUNCIÓN NUEVA PARA ELIMINAR ---
export const deleteSector = async (id) => {
    try {
      // La petición DELETE solo necesita el ID en la URL
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error al eliminar el sector con ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  };