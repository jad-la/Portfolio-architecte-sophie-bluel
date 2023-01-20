let projets = [];
const filtreObjet = document.querySelector('.filtre-objet');
const filtreAppart = document.querySelector('.filtre-appart');
const filtreHotel = document.querySelector('.filtre-hotel');
const filtreTous = document.querySelector('.filtre-tous');
const galerie = document.querySelector(".gallery");

async function recupTravaux(){
   projets = await fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {return data});
    console.log(projets);
};

async function genererProjets(projets) {
    galerie.innerHTML = "";
    // for (let i = 0; i < projets.length; i++) {
    for (let projet of projets ){
        // const projet = projets[i];
        if(!projet.category || !projet.category.name) continue;
        
        const figure = document.createElement('figure');
        galerie.appendChild(figure);
        const img = document.createElement('img');
        img.setAttribute("crossorigin", "anonymous");
        img.src = projet.imageUrl;
        figure.appendChild(img);
        const figcaption = document.createElement('figcaption');
        figcaption.innerText = projet.title;
        figure.appendChild(figcaption);
    }
}

recupTravaux().then(() => genererProjets(projets));

filtreObjet.addEventListener("click", () => {
    const projetsFiltrees = projets.filter(projet => projet.category && projet.category.name === 'Objets');
    genererProjets(projetsFiltrees);
});

filtreAppart.addEventListener("click", () => {
    const projetsFiltrees = projets.filter(projet => projet.category && projet.category.name === 'Appartements');
    genererProjets(projetsFiltrees);
});
filtreHotel.addEventListener("click", () => {
    const projetsFiltrees = projets.filter(projet => projet.category && projet.category.name === 'Hotels & restaurants');
    genererProjets(projetsFiltrees);
});
filtreTous.addEventListener("click", () => {
    genererProjets(projets);
});




