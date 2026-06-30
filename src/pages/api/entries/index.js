import fs from 'fs';
import path from 'path';

const entriesFilePath = path.join(process.cwd(), 'data', 'entries.json');
const productsFilePath = path.join(process.cwd(), 'data', 'products.json');
const partiesFilePath = path.join(process.cwd(), 'data', 'parties.json');

function readData(filePath) {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const entries = readData(entriesFilePath);
      res.status(200).json(entries);
    } catch (error) {
      res.status(500).json({ message: 'Error reading entries data.' });
    }
  } else if (req.method === 'POST') {
    try {
      const { partyId, productId, netWeight, tanch, wastage } = req.body;

      if (!partyId || !productId || !netWeight) {
        return res.status(400).json({ message: 'Missing required fields.' });
      }

      const parties = readData(partiesFilePath);
      const products = readData(productsFilePath);
      const entries = readData(entriesFilePath);

      const party = parties.find(p => p.partyId === parseInt(partyId));
      const product = products.find(p => p.productId === parseInt(productId));

      if (!party || !product) {
        return res.status(404).json({ message: 'Party or Product not found.' });
      }

      const calculatedValue = (parseFloat(netWeight) * (parseFloat(tanch) + parseFloat(wastage))) / 100;

      const newEntryId = entries.length > 0 ? Math.max(...entries.map(e => e.entryDataId)) + 1 : 1;

      const newEntry = {
        entryDataId: newEntryId,
        partyId: parseInt(partyId),
        partyName: party.partyName,
        productId: parseInt(productId),
        productName: product.productName,
        tanch: parseFloat(tanch),
        weight: parseFloat(netWeight),
        wastage: parseFloat(wastage),
        calculatedValue,
      };

      entries.push(newEntry);
      writeData(entriesFilePath, entries);

      res.status(201).json(newEntry);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error writing entry data.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}