Phase 1: Understanding Their Codebase (First 15 min)
Analyze Overall Structure
Analyze this codebase structure. Tell me:
1. How are routes, controllers, and services organized?
2. What patterns do they use (arrow functions vs regular methods, error handling approach)?
3. What naming conventions do they follow?
4. Do they have any base classes or utilities I should use?
Understand a Specific Feature
Walk me through how the [existing feature name, e.g., "pets"] feature works:
1. Show me the request flow from route → controller → service → database
2. What error handling patterns do they use?
3. What TypeScript types are defined?
4. How do they structure their tests?
Find Existing Utilities
What utility functions, middleware, or helper files exist in this codebase that I should reuse? Look for:
- Error handling classes
- Validation middleware
- Database utilities
- Type definitions

Phase 2: Building Features
Create TypeScript Types
Create TypeScript types for a [entity name] feature with these fields:
- [list fields and their types]

Include:
1. Full entity interface (with id, created_at, updated_at)
2. CreateDTO (without auto-generated fields)
3. UpdateDTO (partial of CreateDTO)

Match the style of existing types in this codebase.
Example:
Create TypeScript types for a MedicalRecord feature with these fields:
- pet_id (UUID, foreign key)
- date (Date)
- procedure (string)
- vet_name (string)
- notes (optional string)
- cost (optional number)

Include:
1. Full entity interface (with id, created_at, updated_at)
2. CreateDTO (without auto-generated fields)
3. UpdateDTO (partial of CreateDTO)

Match the style of existing types in this codebase.
Create Service Layer
Create a [EntityName]Service class following the exact patterns used in [ExistingService].

Include these methods:
- getAll() - returns all records
- getById(id: string) - returns single record or null
- create(data: CreateDTO) - creates new record
- update(id: string, data: UpdateDTO) - updates existing record
- delete(id: string) - deletes record

Match their:
- Error handling approach
- Supabase query patterns
- Return types
- Export style (class + instance)
Create Controller Layer
Create a [EntityName]Controller class following the exact patterns used in [ExistingController].

Include these methods:
- getAll - GET all records
- getById - GET single record
- create - POST new record
- update - PATCH existing record
- delete - DELETE record

Match their:
- Method style (arrow functions vs regular methods vs .bind())
- Error handling (try/catch vs next(error))
- Response format
- Status codes
- Export style
Create Routes
Create routes for [entity name] following the exact patterns used in [existing routes file].

Map these endpoints:
- GET / → getAll
- GET /:id → getById
- POST / → create
- PATCH /:id → update
- DELETE /:id → delete

Match their:
- Import style
- Router creation
- Method binding approach
- Export style
Create Nested Routes (e.g., /pets/:id/medical-records)
Create routes for [child entity] nested under [parent entity].

Endpoints needed:
- GET /api/[parent]/:parentId/[children] - get all children for parent
- POST /api/[parent]/:parentId/[children] - create child for parent

Also create standalone routes:
- GET /api/[children]/:id
- PATCH /api/[children]/:id
- DELETE /api/[children]/:id

Match the existing routing patterns in this codebase.

Phase 3: Database & SQL
Create Supabase Schema
Create a PostgreSQL schema for [table name] with these fields:
[list fields with types]

Include:
- UUID primary key with gen_random_uuid()
- Foreign keys with CASCADE on delete to [parent table]
- Proper enum types if needed
- created_at and updated_at timestamps
- Indexes on [commonly queried fields]
- Auto-update trigger for updated_at

Follow PostgreSQL best practices.
Create Seed Data
Create SQL INSERT statements to seed test data for [table name].

Create:
- 3-5 realistic records
- Use subqueries to reference foreign keys from [parent table]
- Include variety in [specific fields to vary]

Phase 4: Testing
Generate Service Tests
Create Jest unit tests for [ServiceName] following the patterns in [existing test file].

Test these methods: [list methods]

For each method, include:
- Happy path test (successful operation)
- Error case test (database error)
- Edge case tests (not found, validation errors)

