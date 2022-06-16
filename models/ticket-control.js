const path = require('path')
const fs = require('fs')

class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero
    this.escritorio = escritorio
  }
}

class TicketControl {
  constructor() {
    this.ultimo = 0
    this.hoy = new Date().getDate()
    this.tickets = []
    this.ultimos4 = []
    this.init()
  }

  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4,
    }
  }

  //Método para iniciar los datos de la app
  init() {
    const { hoy, tickets, ultimo, ultimos4 } = require('../db/data.json') //Guarda en la constante, como un objeto JS, la información del archivo json
    if (hoy === this.hoy) {
      //Si el día de hoy es el mismo que el día de la base de datos
      //Se recuperan los datos de la base de datos
      this.tickets = tickets
      this.ultimo = ultimo
      this.ultimos4 = ultimos4
    } else {
      //Es otro día
      this.guardarDB()
    }
  }

  guardarDB() {
    const dbPath = path.join(__dirname, '../db/data.json')
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson)) // this.toJson es un getter que obtiene la información actual del día
  }

  siguiente() {
    this.ultimo += 1
    const ticket = new Ticket(this.ultimo, null)
    this.tickets.push(ticket)

    this.guardarDB()
    return `Ticket ${ticket.numero}`
  }

  atenderTicket(escritorio) {
    //Si no hay tickets:
    if (this.tickets.length === 0) {
      return null
    }

    const ticket = this.tickets.shift() //Elimina el ticket que está en primera posición en el array y lo retorna
    ticket.escritorio = escritorio // ticket es un objeto de la clase Ticket
    this.ultimos4.unshift(ticket) //Añade el ticket al inicio del array

    if (this.ultimos4.length > 4) {
      this.ultimos4.splice(-1, 1) //Se elimina el último elmento del array
    }

    this.guardarDB()
    return ticket
  }
}

module.exports = TicketControl
