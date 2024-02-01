import { getCards } from "./sendRequest.js";
import { token } from "../modules/userLogin.js";
import { loginBtn, createBtn } from "../modules/index.js";
import { showCard } from "./outputCards.js";
import { search } from "./search.js";

const wrapCards = document.querySelector(".wrap-cards");


export function output (token) {
  console.log("test");
  getCards(token)
  .then(data => {


if(data.length === 0) {
  document.querySelector('.empty').classList.remove('disactive')
  wrapCards.insertAdjacentHTML('afterbegin', `
  <p class="empty">No items have been added</p>
  `)  
} else {
  document.querySelector('.empty')?.remove()
}
  })
}

export function checkBtn (token) {
  if(token) {
    loginBtn.classList.add('disactive');
    createBtn.classList.remove('disactive');
    createBtn.classList.add('active');
   // output ();
  }
}

window.onload = () =>{
 

//  localStorage.clear('token');
//  sessionStorage.clear("card")



//  showCard ();  
//   output ();
//   checkBtn ();

const token = localStorage.getItem('token')

if(!token === "09a83290-418f-4524-af14-1acb64dcde24") {
  wrapCards.insertAdjacentHTML('afterbegin', `
  <p class="empty">No items have been added</p>
  `)  
} else {
  checkBtn (token);
  output (token);
  showCard(token);
  
}


   // if(token) {
   //     console.log("token is found");
   //     loginBtn.classList.add('disactive')
   //     createBtn.classList.remove('active')
   //     showCard();
 
   //   } else {
   //     console.log("token is not found");
   //     loginBtn.classList.add('active')
   //     createBtn.classList.remove('disactive')
   //   }
 
   }
   