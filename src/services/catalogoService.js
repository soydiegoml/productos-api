const axios = require('axios');

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;
const IVA = parseFloat(process.env.IVA);
const LOW_STOCK_THRESHOLD = parseInt(process.env.LOW_STOCK_THRESHOLD);

function transformProduct(product) {
  const price = typeof product.price === 'number' ? product.price : null;
  const stock = typeof product.stock === 'number' ? product.stock : null;

  return {
    id: product.id ?? null,
    title: product.title ?? 'Sin título',
    description: product.description ?? 'Sin descripción',
    category: product.category ?? 'Sin categoría',

    price,
    finalPrice: price !== null ? Number((price * (1 + IVA)).toFixed(2)) : null,

    discountPercentage:
      typeof product.discountPercentage === 'number'
        ? product.discountPercentage
        : null,

    rating: typeof product.rating === 'number' ? product.rating : null,
    stock,
    isLowStock: stock !== null ? stock < LOW_STOCK_THRESHOLD : null,

    tags: Array.isArray(product.tags) ? product.tags : [],
    brand: product.brand ?? 'Sin marca',
    sku: product.sku ?? null,
    weight: typeof product.weight === 'number' ? product.weight : null,

    dimensions: {
      width: product.dimensions?.width ?? null,
      height: product.dimensions?.height ?? null,
      depth: product.dimensions?.depth ?? null,
    },

    warrantyInformation: product.warrantyInformation ?? 'Sin información de garantía',
    shippingInformation: product.shippingInformation ?? 'Sin información de envío',
    availabilityStatus: product.availabilityStatus ?? 'Sin estado de disponibilidad',

    reviews: Array.isArray(product.reviews)
      ? product.reviews.map((review) => ({
          rating: review.rating ?? null,
          comment: review.comment ?? '',
          date: review.date ?? null,
          reviewerName: review.reviewerName ?? 'Anónimo',
          reviewerEmail: review.reviewerEmail ?? null,
        }))
      : [],
  };
}

async function getCatalog() {
  let response;

  try {
    response = await axios.get(EXTERNAL_API_URL, { timeout: 8000 });
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      const customError = new Error('La API externa tardó demasiado en responder.');
      customError.statusCode = 504;
      throw customError;
    }

    if (error.response) {
      const customError = new Error(`La API externa respondió con error ${error.response.status}.`);
      customError.statusCode = 502;
      throw customError;
    }
    const customError = new Error('No se pudo conectar con la API externa.');
    throw customError;
  }

  const products = response.data?.products;

  if (!Array.isArray(products)) {
    throw new Error('La respuesta de la API externa tiene un formato inesperado.');
  }

  const transformed = products.map(transformProduct);

  transformed.sort((a, b) => {
    if (a.finalPrice === null) return 1;
    if (b.finalPrice === null) return -1;
    return b.finalPrice - a.finalPrice;
  });

  return transformed;
}

module.exports = { getCatalog };