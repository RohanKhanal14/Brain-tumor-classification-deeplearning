FROM node:18-alpine AS node-base

# Python stage with Miniconda - use specific Python version
FROM continuumio/miniconda3:latest AS python-base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create conda environment with Python 3.10 (compatible with TensorFlow 2.15)
RUN conda create -n myenv python=3.10 -y

# Activate environment and install packages
SHELL ["conda", "run", "-n", "myenv", "/bin/bash", "-c"]
RUN conda install -c conda-forge \
    tensorflow=2.15.0 \
    numpy \
    opencv \
    pillow \
    && conda clean -afy

# Final stage combining Node.js and Python
FROM node:18-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Miniconda from python-base
COPY --from=python-base /opt/conda /opt/conda

# Set up conda environment
ENV PATH="/opt/conda/bin:$PATH"
ENV CONDA_DEFAULT_ENV="myenv"
ENV CONDA_PREFIX="/opt/conda/envs/myenv"
ENV PATH="/opt/conda/envs/myenv/bin:$PATH"

# Set work directory
WORKDIR /app

# Copy package files and install Node.js dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p uploads/profiles uploads/temp

# Set permissions
RUN chmod +x brain_tumour_detection_using_deep_learning.py

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nodejs

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Set Python path to use conda environment
ENV PYTHON_PATH="/opt/conda/envs/myenv/bin/python"

# Start the application
CMD ["npm", "start"]