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
            this.createInputField('heartDiseases', 'Перенесені захворювання серцево-судинної системи:');
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

// картка візиту
class VisitCard {
    constructor(visitData) {
        this.visitData = visitData;
        this.isExpanded = false;
        this.isEditing = false;
        this.createCardElement();
        this.render();
    }

    createCardElement() {
        this.cardElement = document.createElement('div');
        this.cardElement.classList.add('visitCard');

        // Додати інформацію, яка завжди видима
        this.cardElement.innerHTML = `
            <div class="visibleInfo">
                <p>ПІБ: ${this.visitData.fullName}</p>
                <p>Лікар: ${this.visitData.doctorName}</p>
            </div>
            <div class="additionalInfoContainer"></div>
            <button class="showMoreBtn">Показати більше</button>
            <button class="editBtn">Редагувати</button>
            <button class="saveChangesBtn" style="display: none;">Зберегти зміни</button>
            <span class="deleteIcon">❌</span>
        `;

        // Додати обробники подій
        this.cardElement.querySelector('.showMoreBtn').addEventListener('click', () => this.toggleExpanded());
        this.cardElement.querySelector('.editBtn').addEventListener('click', () => this.toggleEditing());
        this.cardElement.querySelector('.saveChangesBtn').addEventListener('click', () => this.saveChanges());
        this.cardElement.querySelector('.deleteIcon').addEventListener('click', () => this.deleteCard());
    }

    updateShowMoreButtonOnEditing() {
        const showMoreButton = this.cardElement.querySelector('.showMoreBtn');
        if (showMoreButton) {
            showMoreButton.disabled = this.isEditing;
        }
    }

    render() {
        const additionalInfoContainer = this.cardElement.querySelector('.additionalInfoContainer');
        additionalInfoContainer.innerHTML = '';

        if (this.isExpanded && !this.isEditing) {
            Object.keys(this.visitData).forEach(key => {
                const translatedKey = translations[key] || key;

                if (key === 'urgency' && !this.isEditing) {
                    additionalInfoContainer.innerHTML += `
                        <p>${translatedKey}: ${this.visitData[key]}</p>
                    `;
                } else if (key !== 'doctorName') {
                    additionalInfoContainer.innerHTML += `<p>${translatedKey}: ${this.visitData[key]}</p>`;
                }
            });
        }

        document.querySelector('.visits-list').appendChild(this.cardElement);

        const showMoreBtn = this.cardElement.querySelector('.showMoreBtn');
        showMoreBtn.disabled = this.isEditing;
        showMoreBtn.innerText = this.isExpanded ? 'Приховати' : 'Показати більше';
    }

    toggleExpanded() {
        this.isExpanded = !this.isExpanded;
        this.render();
    }

    toggleEditing() {
        this.isEditing = !this.isEditing;
    
        if (this.isEditing) {
            this.displayEditForm();
            this.cardElement.querySelector('.showMoreBtn').disabled = true;
        } else {
            this.saveChanges();
            this.hideEditForm();
            this.cardElement.querySelector('.showMoreBtn').disabled = false;
        }
    
        this.render();
        this.updateShowMoreButtonOnEditing();
    }

    displayEditForm(visitData) {
        const additionalInfoContainer = this.cardElement.querySelector('.additionalInfoContainer');
        const visibleInfoContainer = this.cardElement.querySelector('.visibleInfo');
    
        visibleInfoContainer.style.display = 'none';
        additionalInfoContainer.style.display = 'block';
    
        // Встановлюємо значення visitData для використання у формі редагування
        this.visitData = visitData;
    
        this.renderEditForm();
    }

    hideEditForm() {
        const additionalInfoContainer = this.cardElement.querySelector('.additionalInfoContainer');
        const visibleInfoContainer = this.cardElement.querySelector('.visibleInfo');
    
        additionalInfoContainer.style.display = 'none';
        visibleInfoContainer.style.display = 'block';
    
        this.cardElement.querySelector('.editBtn').style.display = 'inline-block';
        this.cardElement.querySelector('.saveChangesBtn').style.display = 'none';
    
        if (this.isExpanded) {
            additionalInfoContainer.style.display = 'block';
        }
    
        this.render();
        this.updateShowMoreButtonOnEditing();
    }

