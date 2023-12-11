import {
  afficherAvisGraphique,
  ajoutListenerAvis,
  ajouterListenerEnvoyer,
} from "./avis.js";

let pieces = localStorage.getItem("pieces");
if (pieces === null) {
  const reponse = await fetch("http://localhost:8081/pieces");
  pieces = await reponse.json();
  const valeurPieces = JSON.stringify(pieces);
  localStorage.setItem("pieces", valeurPieces);
} else {
  pieces = JSON.parse(pieces);
}

ajouterListenerEnvoyer();

function genererListePieces(pieceAuto) {
  for (let piece of pieceAuto) {
    const wrapperElement = document.createElement("div");
    wrapperElement.classList = "box-fiche";
    const imgElement = document.createElement("img");
    imgElement.src = piece.image;
    const titreElement = document.createElement("h2");
    titreElement.innerText = piece.nom;
    const prixElement = document.createElement("p");
    prixElement.innerText = `${piece.prix}€  (${piece.prix < 35 ? "€" : "€€"})`;
    const categorieElement = document.createElement("p");
    categorieElement.innerText = piece.categorie ?? "(aucune catégorie)";
    const descriptionElement = document.createElement("p");
    descriptionElement.innerText =
      piece.description ?? "Pas de description pour le moment !";
    const stockElement = document.createElement("p");
    stockElement.innerText = piece.disponibilite
      ? "En stock"
      : "Rupture de stock";
    const avisBouton = document.createElement("button");
    avisBouton.dataset.id = piece.id;
    avisBouton.textContent = "Afficher les avis";
    wrapperElement.appendChild(imgElement);
    wrapperElement.appendChild(titreElement);
    wrapperElement.appendChild(prixElement);
    wrapperElement.appendChild(categorieElement);
    wrapperElement.appendChild(descriptionElement);
    wrapperElement.appendChild(stockElement);
    wrapperElement.appendChild(avisBouton);
    document.querySelector(".fiches").appendChild(wrapperElement);
  }
  ajoutListenerAvis();
}
genererListePieces(pieces);

//----------------------------- Filtre prix croissant ---------------------------------
const btnPrixCroissant = document.querySelector("#btnPrixCroissant");
btnPrixCroissant.addEventListener("click", () => {
  let listePrix = [...pieces];
  const listDecroissant = listePrix.sort((a, b) => {
    return a.prix - b.prix;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererListePieces(listDecroissant);
});

//-------------------- filtre avec description --------------
const btnFlitreDescription = document.querySelector("#btnDescription");

btnFlitreDescription.addEventListener("click", () => {
  let filtreDescription = pieces.filter((el) => {
    return el.description;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererListePieces(filtreDescription);
});

//------Afficher les pieces abordable sur le DOM ------------------------------------------------
const nom = pieces.map((piece) => piece.nom);
// commencer la boucle par la fin lorsqu' on souhaite supprimer des élément d'une liste
for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].prix > 35) {
    nom.splice(i, 1);
  }
}

let boxAbordable = document.querySelector(".abordable");
let ulElement = document.createElement("ul");

for (let i = 0; i < nom.length; i++) {
  let liElement = document.createElement("li");
  liElement.innerText = `${nom[i]}`;
  ulElement.appendChild(liElement);
}
boxAbordable.appendChild(ulElement);

//----------- Afficher les pieces Disponible ------------------------------------------------------
const prix = pieces.map((piece) => piece.prix);
const pieceDispo = pieces.map((piece) => piece.nom);

for (let i = pieces.length - 1; i >= 0; i--) {
  if (!pieces[i].disponibilite) {
    pieceDispo.splice(i, 1);
    prix.splice(i, 1);
  }
}

const boxDisponible = document.querySelector(".disponible");
const ulElementDispo = document.createElement("ul");

for (let i = 0; i < pieceDispo.length; i++) {
  let listDisponible = document.createElement("li");
  listDisponible.innerText = `${pieceDispo[i]} - ${prix[i]}`;
  ulElementDispo.appendChild(listDisponible);
}
boxDisponible.appendChild(ulElementDispo);

//---------------- ajouter un filtre avec un input type range  --------------------------
const inputRange = document.querySelector("#inputRange");
inputRange.addEventListener("input", (e) => {
  let rangePrix = e.target.value;

  let prixFiltrerRange = pieces.filter((piece) => piece.prix <= rangePrix);
  document.querySelector(".fiches").innerHTML = "";
  genererListePieces(prixFiltrerRange);
});

//-------------------- supprimer localStorage ------------------
const btnMAJ = document.querySelector(".btn-maj");
btnMAJ.addEventListener("click", () => {
  localStorage.removeItem("pieces");

  if (!document.querySelector(".filtres span")) {
    const spanConfirme = document.createElement("span");
    spanConfirme.innerText = "mise a jour des pieces";
    document.querySelector(".filtres").appendChild(spanConfirme);
  }
});
//-------------------- afficher Graphique ------------------
await afficherAvisGraphique();
//-----------------------------------------------------
