import fs from 'fs';
import path from 'path';

const dataDir = 'C:\\entry-book';
const partyDir = path.join(dataDir, 'PARTY');
const productsFilePath = path.join(dataDir, 'products.json');

// Ensure directories exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(partyDir)) {
  fs.mkdirSync(partyDir, { recursive: true });
}

// Ensure products file exists
if (!fs.existsSync(productsFilePath)) {
  fs.writeFileSync(productsFilePath, JSON.stringify([], null, 2));
}

function readData(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function readParties() {
  try {
    if (!fs.existsSync(partyDir)) {
      return [];
    }
    const files = fs.readdirSync(partyDir);
    const parties = [];
    files.forEach(file => {
      if (file.endsWith('.json')) {
        try {
          const content = fs.readFileSync(path.join(partyDir, file), 'utf8');
          parties.push(JSON.parse(content));
        } catch (err) {
          console.error(`Failed to read party file ${file}:`, err);
        }
      }
    });
    return parties;
  } catch (error) {
    console.error('Error reading parties:', error);
    return [];
  }
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const parties = readParties();
      const allEntries = [];
      parties.forEach(party => {
        if (party.entries) {
          party.entries.forEach(entry => {
            allEntries.push({
              ...entry,
              partyId: party.partyId,
              partyName: party.partyName
            });
          });
        }
      });
      res.status(200).json(allEntries);
    } catch (error) {
      res.status(500).json({ message: 'Error reading entries data.' });
    }
  } else if (req.method === 'POST') {
    try {
      const { partyId, productId, netWeight, tanch, wastage } = req.body;

      if (!partyId || !productId || !netWeight) {
        return res.status(400).json({ message: 'Missing required fields.' });
      }

      const parties = readParties();
      const products = readData(productsFilePath);

      const party = parties.find(p => p.partyId === parseInt(partyId));
      const product = products.find(p => p.productId === parseInt(productId));

      if (!party || !product) {
        return res.status(404).json({ message: 'Party or Product not found.' });
      }

      const newEntryId = (party.entries && party.entries.length > 0) ? Math.max(...party.entries.map(e => e.entryDataId)) + 1 : 1;

      const calculatedValue = (parseFloat(netWeight) * (parseFloat(tanch) + parseFloat(wastage))) / 100;

      const entryToStore = {
        entryDataId: newEntryId,
        productId: parseInt(productId),
        productName: product.productName,
        tanch: parseFloat(tanch) || 0,
        netWeight: parseFloat(netWeight),
        wastage: parseFloat(wastage) || 0,
        calculatedValue,
        createdOn: new Date().toISOString(),
        modifiedOn: new Date().toISOString(),
      };

      if (!party.entries) {
        party.entries = [];
      }
      party.entries.push(entryToStore);

      const safeName = party.partyName.replace(/[\\/:*?"<>|]/g, '_');
      const partyFile = path.join(partyDir, `${safeName}.json`);
      fs.writeFileSync(partyFile, JSON.stringify(party, null, 2));

      res.status(201).json({
        ...entryToStore,
        partyId: party.partyId,
        partyName: party.partyName
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error writing entry data.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}