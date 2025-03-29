const express = require('express');
const router = express.Router();
const HistoryController = require('../controllers/historyController'); 

module.exports = (sequelize) => {
  const historyController = new HistoryController(sequelize); 
  
  router.post('/add', async (req, res) => {
    try {
      const { userId, trackId } = req.body;
      
      if (!userId || !trackId) {
        return res.status(400).json({ 
          error: "Missing parameters",
          received: req.body
        });
      }

      const result = await historyController.addToHistory(userId, trackId);
      res.status(201).json(result);
    } catch (error) {
      console.error("History route error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};