const express = require('express');
const youtubedl = require('youtube-dl-exec');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Store download information
const downloads = new Map();

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Download endpoint
app.post('/download', async (req, res) => {
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
        // Start download
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

        // Clean up old files (older than 1 hour)
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
app.get('/file/:id', (req, res) => {
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

// Start server
app.listen(PORT, () => {
    console.log(`YouTube Downloader server running on http://localhost:${PORT}`);
});
