// Referencias del HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket')
const btnCrear = document.querySelector('button')

const socket = io()

socket.on('connect', () => {
  btnCrear.disabled = false
})

socket.on('disconnect', () => {
  btnCrear.disabled = true
})

//Esto es mejor por REST pero se hace con sockets como ejemplo
socket.on('ultimo-ticket', (ultimoTicket) => {
  lblNuevoTicket.innerText = `Ticket ${ultimoTicket}`
})

btnCrear.addEventListener('click', () => {
  socket.emit('siguiente-ticket', null, (ticket) => {
    lblNuevoTicket.innerText = ticket
  })
})

console.log('Nuevo Ticket HTML')
