import { WebSocket, WebSocketServer } from 'ws'

const port = 4000

// Crear servidor HTTP
const wss = new WebSocketServer({ port: port })

console.log('Servidor iniciado')

wss.on('connection', (wsnext) => {
  // Conexión con la App de NextJS
  console.log('WS NextJS conectado')

  const wsmc = new WebSocket('ws://192.168.1.200:8080')
  // Escuchar eventos del WebSocket
  wsmc.on('open', () => {
    console.log('WS Minecraft conectado')
    wsnext.on('message', (message) => {
      // Enviar comando al servidor de Minecraft
      wsmc.send(message)
      // Escuchar eventos de mensajes recibidos del servidor
      wsmc.on('message', (data) => {
        console.log(`WS Minecraft: ${data}`)
        wsnext.send(data)
        // Aquí puedes procesar los datos recibidos según tus necesidades
      })

      // Manejar eventos de cierre de la conexión
      wsmc.on('close', () => {
        console.log('WS Minecraft cerrado')
        wsnext.send('WS Minecraft cerrado')
      })
    })
  })

  wsmc.on('error', (error) => {
    console.error('WS Minecraft error:', error)
  })
})
