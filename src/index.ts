import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import petRoutes from './routes/petRoutes';
import applicationRoutes from './routes/applicationRoutes';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Routes
// ============================================

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Pet Adoption API',
    version: '1.0.0',
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/pets', petRoutes);
app.use('/api/applications', applicationRoutes);

// ============================================
// Error Handling Middleware (must be last)
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

