import { getToken } from "../function/sendRequest.js";
import { getCards } from "../function/sendRequest.js";
import { showCard } from "../function/outputCards.js";
import { output, checkBtn } from "../function/checkout.js";
import { closeModal } from "../function/closeMod.js";

export let token;


export class userLogin {
  sendData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      console.log(this.login.value, this.password.value);

      getToken(this.login.value, this.password.value)
        .then((response) => response.text())
        .then((token) => {
          localStorage.setItem("token", token);
          closeModal(e);
          showCard(token);
          console.log("set token", token);
        });
    });
  }

  render() {
    this.form = document.createElement("form");
    this.form.className = "login-form";
    this.btn = document.createElement("button");
    this.btn.type = "submit";
    this.btn.classList.add("logBtn");
    this.btn.innerText = "Увійти";

    this.login = document.createElement("input");
    this.password = document.createElement("input");

    this.login.setAttribute("type", "text");
    this.login.setAttribute("placeholder", "Введіть логін/пошту");
    this.login.setAttribute("name", "email");

    this.password.setAttribute("type", "password");
    this.password.setAttribute("placeholder", "Введіть пароль");
    this.password.setAttribute("name", "password");

    this.form.append(this.login, this.password, this.btn);

    this.sendData(this.form);
    return this.form;
  }
}

// function testCreate () {
//   let test = new userLogin ();
//   test.render()
// }
