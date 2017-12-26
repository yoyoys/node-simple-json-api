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
    let result = handleResult(pathname, jsonObject);

    response.setHeader('Content-Type', 'application/json');
    
    if(result){
        response.statusCode = 200;
        response.end(JSON.stringify(result));    
    }else{
        response.statusCode = 404;
        response.end("not found");    
    }
});

server.listen(port, host, () => {
    console.log(`server running at http://${host}:${port}/`)
});

function handleResult(pathname, json = jsonObject) {
    var subIndex = pathname.indexOf('/', 1);
    if (subIndex > 0 && subIndex != pathname.length - 1) {
        var current = pathname.substring(0, subIndex);
        return handleResult(pathname.substring(subIndex), json[current]);
    } else {
        if (subIndex > 0)
            pathname = pathname.substring(0, subIndex);

        if(json[pathname]===undefined){
            return null;
        }else{
            if (pathname !== '/' && json[pathname]['/'] !== undefined)
                return json[pathname]['/'];
            else
                return json[pathname];
        }
    }
}