    renderEditForm() {
        const additionalInfoContainer = this.cardElement.querySelector('.additionalInfoContainer');
        additionalInfoContainer.innerHTML = '<div class="editForm">';
    
        Object.keys(this.visitData).forEach(key => {
            if (key !== 'doctorName') {
                const translatedKey = translations[key] || key;
                if (key === 'urgency') {
                    // Додайте дропдаун для "Терміновості"
                    additionalInfoContainer.innerHTML += `
                        <div>
                            <label for="edited${key}">${translatedKey}:</label>
                            <select id="edited${key}">
                                ${urgencyOptions.map(option => `<option value="${option}" ${this.visitData[key] === option ? 'selected' : ''}>${option}</option>`).join('')}
                            </select>
                        </div>
                    `;
                } else {
                    // Звичайний ввід для інших полів
                    additionalInfoContainer.innerHTML += `
                        <div>
                            <label for="edited${key}">${translatedKey}:</label>
                            <input type="text" id="edited${key}" value="${this.visitData[key]}">
                        </div>
                    `;
                }
            }
        });
    
        additionalInfoContainer.innerHTML += '</div>';
    
        this.cardElement.querySelector('.editBtn').style.display = 'none';
        this.cardElement.querySelector('.saveChangesBtn').style.display = 'inline-block';
    
        this.cardElement.querySelector('.saveChangesBtn').addEventListener('click', () => this.saveChanges());
    }

    updateVisitData() {
        const additionalInfoContainer = this.cardElement.querySelector('.additionalInfoContainer');
    
        Object.keys(this.visitData).forEach(key => {
            if (key !== 'doctorName') {
                this.visitData[key] = document.getElementById(`edited${key}`).value;
            }
        });
    
        additionalInfoContainer.innerHTML = '';
    
        Object.keys(this.visitData).forEach(key => {
            additionalInfoContainer.innerHTML += `<p>${key}: ${this.visitData[key]}</p>`;
        });
    
        this.render();
    }

    saveChanges() {
        this.updateVisitData();
        // this.hideEditForm();
        this.updateShowMoreButtonOnEditing();
        this.render();
    }

    deleteCard() {
        this.cardElement.remove();
    }
}

class VisitCardManager {
    constructor() {
        this.visitsList = document.querySelector('.visits-list');
    }

    addVisitCard(visitData) {
        const visitCard = new VisitCard(visitData);
        this.visitsList.appendChild(visitCard.cardElement);
    
        // Додайте обробник подій для кнопки "Редагувати"
        visitCard.cardElement.querySelector('.editBtn').addEventListener('click', () => visitCard.displayEditForm(visitData));
    }
}

const visitCardManager = new VisitCardManager();

const translations = {
    doctorName: 'Лікар',
    purpose: 'Мета',
    description: 'Опис',
    urgency: 'Терміновість',
    fullName: 'ПІБ',
    bloodPressure: 'Тиск',
    bmi: 'ІМТ',
    cardiovascularDiseases: 'Кардіоваскулярні захворювання',
    age: 'Вік',
    lastVisitDate: 'Дата останнього візиту'
};

const urgencyOptions = ['Висока', 'Середня', 'Низька'];

// Приклад данних для кількох візитів
const visitsData = [
    { 
        doctorName: 'Доктор Іванова',
        purpose: 'Регулярний огляд',
        description: 'Аналіз крові та артеріального тиску',
        urgency: 'Пріоритетна',
        fullName: 'Петренко Іван Петрович',
        bloodPressure: '120/80',
        bmi: 24.5,
        cardiovascularDiseases: 'Немає',
        age: 35,
        lastVisitDate: '2023-01-09'
    },
    // { 
    //     doctorName: 'Доктор Іванова',
    //     purpose: 'Регулярний огляд',
    //     description: 'Аналіз крові та артеріального тиску',
    //     urgency: 'Пріоритетна',
    //     fullName: 'Петренко Іван Петрович',
    //     bloodPressure: '120/80',
    //     bmi: 24.5,
    //     cardiovascularDiseases: 'Немає',
    //     age: 35,
    //     lastVisitDate: '2023-01-09'
    // },
    // Додавайте більше об'єктів даних візитів за потреби
];

visitsData.forEach(visitData => {
    visitCardManager.addVisitCard(visitData);
});
