//variable où on va stocker les données récuperées
let projets = [];
//variable page pour l'utiliser sur les deux pages (index.html et index-edit.html)en fonction de son contenu
let page = "index";
const entete = document.getElementById('banniere')
console.log(entete);

// creation des variables pour les filtres
const filtreObjet = document.querySelector('.filtre-objet');
const filtreAppart = document.querySelector('.filtre-appart');
const filtreHotel = document.querySelector('.filtre-hotel');
const filtreTous = document.querySelector('.filtre-tous');

//variable du parent qui va contenir tout les projets
const galerie = document.querySelector(".gallery");
let container = galerie;

//création de la variable qui va contenir le token pour pouvoir l'utiliser dans edit.js
const token = localStorage.getItem('token')


//fonction pour récuperer les travaux de l'architecte via l'api
async function recupTravaux(){
   projets = await fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {return data});
    console.log(projets);
};


//fonction qui génerer les travaux sur la page index.html et sur la modale de la page index-edit.js ;
async function genererProjets(projets) {

    //supprime les travaux qui étaient présent
    container.innerHTML = "";
    //Création d'une boucle pour parcourir chaque i de projets et réaliser les instructions demandées
    for (let i = 0; i < projets.length; i++) {
    
        const projet = projets[i];
        if(!projet.category || !projet.category.name) continue;
        
        //création des balises et rattachement au DOM
        const figure = document.createElement('figure');
            // ajout de l'attribut pour stocker l'ID de chaque projet
        figure.setAttribute("data-id", projet.id); 
        container.appendChild(figure);

        const img = document.createElement('img');
        img.setAttribute("crossorigin", "anonymous");
        img.src = projet.imageUrl;
        figure.appendChild(img);

        const figcaption = document.createElement('figcaption');
        if (page === "index") {
            //pour générer le titre depuis l'api
            figcaption.innerText = projet.title;
        } else {
        // partie qui concerne la modale
            //pour écrire le titre directement avec innerText
            figcaption.innerText = "éditer";
            // creation de l'élement i
            const block = document.createElement("div");

            //dans la page modale figure change de parent 
            figure.appendChild(block);
            const i = document.createElement("i");
            // ajout de class pour pouvoir changer la forme en css
            i.classList.add("fa-regular","fa-trash-can");
            //Exécution des instructions quand on clique sur le i, avec fetch et la méthode delete
            i.addEventListener("click", function() {
                const id = this.parentNode.parentNode.getAttribute("data-id");
                //appel à l'api pour supprimer des projets depuis la modale  
                fetch(`http://localhost:5678/api/works/${id}`, {
                  method: 'DELETE',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                })
                .then(response => {
                //condition pour vérifier si on a un statut est 200 pour pouvoir supprimer l'élément
                  if (!response.ok) {
                    console.log('erreur');
                  }

                  this.parentNode.parentNode.remove(); 
                })
                .catch(erreur => {
                  console.log(erreur);
                });
              });
            block.appendChild(i);
        }
        figure.appendChild(figcaption);
    }
}

recupTravaux().then(() => genererProjets(projets));

//utilisation de filter() pour filtere les catégories des projets
let categories;

fetch('http://localhost:5678/api/categories')
  .then(response => response.json())
  .then(data => {
    categories = data;
    // faire autre chose avec les données
  })
  .catch(error => console.error(error));



filtreObjet.addEventListener("click", () => {
  const categoriesFiltrees = categories.filter(category => category.name === 'Objets');
//     const projetsFiltrees = projets.filter(projet => projet.category && projet.category.name === 'Objets');
    genererProjets(categoriesFiltrees);
    console.log(categoriesFiltrees);
});


filtreAppart.addEventListener("click", () => {
  const categoriesFiltrees = categories.filter(category => category.name === 'Appartements');
    // const projetsFiltrees = projets.filter(projet => projet.category && projet.category.name === 'Appartements');
    genererProjets(categoriesFiltrees);
});
filtreHotel.addEventListener("click", () => {
  const categoriesFiltrees = categories.filter(category => category.name === 'Hotels & restaurants');
    // const projetsFiltrees = projets.filter(projet => projet.category && projet.category.name === 'Hotels & restaurants');
    genererProjets(categoriesFiltrees);
});

filtreTous.addEventListener("click", () => {
    genererProjets(projets);
});



// ************************Parti Espace utilisateur****************************

const lienLogin = document.getElementById('login-logout')
function toggleLoginLogout() {
  const token = localStorage.getItem('token');
  if (token) {
    // Il y a un token stocké, donc on change le bouton en "logout" et on ajoute l'écouteur d'événement logoutUser
    lienLogin.innerHTML = "Logout";
    lienLogin.removeEventListener('click', loginUser);
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
  const token = localStorage.getItem('token');
  // vérifier si l'utilisateur est connecté en vérifiant si un token est stocké dans le localStorage
  if(token) {
    //cacher la partie filtre
    const blocFiltres = document.querySelector('.filtres')
    blocFiltres.style.display = 'none'
    const modifIntro = document.querySelector('.modif-intro')
    const modifImg = document.querySelector('.modif-img')
    const titreSectionProjets = document.querySelector('.titre-section-projets')
  toggleLoginLogout();
  //creation des éléments pour la partie header
  const entete = document.getElementById('banniere')
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
const closeModal = (e) =>{
    e.preventDefault();
    if(modal === null) return
    //rendre la modale invisible
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.btn-close').removeEventListener('click', closeModal)
    modal.querySelector('.modal-stop').removeEventListener('click', stopPropagation)
    const modale2 = document.querySelector('.close2').addEventListener('click', closeModal)
    //on revient sur la valeur initial de la modale
    modal = null;
    
}
// fonction pour ouvrir la modale
const openModal = (e) => {
    e.preventDefault();
    page = "index-edit"
    container = document.querySelector('.projet-modif');
    modal = document.querySelector('#modal3');
    //rendre la modale visible
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    modal.addEventListener('click', closeModal)
    modal.querySelector('.btn-close').addEventListener('click', closeModal)
    modal.querySelector('.modal-stop').addEventListener('click', stopPropagation)
    recupTravaux().then(() => genererProjets(projets));
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


