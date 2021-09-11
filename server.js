require('dotenv').config()


const { config } = require('dotenv');
const http = require('http');
const querystring = require('querystring');
const https = require('https')

const url_list = [
    '/config',
    '/pargo_auth',
    '/pargo_refresh_auth'
];


const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {

    var uri_avail = false;
    for (var x = 0; x < url_list.length; x++) {
        if (url_list[x] === req.url) {
            uri_avail = true;
        }
    }

    // uri not avail throw error 
    if ( ! uri_avail) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
        return false // stop server execution
    }

    api_config = {
      api_username: process.env.API_USER,
      api_password: process.env.API_PASSWORD,
      api_url: process.env.API_URL,
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Max-Age', 2592000); // 30 days

    // This is the not so clean way because config can be seen in browser.
    if (req.url === "/config" && req.method === "GET") {
        //response headers
        res.writeHead(200, { "Content-Type": "application/json" });
        //set the response
        // res.write("Hi there, This is a Vanilla Node.js API");
        //end the response
        res.end(JSON.stringify(api_config));
        return true // stop server execution here, once data returned 
    }

    if (req.url === "/pargo_refresh_auth" && req.method === "POST") {

        postbody = '';
        req.on('data', function(data) {
            postbody += data;
            
        });

        req.on('end', function() {
            postdata = JSON.parse(postbody)
            // console.log(postdata.token)
            // console.log(postbody.length)
            // // res.end(postbody)

            const post_data = JSON.stringify({
                'refresh_token': postdata.token
            })
             // ${response.statusCode}
             // console.log(post_data.postbody.token
            
            const options = {
              hostname: api_config.api_url,
              port: 443,
              path: '/auth/refresh',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
              }
            }
            
            const request = https.request(options, response => {
              console.log(`statusCode: ${response.statusCode}`)

              var body = '';
            
              if (response.statusCode == 401) {
                // Make auth
                res.end(body)
              }

              response.on('data', d => {
                body = body + d;
              })

              response.on('end', () => {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(body)
              })

              response.on('error', d => {
                res.end(body);
              })
            })
            
            request.on('error', error => {
                res.end(error)
            })

            request.write(post_data)
            request.end()
        });
        return true
    }

    if (req.url === "/pargo_auth" && req.method === "GET") {

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
            res.end(body)
          })

          response.on('error', d => {
            res.end(body);
          })
        })
        
        req.on('error', error => {
            res.end(error)
        })

        req.write(post_data)
        req.end()
        return true
    }

});
  
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
