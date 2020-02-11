const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
var port = 3000;

var fs = require('fs');
let filePath = 'respData.txt';



app.listen(port, function () {
console.log('We are listening on port ' + port)
})

app.options('*', cors());
app.use(cors());

app.use (function(req, res, next) {
    var data='';
    //req.setEncoding('utf8');
    req.on('data', function(chunk) { 
       data += chunk;
    });

    req.on('end', function() {
        req.body = data;
        next();
    });
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/colorDemo.html'))
    })

app.get('/', function (req, res) {
    res.send('sup');
})

app.post('/test', function (req, res) {
//    res.send('got a put at /test');
    data = req.body
    console.log(data)

    fs.appendFile(filePath, data,
        // callback function
        function(err) { 
            if (err) throw err;
            // if no error
            console.log("Data is appended to file successfully.")
    }); 

    return res.end('done')

})
