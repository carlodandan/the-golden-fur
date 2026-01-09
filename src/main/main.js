import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import DatabaseManager from '../database/db';
const { updateElectronApp } = require('update-electron-app');

let mainWindow;
let dbManager;

if (require('electron-squirrel-startup')) app.quit();

// Updater
updateElectronApp();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        minWidth: 1200,
        minHeight: 800,
        backgroundColor: '#E17100',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: true,
            sandbox: true
        },
        icon: path.join(__dirname, '../../icons/goldenfur.ico'),
        titleBarStyle: 'default'
    });

     // Load the app
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/src/index.html'));
    }

    // Use this event to display the window cleanly
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
    mainWindow.focus();
  });
}

app.whenReady().then(() => {
    dbManager = new DatabaseManager();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        dbManager.close();
        app.quit();
    }
});

// IPC Handlers for Pets
ipcMain.handle('pets:search', async (event, searchTerm) => {
    try {
        const results = dbManager.searchPets(searchTerm);
        
        // Get grooming records for each pet
        const petsWithRecords = results.map(pet => {
            const records = dbManager.getGroomingRecordsByPetId(pet.id);
            return { ...pet, records };
        });
        
        return petsWithRecords;
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
});

ipcMain.handle('pets:getAll', async () => {
    try {
        const pets = dbManager.getAllPets();
        const petsWithRecords = pets.map(pet => {
            const records = dbManager.getGroomingRecordsByPetId(pet.id);
            return { ...pet, records };
        });
        return petsWithRecords;
    } catch (error) {
        console.error('Get all pets error:', error);
        throw error;
    }
});

ipcMain.handle('pets:getById', async (event, id) => {
    try {
        const pet = dbManager.getPetById(id);
        if (pet) {
            const records = dbManager.getGroomingRecordsByPetId(id);
            return { ...pet, records };
        }
        return null;
    } catch (error) {
        console.error('Get pet by ID error:', error);
        throw error;
    }
});

ipcMain.handle('pets:create', async (event, petData) => {
    try {
        const result = dbManager.createPet(petData);
        return { id: result.lastInsertRowid, ...petData };
    } catch (error) {
        console.error('Create pet error:', error);
        throw error;
    }
});

ipcMain.handle('pets:update', async (event, id, petData) => {
    try {
        dbManager.updatePet(id, petData);
        return { id, ...petData };
    } catch (error) {
        console.error('Update pet error:', error);
        throw error;
    }
});

ipcMain.handle('pets:delete', async (event, id) => {
    try {
        dbManager.deletePet(id);
        return { success: true };
    } catch (error) {
        console.error('Delete pet error:', error);
        throw error;
    }
});

// IPC Handlers for Grooming Records
ipcMain.handle('grooming:delete', async (event, id) => {
    try {
        dbManager.deleteGroomingRecord(id);
        return { success: true };
    } catch (error) {
        console.error('Delete grooming record error:', error);
        throw error;
    }
});

// Update the createGroomingRecord handler
ipcMain.handle('grooming:create', async (event, recordData) => {
    try {
        return dbManager.createGroomingRecord(recordData);
    } catch (error) {
        console.error('Create grooming record error:', error);
        throw error;
    }
});

ipcMain.handle('grooming:update', async (event, id, recordData) => {
    try {
        return dbManager.updateGroomingRecord(id, recordData);
    } catch (error) {
        console.error('Update grooming record error:', error);
        throw error;
    }
});


// Add this IPC handler in the main process file
ipcMain.handle('pets:getRecordNumbers', async () => {
  try {
    return dbManager.getRecordNumbers();
  } catch (error) {
    console.error('Get record numbers error:', error);
    return [];
  }
});