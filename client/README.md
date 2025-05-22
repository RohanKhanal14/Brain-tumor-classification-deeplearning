# Brain Tumor Analysis Application

## Project Structure

This application consists of a client and server:

### Server Structure

The server follows the MVC (Model-View-Controller) architecture:

```
server/
├── brain_tumor_model.keras    # Pre-trained ML model
├── brain_tumour_detection_using_deep_learning.py  # Python script for ML inference
├── class_labels.json          # Labels for classification
├── package.json               # Node.js dependencies
├── server.js                  # Main server entry point
├── src/                       # Server source code
│   ├── controller/            # Controllers handle business logic
│   │   ├── analysisController.js  # Logic for MRI analysis
│   │   ├── resultController.js    # Logic for retrieving results
│   │   └── uploadController.js    # Logic for file uploads
│   ├── model/                 # Database models
│   │   └── Result.js          # Result schema and model
│   └── routes/                # API route definitions
│       ├── analysisRoutes.js  # Routes for analysis
│       ├── index.js           # Main router configuration
│       ├── resultRoutes.js    # Routes for retrieving results
│       ├── staticRoutes.js    # Routes for static assets
│       └── uploadRoutes.js    # Routes for file uploads
└── uploads/                   # Storage for uploaded MRI scans
    └── temp/                  # Temporary storage for uploads
```

### Client Structure

The client is a React application organized into components and services:

```
client/
├── public/                    # Static assets
└── src/                       # Source code
    ├── components/            # React components
    │   └── ui/                # UI components
    ├── hooks/                 # Custom React hooks
    ├── lib/                   # Utility libraries
    ├── pages/                 # Page components
    │   └── Analysis.tsx       # MRI analysis page
    ├── services/              # API service layer
    │   └── api.ts             # API communication
    └── utils/                 # Utility functions
```

## API Endpoints

- **POST /api/upload-temp**: Upload temporary files with progress tracking
- **POST /api/analyze**: Analyze an MRI scan
- **GET /api/results**: Get all previous analysis results
- **GET /api/results/:id**: Get a specific analysis result
- **GET /uploads/:filename**: Retrieve uploaded files

## Getting Started

1. Install server dependencies:
   ```
   cd server
   npm install
   ```

2. Install client dependencies:
   ```
   cd client
   npm install
   ```

3. Run the server:
   ```
   cd server
   npm start
   ```

4. Run the client:
   ```
   cd client
   npm run dev
   ```
