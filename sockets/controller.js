const TicketControl = require('../models/ticket-control')

const ticketControl = new TicketControl()

const socketController = (socket) => {
  //Cuando se conecta el cliente:
  socket.emit('ultimo-ticket', ticketControl.ultimo) // Envía el último ticket
  socket.emit('estado-actual', ticketControl.ultimos4) // Envía los últimos 4 tickets al iniciar la aplicación
  socket.emit('tickets-pendientes', ticketControl.tickets.length) // Envía el número de tickets pendientes

  socket.on('siguiente-ticket', (payload, callback) => {
    const siguiente = ticketControl.siguiente()
    callback(siguiente)
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length) // Envía los tickets pendientes a todos los clientes
  })

  socket.on('atender-ticket', ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: 'El escritorio es obligatorio',
      })
    }

    const ticket = ticketControl.atenderTicket(escritorio)
    // OJO: Este emit está dentro de la función callback de atender-ticket:
    socket.broadcast.emit('estado-actual', ticketControl.ultimos4) // Envía los últimos 4 tickets cuando cambia ultimos4
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length) // Envía los tickets pendientes
    socket.emit('tickets-pendientes', ticketControl.tickets.length) // Envía el número tickets pendientes

    if (!ticket) {
      callback({
        ok: false,
        msg: 'Ya no hay tickets pendientes',
      })
    } else {
      callback({
        ok: true,
        ticket,
      })
    }
  })
}

module.exports = {
  socketController,
}
