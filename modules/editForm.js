import { showCard } from "../function/outputCards.js";
import {
  editCard,
  addUser,
  getCards,
  getCardByID,
  delUser,
} from "../function/sendRequest.js";

import { UserCardTherapist, UserCardDentist, UserCardCardiologist } from "./userCard.js";


const wrapCards = document.querySelector(".wrap-cards");

class EditForm {
  sendEditCard(form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let modal = document.querySelector(".modal");
      let backgroundColor = document.querySelector(".modal-backdrop"); // метод, в якому закриваємо модальне вікно по натисненню

      if (
        document.body.classList.contains("modal-open") ||
        backgroundColor ||
        modal
      ) {
        backgroundColor.remove();
        modal.remove();
        document.body.classList.remove("modal-open");
      }
    });
  }

  render() {
    this.formEdit = document.createElement("form");
    this.formEdit.className = "edit-form";

    this.formEdit.insertAdjacentHTML(
      "afterbegin",
      `
             <div class="form-group">
                   <label class="form-label" style="width: 100%;">
                        <p>Заповніть свої дані:</p>
                        <input id="full-name" class="form-control" name="fullname" placeholder="Змініть/підтвердіть прізвище">
                   </label>
             </div>
             <div class="form-group">
                   <label class="form-label" style="width: 100%;">
                       <input id="nick-name" class="form-control" name="name" placeholder="Змініть/підтвердіть ім'я">
                   </label>
             </div>
             <div class="form-group">
                  <label class="form-label" style="width: 100%;">
                       <input id="nick-name" class="form-control" name="nickname" placeholder="Змініть/підтвердіть по батькові">
                   </label>
             </div>
             <div class="form-group">
                   <label class="form-label" style="width: 100%;">
                       <textarea class="form-control" cols="50" name="target" rows="1" placeholder="Змініть/підтвердіть ціль візиту"></textarea>
                   </label>
             </div>
             <div class="form-group">
                   <label class="form-label" style="width: 100%;">
                       <textarea class="form-control" cols="50" name="description" rows="1" placeholder="Змініть/підтвердіть короткий опис візиту"></textarea>
                   </label>
             </div>
             <select class="form-control form-group" name="urgency" id="post">
                  <option value="none" disabled selected>Змініть терміновість візиту</option>
                  <option value="Звичайна">Звичайна</option>
                  <option value="Пріоритетна">Пріоритетна</option>
                  <option value="Невідкладна">Невідкладна</option>
             </select>
                `
    );

    this.sendEditCard(this.formEdit);
    return this.formEdit;
  }
}

//////////////////////////////////////////////

export class EditFormTherapist extends EditForm {
  editTerapist(form) {
    form.addEventListener("submit", () => {
      const isFuctionForms = (type) => ["checkbox", "radio"].includes(type);

      const { elements } = form;
      const values = {};

      for (let i = 0; i < elements.length; i++) {
        const formElements = elements[i];
        const { name } = formElements;

        if (name) {
          const { value, type, checked } = formElements;
          values[name] = isFuctionForms(type) ? checked : value;
        }
      }

      const cardID = sessionStorage.getItem("cardID");
      {
        const {
          fullname,
          name,
          nickname,
          target,
          description,
          urgency,
          age,
          id = `${cardID}`,
        } = values;
      }
      const token = localStorage.getItem("token");
      editCard(cardID, values, token).then((data) => {
        const card = new UserCardTherapist(data);
        card.renderCard(wrapCards);
      });
      sessionStorage.clear("card");
    });
  }

  render() {
    super.render();
    this.formEdit.insertAdjacentHTML(
      "beforeend",
      `
      <div class="form-group">
      <label class="form-label" style="width: 100%">
        <input id="doctor" class="form-control" name="doctor" value="Терапевт">
      </label>
 </div>  
           <div class="form-group">
                <label class="form-label" style="width: 100%;">
                    <input type="number" id="age" class="form-control" name="age" placeholder="Змініть/підтвердіть вік">
                </label>
           </div>
           <button type="submit" class="btn btn-primary">Змінити</button>
        `
    );

    this.editTerapist(this.formEdit);
    return this.formEdit;
  }
}

