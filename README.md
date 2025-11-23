# Complete API Endpoints
## Pets:
- GET /api/pets - Get all pets (with optional ?status= and ?type= query params)
- GET /api/pets/:id - Get pet by ID
- GET /api/pets/:id/applications - Get all applications for a specific pet
- POST /api/pets - Create a new pet
- PATCH /api/pets/:id - Update a pet
- DELETE /api/pets/:id - Delete a pet
## Applications:
- GET /api/applications - Get all applications (with optional ?status= and ?pet_id= query params)
- GET /api/applications/:id - Get application by ID
- POST /api/applications - Create a new application
- PATCH /api/applications/:id - Update an application
- DELETE /api/applications/:id - Delete an application
- POST /api/applications/:id/approve - Approve an application
## General:
- GET / - API info
- GET /health - Health check