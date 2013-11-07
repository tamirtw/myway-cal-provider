var request = require('request');
var cheerio = require('cheerio');
var http = require('http');

pools = {
    'Aloha': 3,
    'Beaverton': 15,
    'Conestoga': 12,
    'Harman': 11,
    'Raleigh': 6,
    'Somerset': 22,
    'Sunset': 5,
    'Tualatin Hills': 2
};
days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

http.createServer(function (req, res) 
{
        var addr = "unknown";
        var out = "";
        if (req.headers.hasOwnProperty('x-forwarded-for')) {
                addr = req.headers['x-forwarded-for'];
        } else if (req.headers.hasOwnProperty('remote-addr')){
                addr = req.headers['remote-addr'];
        }

        if (req.headers.hasOwnProperty('accept')) {
                if (req.headers['accept'].toLowerCase() == "application/json") {
                          res.writeHead(200, {'Content-Type': 'application/json'});
                          res.end(JSON.stringify({'ip': addr}, null, 4) + "\n");                        
                          return ;
                }
        }
        
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write("Welcome to Node.js on OpenShift!\n\n");
  for (pool in pools) {
    var url = 'http://www.thprd.org/schedules/schedule.cfm?cs_id=' + pools[pool];
    request(url, function(err, resp, body) {
        if (err)
            throw err;
        $ = cheerio.load(body);
        console.log(pool);
        res.write(pool + "\n");
        // TODO: scraping goes here!
    });
}
  res.end("Your IP address seems to be " + addr + "\n");
}).listen(port, ipaddr);
console.log("Server running at http://" + ipaddr + ":" + port + "/");