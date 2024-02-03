const visitContainer = document.querySelector(".visits-list");

class CreateVisitModal {
    constructor() {
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
    }
    createVisit(){
        const inputs = this.fieldsContainer.querySelectorAll('.modalInput');
        const visitData = {};

        visitData['selectedDoctor'] = visitData['selectedDoctor'] = this.selectElement.options[this.selectElement.selectedIndex].text;;

        inputs.forEach(input => {
            const id = input.id;
            const value = input.type === 'select-one' ? input.options[input.selectedIndex].value : input.value;
            visitData[id] = value;
        });

        this.visit = visitData;
        
        console.log(createVisit.visit);
        this.closeVisitModal();
        //виклик функції для створення картки та відправлення на сервер------
        const card = new Card(createVisit.visit);
        card.addToVisitsList();
        //-------------------------------------------------------------------
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

//тестова строчка допоки не буде кнопки для створення візиту--------
const createVisit = new CreateVisitModal();
//------------------------------------------------------------------
//----------------------------------------------------------------------------------------
class Card {
    constructor(visitData) {
        this.data = visitData;
        this.card = this.createCard();
        this.visitsListSection = document.querySelector('.visits-list');
        this.additionalInfoContainer = this.card.querySelector('.additionalInfoContainer');
        this.btnContainer = this.card.querySelector(".buttonsContainer")
        this.modal 
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
                <button class="deleteIcon">❌</button>
            </div>
        `;
        cardElement.addEventListener('click', this.handleButtonClick.bind(this));
        return cardElement;
    }

    renderAdditionalInfo() {
        let additionalInfoHtml = '';
            for (const key in this.data) {
                if (key !== 'selectedDoctor' && key !== 'fullName') {
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
        this.card.remove();
    }
    showCard(){
        const showMoreBtn = this.card.querySelector('.showMoreBtn')
        this.additionalInfoContainer.classList.toggle('active');
        showMoreBtn.innerText = this.additionalInfoContainer.classList.contains("active") ? "Згорнути" : "Показати більше";
    }
    redactCard() {
        this.additionalInfoContainer.classList.add("hidden");
        this.btnContainer.classList.add("hidden");

        this.modal = document.createElement('div');
        this.modal.classList.add('modal');
        this.modal.innerHTML = `
            <div class="modal-content">
                <h2>Редагування даних</h2>
                ${this.renderEditFields()}
                <button class="saveBtn">Зберегти</button>
            </div>
        `;
        this.card.append(this.modal)

        const saveBtn = this.modal.querySelector('.saveBtn');
        saveBtn.addEventListener('click', () => this.saveChanges());
    }
    renderEditFields() {
        let editFieldsHtml = '';
        for (const key in this.data) {
            if (key !== 'selectedDoctor' && key !== 'fullName') {
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
//-----------------------------------------------------------------------------

const testObj ={ 
            selectedDoctor: 'Кардіолог',
            purpose: 'Регулярний огляд',
            description: 'Аналіз крові та артеріального тиску',
            urgency: 'Пріоритетна',
            fullName: 'Петренко Іван Петрович',
            pressure: '120/80',
            bmi: 24.5,
            cardiovascularDiseases: 'Немає',
            age: 35,
            lastVisitDate: '2023-01-09'
        }
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

        const cardInstance = new Card(testObj);
        cardInstance.addToVisitsList();

        const cardInstance2 = new Card(testObj);
        cardInstance2.addToVisitsList()

        const cardInstance3 = new Card(testObj);
        cardInstance3.addToVisitsList()