const sectionProjets = document.getElementById('portfolio');
const container = document.querySelector('.gallery');
const entete = document.getElementById('banniere')
let projects; 
//création de la variable qui va contenir le token pour pouvoir l'utiliser dans espace utilisateur
const token = localStorage.getItem('token')

async function getData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
  }
}

async function genererProjets(projects = []) {
  container.innerHTML = '';
  if (projects.length === 0) {
    projects = await getData('http://localhost:5678/api/works');
  }
  projects.forEach(project => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
  
    img.src = project.imageUrl;
    img.setAttribute("crossorigin", "anonymous");
    figcaption.textContent = project.title;
  
    figure.appendChild(img);
    figure.appendChild(figcaption);
    container.appendChild(figure);
  });
}
genererProjets();

async function filtreCategories() {
  const categories = await getData('http://localhost:5678/api/categories');
  const containerFiltres = document.createElement("div");
  containerFiltres.classList.add('filtres');
  sectionProjets.insertBefore(containerFiltres, sectionProjets.children[2]);

  //cacher la partie filtre si l'utilisateur est connecte
  if(token){
    containerFiltres.style.display = 'none';
  }
  // Ajouter un bouton pour afficher tous les projets
  const tousLesProjets = document.createElement("button");
  tousLesProjets.classList.add('filtre');
  tousLesProjets.textContent = "Tous";
  tousLesProjets.addEventListener("click", async function() {
    const response = await fetch('http://localhost:5678/api/works');
    const projects = await response.json();
    genererProjets(projects);
    
    const buttons = containerFiltres.querySelectorAll(".filtre");
    buttons.forEach(btn => {
      btn.classList.remove("active");
    });
    // Ajouter la classe 'active' au bouton cliqué
    tousLesProjets.classList.add("active");
  });
  containerFiltres.appendChild(tousLesProjets);
  categories.forEach(categorie => {
    const button = document.createElement("button");
    button.classList.add('filtre');
    button.textContent = categorie.name;
    button.addEventListener("click", async () => {
      const travaux = await getData('http://localhost:5678/api/works');
      const filteredProjects = travaux.filter(project => project.category.name === categorie.name);
      genererProjets(filteredProjects);
      const buttons = containerFiltres.querySelectorAll(".filtre");
      buttons.forEach(btn => {
        btn.classList.remove("active");
      });
      button.classList.add("active");
    });
    containerFiltres.appendChild(button);
  });
}

filtreCategories();
// ************************Partie Espace utilisateur****************************

const lienLogin = document.getElementById('login-logout')
function toggleLoginLogout() {
  if (token) {
    // Il y a un token stocké, donc on change le bouton en "logout" et on ajoute l'écouteur d'événement logoutUser
    lienLogin.innerHTML = "Logout";
    lienLogin.addEventListener('click', logoutUser);
  } else {
    // Il n'y a pas de token stocké, donc on change le bouton en "login" et on ajoute l'écouteur d'événement loginUser
    lienLogin.innerHTML = "Login";
    lienLogin.removeEventListener('click', logoutUser);
    lienLogin.addEventListener('click', loginUser);
  }
}
function logoutUser() {
  localStorage.removeItem('token');
  window.location.assign("login.html");
}
window.addEventListener("load", () => {
  // vérifier si l'utilisateur est connecté en vérifiant si un token est stocké dans le localStorage
  if(token) {
      const modifIntro = document.querySelector('.modif-intro')
      const modifImg = document.querySelector('.modif-img')
      const titreSectionProjets = document.querySelector('.titre-section-projets')
      toggleLoginLogout();

      //creation des éléments pour la partie header
      const banniereEdit = document.createElement("div");
      banniereEdit.classList.add("banniere-edit");
      entete.insertBefore(banniereEdit, entete.firstChild);
      const modeEdit = document.createElement('p');
      modeEdit.classList.add("modif-edition");
      modeEdit.innerText ='Mode édition';
      banniereEdit.appendChild(modeEdit);
      const iconeModeEdition = document.createElement('i');
      iconeModeEdition.classList.add("fa-regular", "fa-pen-to-square");
      modeEdit.insertBefore(iconeModeEdition, modeEdit.firstChild);
      const btnEdition = document.createElement('button');
      btnEdition.classList.add("btn-modif");
      btnEdition.innerText= 'publier les changements';
      banniereEdit.appendChild(btnEdition);
      console.log(entete);

      //creation des éléments pour la partie introdution 
      const modifFig = document.createElement('p');
      modifFig.classList.add('modif-fig');
      modifFig.innerText = 'modifier';
      modifImg.appendChild(modifFig);
      const iconeModiFig = document.createElement('i');
      iconeModiFig.classList.add('fa-regular', 'fa-pen-to-square');
      modifFig.insertBefore(iconeModiFig, modifFig.firstChild);

      const modifArticle = document.createElement('p');
      modifIntro.insertBefore(modifArticle, modifIntro.firstChild);
      modifArticle.classList.add('modif-article');
      modifArticle.innerText= 'modifier';
      const iconeModifArticle = document.createElement('i');
      iconeModifArticle.classList.add('fa-regular', 'fa-pen-to-square');
      modifArticle.insertBefore(iconeModifArticle, modifArticle.firstChild);

      // creation des éléments de la section projets
      const accesModale = document.createElement('a');
      accesModale.setAttribute('href','#modal3')
      accesModale.classList.add('acces-modale')
      titreSectionProjets.appendChild(accesModale);
      const spanAccesModale = document.createElement('span')
      spanAccesModale.classList.add('modif-projet', 'open-modal')
      accesModale.appendChild(spanAccesModale);
      spanAccesModale.innerText = 'modifier';
      const iconeAccesModale = document.createElement('i');
      iconeAccesModale.classList.add('fa-regular', 'fa-pen-to-square');
      spanAccesModale.insertBefore(iconeAccesModale, spanAccesModale.firstChild);

      const btnModal = document.querySelector('.open-modal');
      btnModal.addEventListener('click', openModal);
      const btnAjout = document.querySelector('.btn-ajout')
      btnAjout.addEventListener('click', addPhoto)
  }
});


