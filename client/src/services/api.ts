import axios from 'axios';
import { Card, CubeCard, CubeAnalysis } from '../types/Card';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const cardApi = {
  searchCards: async (query: string): Promise<Card[]> => {
    const response = await api.get(`/cards/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getCardByName: async (name: string): Promise<Card> => {
    const response = await api.get(`/cards/${encodeURIComponent(name)}`);
    return response.data;
  },

  getCardPrintings: async (name: string): Promise<Card[]> => {
    const response = await api.get(`/cards/${encodeURIComponent(name)}/printings`);
    return response.data;
  },
};

export const cubeApi = {
  getCube: async (cubeId: string): Promise<CubeCard[]> => {
    const response = await api.get(`/cubes/${cubeId}`);
    return response.data;
  },

  addCardToCube: async (cubeId: string, card: CubeCard): Promise<void> => {
    await api.post(`/cubes/${cubeId}/cards`, card);
  },

  removeCardFromCube: async (cubeId: string, cardId: string): Promise<void> => {
    await api.delete(`/cubes/${cubeId}/cards/${cardId}`);
  },

  updateCardInCube: async (cubeId: string, cardId: string, updates: Partial<CubeCard>): Promise<void> => {
    await api.patch(`/cubes/${cubeId}/cards/${cardId}`, updates);
  },

  analyzeCube: async (cubeId: string): Promise<CubeAnalysis> => {
    const response = await api.get(`/cubes/${cubeId}/analysis`);
    return response.data;
  },

  createCube: async (name: string): Promise<{ id: string; name: string }> => {
    const response = await api.post('/cubes', { name });
    return response.data;
  },

  getAllCubes: async (): Promise<{ id: string; name: string; cardCount: number }[]> => {
    const response = await api.get('/cubes');
    return response.data;
  },
};