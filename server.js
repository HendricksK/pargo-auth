require('dotenv').config()


const { config } = require('dotenv');
const http = require('http');
var querystring = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/plain');
    // res.end('Hello World');

    api_config = {
      api_username: process.env.API_USER,
      api_password: process.env.API_PASSWORD,
      api_url: process.env.API_URL,
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Max-Age', 2592000); // 30 days

    console.log(req.url)
    console.log(req.method)

    // This is the not so clean way because config can be seen in browser.
    if (req.url === "/config" && req.method === "GET") {
        //response headers
        res.writeHead(200, { "Content-Type": "application/json" });
        //set the response
        // res.write("Hi there, This is a Vanilla Node.js API");
        //end the response
        res.end(JSON.stringify(api_config));
    }

    if (req.url === "/pargo_refresh_auth" && req.method === "POST") {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      })
      req.on('end', () => {
        // console.log(JSON.stringify(data)); // 'Buy the milk'
        console.log(querystring.parse(data));
        res.end(JSON.stringify(data));
      })

      // console.log(req.body)

      res.end('now im still broke');
      return
    }

    if (req.url === "/pargo_auth" && req.method === "GET") {

        const https = require('https')

        const post_data = JSON.stringify({
            username: api_config.api_username,
	          password: api_config.api_password
          })
        
        const options = {
          hostname: api_config.api_url,
          port: 443,
          path: '/auth',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
          }
        }
        
        const req = https.request(options, response => {
          console.log(`statusCode: ${response.statusCode}`)

          var body = '';
        
          if (response.statusCode == 401) {
            // Make auth
            res.end('the end is nigh 401');
          }

          response.on('data', d => {
            body = body + d;
          })

          response.on('end', () => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(body))
          })

          response.on('error', d => {
            res.end(JSON.stringify(body));
          })
        })
        
        req.on('error', error => {
            res.end(error)
        })

        req.write(post_data)
        req.end()
    }
    // If no route present
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});
  
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
