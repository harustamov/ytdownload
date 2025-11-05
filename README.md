# YouTube Video Downloader

A simple web application that allows users to download YouTube videos by entering a URL.

## Features

- Simple and intuitive web interface
- Download YouTube videos in MP4 format
- Automatic file cleanup (files older than 1 hour are removed)
- Responsive design
- Real-time download status

## Prerequisites

Before running this application, you need to have:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- yt-dlp installed on your system

### Installing yt-dlp

**Linux/macOS:**
```bash
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

Or using pip:
```bash
pip install yt-dlp
```

**Windows:**
Download the latest yt-dlp.exe from [yt-dlp releases](https://github.com/yt-dlp/yt-dlp/releases) and add it to your PATH.

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd ytdownload
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Enter a YouTube URL and click "Download Video"

4. Once the download is complete, click the download link to save the video to your device

## How It Works

1. User enters a YouTube URL in the web interface
2. The server validates the URL and initiates the download using yt-dlp
3. The video is downloaded to the server's `downloads` directory
4. A unique download link is generated and sent back to the user
5. User can click the link to download the video file
6. Files are automatically cleaned up after 1 hour

## Configuration

You can customize the following settings in `server.js`:

- `PORT`: Server port (default: 3000)
- Cleanup interval: Modify the `oneHour` variable in the `cleanupOldFiles` function
- Video format: Change the `format` option in the `/download` endpoint

## Notes

- Downloaded files are stored temporarily and automatically deleted after 1 hour
- The application downloads the best available quality in MP4 format
- Large videos may take several minutes to download
- Make sure you have sufficient disk space for temporary file storage

## License

MIT
