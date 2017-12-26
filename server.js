const http = require('http');
const url = require('url');

const host = 'localhost';
const port = 3000;

const jsonObject = {
    "/": {
        "this": "is",
        "a": "simple",
        "json": "api"
    },
    "/users": [{
            name: "Young Guy",
            age: 10
        },
        {
            name: "Old Guy",
            age: 60
        }
    ],
    "/about": "this is a very simple api",
    "/aboutus": {
        "/": "We are a team",
        "/mary": "hi, this is Mary",
        "/john": "hi, this is John",
    }
};

const server = http.createServer((request, response) => {
    let pathname = url.parse(request.url, true).pathname.toLowerCase();
    response.setHeader('Content-Type', 'application/json');
    handleReturn(pathname, response);
});

server.listen(port, host, () => {
    console.log(`server running at http://${host}:${port}/`)
});

function handleReturn(pathname, response, json = jsonObject) {
    var subIndex = pathname.indexOf('/', 1);
    if (subIndex > 0 && subIndex != pathname.length - 1) {
        var current = pathname.substring(0, subIndex);
        handleReturn(pathname.substring(subIndex), response, json[current]);
    } else {
        if (subIndex > 0)
            pathname = pathname.substring(0, subIndex);

        response.statusCode = 200;
        
        if(json[pathname]===undefined){
            response.statusCode = 404;
            response.end("not found");
        }else{
            if (pathname !== '/' && json[pathname]['/'] !== undefined)
                response.end(JSON.stringify(json[pathname]['/']));
            else
                response.end(JSON.stringify(json[pathname]));
        }
    }
}