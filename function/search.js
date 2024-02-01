
import {getCards} from "../function/sendRequest.js";
import {VisitTherapist, VisitDentist, VisitCardiologist} from "../modules/doctorExtendsForm.js";
import { showCard } from "./outputCards.js";

const container = document.getElementById("container");

export function search(formContainer, visitContainer) {

   const searchWrap = document.createElement('form');
   const searchInput = document.createElement('input');
   const doctorInput = document.createElement('select');
   const doctorInput1 = document.createElement('option');
   const doctorInput2 = document.createElement('option');
   const doctorInput3 = document.createElement('option');
   const doctorInput4 = document.createElement('option');
   const priorityInput = document.createElement('select');
   const priorityInput1 = document.createElement('option');
   const priorityInput2 = document.createElement('option');
   const priorityInput3 = document.createElement('option');
   const priorityInput4 = document.createElement('option');
   const buttonInput = document.createElement('input');

   searchInput.placeholder = "Пошук";
   doctorInput1.innerText = "Виберіть лікаря";
   doctorInput2.innerText = "Терапевт";
   doctorInput3.innerText = "Стоматолог";
   doctorInput4.innerText = "Кардіолог";
   doctorInput.append(doctorInput1, doctorInput2, doctorInput3, doctorInput4);

   priorityInput1.innerText = "Виберіть терміновість";
   priorityInput2.innerText = "Звичайна";
   priorityInput3.innerText = "Пріоритетна";
   priorityInput4.innerText = "Невідкладна";
   priorityInput.append(priorityInput1, priorityInput2, priorityInput3, priorityInput4);

   buttonInput.type = "button";
   buttonInput.value = "Знайти";
   searchWrap.className = 'wrap-filters';
   searchInput.className = 'input';
   doctorInput.className = 'select doctor';
   priorityInput.className = 'select urgency';
   buttonInput.className = "search-btn";

   searchWrap.addEventListener('submit', (e) => {
      e.preventDefault();
      getAndRender();
   });
   searchWrap.append(searchInput, doctorInput, priorityInput, buttonInput);
   formContainer.prepend(searchWrap);

   function getAndRender() {
      visitContainer.innerText = "";
      const visits = showCard(); //отримати дані з сервера і перетворити їх в масив готових для рендеру обєктів
      visits.then(cards => {
         let cardsSearch = cards.filter(visit => {
            if (visit) {
               let searchContent = visit.target + " " + visit.fullName;
               if (searchContent.toLowerCase().includes(searchInput.value.toLowerCase()))
                  if (doctorInput.value === "Виберіть лікаря" && priorityInput.value === "Виберіть терміновість")
                     return true;
                  else
                     return (doctorInput.value === visit.doctor && priorityInput.value === visit.urgency) || (doctorInput.value === "Виберіть лікаря" && priorityInput.value === visit.urgency) || (priorityInput.value === "Виберіть терміновість" && doctorInput.value === visit.doctor);
            }
         });
         cardsSearch.forEach((item) => item.render(visitContainer));
      })
   }

   buttonInput.addEventListener('click', (e) => {
      getAndRender();
   })
}

