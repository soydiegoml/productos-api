const { Router } = require('express');
const { getCatalog } = require('../services/catalogoService');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const catalog = await getCatalog();
    res.json({
      success: true,
      total: catalog.length,
      products: catalog,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;