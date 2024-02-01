import Modal from "./modal.js";
import {VisitTherapist,VisitDentist,VisitCardiologist} from "./doctorExtendsForm.js"

export default class allDoctorsButton {
    sendDataDoctor(btn) {                           // Клас по створенню кнопок після того, як натиснули "Створити візит"
        btn.addEventListener("click", (event) => {
            let cardiolog = event.target.closest(".btn-doctor_cardiolog")
            let dentist = event.target.closest(".btn-doctor_dentist")
            let terapist = event.target.closest(".btn-doctor_terapist")
            let modal = document.querySelector('.modal')
            let backgroundColor = document.querySelector(".modal-backdrop")

            if (terapist) {
                if (document.body.classList.contains('modal-open') || backgroundColor || modal) {
                    backgroundColor.remove()
                    modal.remove()                                        //Тут видаляємо модалку при кліку на хрестик, або поза вікном
                    document.body.classList.remove('modal-open')
                }
                const doctorTerapist = new VisitTherapist()   

                const newUserModal = new Modal({
                    headerTitle: 'Терапевт',
                    body: doctorTerapist.render(),    //при натисненні викликаємо метод, в якому викликаємо форму по створені картки
                    closeOutside: true
                })
                document.body.append(newUserModal.render())
            }

            if (cardiolog) {
                if (document.body.classList.contains('modal-open') || backgroundColor || modal) {
                    backgroundColor.remove()
                    modal.remove()
                    document.body.classList.remove('modal-open')
                }
                const doctorCardiolog = new VisitCardiologist()

                const newUserModal = new Modal({
                    headerTitle: 'Кардіолог',
                    body: doctorCardiolog.render(),
                    closeOutside: true
                })
                document.body.append(newUserModal.render())
            }

            if (dentist) {
                if (document.body.classList.contains('modal-open') || backgroundColor || modal) {
                    backgroundColor.remove()
                    modal.remove()
                    document.body.classList.remove('modal-open')
                }
                const doctorDentist = new VisitDentist()

                const newUserModal = new Modal({
                    headerTitle: 'Стоматолог',
                    body: doctorDentist.render(),
                    closeOutside: true
                })
                document.body.append(newUserModal.render())
            }
        })
    }

    render() {
        this.doctorElem = document.createElement("ul") // Створюємо кнопки, після того як натиснули "Створити візит"
        this.doctorElem.className = "doctor-name"
        this.doctorElem.insertAdjacentHTML("beforeend", `
             <li class="btn-doctor btn-doctor_cardiolog" data-path="Кардіолог">Кардіолог</li>
             <li class="btn-doctor btn-doctor_dentist" data-path="Стоматолог">Стоматолог</li>
             <li class="btn-doctor btn-doctor_terapist" data-path="Терапевт">Терапевт</li>
        `)

        this.sendDataDoctor(this.doctorElem) 

        return this.doctorElem
    }
}
