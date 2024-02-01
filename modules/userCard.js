import { delUser, getCardByID } from "../function/sendRequest.js";
import {
  VisitTherapist,
  VisitDentist,
  VisitCardiologist,
} from "../modules/doctorExtendsForm.js";
import Modal from "./modal.js";
import { EditFormTherapist, EditFormDentist, EditFormCardiologist } from "./editForm.js";
import { showCard } from "../function/outputCards.js";
import { token } from "./userLogin.js";

class UserCard {
  constructor(options) {
    // Основний клас, в якому є основні елементи для всіх лікарів
    this.fullname = options.fullname; //  і від якого наслідується три окремі класи для створення карточок на екрані
    this.name = options.name;
    this.nickname = options.nickname;
    this.target = options.target;
    this.description = options.description;
    this.urgency = options.urgency;
    this.userId = options.id;
    // this.doctor = options.doctor;
  }

  createHeader() {
    this.mainCard = document.createElement("div");
    this.mainCard.classList.add("card", "user-card");
    this.mainCard.insertAdjacentHTML(
      "afterbegin",
      `
            <div class="card-header">
                  <span class="icon-delete" data-action="delete">
                       <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"  viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;opacity:0;}.cls-2{fill:#231f20;}</style></defs><title>close</title><g id="Layer_2" data-name="Layer 2"><g id="close"><g id="close-2" data-name="close">
                       <rect data-action="delete" class="cls-1" width="24" height="24" transform="translate(24 24) rotate(180)"/>
                       <path data-action="delete" class="cls-2" d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"/></g></g></g></svg>
                  </span>
                 <p><span class="colored">Прізвище:</span>  ${this.fullname}</p>
                 <p><span class="colored">Ім'я:</span>  ${this.name}</p>
                 <p><span class="colored">По батькові:</span>  ${this.nickname}</p>                
                 <p><span class="colored doctors">Лікар:</span> ${this.doctor}</p>
                 <button class="edit-btn">Редагувати</button>        
                 <button class="more-btn">Показати більше</button>        
            </div>             
            `
    );

    this.mainCard.dataset.userId = this.userId;

    return this.mainCard;
  }

  showMore() {
    this.mainCard.addEventListener("click", (event) => {
      const footerInfo = event.target.closest(".more-btn"); // при кліку "Показати більше" виводимо додаткову інфу

      if (footerInfo) {
        const idAddInfo = footerInfo
          .closest(".user-card")
          .querySelector(".footer-info");
        if (!idAddInfo.classList.contains(".footer-info_active")) {
          idAddInfo.classList.add("footer-info_active");
        }
      }
    });
  }

  editCard() {
    const token = localStorage.getItem("token");
    this.mainCard.addEventListener("click", (event) => {
      const edit = event.target.closest(".edit-btn");
      const cardID = this.mainCard.getAttribute("data-user-id");
      console.log(cardID);
      sessionStorage.setItem("cardID", cardID);

      if (edit) {
        getCardByID(cardID, token).then((data) => {
          if (data.doctor === "Терапевт") {
            const editCard = new EditFormTherapist();

            const editForm = new Modal({
              headerTitle: "Терапевт",
              body: editCard.render(),
              closeOutside: true,
            });
            document.body.append(editForm.render(this.mainCard));
          } else {
            if (data.doctor === "Стоматолог") {
              const editCard = new EditFormDentist();
  
              const editForm = new Modal({
                headerTitle: "Стоматолог",
                body: editCard.render(),
                closeOutside: true,
              });
              document.body.append(editForm.render(this.mainCard));
            } else {
              if (data.doctor === "Кардіолог") {
                const editCard = new EditFormCardiologist();
    
                const editForm = new Modal({
                  headerTitle: "Кардіолог",
                  body: editCard.render(),
                  closeOutside: true,
                });
                document.body.append(editForm.render(this.mainCard));
              }
            }
          }

          console.log(data);
        });
        console.log("Edit form");
      } 
    });
  }

  deleteCardsInfo() {
    const token = localStorage.getItem("token");
    this.mainCard.addEventListener("click", (event) => {
      const delCards = event.target.closest(".icon-delete");
      if (delCards) {
        const deleteCards = event.target
          .closest(".card")
          .getAttribute("data-user-id");

        delUser(deleteCards, token).then((data) => {
          // запит на видалення картки
          if (data.ok) {
            console.log(data);
            delCards.closest(".card").remove();
          }
        });
      }

      const footerInfoDelete = event.target.closest(".info_delete"); // при кліку на хрестик видаляємо додаткову інфу юзера
      if (footerInfoDelete) {
        const deleteInfo = footerInfoDelete
          .closest(".user-card")
          .querySelector(".footer-info");
        deleteInfo.classList.remove("footer-info_active");
      }
    });
  }
}

