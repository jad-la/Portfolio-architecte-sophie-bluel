// ****************connexion****************
//variable pour cibler le formulaire depuis le DOM
const formConnexion = document.getElementById('form-connexion');
const boutonLogin = document.getElementById('bouton-login'); 

//creation d'élement pour le message d'erreur
const messageErreur = document.createElement('div');
messageErreur.classList.add('message-erreur'); 

//  Supprime le message d'erreur précédent s'il existe
function suppMessageErreur(){
  const precedentMessageErreur = document.querySelector('.message-erreur');
  if (precedentMessageErreur) {
    precedentMessageErreur.remove();
  }
}  


function verifForm(event){
      event.preventDefault();
      suppMessageErreur()
      let isError = false;
      //variable qui recupere ce qu'est écrit dans l'input 
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

        // Vérifie que les champs ne sont pas vides
      if (!email) {
      
        messageErreur.innerHTML = 'Le champ email ne peut pas être vide';
        formConnexion.insertBefore(messageErreur, formConnexion.children[1]);
       isError= true
      }
      
    if (!password) {
      
        messageErreur.innerHTML = 'Le champ mot de passe ne peut pas être vide';
        formConnexion.insertBefore(messageErreur, formConnexion.children[2]);
        isError= true
      }

      // Vérifie que le champ email est au format e-mail
      const emailReg = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$');
      const testEmail = emailReg.test(email);
      console.log(testEmail);
      if (!testEmail) {
      
        console.log('L\'email est incorrect');
        messageErreur.innerHTML = "Le format de l'e-mail n'est pas valide";
        formConnexion.insertBefore(messageErreur, formConnexion.children[1]);
        isError= true
      }
        if (isError)return
      //connexion de l'utilisateur
      loginUser(event);
}

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
                // Ajoute le nouveau message d'erreur
                messageErreur.innerHTML = 'Erreur dans l’e-mail ou le mot de passe';
                formConnexion.insertBefore(messageErreur, formConnexion.children[2]);
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
        console.log(erreur);
      }

}

formConnexion.addEventListener('submit', (event)=> verifForm(event));
