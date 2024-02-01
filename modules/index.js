import {API,  getToken, getCards, delUser} from "../function/sendRequest.js";
import Modal from "./modal.js";
import allDoctorsButton from "./createButtons.js";
import { userLogin } from "./userLogin.js";
import { output } from "../function/checkout.js";
import { token } from "./userLogin.js";
import { showCard } from "../function/outputCards.js";
import { search } from "../function/search.js";

//console.log(API)
//console.log(token);


export const createBtn = document.querySelector(".create-btn");

createBtn.addEventListener("click", () => {
    const doctorsButton = new allDoctorsButton()   // викликаємо клас, в якому створюємо три кнопки з лікарями

    const newUserModal = new Modal ({
        headerTitle: 'Оберіть Вашого лікаря:',
        body: doctorsButton.render(),
        closeOutside: true
    })

    document.body.append(newUserModal.render());

})

export const loginBtn = document.querySelector(".login-btn");

loginBtn.addEventListener("click", () => {
  
    const user = new userLogin;

    const newUser = new Modal ({
        headerTitle: 'Введіть логін та пароль:',
        body: user.render(),
        closeOutside: true
    })

    document.body.append(newUser.render());

})



const container = document.getElementById('container');
const formContainer = document.querySelector('.filter');
search(formContainer, container);


//delUser(112868);
