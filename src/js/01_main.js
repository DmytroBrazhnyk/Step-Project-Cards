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
