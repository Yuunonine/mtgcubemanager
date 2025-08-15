const express = require('express');
const { v4: uuidv4 } = require('uuid');
const database = require('../models/database');
const { analyzeCube } = require('../utils/cubeAnalysis');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cubes = await database.getAllCubes();
    res.json(cubes);
  } catch (error) {
    console.error('Get cubes error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Cube name is required' });
    }

    const cubeId = uuidv4();
    const cubeData = {
      id: cubeId,
      name,
      description: description || ''
    };

    await database.createCube(cubeData);
    res.status(201).json(cubeData);
  } catch (error) {
    console.error('Create cube error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:cubeId', async (req, res) => {
  try {
    const { cubeId } = req.params;
    const cards = await database.getCubeCards(cubeId);
    res.json(cards);
  } catch (error) {
    console.error('Get cube cards error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/:cubeId/cards', async (req, res) => {
  try {
    const { cubeId } = req.params;
    const cardData = req.body;

    await database.addCardToCube(cubeId, cardData);
    res.status(201).json({ message: 'Card added to cube successfully' });
  } catch (error) {
    console.error('Add card to cube error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cubeId/cards/:cardId', async (req, res) => {
  try {
    const { cubeId, cardId } = req.params;
    const result = await database.removeCardFromCube(cubeId, cardId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Card not found in cube' });
    }
    
    res.json({ message: 'Card removed from cube successfully' });
  } catch (error) {
    console.error('Remove card from cube error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:cubeId/analysis', async (req, res) => {
  try {
    const { cubeId } = req.params;
    const cards = await database.getCubeCards(cubeId);
    const analysis = analyzeCube(cards);
    res.json(analysis);
  } catch (error) {
    console.error('Cube analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;