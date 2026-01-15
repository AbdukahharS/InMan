# InMan - Inventory Management System

Cross-platform desktop application for inventory management, built with Nextron (Next.js + Electron).

## About

InMan is a desktop inventory management system designed for businesses that need to manage:
- Suppliers
- Warehouse and intake operations
- Customers
- Sales and orders

## Tech Stack

- Nextron (Next.js + Electron)
- React 18
- TypeScript
- Tailwind CSS
- Radix UI (headless components)
- Zustand (state management)
- PouchDB (local database)
- Electron Store (settings persistence)
- Lucide React (icons)

## Features

- **Supplier Management** - Add, edit, track suppliers
- **Warehouse Management** - Track inventory and intake
- **Customer Management** - Manage customer data
- **Sales Tracking** - Track orders and sales
- **Cross-Platform** - Runs on Windows, macOS, Linux
- **Offline Support** - Local PouchDB database
- **Print Support** - Generate printable documents
- **Dark Mode** - Theme support

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdukahharS/InMan
cd InMan

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Build for specific platform
npm run build:win32    # Windows 32-bit
npm run build:win64    # Windows 64-bit
```

## Project Structure

```
app/
├── background.js         # Electron background process
├── renderer/             # Next.js renderer process
├── main/                 # Main process code
├── preload/              # Preload scripts
├── store/                # Electron store
public/                   # Static assets and icons
```

## Notes

This is a desktop application built with Electron. Unlike web apps, it has access to the file system and other system resources.

## Acknowledgements

- [Nextron](https://github.com/saltyshiomix/nextron) - Electron + Next.js integration
