const SerialPort = require('serialport'); //import package
const portNumber = "COM15"; // ambil argument ke 2 di command
console.log("Port Number :  " + portNumber); // nampilin port Number
const baudPort = new SerialPort(portNumber, {
	baudRate : 57600
}); // buat object serial port

//parser biar ga nampilin buffer
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
	delimiter : '\r\n'
});

baudPort.pipe(parser); // using parser 

// event yang dipanggil ketika serial port kebuka. pake 'open'
baudPort.on('open', ()=> {
	console.log("Arduino Connected on" + portNumber);

	let timeOut = 3000; // 3detik
	setTimeout(()=> {
		// kirim command 1 ke arduino
		baudPort.write('1', (err)=> {
			if(err)
				console.log(err); // munculin error
			else 
				console.log("success write 1"); // kalo ga error kasih notif
		});
	},timeOut);
});

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');

app.use(express.static(path.join(__dirname, 'www')));
const portListen = 8080;
server.listen(portListen);

// buat socket event
let clientCount = 0;
io.on('connection', (socket)=>{
	clientCount++;
	console.log('New client connected. '+ clientCount);	
	// event yang munculin data dari arduino. pake 'data'
	parser.on('data', (data)=> {
		//panggil parsing
		let hasilParsing = parsingRAWData(data, "*");
		socket.emit('socketData', {dataHasil : hasilParsing});
		console.log(data);
	});

})

// event yang munculin data dari arduino. pake 'data'
parser.on('data', (data)=> {
	console.log(data);
});
// FUNCTION UNTUK PARSING
// argument 1 : data yang diparsing ex: 123 434 5334
// argument 2 : pemisah
// return array data [0] =123 [1] =434 [2] =5334
function parsingRAWData(data,delimiter){
	let result;
	result = data.toString().replace(/(\r\n|\n|\r)/gm,"").split(delimiter);

	return result;
}