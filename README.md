requirements - nodeJS

run `npm install` - should create a server using port PORT 3000
move .env.example to .env and update to your details.
API_URL=api.staging.pargo.co.za
API_USER=nowimstillbroke@stillbroke.co.za
API_PASSWORD=stilldamnbroke

run `node server.js`

URL LIST

GET /config - BAD as anyone inspecting tab, will be able to see API details.
GET /pargo_auth - returns pargo token and refresh token
POST /pargo_refresh_auth - will return refreshed auth token


