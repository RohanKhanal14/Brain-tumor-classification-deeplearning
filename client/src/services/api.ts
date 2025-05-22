// API service for communication with the backend

const API_URL = 'http://localhost:8000';

// Type definitions
type UploadResponse = {
  success: boolean;
  message: string;
  filename?: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  userType: string;
  organization?: string;
  location?: string;
  avatar?: string;
};

type AuthResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
};

type PatientData = {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  scanDate?: string;
};

export type AnalysisResult = {
  message?: string;
  result?: {
    prediction: string;
    confidence: number;
    // Other properties returned by the model
  };
  resultId?: string;
  _id?: string;
  timestamp?: string;
  prediction?: string;
  confidence?: number;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  scanDate?: string;
  originalImage?: string;
  patientData?: PatientData;
};

/**
 * Upload a file with progress tracking
 */
export const uploadFileWithProgress = (
  file: File, 
  onProgress?: (percent: number) => void,
  onComplete?: (response: UploadResponse) => void,
  onError?: (error: Error) => void
) => {
  return new Promise<string>((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    
    // Check if file is an image
    if (!file.type.includes("image")) {
      reject(new Error('Please upload a valid MRI image file'));
      return;
    }

    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append('image', file);

    // Use XMLHttpRequest to track real upload progress
    const xhr = new XMLHttpRequest();
    
    // Set up progress tracking
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        if (onProgress) {
          onProgress(percentComplete);
        }
        console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('Upload completed successfully');
        const response = JSON.parse(xhr.responseText);
        if (onComplete) {
          onComplete(response);
        }
        resolve(response.filename || 'uploaded');
      } else {
        console.error('Upload failed', xhr.statusText);
        const error = new Error(`Upload failed: ${xhr.statusText}`);
        if (onError) {
          onError(error);
        }
        reject(error);
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      console.error('Upload failed due to network error');
      const error = new Error('Network error occurred during upload');
      if (onError) {
        onError(error);
      }
      reject(error);
    });

    // Open and send the request
    xhr.open('POST', `${API_URL}/api/upload-temp`, true);
    xhr.send(formData);
  });
};

/**
 * Submit an MRI scan for analysis along with patient information
 */
export const analyzeMRI = async (file: File, patientData: PatientData): Promise<AnalysisResult> => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const formData = new FormData();
  
  // Add the image file
  formData.append('image', file);
  
  // Add patient information
  if (patientData.patientName) formData.append('patientName', patientData.patientName);
  if (patientData.patientAge) formData.append('patientAge', patientData.patientAge);
  if (patientData.patientGender) formData.append('patientGender', patientData.patientGender);
  if (patientData.scanDate) formData.append('scanDate', patientData.scanDate);
  
  // Make the API request
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Get all analysis results for the authenticated user
 */
export const getResults = async (): Promise<AnalysisResult[]> => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/api/results`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Get a specific analysis result by ID
 */
export const getResultById = async (id: string): Promise<AnalysisResult> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/api/results/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Register a new user
 */
export const register = async (name: string, email: string, password: string, userType: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      email,
      password,
      userType
    })
  });

  return response.json();
};

/**
 * Login a user
 */
export const login = async (email: string, password: string, rememberMe: boolean): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json();
  
  if (data.success && data.token) {
    // Store the token in localStorage or sessionStorage based on rememberMe
    if (rememberMe) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
    }
  }
  
  return data;
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    return { 
      success: false, 
      message: 'No authentication token found' 
    };
  }
  
  const response = await fetch(`${API_URL}/api/auth/user`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};

/**
 * Check if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
};

/**
 * Logout the current user
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData: {
  fullName?: string;
  email?: string;
  organization?: string;
  location?: string;
}): Promise<any> => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_URL}/api/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (file: File): Promise<any> => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await fetch(`${API_URL}/api/profile/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Get user profile
 */
export const getProfile = async (): Promise<any> => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_URL}/api/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};
