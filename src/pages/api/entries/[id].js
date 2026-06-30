import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'entries.json');

function readEntries() {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function writeEntries(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  const { id } = req.query;
  const entries = readEntries();
  const entryIndex = entries.findIndex(e => e.id === parseInt(id));

  if (entryIndex === -1) {
    return res.status(404).json({ message: 'Entry not found.' });
  }

  if (req.method === 'GET') {
    res.status(200).json(entries[entryIndex]);
  } else if (req.method === 'PUT') {
    try {
      const updatedEntry = {
        ...entries[entryIndex],
        ...req.body,
        id: parseInt(id), // Ensure ID remains the same and is a number
      };
      entries[entryIndex] = updatedEntry;
      writeEntries(entries);
      res.status(200).json(updatedEntry);
    } catch (error) {
      res.status(500).json({ message: 'Error updating entry.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [deletedEntry] = entries.splice(entryIndex, 1);
      writeEntries(entries);
      res.status(200).json({ message: 'Entry deleted successfully.', deletedEntry });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting entry.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}