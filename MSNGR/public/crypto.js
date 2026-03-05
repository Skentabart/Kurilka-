async function generateKey(){

return crypto.subtle.generateKey(
{
name:"AES-GCM",
length:256
},
true,
["encrypt","decrypt"]
);

}

async function encrypt(key,data){

let iv=crypto.getRandomValues(new Uint8Array(12));

let enc=new TextEncoder().encode(data);

let cipher=await crypto.subtle.encrypt(
{
name:"AES-GCM",
iv
},
key,
enc
);

return {
cipher:Array.from(new Uint8Array(cipher)),
iv:Array.from(iv)
};

}

async function decrypt(key,data){

let cipher=new Uint8Array(data.cipher);

let iv=new Uint8Array(data.iv);

let plain=await crypto.subtle.decrypt(
{
name:"AES-GCM",
iv
},
key,
cipher
);

return new TextDecoder().decode(plain);

}