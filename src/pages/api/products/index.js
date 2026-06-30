import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'products.json');

function readProducts() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
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
    try {
      const { productName } = req.body;

      if (!productName) {
        return res.status(400).json({ message: 'Product name is required.' });
      }

      const products = readProducts();

      if (products.find(p => p.productName === productName)) {
        return res.status(409).json({ message: 'Product name must be unique.' });
      }

      const newProductId = products.length > 0 ? Math.max(...products.map(p => p.productId)) + 1 : 1;

      const newProduct = {
        productId: newProductId,
        productName,
      };

      products.push(newProduct);
      writeProducts(products);

      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error writing products data.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}