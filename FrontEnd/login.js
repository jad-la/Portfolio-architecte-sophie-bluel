
// ****************connexion****************
const formConnexion = document.getElementById('form-connexion');
let respLogin; 
const boutonLogin = document.getElementById('bouton-login');

async function loginUser(event){
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    respLogin = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        },
        body:JSON.stringify({email: email, password: password})
    });
    
    console.log(respLogin);
    

    if(respLogin.status === 200) {
       window.location.assign("index-edit.html");
     }
}

 formConnexion.addEventListener('submit', (event)=> loginUser(event)); 
loginUser()

