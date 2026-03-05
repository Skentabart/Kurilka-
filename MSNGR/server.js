const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req,res)=>{

let file="public"+(req.url==="/" ? "/index.html":req.url);

fs.readFile(file,(err,data)=>{

if(err){res.writeHead(404);res.end();return;}

res.writeHead(200);
res.end(data);

});

});

const wss = new WebSocket.Server({server});

let rooms={};

wss.on("connection",ws=>{

ws.on("message",msg=>{

let data=JSON.parse(msg);

if(data.join){

ws.room=data.join;

rooms[data.join] ??= [];

rooms[data.join].push(ws);

}

if(data.signal){

rooms[ws.room]?.forEach(client=>{
if(client!==ws)
client.send(JSON.stringify(data.signal));
});

}

});

ws.on("close",()=>{

if(ws.room){

rooms[ws.room]=rooms[ws.room].filter(c=>c!==ws);

}

});

});

server.listen(3000,()=>console.log("Messenger running on 3000"));