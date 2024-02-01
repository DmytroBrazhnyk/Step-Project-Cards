const BODY_SCROLL = 'modal-open'

export default class Modal {
    constructor({headerTitle, body, closeOutside = false}) {
        this.headerTitle = headerTitle;
        this.body = body;
        this.closeOutside = closeOutside;
    }
    attachListener() {
        document.body.addEventListener("click", (event) => {

            let modal = event.target.classList.contains('modal');
            let close = event.target.classList.contains('close');

            if (modal && this.closeOutside || close) {
                this.close()
            }
        })
    }

    close() {
        this.background.remove()
        document.body.classList.remove(BODY_SCROLL);
        this.modal.remove()
    }
    renderBackground() {
        this.background = document.createElement("div")
        this.background.classList.add('modal-backdrop');
        document.body.append(this.background)
    }
    render() {
        this.modal = document.createElement("div");
        this.modal.classList.add("modal");
        this.modal.style.display = "block";
        document.body.classList.add(BODY_SCROLL);
        this.modal.insertAdjacentHTML("beforeend", `  
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${this.headerTitle}</h5>
                        <button type="button" class="close">
                            <span aria-hidden="true" style="pointer-events: none;">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
               
                    </div>
                </div>
            </div>
            `)

        if (this.body) {
            this.modal.querySelector('.modal-body').append(this.body);
        }

        this.renderBackground();
        this.attachListener();
        return this.modal
    }
}
