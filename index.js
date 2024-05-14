const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Peta enkripsi berdasarkan keyboard QWERTY
const encryptMap = {
  q: "w", w: "e", e: "r", r: "t", t: "y", y: "u", u: "i", i: "o", o: "p", p: "a", a: "s", s: "d", d: "f", f: "g", g: "h", h: "j", j: "k", k: "l", l: ";", z: "x", x: "c", c: "v", v: "b", b: "n", n: "m", m: ",",
  Q: "W", W: "E", E: "R", R: "T", T: "Y", Y: "U", U: "I", I: "O", O: "P", P: "A", A: "S", S: "D", D: "F", F: "G", G: "H", H: "J", J: "K", K: "L", L: ":", Z: "X", X: "C", C: "V", V: "B", B: "N", N: "M", M: ".",
};

// Buat peta balik untuk dekripsi
const decryptMap = {};
for (const [key, value] of Object.entries(encryptMap)) {
  decryptMap[value] = key;
}

// Fungsi untuk mengenkripsi pesan
function encryptMessage(message) {
  let encryptedMessage = "";
  for (const char of message) {
    encryptedMessage += encryptMap[char] || char;
  }
  return encryptedMessage;
}

// Fungsi untuk mendekripsi pesan
function decryptMessage(encryptedMessage) {
  let decryptedMessage = "";
  for (const char of encryptedMessage) {
    decryptedMessage += decryptMap[char] || char;
  }
  return decryptedMessage;
}

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    const messageContent = msg.body;

    if (messageContent.startsWith('!')) {
        const textToEncrypt = msg.body.slice(1);
        const encryptedText = encryptMessage(textToEncrypt);
        msg.reply(`Encrypted: ${encryptedText}`);
    } else if (messageContent.startsWith('?')) {
        const textToDecrypt = msg.body.slice(1);
        const decryptedText = decryptMessage(textToDecrypt);
        msg.reply(`Decrypted: ${decryptedText}`);
    } else {
        msg.reply("Please use '!' followed by the message to encrypt or '?' followed by the message to decrypt.");
    }
});

client.initialize();