// ********************Partie modale **************************


let modal = null;

//création d'une fonction pour fermer la modale 
const closeModal = () =>{
    if(modal === null) return
    //rendre la modale invisible
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.btn-close').removeEventListener('click', closeModal)
    modal.querySelector('.modal-stop').removeEventListener('click', stopPropagation)
    const modaleAjout = document.querySelector('.close-2');
    modaleAjout.addEventListener('click', closeModal);
    //on revient sur la valeur initial de la modale
    modal = null;
    
}
async function suppProjet(id){
  
    console.log(id);
    //appel à l'api pour supprimer des projets depuis la modale  
    await fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
    })
    .then(async response => {
    //condition pour vérifier si on a un statut est 200 pour pouvoir supprimer l'élément
        if (!response.ok) {
          console.log(response)
          console.log('Impossible de supprimer le projet');
        }
        console.log('Le projet est supprimé');
        await genererModale(projects);
        await genererProjets();
        closeModal(); 
    })
    .catch(erreur => {
      console.log(erreur);
    });
};

async function genererModale(projects) {
      containerModaleProjets.innerHTML = '';
  try {
      projects = await getData('http://localhost:5678/api/works');

      projects.forEach(function(project) {
          const figure = document.createElement("figure");
          const img = document.createElement("img");
          const figcaption = document.createElement("figcaption");
          const block = document.createElement("div"); 
          const iconeCorbeil = document.createElement("i");
          // ajout de class pour pouvoir changer la forme en css
          iconeCorbeil.classList.add("fa-regular","fa-trash-can");
          img.src = project.imageUrl;
          img.setAttribute("crossorigin", "anonymous");
          figcaption.textContent = "Editer";
          block.appendChild(iconeCorbeil);
          figure.appendChild(block);
          figure.appendChild(img);
          figure.appendChild(figcaption);
          containerModaleProjets.appendChild(figure);
          iconeCorbeil.addEventListener('click', async function(event) {
              event.preventDefault();
              suppProjet(project.id);
          });
      });
  } catch(error) {
    console.error('Il y a eu une erreur lors de la récupération des données :', error);
  }
}


// fonction pour ouvrir la modale
const openModal = (e) => {
    if (e){
        e.preventDefault();
    }
    page = "index-edit"
    containerModaleProjets = document.querySelector('.projet-modif');
    modal = document.querySelector('#modal3');
    //rendre la modale visible
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    modal.addEventListener('click', closeModal)
    modal.querySelector('.btn-close').addEventListener('click', closeModal)
    modal.querySelector('.modal-stop').addEventListener('click', stopPropagation)
    genererModale(projects);
}


const stopPropagation = (e) =>{
    e.stopPropagation();
}

// ************modale 2 partie chargment de l'image**********
const retourModale = document.querySelector('.btn-retour').addEventListener('click', goBack)
//fuction pour ouvrir le formulaire et fermer la modale
function addPhoto() {
    document.querySelector(".wrapper1").style.display = "none";
    document.querySelector(".wrapper2").style.display = "block";
    document.querySelector('.wrapper2').addEventListener('click', stopPropagation)
}
//fonction pour fermer le forumlaire et revenir à la modale 
function goBack(){
    document.querySelector(".wrapper1").style.display = "block";
    document.querySelector(".wrapper2").style.display = "none";
}

  // partie qui concerne le chargement de l'image
