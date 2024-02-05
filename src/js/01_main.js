const visitContainer = document.querySelector(".visits-list");
const loginButton = document.getElementById('header-userActions-loginButton');
loginButton.addEventListener("click", () => new Login());
let userToken = "";

const createCardButton = document.getElementById('header-userActions-createCard');
createCardButton.addEventListener('click', () => {
    let createVisit = new CreateVisitModal();
});

class CreateVisitModal {
    constructor() {
        createCardButton.classList.toggle("hidden");

        this.modal = document.createElement('div');
        this.modal.classList.add('creadeVisitModal');
        this.modal.innerHTML = `
        <div class="modal-content">
            <label for="doctorSelect">Оберіть лікаря:</label>
            <select id="doctorSelect">
                <option value="" disabled selected hidden>Оберіть лікаря</option>
                <option value="cardiologist">Кардіолог</option>
                <option value="dentist">Стоматолог</option>
                <option value="therapist">Терапевт</option>
            </select>
            <div id="fieldsContainer"></div>
        </div>
        `;

        document.body.appendChild(this.modal);

        this.selectElement = document.getElementById('doctorSelect');
        this.fieldsContainer = document.getElementById('fieldsContainer');
        this.selectElement.addEventListener('change', this.handleDoctorChange.bind(this));
    }
    handleDoctorChange() {
        const selectedDoctor = this.selectElement.value;
        this.updateAdditionalFields(selectedDoctor);
    }
    updateAdditionalFields(selectedDoctor) {

        this.fieldsContainer.innerHTML = '';

        this.createInputField("purpose","Мета візиту")
        this.createInputField("description","Короткий опис візиту")
        this.createSelectField("urgency", "Терміновість", ["Звичайна", "Пріоритетна", "Невідкладна"],"оберіть терміновість");
        this.createInputField("fullName","ПІБ")

        if (selectedDoctor === 'cardiologist') {
            this.createInputField('pressure', 'Звичайний тиск:');
            this.createInputField('bmi', 'Індекс маси тіла:');
            this.createInputField('cardiovascularDiseases', 'Перенесені захворювання серцево-судинної системи:');
            this.createInputField('age', 'Вік:');
        } else if (selectedDoctor === 'dentist') {
            this.createInputField('lastVisitDate', 'Дата останнього відвідування:');
        } else if (selectedDoctor === 'therapist') {
            this.createInputField('age', 'Вік:');
        }

        const createBtn = document.createElement('button');
        createBtn.innerText = 'Створити';
        createBtn.addEventListener('click', () => this.createVisit());
        this.fieldsContainer.appendChild(createBtn);

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'Закрити';
        closeBtn.addEventListener('click', () => this.closeVisitModal());
        this.fieldsContainer.appendChild(closeBtn);

    }

    closeVisitModal(){
        this.modal.remove();
        createCardButton.classList.toggle("hidden");
    }
    createVisit(){
        const inputs = this.fieldsContainer.querySelectorAll('.modalInput');
        const visitData = {};
        this.valid = true;

        visitData['selectedDoctor'] = visitData['selectedDoctor'] = this.selectElement.options[this.selectElement.selectedIndex].text;;

        inputs.forEach(input => {
            const id = input.id;
            let value;
            // Отримати значення input
            if (input.type === 'select-one') {
                value = input.options[input.selectedIndex].value;
            } else {
                value = input.value;
            }
    
            // Викликати валідацію
            if (input.type === 'select-one') {
                this.selectValidation(id, value);
            } else {
                this.inputValidation(id, value);
            }
            console.log(this.valid);
            visitData[id] = value;
        });

        if(this.valid){
            this.visit = visitData;
            console.log(this.visit);
            this.closeVisitModal();
            this.pushToServer(this.visit);
        }else{
            console.log("(");
        }       
    }
    selectValidation(id, value) {
        if (value === "") {
            this.valid = false
        }
        
    }
    inputValidation(id,value){
        const stringFields = [
            "purpose",
            "description",
            "fullName",
            "cardiovascularDiseases",
            "lastVisitDate"
        ];
        if (stringFields.includes(id)) {
            if (typeof value !== 'string' || value.trim() === '') {
                console.log(`Поле ${id} повинно бути строкою та не може бути порожнім.`);
                this.validation = false;
            }
        }
        if (id === "age") {
            if (isNaN(value)) {
                console.log(`Поле ${id} повинно бути числом.`);
                this.valid = false;
            }
        } else if (id === "bmi") {
            const bmiValue = parseFloat(value);
            if (isNaN(bmiValue) || bmiValue < 10 || bmiValue > 50) {
                console.log(`Поле ${id} повинно бути реалістичним індексом маси тіла.`);
                this.valid = false;
            }
        } else if (id === "pressure") {
            const pressureRegex = /^\d+([\/\\])\d+$/;
            if (!pressureRegex.test(value)) {
                console.log(`Поле ${id} повинно бути у форматі 80/120 або 80\\120.`);
                this.valid = false;
            } else {
                const [lower, upper] = value.split('/').map(Number);
                if (lower < 30 || upper < lower || upper > 300) {
                    console.log(`Поле ${id} повинно бути в діапазоні 30-150/30-300.`);
                    this.valid = false;
                }
            }
        }
    }

