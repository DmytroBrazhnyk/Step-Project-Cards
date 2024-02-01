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

    render() {
        const additionalInfoContainer = this.cardElement.querySelector('.additionalInfoContainer');
        additionalInfoContainer.innerHTML = ''; // Очищаємо контейнер перед відображенням

        if (this.isExpanded) {
            Object.keys(this.visitData).forEach(key => {
                additionalInfoContainer.innerHTML += `<p>${key}: ${this.visitData[key]}</p>`;
            });
        }

        document.querySelector('.visits-list').appendChild(this.cardElement);

        this.cardElement.querySelector('.showMoreBtn').innerText = this.isExpanded ? 'Показати менше' : 'Показати більше';
    }

    toggleExpanded() {
        this.isExpanded = !this.isExpanded;
        this.render();
    }

    toggleEditing() {
        this.isEditing = !this.isEditing;
        const additionalInfoContainer = this.cardElement.querySelector('.additionalInfoContainer');
        const visibleInfoContainer = this.cardElement.querySelector('.visibleInfo');

        if (this.isEditing) {
            visibleInfoContainer.style.display = 'none';
            additionalInfoContainer.style.display = 'block';
        } else {
            additionalInfoContainer.style.display = 'none';
            visibleInfoContainer.style.display = 'block';

            visibleInfoContainer.innerHTML = `
                <p>ПІБ: ${this.visitData.fullName}</p>
                <p>Лікар: ${this.visitData.doctorName}</p>
            `;
        }

        this.renderEditForm();
    }

    renderEditForm() {
        const additionalInfoContainer = this.cardElement.querySelector('.additionalInfoContainer');
        additionalInfoContainer.innerHTML = `
            <label for="editedFullName">ПІБ:</label>
            <input type="text" id="editedFullName" value="${this.visitData.fullName}">
            <label for="editedSelectedDoctor">Лікар:</label>
            <input type="text" id="editedSelectedDoctor" value="${this.visitData.doctorName}">
            <label for="editedPurpose">Мета:</label>
            <input type="text" id="editedPurpose" value="${this.visitData.purpose}">
            <!-- Додайте інші поля редагування, використовуючи this.visitData -->
        `;
    }

    saveChanges() {
        this.visitData.fullName = document.getElementById('editedFullName').value;
        this.visitData.doctorName = document.getElementById('editedSelectedDoctor').value;
        this.visitData.purpose = document.getElementById('editedPurpose').value;
        // Оновіть інші поля, якщо необхідно
        // ...

        const additionalInfoContainer = this.cardElement.querySelector('.additionalInfoContainer');
        const visibleInfoContainer = this.cardElement.querySelector('.visibleInfo');

        additionalInfoContainer.style.display = 'none';
        visibleInfoContainer.style.display = 'block';

        visibleInfoContainer.innerHTML = `
            <p>ПІБ: ${this.visitData.fullName}</p>
            <p>Лікар: ${this.visitData.doctorName}</p>
        `;

        this.cardElement.querySelector('.editBtn').style.display = 'inline-block';
        this.cardElement.querySelector('.saveChangesBtn').style.display = 'none';
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
    }
}

const visitCardManager = new VisitCardManager();

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
    // Додавайте більше об'єктів даних візитів за потреби
];

visitsData.forEach(visitData => {
    visitCardManager.addVisitCard(visitData);
});