const input = document.getElementById('tele-image');
const preview = document.querySelector('.preview');
const labelImage= document.querySelector('.label-image')
const blockTeleImg = document.querySelector('.bloc-tele-img')
const fileTypes = ['image/jpeg', 'image/png'];

function validFileType(file) {
    return fileTypes.includes(file.type);
  }

function telechargement() { 
    const infoFiles = input.files;
    for (const file of infoFiles) {
        if (validFileType(file)) {
          const image = document.createElement('img');
          image.src = URL.createObjectURL(file);
            blockTeleImg.appendChild(image)
            labelImage.style.display= "none";
        } 
      }
    }
  
input.addEventListener('change', telechargement);

//  partie qui concerne l'envoi d'un nouveau projet 
const form = document.getElementById('ajout');
let imageInput = form.querySelector('input[name="tele-image"]');
const titleInput = form.querySelector('input[name="titre-projet"]');
const categorySelect = form.querySelector('select[name="categorie"]');
const submitButton = document.querySelector('.btn-ajout-projet');


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

// Fonction pour valider le formulaire
function validateForm(event) {
      event.preventDefault();
      let isError = false;
      submitButton.setAttribute('disabled', true);
      console.log(submitButton);
      
      const ajoutImage = imageInput.files[0];
      const ajoutTitle = titleInput.value;
      const ajoutCategory = categorySelect.options[categorySelect.selectedIndex].id;
     
      const formData = new FormData();
      formData.append('image', ajoutImage);
      formData.append('title', ajoutTitle);
      formData.append('category', ajoutCategory);

      // Supprime tous les messages d'erreur existants
      const errorMessages = form.querySelectorAll('.message-erreur');
      errorMessages.forEach(errorMessage => errorMessage.remove());

      //supprime le message déjà existant
      const inputs = [imageInput, titleInput, categorySelect];
      inputs.forEach(input => {
          input.addEventListener('input', () => suppMessageErreur(input));
      });

      // Vérifie si l'image a été sélectionnée
      if (!ajoutImage) {
          imageInput.parentNode.appendChild(creationMessageErreur('Veuillez sélectionner une image'));
          isError = true;
      }

      // Vérifie si le titre a été entré
      if (!ajoutTitle) {
          titleInput.parentNode.appendChild(creationMessageErreur('Veuillez entrer un titre'));
          isError = true;
      }

      // Vérifie si la catégorie a été sélectionnée
      if (!ajoutCategory) {
          categorySelect.parentNode.appendChild(creationMessageErreur('Veuillez sélectionner une catégorie'));
          isError = true;
      }

      // Si il y a une erreur, arrête la fonction
      if (isError) {
        return;
      }else{

        console.log(ajoutTitle, ajoutImage, ajoutCategory);
        // Change la couleur du bouton et définit son état 
        submitButton.style.backgroundColor = '#1D6154';
        submitButton.removeAttribute('disabled');
        console.log(submitButton);
        
        submitForm(formData); 
  
        // Réinitialise le formulaire
        inputs.forEach(input => {
            if (input.type === "file") {
                  // Création d'une nouvelle instance de l'input type file
                  const newInput = document.createElement("input");
                  newInput.type = "file";
                  newInput.id = imageInput.id;
                  newInput.name = imageInput.name;
                  imageInput.parentNode.replaceChild(newInput, imageInput);
                  imageInput = newInput;
            } else {
                  input.value = '';
                }
          });
        document.querySelector(".wrapper2").style.display = "none";
        document.querySelector(".wrapper1").style.display = "block";
      }
      

 }
 

function submitForm(formData) {
      fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      .then(async response => {
          if (response.ok) {
              const notification = document.createElement("div");
              notification.classList.add("notification");
              notification.innerText = "Le projet a bien été envoyé";
              entete.appendChild(notification);
              const boutonNotification = document.createElement('button')
              boutonNotification.classList.add('btn-notif')
              boutonNotification.innerText= 'Ok';
              notification.appendChild(boutonNotification)
              boutonNotification.addEventListener('click', ()=>{
                notification.remove()})
              // alert('projet ajouté')
              await genererModale(projects);
              await genererProjets();
              closeModal();
        
              console.log('projet envoyé');
              return response.json();
          }
          console.log("Impossible d'ajouter projet");
          throw new Error('échec');
      });
    }

form.addEventListener('submit', (event)=> validateForm(event));

