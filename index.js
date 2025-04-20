import { WebSocket, WebSocketServer } from 'ws'

const port = 4000

// Crear servidor HTTP
const wss = new WebSocketServer({ port: port })

console.log('Servidor iniciado')

wss.on('connection', (wsnext) => {
  // Conexión con la App de NextJS
  console.log('WS NextJS conectado')

  const wsmc = new WebSocket('ws://192.168.1.71:8080')

  // Escuchar eventos del WebSocket
  wsmc.on('open', () => {
    console.log('Evolve API conectado')

    // Escuchar eventos de mensajes recibidos del servidor
    wsmc.on('message', (data) => {
      console.log(`Evolve API: ${data.toString()}`)
      wsnext.send(data.toString())
    })

    // Manejar eventos de cierre de la conexión
    wsmc.on('close', () => {
      console.log('Evolve API cerrado')

      wsnext.send(
        JSON.stringify({
          stream: 'server',
          type: 'status',
          data: 'Evolve API cerrado'
        })
      )
    })
  })

  wsnext.on('message', (message) => {
    // Verificar si el WebSocket está abierto
    if (wsmc.readyState === WebSocket.OPEN) {
      // Enviar comando al servidor de Minecraft
      wsmc.send(message.toString())
    } else {
      console.error('El WebSocket no está abierto')
    }
  })

  wsmc.on('error', (error) => {
    console.error('Evolve API error:', error)
  })
})
