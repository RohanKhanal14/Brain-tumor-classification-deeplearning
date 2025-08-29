# 🧠 Mastishka - Brain Tumor Analysis Application

[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange?logo=tensorflow)](https://tensorflow.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb)](https://mongodb.com/)

**Mastishka** is an advanced AI-powered medical imaging application that uses deep learning to detect and classify brain tumors from MRI scans with **97.25% accuracy**. The application provides healthcare professionals with rapid, reliable diagnostic assistance for identifying Glioma, Meningioma, and Pituitary tumors.

## 🌟 Features

### 🏥 **Medical Capabilities**
- **AI-Powered Diagnosis**: Deep learning model with 97.25% accuracy
- **Multi-Class Detection**: Identifies Glioma, Meningioma, Pituitary, and No Tumor cases
- **Real-time Analysis**: Instant results from MRI scan uploads
- **Confidence Scoring**: Provides prediction confidence levels
- **Medical History**: Stores and tracks previous analyses

### 👥 **User Management**
- **Role-Based Access**: Healthcare providers and patients
- **Secure Authentication**: JWT-based authentication system
- **Profile Management**: User profiles with avatar uploads
- **Organization Support**: Healthcare institution integration

### 📊 **Dashboard & Analytics**
- **Interactive Dashboard**: Real-time statistics and insights
- **Result History**: Comprehensive analysis tracking
- **Performance Metrics**: Detailed model performance data
- **Export Capabilities**: Download results and reports

```
Brain-tumor-classification-deeplearning/
├── 📱 client/                    # React Frontend Application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── ui/              # Shadcn/ui components
│   │   │   ├── Navbar.tsx       # Navigation component
│   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   ├── UserProfile.tsx  # User profile management
│   │   │   └── ModelStats.tsx   # Model performance display
│   │   ├── context/             # React context providers
│   │   │   └── AuthContext.tsx  # Authentication context
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Page components
│   │   │   ├── Analysis.tsx     # MRI analysis interface
│   │   │   ├── Dashboard.tsx    # User dashboard
│   │   │   ├── Login.tsx        # Authentication
│   │   │   ├── About.tsx        # Model information
│   │   │   └── Profile.tsx      # User profile
│   │   ├── services/            # API communication
│   │   │   └── api.ts          # API service layer
│   │   └── lib/                 # Utility libraries
│   └── package.json
├── 🖥️ server/                    # Node.js Backend Server
│   ├── brain_tumor_model.keras  # Pre-trained ML model (97.25% accuracy)
│   ├── brain_tumour_detection_using_deep_learning.py  # Python ML inference
│   ├── class_labels.json        # Tumor classification labels
│   ├── server.js                # Main server entry point
│   ├── src/
│   │   ├── controllers/         # Business logic controllers
│   │   │   ├── analysisController.js   # MRI analysis logic
│   │   │   ├── authController.js       # Authentication logic
│   │   │   ├── resultController.js     # Results management
│   │   │   └── uploadController.js     # File upload handling
│   │   ├── models/              # Database schemas
│   │   │   ├── User.js          # User model
│   │   │   └── Result.js        # Analysis result model
│   │   ├── routes/              # API route definitions
│   │   │   ├── analysisRoutes.js       # Analysis endpoints
│   │   │   ├── authRoutes.js           # Authentication endpoints
│   │   │   ├── profileRoutes.js        # Profile management
│   │   │   ├── resultRoutes.js         # Results endpoints
│   │   │   └── uploadRoutes.js         # Upload endpoints
│   │   └── middleware/          # Express middleware
│   │       ├── auth.js          # Authentication middleware
│   │       └── upload.js        # File upload middleware
│   ├── uploads/                 # File storage
│   │   ├── profiles/            # User profile images
│   │   └── temp/                # Temporary MRI uploads
│   └── package.json
└── README.md
```

## 🤖 AI Model Performance

### **Overall Metrics**
- **Accuracy**: 97.25%
- **Precision**: 97.29% (weighted)
- **Recall**: 97.25% (weighted)
- **F1-Score**: 97.26% (weighted)

### **Class-Specific Performance**
| Tumor Type | Precision | Recall | F1-Score | Test Samples |
|------------|-----------|--------|----------|--------------|
| Meningioma | 93.0%     | 97.0%  | 95.0%    | 306          |
| Glioma     | 98.0%     | 94.0%  | 96.0%    | 300          |
| No Tumor   | 99.0%     | 99.0%  | 99.0%    | 405          |
| Pituitary  | 98.0%     | 98.0%  | 98.0%    | 300          |

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher
- **Python** 3.8+ with TensorFlow
- **MongoDB** 6.x
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/RohanKhanal14/Brain-tumor-classification-deeplearning.git
cd Brain-tumor-classification-deeplearning
```

### 2. Download the Trained Model

https://drive.google.com/file/d/1mlivNqo7_F151JQZv-W4uNDFHTqxN-eX/view?usp=sharing

### and copy the ( model brain_tumor_model.keras ) inside the server directory. 

### 3. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
# Replace the python path with your devices python path 

# Start the server
npm run dev
```

### 4. Frontend Setup
```bash
# Navigate to client directory (in a new terminal)
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT = 8000

# Database
MONGO_URL = mongodb+srv://root:toor@cluster0.2k72ozv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Python Path
PYTHON_PATH = /home/rohan/anaconda3/bin/

```

## 📡 API Documentation

### Authentication Endpoints
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/user         # Get current user
POST /api/auth/logout       # User logout
```

### Analysis Endpoints
```
POST /api/upload-temp       # Upload MRI scan
POST /api/analyze           # Analyze uploaded scan
GET  /api/results          # Get analysis history
GET  /api/results/:id      # Get specific result
DELETE /api/results/:id    # Delete analysis result
```

### Profile Endpoints
```
GET  /api/profile          # Get user profile
PUT  /api/profile          # Update user profile
POST /api/profile/avatar   # Upload profile picture
```

### File Endpoints
```
GET /uploads/profiles/:filename    # Get profile images
GET /uploads/temp/:filename        # Get temporary files
```