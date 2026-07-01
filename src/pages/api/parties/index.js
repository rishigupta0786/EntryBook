import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'parties.json');

function readParties() {
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

function writeParties(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const parties = readParties();
      res.status(200).json(parties);
    } catch (error) {
      res.status(500).json({ message: 'Error reading parties data.' });
    }
  } else if (req.method === 'POST') {
    try {
      const { partyName, products } = req.body;

      if (!partyName || !products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Missing required fields: partyName and a non-empty products array.' });
      }

      const parties = readParties();
      let party = parties.find(p => p.partyName.toLowerCase() === partyName.toLowerCase());

      if (party) {
        // Party exists, add new products to it
        products.forEach(newProduct => {
          party.products.push({
            productId: parseInt(newProduct.productId),
            tanch: parseFloat(newProduct.tanch) || 0,
            wastage: parseFloat(newProduct.wastage) || 0,
          });
        });
      } else {
        // Party does not exist, create a new one
        const newPartyId = parties.length > 0 ? Math.max(...parties.map(p => p.partyId)) + 1 : 1;
        party = {
          partyId: newPartyId,
          partyName,
          products: products.map(p => ({
            productId: parseInt(p.productId),
            tanch: parseFloat(p.tanch) || 0,
            wastage: parseFloat(p.wastage) || 0,
          })),
        };
        parties.push(party);
      }

      writeParties(parties);

      res.status(201).json(party);
    } catch (error) {
      console.error('Error in POST /api/parties:', error);
      res.status(500).json({ message: 'Error writing parties data.' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { partyId, partyName, products } = req.body;
      
      if (!partyId || !partyName) {
        return res.status(400).json({ message: 'Missing required fields: partyId and partyName.' });
      }

      const parties = readParties();
      const partyIndex = parties.findIndex(p => p.partyId === parseInt(partyId));
      
      if (partyIndex === -1) {
        return res.status(404).json({ message: 'Party not found.' });
      }

      parties[partyIndex] = {
        ...parties[partyIndex],
        partyName,
        products: products ? products.map(p => ({
          productId: parseInt(p.productId),
          tanch: parseFloat(p.tanch) || 0,
          wastage: parseFloat(p.wastage) || 0,
        })) : parties[partyIndex].products
      };

      writeParties(parties);
      res.status(200).json(parties[partyIndex]);
    } catch (error) {
      console.error('Error in PUT /api/parties:', error);
      res.status(500).json({ message: 'Error updating party.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { partyId } = req.query;
      
      if (!partyId) {
        return res.status(400).json({ message: 'Missing partyId parameter.' });
      }

      const parties = readParties();
      const updatedParties = parties.filter(p => p.partyId !== parseInt(partyId));
      
      if (updatedParties.length === parties.length) {
        return res.status(404).json({ message: 'Party not found.' });
      }

      writeParties(updatedParties);
      res.status(200).json({ message: 'Party deleted successfully.' });
    } catch (error) {
      console.error('Error in DELETE /api/parties:', error);
      res.status(500).json({ message: 'Error deleting party.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}