    pushToServer(visit) {
        fetch("https://ajax.test-danit.com/api/v2/cards", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(visit) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(response => {
            console.log(response)
            const card = new Card(response);
        card.addToVisitsList();
        })
        .catch(error => console.error('Помилка:', error));
    }

    createInputField(fieldName, label) {
        const inputField = document.createElement('div');
        inputField.innerHTML = `
            <label for="${fieldName}">${label}</label>
            <input type="text" id="${fieldName}" name="${fieldName}" class="modalInput">
        `;
        this.fieldsContainer.appendChild(inputField);
    }
    createSelectField(fieldName, label, options) {
        const selectField = document.createElement('div');
        const selectOptions = options.map(option => `<option value="${option}">${option}</option>`).join('');
        selectField.innerHTML = `
            <label for="${fieldName}">${label}</label>
            <select id="${fieldName}" name="${fieldName}" class="modalInput">
                <option value="" disabled selected hidden>Оберіть ${label.toLowerCase()}</option>
                ${selectOptions}
            </select>
        `;
        this.fieldsContainer.appendChild(selectField);
    }
}
//----------------------------------------------------------------------------------------
class Card {
    static currentEditingCard = null;

    constructor(visitData) {
        this.data = visitData;
        this.isEditing = false; //перевірка чи відкрита форма редагування
        this.card = this.createCard();
        this.visitsListSection = document.querySelector('.visits-list');
        this.additionalInfoContainer = this.card.querySelector('.additionalInfoContainer');
        this.btnContainer = this.card.querySelector(".buttonsContainer")
        this.modal 

        this.card.cardInstance = this;
    }

    putToServer(card) {
        const cardId = this.data.id;
        fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(card) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(response => {
            console.log(response)
        })
        .catch(error => console.error('Помилка:', error));
    }

    createCard() {
        const cardElement = document.createElement("div");
        cardElement.classList.add("visitCard");
        cardElement.innerHTML = `
            <div class="visibleInfo">
                <p>ПІБ: ${this.data.fullName}</p>
                <p>Лікар: ${this.data.selectedDoctor}</p>
            </div>
            <div class="additionalInfoContainer">
                ${this.renderAdditionalInfo()}
            </div>
            <div class="buttonsContainer">
                <button class="showMoreBtn">Показати більше</button>
                <button class="editBtn">Редагувати</button>
            </div>
            <button class="deleteIcon">❌</button>
        `;
        cardElement.addEventListener('click', this.handleButtonClick.bind(this));
        return cardElement;
    }

    renderAdditionalInfo() {
        let additionalInfoHtml = '';
            for (const key in this.data) {
                if (key !== 'selectedDoctor' && key !== 'fullName' && key !== 'id') {
                    const translatedKey = translations[key] || key;
                    additionalInfoHtml += `<p>${translatedKey}: ${this.data[key]}</p>`;
                }
            }
        return additionalInfoHtml;
    }
//------------------------кнопки--------------------------------------------
    handleButtonClick(event) {
        const target = event.target;
        if (target.classList.contains('editBtn')) {
            this.redactCard();
        } else if (target.classList.contains('deleteIcon')) {
            this.deleteCard();
        } else if (target.classList.contains("showMoreBtn")){
            this.showCard();
        }
    }

