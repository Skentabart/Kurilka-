let ws = new WebSocket(`ws://${location.host}`);

let pc = new RTCPeerConnection();

let channel = pc.createDataChannel("chat");

let key;

(async()=>{

key = await generateKey();

})();

channel.onmessage = async e=>{

let data=JSON.parse(e.data);

let text=await decrypt(key,data);

addMessage(text);

};

ws.onopen=()=>{

let room=prompt("Room name");

ws.send(JSON.stringify({join:room}));

};

ws.onmessage=async e=>{

let data=JSON.parse(e.data);

if(data.sdp){

await pc.setRemoteDescription(data);

if(data.type==="offer"){

let ans=await pc.createAnswer();

await pc.setLocalDescription(ans);

ws.send(JSON.stringify({signal:pc.localDescription}));

}

}

if(data.candidate){

pc.addIceCandidate(data);

}

};

pc.onicecandidate=e=>{

if(e.candidate){

ws.send(JSON.stringify({signal:e.candidate}));

}

};

async function start(){

let offer=await pc.createOffer();

await pc.setLocalDescription(offer);

ws.send(JSON.stringify({signal:pc.localDescription}));

}

start();

document.getElementById("send").onclick=send;

async function send(){

let msg=document.getElementById("msg").value;

let enc=await encrypt(key,msg);

channel.send(JSON.stringify(enc));

addMessage(msg);

msg.value="";

}

function addMessage(t){

let div=document.createElement("div");

div.className="msg";

div.innerText=t;

chat.appendChild(div);

}