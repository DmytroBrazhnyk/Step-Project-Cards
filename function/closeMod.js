export const closeModal = (e) => {
    const wraper = e.target.closest(".modal");
    wraper.remove();
    const loginBtn = document.querySelector(".login-btn");
    loginBtn.classList.add("disactive");
    console.log("test");
    document.body.classList.remove("modal-open");
    const background = document.querySelector(".modal-backdrop");
    background.remove();
    document.querySelector(".create-btn").classList.remove("disactive");
    console.log(document.querySelector(".create-btn"));
}