    deleteCard() {
        const cardId = this.data.id;

        if (cardId) {
            fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete card with ID ${cardId}`);
                }
                this.card.remove();
            })
            .catch(error => console.error(error));
        }
    }
    showCard(){
        const showMoreBtn = this.card.querySelector('.showMoreBtn')
        this.additionalInfoContainer.classList.toggle('active');
        showMoreBtn.innerText = this.additionalInfoContainer.classList.contains("active") ? "Згорнути" : "Показати більше";
    }
    redactCard() {
        if (!Card.currentEditingCard) { // перевіряємо, чи не редагується вже інша карта
            Card.currentEditingCard = this; // зберігаємо посилання на поточну редаговану карту
            this.additionalInfoContainer.classList.add("hidden");
            this.btnContainer.classList.add("hidden");

            this.modal = document.createElement('div');
            this.modal.classList.add('modal');
            this.modal.innerHTML = `
                <div class="modal-edit-content">
                    <h2>Редагування даних</h2>
                    <section>
                        ${this.renderEditFields()}
                    </section>
                    <button class="saveBtn">Зберегти</button>
                </div>
            `;
            this.card.append(this.modal)

            const saveBtn = this.modal.querySelector('.saveBtn');
            saveBtn.addEventListener('click', () => this.saveChanges());
        }
    }
    renderEditFields() {
        let editFieldsHtml = '';
        for (const key in this.data) {
            if (key !== 'selectedDoctor' && key !== 'fullName' && key !== 'id') {
                const translatedKey = translations[key] || key;
                if (key === 'urgency') {
                    editFieldsHtml += `
                        <div class="edit-field">
                            <label for="${key}">${translatedKey}</label>
                            <select id="${key}">
                                <option value="Звичайна" ${this.data[key] === 'Звичайна' ? 'selected' : ''}>Звичайна</option>
                                <option value="Пріоритетна" ${this.data[key] === 'Пріоритетна' ? 'selected' : ''}>Пріоритетна</option>
                                <option value="Невідкладна" ${this.data[key] === 'Невідкладна' ? 'selected' : ''}>Невідкладна</option>
                            </select>
                        </div>
                    `;
                } else {
                    editFieldsHtml += `
                        <div class="edit-field">
                            <label for="${key}">${translatedKey}</label>
                            <input type="text" id="${key}" value="${this.data[key]}">
                        </div>
                    `;
                }
            }
        }
        return editFieldsHtml;
    }
    saveChanges() {
        const newData = {};
        
        for (const key in this.data) {
            const inputField = document.getElementById(key);
            if (inputField && inputField.value !== undefined) {
                newData[key] = inputField.value;
            }
        }

        for (const key in newData) {
            if (this.data.hasOwnProperty(key)) {
                this.data[key] = newData[key];
            }
        }
        
        this.modal.remove();
        console.log(this.data);
        this.updateAdditionalInfo();
        this.additionalInfoContainer.classList.remove("hidden");
        this.btnContainer.classList.remove("hidden");
        this.putToServer(this.data);
        Card.currentEditingCard = null; // позначаємо, що форма редагування закрита
    }

    updateAdditionalInfo() {
        const newAdditionalInfoHtml = this.renderAdditionalInfo();
        this.additionalInfoContainer.innerHTML = newAdditionalInfoHtml;
    }


//---------------------------------------------------------------------------
    addToVisitsList() {
        this.visitsListSection.appendChild(this.card);
    }
}
//-------login------------------------------------------------------------
class Login {
    constructor() {
        this.modal = this.createLoginModal();
        document.body.append(this.modal);
        this.loginButton = document.getElementById('header-userActions-loginButton');
        this.loginButton.classList.add("hidden");
        this.loginEventButton = this.modal.querySelector("#loginBtn");
        this.errorElement = this.modal.querySelector("#error-message"); // Додали елемент для відображення повідомлення про помилку
        this.loginEventButton.addEventListener('click', () => this.loginEvent());
    }

    createLoginModal() {
        const loginModal = document.createElement('div');
        loginModal.classList.add('loginModal');
        loginModal.innerHTML = `
            <section>
                <label for="email">Email:</label>
                <input type="email" id="email" />
            </section>            
            <br />
            <section>
                <label for="password">Пароль:</label>
                <input type="password" id="password" />
            </section>
            <br />
            <button id="loginBtn">Увійти</button>
            <p id="error-message" class="error-message"></p> <!-- Додали елемент для відображення повідомлення про помилку -->
        `;
        return loginModal;
    }

    loginEvent() {
        const emailInput = this.modal.querySelector("#email");
        const passwordInput = this.modal.querySelector("#password");
        const email = emailInput.value;
        const password = passwordInput.value;

        fetch("https://ajax.test-danit.com/api/v2/cards/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Неправильні дані');
            }
            return response.text();
        })
        .then(token => {
            userToken = token;
            console.log(userToken);

            createCardButton.classList.add('active');
            this.displayCards();

            this.modal.remove();
        })
        .catch(error => {
            console.error('Error:', error);
            this.clearFields();
            this.showError('Неправильні дані'); 
        });
    }

    clearFields() {
        const emailInput = this.modal.querySelector("#email");
        const passwordInput = this.modal.querySelector("#password");
        emailInput.value = '';
        passwordInput.value = '';
        this.hideError(); 
    }
    showError(message) {
        this.errorElement.textContent = message;
        this.errorElement.classList.add("visible");
    }
    hideError() {
        this.errorElement.textContent = '';
        this.errorElement.classList.remove("visible");
    }
    displayCards(){
        fetch("https://ajax.test-danit.com/api/v2/cards", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(cardData => {
                const card = new Card(cardData);
                card.addToVisitsList();
            });
        })
        .catch(error => console.error('Помилка:', error));
            }
        }

//-----------------------------------------------------------------------
class Filter {
    constructor() {
        this.initElements();
        this.attachListeners();
    }
    initElements() {
        this.visitTitleInput = document.getElementById('visitTitle');
        this.urgencyFilterSelect = document.getElementById('urgencyFilter');
    }
    attachListeners() {
        this.visitTitleInput.addEventListener('input', this.handleInputChange.bind(this));
        this.urgencyFilterSelect.addEventListener('change', this.handleSelectChange.bind(this));
    }
    handleInputChange(event) {
        const inputValue = event.target.value;
        console.log(`Input changed: ${inputValue}`);
        this.applyFilters();
    }
    handleSelectChange(event) {
        const selectValue = event.target.value;
        console.log(`Select changed: ${selectValue}`);
        this.applyFilters();
    }
    applyFilters() {
        const selectedUrgency = this.urgencyFilterSelect.value;
        const inputDescriptionOrPurpose = this.visitTitleInput.value.toLowerCase().trim();
    
        const visitCards = document.querySelectorAll('.visitCard');
    
        visitCards.forEach(cardElement => {
            const cardInstance = cardElement.cardInstance;
    
            const urgencyValue = cardInstance.data.urgency;
            const descriptionValue = cardInstance.data.description.toLowerCase().trim();
            const purposeValue = cardInstance.data.purpose.toLowerCase().trim();
            console.log(urgencyValue);
            if (
                (selectedUrgency === urgencyValue || selectedUrgency === "Усі") &&
                (descriptionValue.includes(inputDescriptionOrPurpose) || purposeValue.includes(inputDescriptionOrPurpose))
            ) {
                cardElement.classList.remove('hidden');  
            } else {
                cardElement.classList.add('hidden');   
            }
        });
    }
}
const filter = new Filter();
const translations = {
            doctorName: 'Лікар',
            purpose: 'Мета візиту',
            description: 'Короткий опис візиту',
            urgency: 'Терміновість',
            fullName: 'ПІБ',
            pressure: 'Звичайний тиск',
            bmi: 'Індекс маси тіла',
            cardiovascularDiseases: 'Перенесені захворювання серцево-судинної системи',
            age: 'Вік',
            lastVisitDate: 'Дата останнього відвідування'
};