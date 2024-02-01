const API = "https://ajax.test-danit.com/api/v2/cards";


import { token } from "../modules/userLogin.js";



const sendRequest = async (entity, method = "GET", config) => {
    return await fetch(`${API}${entity}`, {
        method,
        ...config,
    }).then((response) => {
        if (response.ok) {
            if (method === "GET" || method === "POST" || method === "PUT") {
                return response.json();
            }
            return response;
        } else {
            return new Error("Что-то пошло не так");
        }
    });
};


const addUser = (newUser, token) =>
    sendRequest('/', "POST", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: newUser,
    });




//   function saveToken(values) {
//     sessionStorage.setItem('token', JSON.stringify(values));
// }

const delUser = (id, token) => sendRequest(`/${id}`, 'DELETE', {
    headers: {
        'Authorization': `Bearer ${token}`
    },
});
// 


function getToken (email, password) {
    return fetch(`${API}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    })
       
};
const getCards = (token) => sendRequest('/', "GET", {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
})

const getCardByID = (cardID, token) => sendRequest(`/${cardID}`, "GET", {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
})

const editCard = (cardID, values, token) =>
    sendRequest(`/${cardID}`, "PUT", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
    });


export {API, addUser, getToken, delUser, getCards, getCardByID, editCard};