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
            <p>ПІБ: ${this.visitData.fullName}</p>
            <p>Лікар: ${this.visitData.doctorName}</p>
            <div class="additionalInfoContainer"></div>
            <button class="showMoreBtn">Показати більше</button>
            <button class="editBtn">Редагувати</button>
            <span class="deleteIcon">❌</span>
        `;

        // Додати обробники подій
        this.cardElement.querySelector('.showMoreBtn').addEventListener('click', () => this.toggleExpanded());
        this.cardElement.querySelector('.editBtn').addEventListener('click', () => this.toggleEditing());
        this.cardElement.querySelector('.deleteIcon').addEventListener('click', () => this.deleteCard());
    }

    render() {
        // Оновити вміст картки залежно від стану
        const additionalInfoContainer = this.cardElement.querySelector('.additionalInfoContainer');

        if (this.isExpanded) {
            // Додати решту інформації в додатковий контейнер
            Object.keys(this.visitData).forEach(key => {
                if (key !== 'fullName' && key !== 'doctorName') {
                    additionalInfoContainer.innerHTML += `<p>${key}: ${this.visitData[key]}</p>`;
                }
            });
        } else {
            additionalInfoContainer.innerHTML = ''; // Очистити додатковий контейнер
        }

        // Оновити вміст картки
        document.querySelector('.visits-list').appendChild(this.cardElement);

        this.cardElement.querySelector('.showMoreBtn').innerText = this.isExpanded ? 'Показати менше' : 'Показати більше';
    }

    toggleExpanded() {
        this.isExpanded = !this.isExpanded;
        this.render();
    }

    toggleEditing() {
        this.isEditing = !this.isEditing;

        if (this.isEditing) {
            // При переході до режиму редагування, ви можете вивести форму для редагування
            // Наприклад, викликати метод для виведення форми редагування
            this.renderEditForm();
        } else {
            // При виході з режиму редагування, оновіть вміст картки та збережіть редаговані дані
            this.updateVisitDataFromForm();
            this.render();
        }
    }

    renderEditForm() {
        const additionalInfoContainer = this.cardElement.querySelector('.additionalInfoContainer');
        additionalInfoContainer.innerHTML = `
            <label for="editedFullName">ПІБ:</label>
            <input type="text" id="editedFullName" value="${this.visitData.fullName}">
            <label for="editedSelectedDoctor">Лікар:</label>
            <input type="text" id="editedSelectedDoctor" value="${this.visitData.doctorName}">
            <!-- Додайте інші поля редагування, використовуючи this.visitData -->
        `;
    }

    updateVisitDataFromForm() {
        // Оновіть дані візиту на основі даних у формі редагування
        this.visitData.fullName = document.getElementById('editedFullName').value;
        this.visitData.selectedDoctor = document.getElementById('editedSelectedDoctor').value;
        // Оновіть інші поля, якщо необхідно
        // ...
    }

    deleteCard() {
        // Логіка видалення картки, наприклад, зображення контейнера
        this.cardElement.remove();
    }
}

function DoctorVisit(doctorName, purpose, description, urgency, fullName, bloodPressure, bmi, cardiovascularDiseases, age, lastVisitDate) {
    this.doctorName = doctorName;
    this.purpose = purpose;
    this.description = description;
    this.urgency = urgency;
    this.fullName = fullName;
    this.bloodPressure = bloodPressure;
    this.bmi = bmi;
    this.cardiovascularDiseases = cardiovascularDiseases;
    this.age = age;
    this.lastVisitDate = lastVisitDate;
}

// Приклад створення об'єкту
const doctorVisitObject = new DoctorVisit(
    'Доктор Іванова',
    'Регулярний огляд',
    'Аналіз крові та артеріального тиску',
    'Пріоритетна',
    'Петренко Іван Петрович',
    '120/80',
    24.5,
    'Немає',
    35,
    '2023-01-09'
);

// Приклад створення об'єкту VisitCard на основі doctorVisitObject
const visitCard = new VisitCard(doctorVisitObject);