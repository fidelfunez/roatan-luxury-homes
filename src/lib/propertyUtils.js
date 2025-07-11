import React from 'react';

const LOCAL_STORAGE_KEY = 'caribbeanLuxRealty_properties';

export const getProperties = () => {
  try {
    const storedProperties = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedProperties) {
      return JSON.parse(storedProperties);
    } else {
      // Return empty array instead of mock data
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
  } catch (error) {
    console.error("Error reading properties from localStorage:", error);
    return []; 
  }
};

export const getPropertyById = (id) => {
  const numericId = parseInt(id, 10);
  const properties = getProperties();
  return properties.find(p => p.id === numericId);
};

export const addProperty = (newPropertyData) => {
  const properties = getProperties();
  const maxId = properties.reduce((max, p) => p.id > max ? p.id : max, 0);
  const newProperty = {
    ...newPropertyData,
    id: maxId + 1,
  };
  const updatedProperties = [...properties, newProperty];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProperties));
  return newProperty;
};

export const updateProperty = (propertyId, updatedData) => {
  const properties = getProperties();
  const numericId = parseInt(propertyId, 10);
  const updatedProperties = properties.map(p => 
    p.id === numericId ? { ...p, ...updatedData, id: numericId } : p
  );
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProperties));
  return updatedProperties.find(p => p.id === numericId);
};

export const deleteProperty = (propertyId) => {
  const properties = getProperties();
  const numericId = parseInt(propertyId, 10);
  const propertyToDelete = properties.find(p => p.id === numericId);
  
  if (!propertyToDelete) {
    console.error(`Property with ID ${propertyId} not found`);
    return false;
  }

  // Calculate approximate image sizes for logging
  const mainImageSize = propertyToDelete.image ? Math.round(propertyToDelete.image.length * 0.75 / 1024) : 0;
  const galleryImageSizes = propertyToDelete.images ? propertyToDelete.images.map(img => Math.round(img.length * 0.75 / 1024)) : [];
  const totalGallerySize = galleryImageSizes.reduce((sum, size) => sum + size, 0);
  const totalImageSize = mainImageSize + totalGallerySize;

  const updatedProperties = properties.filter(p => p.id !== numericId);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProperties));

  // Log cleanup for transparency
  if (totalImageSize > 0) {
    console.log(`Property "${propertyToDelete.title}" deleted. Image data (~${totalImageSize}KB) has been removed from storage.`);
  }

  return true;
};