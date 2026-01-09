import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // Pet operations
    searchPets: (searchTerm) => ipcRenderer.invoke('pets:search', searchTerm),
    getAllPets: () => ipcRenderer.invoke('pets:getAll'),
    getPetById: (id) => ipcRenderer.invoke('pets:getById', id),
    createPet: (petData) => ipcRenderer.invoke('pets:create', petData),
    updatePet: (id, petData) => ipcRenderer.invoke('pets:update', id, petData),
    deletePet: (id) => ipcRenderer.invoke('pets:delete', id),
    getRecordNumbers: () => ipcRenderer.invoke('pets:getRecordNumbers'),
    
    // Grooming record operations
    createGroomingRecord: (recordData) => ipcRenderer.invoke('grooming:create', recordData),
    updateGroomingRecord: (id, recordData) => ipcRenderer.invoke('grooming:update', id, recordData),
    deleteGroomingRecord: (id) => ipcRenderer.invoke('grooming:delete', id),
});