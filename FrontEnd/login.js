
// ****************connexion****************
//variable pour cibler le formulaire depuis le DOM
const formConnexion = document.getElementById('form-connexion');
const boutonLogin = document.getElementById('bouton-login');  
//  Supprime le message d'erreur précédent s'il existe
function suppMessageErreur(){
  const precedentMessageErreur = document.querySelector('.message-erreur');
  if (precedentMessageErreur) {
    precedentMessageErreur.remove();
  }
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
             // Vérifie que les champs ne sont pas vides
            if (!email || !password ) {
              suppMessageErreur();
              const messageErreur = document.createElement('div');
              messageErreur.classList.add('message-erreur');
              messageErreur.innerHTML = 'Les champs email et/ou mot de passe ne peuvent pas être vides';
              formConnexion.insertBefore(messageErreur, formConnexion.children[2]);
              return;
            }
            // Vérifie que le champ email est de la forme d'un e-mail
            const emailReg = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
            const testEmail = emailReg.test(email);
            console.log(testEmail);
            if (!testEmail) {
              suppMessageErreur();
              console.log('L\'email est incorrect');
              const messageErreur = document.createElement('div');
              messageErreur.classList.add('message-erreur')
              messageErreur.innerHTML = 'L\'email est incorrect';
              formConnexion.insertBefore(messageErreur, formConnexion.children[1]);
              return
            }
              if(respLogin.status !== 200) {
                console.log('Connexion échouée');
                suppMessageErreur();
                // Ajoute le nouveau message d'erreur
                const messageErreur = document.createElement('div');
                messageErreur.classList.add('message-erreur')
                messageErreur.innerHTML = 'Votre e-mail et/ou mot de passe sont incorrects';
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



formConnexion.addEventListener('submit', (event)=> loginUser(event));
