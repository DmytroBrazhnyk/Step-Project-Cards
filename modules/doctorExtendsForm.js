import {addUser} from "../function/sendRequest.js";
import {UserCardTherapist, UserCardDentist, UserCardCardiologist} from "./userCard.js"
import Visit from "./classVisit.js";

export {VisitTherapist, VisitDentist, VisitCardiologist}

const wrapCards = document.querySelector(".wrap-cards")

const token = localStorage.getItem('token');

class VisitCardiologist extends Visit {          //  тут класи, які ми наслідуємо від загального класу Visit, і вже створюємо форму з
    headerCardiologist(form) {                   //  додатковими інпутами для кожного лікаря
        form.addEventListener("submit", () => {

            const isFuctionForms = type => ['checkbox', 'radio'].includes(type)

            const {elements} = form;
            const values = {}

            for (let i = 0; i < elements.length; i++) {
                const formElements = elements[i];
                const {name} = formElements;                   // Метод, який перевіряє наявність всіх інпутів у формі

                if (name) {
                    const {value, type, checked} = formElements;
                    values[name] = isFuctionForms(type) ? checked : value
                }
            }

            addUser(JSON.stringify(values), token)  // Цим методом відправляємо запит на сервер для створення карток, знаходиться у файлі sendRequest
                .then(user => {
                    console.log(user)
                    const card = new UserCardCardiologist(user)    // і вже на основі всіх інпутів, які є у формі, ми створюємо клас
                    card.renderCard(wrapCards)                     // в якому виводимо на екран карточки
                })
        })
    }

    render() {
        super.createGeneralForms()  // в цьому методі ми викликаємо із загального класу Visit основні поля які є у кожного доктора і додаємо ще необхідними
        this.formElem.insertAdjacentHTML("beforeend", `    
            <div class="form-group">
                <label class="form-label" style="width: 100%">
                  <input id="doctor" class="form-control" name="doctor" value="Кардіолог">
                </label>
            </div>  
            <div class="form-group">
                <label class="form-label" style="width: 100%;">
                    <input type="number" id="pressure" class="form-control" name="pressure" placeholder="Звичайний тиск">
                </label>
            </div>
            <div class="form-group">
                <label class="form-label" style="width: 100%;">
                    <input type="number" id="index" class="form-control" name="index" placeholder="Індекс маси тіла">
                </label>
            </div>
            <div class="form-group">
                <label class="form-label" style="width: 100%;">
                    <input id="diseases" class="form-control" name="diseases" placeholder="Перенесені захворювання серцево-судинної системи">
                </label>
            </div>
            <div class="form-group">
                <label class="form-label" style="width: 100%;">
                    <input type="number" id="age" class="form-control" name="age" placeholder="Вік">
                </label>
            </div>  
                                  
            <button type="submit" class="btn btn-primary">Створити</button>
        `)
        this.headerCardiologist(this.formElem)
        return this.formElem
    }
}

////////////////////////////////////////////////////////////////  три окремі наслідувані класи - три окремі лікарі

class VisitDentist extends Visit {
    headerDentist(form) {
        form.addEventListener("submit", () => {

            const isFuctionForms = type => ['checkbox', 'radio'].includes(type)

            const {elements} = form;
            const values = {}

            for (let i = 0; i < elements.length; i++) {
                const formElements = elements[i];
                const {name} = formElements;

                if (name) {
                    const {value, type, checked} = formElements;
                    values[name] = isFuctionForms(type) ? checked : value
                }
            }
            addUser(JSON.stringify(values), token)
                .then(user => {
                    console.log(user)
                    const card = new UserCardDentist(user)
                    card.renderCard(wrapCards)
                })
        })
    }

    render() {
        super.createGeneralForms()
        this.formElem.insertAdjacentHTML("beforeend", `    
           <div class="form-group">
                <label class="form-label" style="width: 100%">
                  <input id="doctor" class="form-control" name="doctor" value="Стоматолог">
                </label>
            </div>  
            <div class="form-group">
                <label class="form-label" style="width: 100%;">
                 <p>Дата останнього візиту:</p>
                    <input type="date" id="date" class="form-control" name="date" placeholder="Дата останнього візиту">
                </label>
            </div>
            <button type="submit" class="btn btn-primary">Створити</button>
        `)
        this.headerDentist(this.formElem)
        return this.formElem
    }
}

///////////////////////////////////////////////////////////

class VisitTherapist extends Visit {
    headerTerapist(form) {
        form.addEventListener("submit", () => {

            const isFuctionForms = type => ['checkbox', 'radio'].includes(type)

            const {elements} = form;
            const values = {}

            for (let i = 0; i < elements.length; i++) {
                const formElements = elements[i];
                const {name} = formElements;

                if (name) {
                    const {value, type, checked} = formElements;
                    values[name] = isFuctionForms(type) ? checked : value
                }
            }
            addUser(JSON.stringify(values), token)
                .then(user => {
                    console.log(user)
                    const card = new UserCardTherapist(user)
                    card.renderCard(wrapCards)
                   
                })
        })
    }

    render() {
        super.createGeneralForms()
        this.formElem.insertAdjacentHTML("beforeend", `
           <div class="form-group">
                <label class="form-label" style="width: 100%">
                  <input id="doctor" class="form-control" name="doctor" value="Терапевт">
                </label>
           </div>  
           <div class="form-group">
                <label class="form-label" style="width: 100%;">
                    <input type="number" id="age" class="form-control" name="age" placeholder="Вік">
                </label>
           </div>

           <button type="submit" class="btn btn-primary">Створити</button>
        `)

        this.headerTerapist(this.formElem)
        return this.formElem

    }
}

