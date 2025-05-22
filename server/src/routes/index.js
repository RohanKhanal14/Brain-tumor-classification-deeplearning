const uploadRoutes = require('./uploadRoutes');
const analysisRoutes = require('./analysisRoutes');
const resultRoutes = require('./resultRoutes');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const staticRoutes = require('./staticRoutes');

/**
 * Register all application routes
 * @param {Express} app - Express application instance
 */
const registerRoutes = (app) => {
  app.use('/api', uploadRoutes);
  app.use('/api', analysisRoutes);
  app.use('/api', resultRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/', staticRoutes);
};

module.exports = registerRoutes;
