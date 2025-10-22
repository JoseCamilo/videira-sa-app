import { Component } from '@angular/core';
import { Evento } from '../evento/evento';

@Component({
  selector: 'app-eventos',
  imports: [Evento],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css'
})
export class Eventos {

  eventos = [
    {
      titulo: 'Conferência Profética 2025',
      data: '25-28 de Julho, 2025',
      local: 'Igreja Videira - Sede',
      imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChBZ9u-L6M5yZ5ISreokbwAmiPF1eRasNH2yCxqvGdnCXRfso1YTt8mb_GnxXEQU-7fPtqvE6xzHQW0_-dw_fzFCy2NPcsD_qgYCxYzOmj20j4L3NClGyhWhbrHJnmg2Dk7EKl1nWcKN5PiCsqqRusNMYRESEzzz7BqOey7Iwm_Ju-jdLlFCTnPCYcLcrxGCPgLscBIsNogtTWabgoHh_nc8ArHnJwMdEQ4FASGOjUokDyugfUrunZjbfgeI2q0LTRqoUilezXwqA'
    },
    {
      titulo: 'Acampamento Radicais Livres',
      data: '15 de Agosto, 2025',
      local: 'Chácara Videira',
      imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdBEhHIW3R57clCt7mTXB5MGBcxOCL0lrqLGnfkRyolmls2Rp0MdTnJlEN8QBDu_6_5qFJC3PaPVC6sldZ9XhC6OY9Zz626Id0trG7mnVRNAz6rEl9VABHkhrsPO3t88AjCbKpkeePuN-FYNqt4WK6n-eNivRlxrLAhnoIbuEdZW5_9oHIFJTN_vEgpzA59l0whU2Vf42cHiiAwuX4mjfKbGnWlpJrq1VuOTrYTxQbN6kUnlnA4vWpA0kq3IVKMp5A7bl_9FQNxOc'
    }
  ]

}
