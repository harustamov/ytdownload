# YouTube Video Downloader

A cross-platform desktop application built with Electron that allows users to download YouTube videos by entering a URL.

## Features

- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Simple Interface**: Clean, intuitive UI with modern design
- **High Quality**: Downloads the best available quality in MP4 format
- **File Management**: Built-in downloads folder management
- **Auto Cleanup**: Automatically removes files older than 1 hour
- **Real-time Status**: Live download progress and status updates
- **Secure**: Built with Electron's security best practices

## Download

### Pre-built Binaries

Download the latest release for your platform from the [Releases](https://github.com/your-username/ytdownload/releases) page:

- **Windows**: `.exe` installer or portable version
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage`, `.deb`, or `.rpm` packages

### Build from Source

See the [Building](#building) section below.

## Prerequisites

### For Running the App

The application comes bundled with all necessary dependencies except `yt-dlp`, which needs to be installed on your system.

### Installing yt-dlp

**Linux:**
```bash
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

Or using pip:
```bash
pip install yt-dlp
```

**macOS:**
```bash
brew install yt-dlp
```

**Windows:**
```bash
choco install yt-dlp
```

Or download the latest `yt-dlp.exe` from [yt-dlp releases](https://github.com/yt-dlp/yt-dlp/releases) and add it to your PATH.

## Building

### Prerequisites for Building

- Node.js 18 or higher
- npm (Node Package Manager)
- yt-dlp installed on your system

### Development Setup

1. Clone this repository:
```bash
git clone <repository-url>
cd ytdownload
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run dev
```

### Building Executables

Build for your current platform:
```bash
npm run build
```

Build for specific platforms:
```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
npm run build:all    # All platforms
```

Build output will be in the `dist/` directory.

## Usage

1. Launch the application
2. Enter a YouTube URL in the input field
3. Click "Download Video"
4. Wait for the download to complete
5. Click the download link to save the video to your device
6. Use "Open Downloads Folder" to access all downloaded files

## CI/CD Pipeline

This project includes a comprehensive GitHub Actions workflow that:

- **Automated Builds**: Builds for Windows, macOS, and Linux on every push
- **Multi-Platform**: Uses matrix strategy for parallel builds
- **Artifact Storage**: Uploads build artifacts for each platform
- **Auto Release**: Creates GitHub releases on version tags
- **Quality Checks**: Installs yt-dlp and validates builds

### Triggering Builds

- **Push to main/master**: Builds all platforms
- **Pull Requests**: Builds and tests changes
- **Tags (v*)**: Creates a release with binaries
- **Manual**: Use "Run workflow" in GitHub Actions

### Creating a Release

1. Update version in `package.json`
2. Commit changes
3. Create and push a tag:
```bash
git tag v1.0.0
git push origin v1.0.0
```
4. GitHub Actions will automatically build and create a release

## Project Structure

```
ytdownload/
├── main.js              # Electron main process
├── preload.js           # Preload script for IPC
├── server.js            # Express server (embedded)
├── package.json         # Dependencies and build config
├── public/
│   └── index.html       # Frontend UI
├── assets/
│   ├── icon.png         # Linux icon
│   ├── icon.icns        # macOS icon
│   └── icon.ico         # Windows icon
├── .github/
│   └── workflows/
│       └── build.yml    # CI/CD pipeline
└── dist/                # Build output (gitignored)
```

## Architecture

- **Electron Main Process**: Manages window lifecycle and native features
- **Express Server**: Handles download requests (localhost only)
- **youtube-dl-exec**: Node.js wrapper for yt-dlp
- **Renderer Process**: User interface with modern HTML/CSS/JS

## Configuration

### Download Settings

Edit `main.js` to customize:
- Download directory location
- Cleanup interval (default: 1 hour)
- Video format preferences

### Server Settings

Edit `main.js` to change:
- Server port (default: 3000)
- Download options for yt-dlp

## Security

- Context isolation enabled
- Node integration disabled in renderer
- Preload script for secure IPC
- Server binds to localhost only
- CSP headers recommended for production

## Troubleshooting

### yt-dlp not found
Make sure yt-dlp is installed and in your PATH. Test with:
```bash
yt-dlp --version
```

### Build fails on macOS
You may need to install Xcode Command Line Tools:
```bash
xcode-select --install
```

### Linux AppImage not running
Make the file executable:
```bash
chmod +x YouTube-Downloader-*.AppImage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Disclaimer

This tool is for personal use only. Please respect YouTube's Terms of Service and copyright laws. Only download videos you have the right to download.
