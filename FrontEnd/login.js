
// ****************connexion****************
const formConnexion = document.getElementById('form-connexion');
let respLogin; 

async function loginUser(){
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    respLogin = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body:JSON.stringify({'email': email, 'password': password})
    });
    const data = await respLogin.json();
    console.log(respLogin);
    console.log(data);
}

 formConnexion.addEventListener('submit', loginUser); 


loginUser();
