document.addEventListener("DOMContentLoaded", () => {
  const startKnapp = document.getElementById("start-knapp");
  const intro = document.getElementById("intro");
  const spill = document.getElementById("spill");
  const slutt = document.getElementById("slutt");
  const sporsmalTekst = document.getElementById("sporsmal");
  const beskrivelseTekst = document.getElementById("beskrivelse");
  const jaKnapp = document.getElementById("ja-knapp");
  const neiKnapp = document.getElementById("nei-knapp");
  const startPaNyttKnapp = document.getElementById("start-pa-nytt");
  const sluttMelding = document.getElementById("sluttmelding");

  const tavle = document.getElementById("tavle");
  const hjerteTavle = document.getElementById("hjerte-tavle");
  const bossTavle = document.getElementById("boss-tavle");
  const gullappTeller = document.getElementById("gullapp-teller");
  const stressbar = document.getElementById("stressbar-fyll");
  const stressnivaa = document.getElementById("stressnivaa");

  // 🆕 Søppelteller legges til først etter at bossTavle finnes
  let soppelTeller;
  function lagSoppelTeller() {
    if (!soppelTeller) {
      soppelTeller = document.createElement("p");
      soppelTeller.id = "soppel-teller";
      soppelTeller.textContent = "Søppel: 0 / 10";
      bossTavle.insertAdjacentElement("beforebegin", soppelTeller);
    }
  }

  // Tellerverdier
  let gullapper = 0;
  const maksGullapper = 20;
  let hjerter = 0;
  const maksHjerter = 7;
  let bossLapper = 0;
  const maksBoss = 10;
  let runde = 0;
  const maksRunder = 100;
  let soppelFullt = false;

  const kategorier = {
    Medarbeider: [
      "Kan du forhandle mer lønn for meg?",
      "Kan jeg ta fri i morgen?",
      "Kan du ta min medievakt?",
      "Har du logget den mediehenvendelsen?",
      "Kan du koke kaffe?"
    ],
    "Kollega fra annen avdeling": [
      "Kan du hjelpe med et stort prosjekt?",
      "Har du tid til et internt møte?",
      "Kan du se over rapporten min?",
      "Kan du lage et dritlangt nytt skjema?"
    ],
    "Ekstern kunde": [
      "Jeg skriver en sak til avisen. Kan du hjelpe meg?",
      "Kan du svare på vår spørreundersøkelse?",
      "Kan du ta et møte nå?",
      "Kan du sponse vår konferanse?"
    ],
    Lars: [
      "Kan du lede et nytt prosjekt?",
      "Kan du skrive strategi for neste år?",
      "Kan du holde et foredrag i morgen?",
      "Kan du lage en plan for alt?"
    ]
  };

  const beskrivelser = {
    Medarbeider: "En medarbeider banker på døra og spør:",
    "Kollega fra annen avdeling": "En kollega fra en annen avdeling sender deg en e-post:",
    "Ekstern kunde": "En ekstern kunde ringer og sier:",
    Lars: "Lars stikker hodet inn på kontoret og spør:"
  };

  // Oppstarts-funksjon
  function startSpill() {
    gullapper = 0;
    hjerter = 0;
    bossLapper = 0;
    soppelFullt = false;
    runde = 0;

    tavle.innerHTML = "";
    hjerteTavle.innerHTML = "";
    bossTavle.innerHTML = "";

    lagSoppelTeller();
    oppdaterSoppelTeller();

    intro.classList.add("skjult");
    slutt.classList.add("skjult");
    spill.classList.remove("skjult");

    oppdaterTavle();
    oppdaterStressbar();
    visSporsmal();
  }

  function tilfeldigKategori() {
    const navn = Object.keys(kategorier);
    return navn[Math.floor(Math.random() * navn.length)];
  }

  function tilfeldigSporsmal(kat) {
    const liste = kategorier[kat];
    return liste[Math.floor(Math.random() * liste.length)];
  }

  let aktivKategori = "";
  let aktivSporsmal = "";

  function visSporsmal() {
    if (runde >= maksRunder) {
      avsluttSpill(false);
      return;
    }
    aktivKategori = tilfeldigKategori();
    aktivSporsmal = tilfeldigSporsmal(aktivKategori);
    beskrivelseTekst.textContent = beskrivelser[aktivKategori];
    sporsmalTekst.textContent = `"${aktivSporsmal}"`;
  }

  // Oppdateringer
  function oppdaterTavle() {
    tavle.innerHTML = "";
    for (let i = 0; i < gullapper; i++) {
      const lapp = document.createElement("div");
      lapp.classList.add("gullapp");
      tavle.appendChild(lapp);
    }
    gullappTeller.textContent = `Gullapper: ${gullapper} / ${maksGullapper}`;
  }

  function oppdaterStressbar() {
    const prosent = Math.min((gullapper / maksGullapper) * 100, 100);
    stressbar.style.width = `${prosent}%`;
    stressnivaa.textContent = `Stressnivå: ${Math.round(prosent)}%`;
    if (prosent < 50) stressbar.style.backgroundColor = "#28a745";
    else if (prosent < 80) stressbar.style.backgroundColor = "#ffc107";
    else stressbar.style.backgroundColor = "#dc3545";
  }

  function oppdaterSoppelTeller() {
    if (soppelTeller)
      soppelTeller.textContent = `Søppel: ${bossLapper} / ${maksBoss}`;
  }

  // Hjerte-funksjoner
  function leggTilHjerte() {
    const emoji = document.createElement("span");
    emoji.textContent = "❤️";
    emoji.style.fontSize = "20px";
    emoji.style.margin = "2px";
    hjerteTavle.appendChild(emoji);
    hjerter++;
    if (hjerter >= maksHjerter) avsluttSpill("vinner");
  }

  function fjernHjerte() {
    if (hjerter > 0) {
      hjerteTavle.removeChild(hjerteTavle.lastChild);
      hjerter--;
      visMistetHjerteMelding();
    }
  }

  function visMistetHjerteMelding() {
    const melding = document.createElement("div");
    melding.textContent = "💔 Du mistet en stemme!";
    melding.classList.add("hjerte-mistet");
    document.body.appendChild(melding);
    setTimeout(() => melding.remove(), 1200);
  }

  function visSoppelFulltMelding() {
    const melding = document.createElement("div");
    melding.textContent =
      "Ups, søppelet er fullt! Du kan ikke si nei til flere oppgaver.";
    melding.classList.add("hjerte-mistet");
    melding.style.background = "rgba(255,255,255,0.95)";
    melding.style.border = "2px solid #ff8800";
    melding.style.color = "#ff6600";
    document.body.appendChild(melding);
    setTimeout(() => melding.remove(), 2000);
  }

  // Søppel-funksjoner
  function leggISoppel() {
    if (bossLapper < maksBoss) {
      const bossLapp = document.createElement("div");
      bossLapp.classList.add("boss-lapp");
      bossTavle.appendChild(bossLapp);
      bossLapper++;
      oppdaterSoppelTeller();
      if (bossLapper >= maksBoss) soppelFullt = true;
    } else {
      soppelFullt = true;
      visSoppelFulltMelding();
    }
  }

  // Spillerens valg
  function svar(valg) {
    if (valg === "nei" && soppelFullt) {
      visSoppelFulltMelding();
      return;
    }

    if (valg === "ja") {
      gullapper++;
      oppdaterTavle();
      oppdaterStressbar();
      if (aktivKategori === "Medarbeider") leggTilHjerte();
      if (gullapper >= maksGullapper) {
        avsluttSpill(true);
        return;
      }
    } else if (valg === "nei") {
      leggISoppel();
      if (aktivKategori === "Medarbeider" || aktivKategori === "Lars") fjernHjerte();
    }

    setTimeout(() => {
      runde++;
      visSporsmal();
    }, 800);
  }

  function avsluttSpill(tilstand) {
    spill.classList.add("skjult");
    slutt.classList.remove("skjult");
    if (tilstand === true)
      sluttMelding.textContent = `KaoS har tatt over! Tavla er full av gullapper (${gullapper}). Håvard kollapser under arbeidsmengden 💥`;
    else if (tilstand === "vinner")
      sluttMelding.textContent = `Du er kåret til Verdens beste sjef! ❤️🎉 (${hjerter} hjerter)`;
    else
      sluttMelding.textContent = `Du klarte deg! Tavla har ${gullapper} gullapper – kontrollert KaoS for denne gang 😅`;
  }

  // Hendelser
  startKnapp.addEventListener("click", startSpill);
  jaKnapp.addEventListener("click", () => svar("ja"));
  neiKnapp.addEventListener("click", () => svar("nei"));
  startPaNyttKnapp.addEventListener("click", startSpill);
});

