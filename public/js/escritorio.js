//Referencias HTML
const lblEscritorio = document.querySelector('h1') //Primer h1 que encuentra
const btnAtender = document.querySelector('button')
const lblTicket = document.querySelector('small')
const divAlerta = document.querySelector('.alert')
const lblPendientes = document.querySelector('#lblPendientes')

const searchParams = new URLSearchParams(window.location.search) //Solo funciona en chrome y firefox

if (!searchParams.has('escritorio')) {
  window.location = 'index.html'
  throw new Error('El escritorio es obliogatorio')
}

const escritorio = searchParams.get('escritorio')
lblEscritorio.innerText = escritorio

divAlerta.style.display = 'none'

const socket = io()

socket.on('connect', () => {
  btnAtender.disabled = false
})

socket.on('disconnect', () => {
  btnAtender.disabled = true
})

socket.on('tickets-pendientes', (pendientes) => {
  if (pendientes === 0) {
    lblPendientes.style.display = 'none'
  } else {
    lblPendientes.style.display = ''
    lblPendientes.innerText = pendientes
  }
})

btnAtender.addEventListener('click', () => {
  socket.emit('atender-ticket', { escritorio }, ({ ok, ticket, msg }) => {
    if (!ok) {
      lblTicket.innerText = 'Ningún ticket'
      return (divAlerta.style.display = '')
    }

    lblTicket.innerText = `Ticket ${ticket.numero}`
  })
  // socket.emit('siguiente-ticket', null, (ticket) => {
  //   lblNuevoTicket.innerText = ticket
  // })
})
