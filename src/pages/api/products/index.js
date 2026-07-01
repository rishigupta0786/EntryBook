import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'products.json');

function readProducts() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // If file doesn't exist, return empty array
    }
    throw error;
  }
}

function writeProducts(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const products = readProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error reading products data.' });
    }
  } else if (req.method === 'POST') {
    console.log('Received POST request to /api/products');
    try {
      const { productName } = req.body;
      console.log('Product name from request:', productName);

      if (!productName) {
        console.log('Validation failed: Product name is required.');
        return res.status(400).json({ message: 'Product name is required.' });
      }

      let products = [];
      try {
        const data = fs.readFileSync(filePath, 'utf8');
        console.log('File content before parsing:', data);
        products = JSON.parse(data);
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log('products.json not found, starting with an empty array.');
        } else {
          console.error('Error reading or parsing products.json:', error);
          throw error;
        }
      }
      console.log('Products before adding new one:', products);

      if (products.find(p => p.productName === productName)) {
        console.log('Validation failed: Product name must be unique.');
        return res.status(409).json({ message: 'Product name must be unique.' });
      }

      const newProductId = products.length > 0 ? Math.max(...products.map(p => p.productId)) + 1 : 1;
      const newProduct = { productId: newProductId, productName };
      console.log('New product to be added:', newProduct);

      products.push(newProduct);
      console.log('Products after adding new one:', products);

      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
      console.log('Successfully wrote to products.json');

      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Caught error in POST /api/products:', error);
      res.status(500).json({ message: 'Error writing products data.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}