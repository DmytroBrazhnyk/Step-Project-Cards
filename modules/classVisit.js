export default class Visit {
    sendUserData(form) {
        form.addEventListener("submit",(event) => {
            event.preventDefault()

            let modal = document.querySelector('.modal')
            let backgroundColor = document.querySelector(".modal-backdrop")    /// метод, в якому закриваємо модальне вікно по натисненні

            if (document.body.classList.contains('modal-open') || backgroundColor || modal) {
                backgroundColor.remove()
                modal.remove()
                document.body.classList.remove('modal-open')
            }
        })
    }                    ////// Основний клас по створеню форми, де 5 спільних інпутів 

    createGeneralForms() {
        this.formElem = document.createElement('form')
        this.formElem.insertAdjacentHTML("afterbegin", `
             <div class="form-group">
                   <label class="form-label" style="width: 100%;">
                        <p>Заповніть свої дані:</p>
                        <input id="full-name" class="form-control" name="fullname" placeholder="Прізвище">
                   </label>
             </div>
             <div class="form-group">
                   <label class="form-label" style="width: 100%;">
                       <input id="nick-name" class="form-control" name="name" placeholder="Ім'я">
                   </label>
             </div>
             <div class="form-group">
                  <label class="form-label" style="width: 100%;">
                       <input id="nick-name" class="form-control" name="nickname" placeholder="По батькові">
                   </label>
             </div>
             <div class="form-group">
                   <label class="form-label" style="width: 100%;">
                       <textarea class="form-control" cols="50" name="target" rows="1" placeholder=" Ціль візиту"></textarea>
                   </label>
             </div>
             <div class="form-group">
                   <label class="form-label" style="width: 100%;">
                       <textarea class="form-control" cols="50" name="description" rows="1" placeholder=" Короткий опис візиту"></textarea>
                   </label>
             </div>
             <select class="form-control form-group" name="urgency" id="post">
                  <option value="none" disabled selected>Терміновість візиту</option>
                  <option value="Звичайна">Звичайна</option>
                  <option value="Пріоритетна">Пріоритетна</option>
                  <option value="Невідкладна">Невідкладна</option>
             </select>
                `)

        this.sendUserData(this.formElem)
        return this.formElem
    }
}
