import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEYS = {
  PRODUCTS: 'entrybook_products',
  PARTIES: 'entrybook_parties'
};

const isMobile = Capacitor.isNativePlatform();

// Helper to get mobile data
const getMobileData = async (key, defaultValue = []) => {
  try {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.error('Error reading from Preferences:', e);
    return defaultValue;
  }
};

const setMobileData = async (key, value) => {
  try {
    await Preferences.set({ key, value: JSON.stringify(value) });
  } catch (e) {
    console.error('Error writing to Preferences:', e);
  }
};

// --- PRODUCTS ---
export const getProducts = async () => {
  if (isMobile) {
    return await getMobileData(STORAGE_KEYS.PRODUCTS);
  } else {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  }
};

export const addProduct = async (productName) => {
  if (isMobile) {
    const products = await getMobileData(STORAGE_KEYS.PRODUCTS);
    const newProductId = products.length > 0 ? Math.max(...products.map(p => p.productId)) + 1 : 1;
    const newProduct = {
      productId: newProductId,
      productName,
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString()
    };
    products.push(newProduct);
    await setMobileData(STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  } else {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName }),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  }
};

export const deleteProduct = async (productId) => {
  if (isMobile) {
    let products = await getMobileData(STORAGE_KEYS.PRODUCTS);
    products = products.filter(p => p.productId !== parseInt(productId));
    await setMobileData(STORAGE_KEYS.PRODUCTS, products);
    return true;
  } else {
    const res = await fetch(`/api/products?productId=${productId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    return true;
  }
};

// --- PARTIES ---
export const getParties = async () => {
  if (isMobile) {
    return await getMobileData(STORAGE_KEYS.PARTIES);
  } else {
    const res = await fetch('/api/parties');
    if (!res.ok) throw new Error('Failed to fetch parties');
    return await res.json();
  }
};

export const addParty = async (partyData) => {
  if (isMobile) {
    const parties = await getMobileData(STORAGE_KEYS.PARTIES);
    const newPartyId = parties.length > 0 ? Math.max(...parties.map(p => p.partyId)) + 1 : 1;
    const newParty = {
      partyId: newPartyId,
      partyName: partyData.partyName,
      partyType: partyData.partyType,
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString(),
      entries: []
    };
    parties.push(newParty);
    await setMobileData(STORAGE_KEYS.PARTIES, parties);
    return newParty;
  } else {
    const res = await fetch('/api/parties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partyData),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  }
};

export const updateParty = async (partyId, partyData) => {
  if (isMobile) {
    const parties = await getMobileData(STORAGE_KEYS.PARTIES);
    const index = parties.findIndex(p => p.partyId === parseInt(partyId));
    if (index !== -1) {
      parties[index] = { ...parties[index], ...partyData, modifiedOn: new Date().toISOString() };
      await setMobileData(STORAGE_KEYS.PARTIES, parties);
      return parties[index];
    }
    throw new Error("Party not found");
  } else {
    const res = await fetch(`/api/parties?partyId=${partyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partyData),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  }
};

export const deleteParty = async (partyId) => {
  if (isMobile) {
    let parties = await getMobileData(STORAGE_KEYS.PARTIES);
    parties = parties.filter(p => p.partyId !== parseInt(partyId));
    await setMobileData(STORAGE_KEYS.PARTIES, parties);
    return true;
  } else {
    const res = await fetch(`/api/parties?partyId=${partyId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    return true;
  }
};

// --- ENTRIES ---
export const getEntries = async () => {
  if (isMobile) {
    const parties = await getMobileData(STORAGE_KEYS.PARTIES);
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
    return allEntries;
  } else {
    const res = await fetch('/api/entries');
    if (!res.ok) throw new Error('Failed to fetch entries');
    return await res.json();
  }
};

export const addEntry = async (entryData) => {
  if (isMobile) {
    const { partyId, productId, netWeight, tanch, wastage } = entryData;
    const parties = await getMobileData(STORAGE_KEYS.PARTIES);
    const products = await getMobileData(STORAGE_KEYS.PRODUCTS);
    
    const party = parties.find(p => p.partyId === parseInt(partyId));
    const product = products.find(p => p.productId === parseInt(productId));
    if (!party || !product) throw new Error('Party or Product not found.');
    
    const newEntryId = (party.entries && party.entries.length > 0) ? Math.max(...party.entries.map(e => e.entryDataId)) + 1 : 1;
    const calculatedValue = (parseFloat(netWeight) * (parseFloat(tanch) + parseFloat(wastage))) / 100;
    
    const newEntry = {
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
    
    if (!party.entries) party.entries = [];
    party.entries.push(newEntry);
    await setMobileData(STORAGE_KEYS.PARTIES, parties);
    
    return {
      ...newEntry,
      partyId: party.partyId,
      partyName: party.partyName
    };
  } else {
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  }
};

export const updateEntry = async (entryDataId, partyId, entryData) => {
  if (isMobile) {
    const parties = await getMobileData(STORAGE_KEYS.PARTIES);
    const partyIndex = parties.findIndex(p => p.partyId === parseInt(partyId));
    if (partyIndex === -1) throw new Error('Party not found');
    
    const party = parties[partyIndex];
    if (!party.entries) party.entries = [];
    
    const entryIndex = party.entries.findIndex(e => e.entryDataId === parseInt(entryDataId));
    if (entryIndex === -1) throw new Error('Entry not found');
    
    const { productId, netWeight, tanch, wastage } = entryData;
    const products = await getMobileData(STORAGE_KEYS.PRODUCTS);
    const product = products.find(p => p.productId === parseInt(productId));
    if (!product) throw new Error('Product not found');
    
    const calculatedValue = (parseFloat(netWeight) * (parseFloat(tanch) + parseFloat(wastage))) / 100;
    
    party.entries[entryIndex] = {
      ...party.entries[entryIndex],
      productId: parseInt(productId),
      productName: product.productName,
      tanch: parseFloat(tanch) || 0,
      netWeight: parseFloat(netWeight),
      wastage: parseFloat(wastage) || 0,
      calculatedValue,
      modifiedOn: new Date().toISOString(),
    };
    await setMobileData(STORAGE_KEYS.PARTIES, parties);
    
    return {
      ...party.entries[entryIndex],
      partyId: party.partyId,
      partyName: party.partyName
    };
  } else {
    const res = await fetch(`/api/entries/${entryDataId}?partyId=${partyId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  }
};

export const deleteEntry = async (entryDataId, partyId) => {
  if (isMobile) {
    const parties = await getMobileData(STORAGE_KEYS.PARTIES);
    const partyIndex = parties.findIndex(p => p.partyId === parseInt(partyId));
    if (partyIndex === -1) throw new Error('Party not found');
    
    const party = parties[partyIndex];
    if (party.entries) {
      party.entries = party.entries.filter(e => e.entryDataId !== parseInt(entryDataId));
      await setMobileData(STORAGE_KEYS.PARTIES, parties);
    }
    return true;
  } else {
    const res = await fetch(`/api/entries/${entryDataId}?partyId=${partyId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    return true;
  }
};
