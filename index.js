const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const { exec } = require("child_process")

/**
 * From SerialPort.list(), find your microcontroller's path.
 * In my case, my Arduino is connected to COM6, with a baud rate of 9600.
 * If you're using a micro:bit, set the baud rate to 115200, and follow this guide: https://makecode.microbit.org/device/serial
 */
SerialPort.list().then(p => console.log(p))
const port = new SerialPort("COM6", { baudRate: 9600 })
const parser = new Readline()
port.pipe(parser)

app.get('/', function serveIndexHtml(_, res) {
	res.sendFile(__dirname + '/index.html')
})

io.on('connection', function socketSetup(socket) {
	// Receive data from browser
	socket.on("dataFromBrowser", function fromBrowserToSerial(data) {
		console.log(`Data from browser: ${data}`)
		exec("ls -l")
	})

	// Send data from serial port to browser
	parser.on('data', function fromSerialToBrowser(line) {
		io.emit("dataFromNodeJS", line)
	})
})

http.listen(3000)