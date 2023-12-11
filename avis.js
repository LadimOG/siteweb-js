/*global Chart*/

export function ajoutListenerAvis() {
  const btnsElement = document.querySelectorAll(".fiches button");
  for (let btnElement of btnsElement) {
    btnElement.addEventListener("click", async (e) => {
      const id = parseInt(e.target.dataset.id);
      const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
      const avis = await reponse.json();
      localStorage.setItem(`avis-${id}`, JSON.stringify(avis));
      const pieceElement = e.target.parentElement;
      afficherAvis(pieceElement, avis);
    });
  }
}

export function afficherAvis(pieceElement, avis) {
  const avisElement = document.createElement("p");
  for (let i = 0; i < avis.length; i++) {
    avisElement.innerHTML += `<br>${avis[i].utilisateur}:</br> ${avis[i].commentaire}<br>`;
  }
  pieceElement.appendChild(avisElement);
}

export function ajouterListenerEnvoyer() {
  const formulaireAvis = document.querySelector(".formulaire-avis");
  formulaireAvis.addEventListener("submit", (e) => {
    e.preventDefault();

    const avis = {
      pieceId: parseInt(e.target.querySelector("[name=piece-id]").value),
      utilisateur: e.target.querySelector("[name=utilisateur]").value,
      nbEtoile: parseInt(e.target.querySelector("[name=nbEtoile]").value),
      commentaire: e.target.querySelector("[name=commentaire]").value,
    };
    const chargeUtile = JSON.stringify(avis);
    e.target.querySelector("[name=piece-id]").value = "";
    e.target.querySelector("[name=utilisateur]").value = "";
    e.target.querySelector("[name=commentaire]").value = "";

    fetch("http://localhost:8081/avis", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: chargeUtile,
    });
  });
}

export async function afficherAvisGraphique() {
  const reponse = await fetch("http://localhost:8081/avis");
  const avis = await reponse.json();
  const nb_commentaires = [0, 0, 0, 0, 0];
  for (let commentaire of avis) {
    nb_commentaires[commentaire.nbEtoiles - 1]++;
  }

  const labels = ["5", "4", "3", "2", "1"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Étoiles attribuée",
        data: nb_commentaires.reverse(),
        backgroundColor: "rgba(255, 230, 0, 1)",
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      indexAxis: "y",
    },
  };

  new Chart(document.querySelector("#graphique-avis"), config);
  //--------------------------------------------------------------

  let nbCommentairePiecesDispo = 0;
  let nbCommentairePiecesNonDispo = 0;

  const piecesJSON = localStorage.getItem("pieces");
  const pieces = JSON.parse(piecesJSON);

  for (let i = 0; i < avis.length; i++) {
    let piece = pieces.find((p) => p.id === avis[i].pieceId);
    if (piece) {
      if (piece.disponibilite) {
        nbCommentairePiecesDispo++;
      } else {
        nbCommentairePiecesNonDispo++;
      }
    }
  }
  const labelsDispo = ["Pieces disponible", "Pieces non disponible"];

  const dataCommentaire = {
    labels: labelsDispo,
    datasets: [
      {
        label: "nombre commentaire",
        data: [nbCommentairePiecesDispo, nbCommentairePiecesNonDispo],
      },
    ],
  };

  const configCommentaire = {
    type: "bar",
    data: dataCommentaire,
  };

  new Chart(
    document.querySelector("#graphique-nbCommentaire"),
    configCommentaire
  );
}
