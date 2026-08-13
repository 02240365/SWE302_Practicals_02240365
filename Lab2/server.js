/**
 * server.js
 * -----------------------------------------------------------------------
 * Entry point for the CST College Student Management System.
 * Wires up middleware, static file serving, and API routes.
 * -----------------------------------------------------------------------
 */
const express = require('express');
const path = require('path');

const authRoutes = require('./src/routes/auth');
const registrationRoutes = require('./src/routes/registration');
const paymentRoutes = require('./src/routes/payment');
const resultsRoutes = require('./src/routes/results');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the front-end (public/index.html, css, js, icons)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', authRoutes);
app.use('/api', registrationRoutes);
app.use('/api', paymentRoutes);
app.use('/api', resultsRoutes);

// Fallback: send the SPA shell for any unmatched non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Only start listening when run directly (keeps `require('./server')` safe
// for supertest in the API test suite, which manages its own instance).
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CST Student Management System running at http://localhost:${PORT}`);
  });
}

module.exports = app;
