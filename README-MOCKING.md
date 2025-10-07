Mocking module and error handler added

What changed
- Added a mocking utility at `src/utils/mocking.js` that can generate N mock pet documents shaped like mongoose results (includes _id, __v, owner=null and adopted=false).
- Exposed GET /mockingpets via `src/routes/mocking.router.js` (query param `size`, default 100).
- Added a custom error class and dictionary in `src/errors/` and a centralized middleware `src/middlewares/errorHandler.js`.
- Updated `src/app.js` to mount the mocking route and error handler.
- Updated `sessions.controller.js` and `pets.controller.js` to use the error dictionary for common validation cases.

Try it (after installing dependencies and running the server):

Example request that returns 100 mock pets:

GET http://localhost:8080/mockingpets

Or request 50 pets:

GET http://localhost:8080/mockingpets?size=50

Repository link (without node_modules):
https://github.com/<your-user>/<your-repo>
