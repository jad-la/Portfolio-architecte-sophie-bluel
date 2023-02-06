
// ****************connexion****************

//variable pour cibler le formulaire depuis le DOM
const formConnexion = document.getElementById('form-connexion');
const boutonLogin = document.getElementById('bouton-login');


async function loginUser(event) {
      event.preventDefault();
      //variable qui recupere ce qu'est écrit dans l'input  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const emailMessage = document.getElementById('email');
      const passwordMessage = document.getElementById('password');

      //fonction pour ajouter un message d'erreur si l'utilisateur ne rempli pas le champ
      function creationMessageErreur(message) {
            const messageErreur = document.createElement('span');
            messageErreur.classList.add('message-erreur');
            messageErreur.innerText = message;
            return messageErreur;
      }

      // fonction pour supprime le message d'erreur si l'utilisateur écrire dans le champ
      function suppMessageErreur(input) {
            const messageErreur = input.parentNode.querySelector('.message-erreur');
            if (messageErreur) {
              messageErreur.remove();
            }
      }
          const inputsMessage = [emailMessage, passwordMessage];
          inputsMessage.forEach(input => {
            input.addEventListener('input', () => suppMessageErreur(input));
      });

      // Vérifie si l'email et le mot de passe sont bon sinon execute la fonction creationMessageErreur()
      if (email !== "sophie.bluel@test.tld") {
          emailMessage.parentNode.appendChild(creationMessageErreur("L'e-mail est incorrect"));
      }
      if (password !== "S0phie") {
          passwordMessage.parentNode.appendChild(creationMessageErreur("Le mot de passe est incorrect"));
      }

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
