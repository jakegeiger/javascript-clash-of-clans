var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    url = require('url');

app.listen(process.env.PORT, process.env.IP);

function handler(req, res) {
    var file = url.parse(req.url).pathname;
    if(!file || file == "/"){
        file = "/index.html";
    }
    if(file.indexOf("..") > -1){
        res.writeHead(500);
        return res.end('Error');
    }
    
    fs.readFile(__dirname + file,
        function(err, data) {
            if (err) {
                console.log(err);
                res.writeHead(500);
                return res.end('Error loading ' + file);
            }
    
            res.writeHead(200, {"Content-Type": typeFromFile(file)});
            res.end(data);
        });
}

function typeFromFile(file){
    if(file.indexOf(".html") > -1){
        return "text/html";
    } else if (file.indexOf(".js") > -1){
        return "application/javascript";
    } else if (file.indexOf(".png") > -1){
        return "image/png";
    }
}

io.sockets.on('connection', function(socket) {
    socket.emit('news', {
        hello: 'world'
    });
    socket.on('my other event', function(data) {
        console.log(data);
    });
});