////////////

export class EditFormDentist extends EditForm {
  editDentist(form) {
    form.addEventListener("submit", () => {
      const isFuctionForms = (type) => ["checkbox", "radio"].includes(type);

      const { elements } = form;
      const values = {};

      for (let i = 0; i < elements.length; i++) {
        const formElements = elements[i];
        const { name } = formElements;

        if (name) {
          const { value, type, checked } = formElements;
          values[name] = isFuctionForms(type) ? checked : value;
        }
      }

      const cardID = sessionStorage.getItem("cardID");
      {
        const {
          fullname,
          name,
          nickname,
          target,
          description,
          urgency,
          date,
          id = `${cardID}`,
        } = values;
      }
      const token = localStorage.getItem("token");
      editCard(cardID, values, token).then((data) => {
        const card = new UserCardDentist(data);
        card.renderCard(wrapCards);
      });
      sessionStorage.clear("card");
    });
  }

  render() {
    super.render();
    this.formEdit.insertAdjacentHTML(
      "beforeend",
      `    
           <div class="form-group">
                <label class="form-label" style="width: 100%">
                  <input id="doctor" class="form-control" name="doctor" value="Стоматолог">
                </label>
            </div>  
            <div class="form-group">
                <label class="form-label" style="width: 100%;">
                 <p>Дата останнього візиту:</p>
                    <input type="date" id="date" class="form-control" name="date" placeholder="Змініть/підтвердіть дату останнього візиту">
                </label>
            </div>
            <button type="submit" class="btn btn-primary">Змінити</button>
        `
    );
    this.editDentist(this.formEdit);
    return this.formEdit;
  }
}

/////////////////////////////////

export class EditFormCardiologist extends EditForm {
  editCardiologist(form) {
    form.addEventListener("submit", () => {
      const isFuctionForms = (type) => ["checkbox", "radio"].includes(type);

      const { elements } = form;
      const values = {};

      for (let i = 0; i < elements.length; i++) {
        const formElements = elements[i];
        const { name } = formElements;

        if (name) {
          const { value, type, checked } = formElements;
          values[name] = isFuctionForms(type) ? checked : value;
        }
      }

      const cardID = sessionStorage.getItem("cardID");
      {
        const {
          fullname,
          name,
          nickname,
          target,
          description,
          urgency,
          pressure,
          index,
          diseases,
          age,
          id = `${cardID}`,
        } = values;
      }
      const token = localStorage.getItem("token");
      editCard(cardID, values, token).then((data) => {
        const card = new UserCardCardiologist(data);
        card.renderCard(wrapCards);
      });
      sessionStorage.clear("card");
    });
  }

  render() {
    super.render();
    this.formEdit.insertAdjacentHTML(
      "beforeend",
      `    
        <div class="form-group">
            <label class="form-label" style="width: 100%">
              <input id="doctor" class="form-control" name="doctor" value="Кардіолог">
            </label>
        </div>  
        <div class="form-group">
            <label class="form-label" style="width: 100%;">
                <input type="number" id="pressure" class="form-control" name="pressure" placeholder="Змініть/підтвердіть звичайний тиск">
            </label>
        </div>
        <div class="form-group">
            <label class="form-label" style="width: 100%;">
                <input type="number" id="index" class="form-control" name="index" placeholder="Змініть/підтвердіть індекс маси тіла">
            </label>
        </div>
        <div class="form-group">
            <label class="form-label" style="width: 100%;">
                <input id="diseases" class="form-control" name="diseases" placeholder="Змініть/підтвердіть перенесені захворювання серцево-судинної системи">
            </label>
        </div>
        <div class="form-group">
            <label class="form-label" style="width: 100%;">
                <input type="number" id="age" class="form-control" name="age" placeholder="Змініть/підтвердіть вік">
            </label>
        </div>  
                              
        <button type="submit" class="btn btn-primary">Змінити</button>
    `
    );
    this.editCardiologist(this.formEdit);
    return this.formEdit;
  }
}

//fullname, name, nickname, target, description, urgency, id = `${userID}`
// + age - Therapist
// + date - Dentist
// + pressure, index, diseases, age - Cardiologist