///////////////////////////////////////////////////////////////

export class UserCardTherapist extends UserCard {
  constructor(options, doctor = "Терапевт") {
    super(options);
    this.age = options.age;
    this.doctor = doctor;
  }

  renderShowMore() {
    super.createHeader(); // Метод в якому ми створюємо від основного класу UserCard основіні поля і нижче добавляємо вже додаткові для кожного лікаря
    this.mainCard.insertAdjacentHTML(
      "beforeend",
      `
        <div class="footer-info">
        <span class="info_delete" data-action="delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"  viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;opacity:0;}.cls-2{fill:#231f20;}</style></defs><title>close</title><g id="Layer_2" data-name="Layer 2"><g id="close"><g id="close-2" data-name="close">
            <rect data-action="delete" class="cls-1" width="24" height="24" transform="translate(24 24) rotate(180)"/>
            <path data-action="delete" class="cls-2" d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"/></g></g></g></svg>
        </span>
        
        <p><span class="colored">Ціль візиту:</span>  ${this.target}</p>
        <p><span class="colored">Опис :</span>  ${this.description}</p>
        <p><span class="colored">Терміновість:</span>  ${this.urgency}</p>
        <p><span class="colored">Вік:</span>  ${this.age}</p>
   </div>
            `
    );

    return this.mainCard;
  }

  renderCard(wrap) {
    // метод в якому ми добавляємо всі вищесказані елементи на екран
    wrap.append(this.renderShowMore());
    this.deleteCardsInfo();
    this.showMore();
    this.editCard();
  }
}

///////////////////////////////////////////////////

export class UserCardDentist extends UserCard {
  constructor(options, doctor = "Стоматолог") {
    super(options);
    this.date = options.date;
    this.doctor = doctor;
  }

  renderShowMore() {
    super.createHeader();
    this.mainCard.insertAdjacentHTML(
      "beforeend",
      `
        <div class="footer-info">
                      <span class="info_delete" data-action="delete">
                           <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"  viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;opacity:0;}.cls-2{fill:#231f20;}</style></defs><title>close</title><g id="Layer_2" data-name="Layer 2"><g id="close"><g id="close-2" data-name="close">
                           <rect data-action="delete" class="cls-1" width="24" height="24" transform="translate(24 24) rotate(180)"/>
                           <path data-action="delete" class="cls-2" d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"/></g></g></g></svg>
                     </span>
                     
                     <p><span class="colored">Ціль візиту:</span>  ${this.target}</p>
                     <p><span class="colored">Опис :</span>  ${this.description}</p>
                     <p><span class="colored">Терміновість:</span>  ${this.urgency}</p>
                     <p><span class="colored">Дата останнього візиту:</span>  ${this.date}</p>                   
                </div>    
  
            `
    );

    return this.mainCard;
  }

  renderCard(wrap) {
    wrap.append(this.renderShowMore());
    this.deleteCardsInfo();
    this.showMore();
    this.editCard();
  }
}

//////////////////////////////////////////////////

export class UserCardCardiologist extends UserCard {
  constructor(options, doctor = "Кардіолог") {
    super(options);
    this.pressure = options.pressure;
    this.index = options.index;
    this.diseases = options.diseases;
    this.age = options.age;
    this.doctor = doctor;
  }

  renderShowMore() {
    super.createHeader();
    this.mainCard.insertAdjacentHTML(
      "beforeend",
      `
        <div class="footer-info">
        <span class="info_delete" data-action="delete">
             <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"  viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;opacity:0;}.cls-2{fill:#231f20;}</style></defs><title>close</title><g id="Layer_2" data-name="Layer 2"><g id="close"><g id="close-2" data-name="close">
             <rect data-action="delete" class="cls-1" width="24" height="24" transform="translate(24 24) rotate(180)"/>
             <path data-action="delete" class="cls-2" d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"/></g></g></g></svg>
        </span>
        
        <p><span class="colored">Ціль візиту:</span>  ${this.target}</p>
        <p><span class="colored">Опис :</span>  ${this.description}</p>
        <p><span class="colored">Терміновість:</span>  ${this.urgency}</p>
        <p><span class="colored">Звичайний тиск:</span>  ${this.pressure}</p>
        <p><span class="colored">Індекс маси тіла:</span>  ${this.index}</p>
        <p><span class="colored">Перенесені захворювання серцево-судинної системи:</span>  ${this.diseases}</p>
        <p><span class="colored">Вік:</span>  ${this.age}</p>
  </div>

                
            `
    );

    return this.mainCard;
  }

  renderCard(wrap) {
    wrap.append(this.renderShowMore());
    this.deleteCardsInfo();
    this.showMore();
    this.editCard();
  }
}