Mock Supabase using the same mocking patterns as existing tests.
Generate Controller Tests
Create Jest tests for [ControllerName] following existing test patterns.

Test these endpoints: [list endpoints]

For each endpoint, test:
- Successful request (200/201)
- Not found (404)
- Validation error (400)
- Server error (500)

Mock the service layer.
Fix Broken Test
This test is failing:

[paste test code]

Error:
[paste error]

Fix the test to match the actual implementation. The test should properly mock dependencies and verify behavior.

Phase 5: Debugging
Debug Error
I'm getting this error:

[paste full error with stack trace]

Here's my code:

[paste relevant code]

What's wrong and how do I fix it?
Debug TypeScript Error
TypeScript is throwing this error:

[paste TypeScript error]

Here's the code:

[paste code]

Fix the types to resolve this error.
Debug Supabase Query
This Supabase query isn't working as expected:

[paste query code]

Expected: [what you expect]
Actual: [what you're getting]

What's wrong with the query?
Why Isn't This Working?
This [feature/endpoint] isn't working. Here's what I've implemented:

Route: [paste route code]
Controller: [paste controller method]
Service: [paste service method]

When I test with [method] to [endpoint], I get: [describe result]

Debug this and tell me what's wrong.

Phase 6: Polishing
Add Input Validation
Add validation for [endpoint] to ensure:
- [field] is required and [constraints]
- [field] is optional and [constraints]
- [field] must be [format/pattern]

Use the same validation approach as existing code in this codebase.
Add Error Messages
Improve error handling in [file] to return more descriptive error messages:

Current errors are generic. Make them specific to:
- Record not found → "Pet with id X not found"
- Validation failure → describe which field failed
- Database errors → sanitize but be informative
Generate README Section
Write a README section documenting the [feature name] endpoints I just added.

Include:
- Endpoint URL
- HTTP method
- Request body (if applicable)
- Response format
- Example curl command

Match the style of existing API documentation.
Review My Code
Review this code for:
1. Bugs or logic errors
2. TypeScript type issues
3. Missing error handling
4. Code that doesn't match existing patterns
5. Performance issues

[paste your code]

Be specific about what needs fixing.

Phase 7: Quick Wins
Understand This Code
Explain what this code does step-by-step:

[paste code]

Focus on: [specific aspect you're confused about]
Convert Pattern
I need to do [task X] following the same pattern as [existing feature Y].

Show me how to adapt this pattern:
[paste existing code]

To work for: [describe new requirements]
Generate Boilerplate
Generate a complete CRUD setup for [entity name] matching existing code patterns.

Include:
- Types
- Service with all CRUD methods
- Controller with all endpoints
- Routes
- Basic error handling

Model it after [existing feature].

Pro Tips for Using These Prompts
1. Always provide context:
// ✅ GOOD
"Create a UserService following the exact patterns in PetService"

// ❌ BAD
"Create a UserService"
2. Reference existing code:
"Match the style of src/controllers/petController.ts"
3. Be specific about what you want:
"Include error handling for: not found (404), validation error (400), database error (500)"
4. Ask for explanations when confused:
"Explain why this works: [paste code]"
5. Iterate on responses:
"That's close, but they use arrow functions, not regular methods. Update it."

Emergency Prompts (When Stuck)
I'm Completely Lost
I need to add [feature] to this codebase but I'm not sure where to start.

Walk me through:
1. What files do I need to create/modify?
2. In what order should I work?
3. What's the first thing I should code?

Here's what I need to build: [describe requirements]
This Isn't Working and I Don't Know Why
I've been stuck on this for 15 minutes. Something is broken but I can't figure out what.

What I'm trying to do: [describe goal]
What's happening: [describe behavior]
Error (if any): [paste error]

Here's all my relevant code:
[paste code files]

Debug this systematically and tell me what's wrong.
How Do They Do X?
How does this codebase handle [specific pattern, e.g., "authentication" or "validation" or "error responses"]?

Search the codebase and show me examples.