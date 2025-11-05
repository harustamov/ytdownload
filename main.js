const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const express = require('express');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let mainWindow;
let server;
const PORT = 3000;

// Create downloads directory
const downloadsDir = path.join(app.getPath('userData'), 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
}

// Store download information
const downloads = new Map();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
    });

    // Load the app
    mainWindow.loadURL(`http://localhost:${PORT}`);

    // Open DevTools in development mode
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function startServer() {
    const expressApp = express();

    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));
    expressApp.use(express.static(path.join(__dirname, 'public')));

    // Download endpoint
    expressApp.post('/download', async (req, res) => {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Validate YouTube URL
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        if (!youtubeRegex.test(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const downloadId = uuidv4();
        const outputPath = path.join(downloadsDir, `${downloadId}.%(ext)s`);

        try {
            console.log(`Starting download for: ${url}`);

            const output = await youtubedl(url, {
                output: outputPath,
                format: 'best[ext=mp4]/best',
                noPlaylist: true,
            });

            // Find the downloaded file
            const files = fs.readdirSync(downloadsDir);
            const downloadedFile = files.find(file => file.startsWith(downloadId));

            if (!downloadedFile) {
                throw new Error('Downloaded file not found');
            }

            const fullPath = path.join(downloadsDir, downloadedFile);
            const stats = fs.statSync(fullPath);

            // Store download info
            downloads.set(downloadId, {
                filename: downloadedFile,
                path: fullPath,
                size: stats.size,
                timestamp: Date.now()
            });

            // Clean up old files
            cleanupOldFiles();

            res.json({
                success: true,
                downloadId: downloadId,
                filename: downloadedFile,
                size: stats.size,
                downloadUrl: `/file/${downloadId}`
            });

        } catch (error) {
            console.error('Download error:', error);
            res.status(500).json({
                error: 'Failed to download video',
                details: error.message
            });
        }
    });

    // Serve downloaded file
    expressApp.get('/file/:id', (req, res) => {
        const downloadId = req.params.id;
        const downloadInfo = downloads.get(downloadId);

        if (!downloadInfo || !fs.existsSync(downloadInfo.path)) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.download(downloadInfo.path, downloadInfo.filename, (err) => {
            if (err) {
                console.error('Error sending file:', err);
            }
        });
    });

    server = expressApp.listen(PORT, 'localhost', () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Clean up files older than 1 hour
function cleanupOldFiles() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    downloads.forEach((info, id) => {
        if (now - info.timestamp > oneHour) {
            try {
                if (fs.existsSync(info.path)) {
                    fs.unlinkSync(info.path);
                }
                downloads.delete(id);
                console.log(`Cleaned up old file: ${info.filename}`);
            } catch (error) {
                console.error(`Error cleaning up file ${info.filename}:`, error);
            }
        }
    });
}

// IPC handlers
ipcMain.handle('select-download-location', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    return result.filePaths[0];
});

ipcMain.handle('open-downloads-folder', () => {
    shell.openPath(downloadsDir);
});

// App lifecycle
app.whenReady().then(() => {
    startServer();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (server) {
            server.close();
        }
        app.quit();
    }
});

app.on('before-quit', () => {
    if (server) {
        server.close();
    }
});
