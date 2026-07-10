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
  const { id, partyId } = req.query;
  const parties = readParties();
  let targetParty = null;
  let entryIndex = -1;

  if (partyId) {
    targetParty = parties.find(p => p.partyId === parseInt(partyId));
    if (targetParty && targetParty.entries) {
      entryIndex = targetParty.entries.findIndex(e => e.entryDataId === parseInt(id));
    }
  } else {
    for (const party of parties) {
      if (party.entries) {
        const index = party.entries.findIndex(e => e.entryDataId === parseInt(id));
        if (index !== -1) {
          targetParty = party;
          entryIndex = index;
          break;
        }
      }
    }
  }

  if (entryIndex === -1) {
    return res.status(404).json({ message: 'Entry not found.' });
  }

  if (req.method === 'GET') {
    res.status(200).json({
      ...targetParty.entries[entryIndex],
      partyId: targetParty.partyId,
      partyName: targetParty.partyName
    });
  } else if (req.method === 'PATCH') {
    console.log('Received PATCH request for entry:', id);
    try {
      const currentEntry = targetParty.entries[entryIndex];
      const netWeight = req.body.netWeight !== undefined ? req.body.netWeight : currentEntry.netWeight;
      const tanch = req.body.tanch !== undefined ? req.body.tanch : currentEntry.tanch;
      const wastage = req.body.wastage !== undefined ? req.body.wastage : currentEntry.wastage;
      const calculatedValue = (parseFloat(netWeight) * (parseFloat(tanch) + parseFloat(wastage))) / 100;

      const updatedEntry = {
        ...currentEntry,
        ...req.body,
        entryDataId: parseInt(id),
        calculatedValue,
        modifiedOn: new Date().toISOString(),
      };

      // Since partyId or partyName shouldn't be saved in the entry array, delete them from req.body if they were passed
      delete updatedEntry.partyId;
      delete updatedEntry.partyName;

      targetParty.entries[entryIndex] = updatedEntry;

      const safeName = targetParty.partyName.replace(/[\\/:*?"<>|]/g, '_');
      const partyFile = path.join(partyDir, `${safeName}.json`);
      fs.writeFileSync(partyFile, JSON.stringify(targetParty, null, 2));

      res.status(200).json({
        ...updatedEntry,
        partyId: targetParty.partyId,
        partyName: targetParty.partyName
      });
    } catch (error) {
      console.error('Error in PATCH:', error);
      res.status(500).json({ message: 'Error updating entry.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [deletedEntry] = targetParty.entries.splice(entryIndex, 1);

      const safeName = targetParty.partyName.replace(/[\\/:*?"<>|]/g, '_');
      const partyFile = path.join(partyDir, `${safeName}.json`);
      fs.writeFileSync(partyFile, JSON.stringify(targetParty, null, 2));

      res.status(200).json({
        message: 'Entry deleted successfully.',
        deletedEntry: {
          ...deletedEntry,
          partyId: targetParty.partyId,
          partyName: targetParty.partyName
        }
      });
    } catch (error) {
      console.error('Error in DELETE:', error);
      res.status(500).json({ message: 'Error deleting entry.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}