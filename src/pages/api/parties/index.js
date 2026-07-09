import fs from 'fs';
import path from 'path';

const dataDir = 'C:\\entry-book';
const partyDir = path.join(dataDir, 'PARTY');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(partyDir)) {
  fs.mkdirSync(partyDir, { recursive: true });
}

function getPartyFilePath(partyName) {
  const safeName = partyName.replace(/[\\/:*?"<>|]/g, '_');
  return path.join(partyDir, `${safeName}.json`);
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
          entries: [],
        };
      }

      fs.writeFileSync(getPartyFilePath(party.partyName), JSON.stringify(party, null, 2));

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
      const oldParty = parties.find(p => p.partyId === parseInt(partyId));
      
      if (!oldParty) {
        return res.status(404).json({ message: 'Party not found.' });
      }

      // If the name changed, delete/rename the old file to avoid duplicates
      if (oldParty.partyName.toLowerCase() !== partyName.toLowerCase()) {
        const oldPath = getPartyFilePath(oldParty.partyName);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const updatedParty = {
        ...oldParty,
        partyName,
        products: products ? products.map(p => ({
          productId: parseInt(p.productId),
          tanch: parseFloat(p.tanch) || 0,
          wastage: parseFloat(p.wastage) || 0,
        })) : oldParty.products,
        entries: oldParty.entries || []
      };

      fs.writeFileSync(getPartyFilePath(partyName), JSON.stringify(updatedParty, null, 2));
      res.status(200).json(updatedParty);
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
      const party = parties.find(p => p.partyId === parseInt(partyId));
      
      if (!party) {
        return res.status(404).json({ message: 'Party not found.' });
      }

      const filePath = getPartyFilePath(party.partyName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

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