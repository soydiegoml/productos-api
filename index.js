require('dotenv').config();

const express = require('express');
const catalogoRouter = require('./src/routes/catalogo');
const { errorHandler } = require('./src/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/catalogo', catalogoRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada.' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Catálogo disponible en http://localhost:${PORT}/api/catalogo`);
});