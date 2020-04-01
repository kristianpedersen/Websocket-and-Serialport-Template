const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const SerialPort = require('serialport')
SerialPort.list().then(p => console.log(p))
const Readline = require('@serialport/parser-readline')

const port = new SerialPort("COM6", { baudRate: 9600 })
const parser = new Readline()
port.pipe(parser)

app.get('/', function serveIndexHtml(req, res) {
	res.sendFile(__dirname + '/index.html')
})

io.on('connection', function socketSetup(socket) {
	socket.on("randomValue", value => {
		console.log("Hei, sveis!", value)
		port.write("" + value)
	})

	parser.on('data', line => {
		io.emit("valueFromDevice", line)
	})
})

http.listen(3000)