import { getCards } from "./sendRequest.js";
//const wrapperCards = document.querySelector(".wrap-cards");
import { UserCardTherapist, UserCardDentist, UserCardCardiologist } from "../modules/userCard.js";



export function showCard (token) {
    
    getCards(token)
.then(data => {console.log(data)

    
    const wrapCards = document.querySelector(".wrap-cards");
   
    
data.forEach(element => {

    if(element.doctor === "Терапевт") {
        console.log(element.doctor);
        const card = new UserCardTherapist (element);
        card.renderCard(wrapCards)
        console.log(element.doctor);
        wrapCards.querySelector(".empty")?.remove()
        
    } else {
       if (element.doctor === "Стоматолог") {
        const card = new UserCardDentist (element);
        card.renderCard(wrapCards)
        console.log(element.doctor);
        wrapCards.querySelector(".empty")?.remove()
       
    } else {
        if (element.doctor === "Кардіолог") {
            const card = new UserCardCardiologist (element);
            card.renderCard(wrapCards)
            console.log(element.doctor);
            wrapCards.querySelector(".empty")?.remove()
    }
}} 
});
})
}

