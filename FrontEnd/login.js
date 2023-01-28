
// ****************connexion****************

//variable pour cibler le formulaire depuis le DOM
const formConnexion = document.getElementById('form-connexion');
const boutonLogin = document.getElementById('bouton-login');


async function loginUser(event) {
  event.preventDefault();
  //variable qui recupere ce qu'est écrit dans l'input  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    //envoi d'une requete avec la methode post pour la connexion du client
    const respLogin = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({email: email, password: password})
    });

    if(respLogin.status !== 200) {
      console.log('Connexion échouée');
    }else{
    const data = await respLogin.json();
    if (!data.token) {
      console.log('Token non trouvé dans la réponse');
    }
    //variable pour stocker le token après la connexion du client
    const token = data.token;
    localStorage.setItem('token', token);
    //dériger le client vers son espace 
    window.location.assign("index.html");
  
    }
  } catch (erreur) {
    console.error(erreur);
  }
}


formConnexion.addEventListener('submit', (event)=> loginUser(event));

