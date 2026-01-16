document.addEventListener("DOMContentLoaded", () => {
    // === Elementreferanser ===
    const livEl = document.getElementById("liv");
    const sporsmalEl = document.getElementById("sporsmal");
    const personerEl = document.getElementById("personer");
    const gullapperEl = document.getElementById("gullapper");
    
    // Knapper
    const jaBtn = document.getElementById("ja");
    const neiBtn = document.getElementById("nei");
    const startKnapp = document.getElementById("start-knapp");
    const startPaNyttBtn = document.getElementById("start-pa-nytt");
  
    // Skjermer
    const startSkjerm = document.getElementById("start-skjerm");
    const sluttSkjerm = document.getElementById("slutt-skjerm");
    const sluttTekst = document.getElementById("slutt-tekst");
  
    // 🎵 Lyder
    const lydJa = document.getElementById("lyd-ja");
    const lydNei = document.getElementById("lyd-nei");
    const lydNy = document.getElementById("lyd-ny");
    const lydGameover = document.getElementById("lyd-gameover");
  
    // 🎵 Bakgrunnsmusikk
    const bakgrunnLyd = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_61b6748d52.mp3");
    bakgrunnLyd.loop = true;
    bakgrunnLyd.volume = 0.3;
  
    // === Spillets variabler ===
    let liv = 10;
    const totalLiv = 10;
    let aktivPerson = null;
    
    // Tidskontroll
    let intervallTid = 5000; // Starter med 5 sekunder mellom hver person
    let gameLoopId = null;   // ID for å kunne stoppe timeouten
    let spillIGang = false;
  
    // Data
    const medarbeidere = ["Hanne", "Sanne", "Mali", "Eirik", "Monica"];
    const kollegaer = ["Jens", "Maria", "Tone", "Ali", "Leif"];
    const kunder = ["Kunde AS", "Ekstern AB", "Bedrift X"];
    const toppsjef = "Lars";
  
    // === Tegn hjerter ===
    function tegnLiv() {
      livEl.innerHTML = "";
      for (let i = 0; i < totalLiv; i++) {
        const hjerte = document.createElement("span");
        hjerte.textContent = i < liv ? "❤️" : "🩶";
        livEl.appendChild(hjerte);
      }
    }
  
    // === Generer data ===
    function tilfeldig(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
  
    function lagSporsmal() {
      const kategori = Math.floor(Math.random() * 4);
      let navn, tekst, farge;
  
      if (kategori === 0) {
        navn = tilfeldig(medarbeidere);
        farge = "#4da6ff"; // Blå
        tekst = tilfeldig(["Mer lønn?", "Fri i morgen?", "Ta min vakt?", "Koke kaffe?"]);
      } else if (kategori === 1) {
        navn = tilfeldig(kollegaer);
        farge = "#00b300"; // Grønn
        tekst = tilfeldig(["Hjelp til prosjekt?", "Møte nå?", "Les rapporten?", "Nytt skjema?"]);
      } else if (kategori === 2) {
        navn = tilfeldig(kunder);
        farge = "#333333"; // Svart
        tekst = tilfeldig(["Sak til avisen?", "Spørreundersøkelse?", "Kundemøte?", "Sponse oss?"]);
      } else {
        navn = toppsjef;
        farge = "#ff8000"; // Oransje
        tekst = tilfeldig(["Lede prosjekt?", "Ny strategi?", "Holde foredrag?", "Fikse alt?"]);
      }
      return { navn, tekst, farge };
    }
  
    // === Game Loop (Hjertet i spillet) ===
    function kjorSpillLoop() {
      if (!spillIGang) return;
  
      nyPerson();
  
      // Øk vanskelighetsgraden: Tiden reduseres med 5% hver runde, men aldri raskere enn 800ms
      intervallTid = Math.max(800, intervallTid * 0.95);
      
      // Juster musikktempo basert på hastighet
      const speedFactor = 5000 / intervallTid;
      bakgrunnLyd.playbackRate = Math.min(1.5, Math.max(1, speedFactor * 0.5));
  
      // Sett opp neste runde
      gameLoopId = setTimeout(kjorSpillLoop, intervallTid);
    }
  
    // === Håndter ny person ===
    function nyPerson() {
      if (!spillIGang) return;
  
      // Hvis det allerede står en person der -> Du var for treg!
      if (aktivPerson) {
        liv--;
        tegnLiv();
        sporsmalEl.textContent = "Du var for treg! " + aktivPerson.navn + " ble sur.";
        
        const personEl = personerEl.lastChild;
        if(personEl) {
          personEl.classList.add("misfornoyd");
          lydNei.play(); // Negativ lyd
        }
  
        // Fjern den gamle personen etter et øyeblikk før vi lager en ny
        setTimeout(() => {
          if(personerEl.lastChild) personerEl.lastChild.remove();
          aktivPerson = null;
          sjekkGameover("Du klarte ikke holde unna køen!");
        }, 500);
        
        return; 
      }
  
      // Lag ny person
      const person = lagSporsmal();
      aktivPerson = person;
      lydNy.play().catch(() => {}); // Ignorer feil hvis lyd ikke er klar
  
      const el = document.createElement("div");
      el.classList.add("avatar", "gjest", "kom-inn");
      el.style.backgroundColor = person.farge;
      el.innerHTML = `<div class="navn">${person.navn}</div>`;
      personerEl.innerHTML = ""; // Sikkerhetsvask
      personerEl.appendChild(el);
  
      sporsmalEl.textContent = `${person.navn} spør: "${person.tekst}"`;
    }
  
    // === Spiller svarer ===
    function svar(ja) {
      if (!aktivPerson || !spillIGang) return;
      
      const personEl = personerEl.lastChild;
  
      if (ja) {
        lydJa.currentTime = 0;
        lydJa.play();
        
        // Belønning: Gullapp
        const note = document.createElement("div");
        note.classList.add("gullapp");
        note.textContent = aktivPerson.tekst;
        gullapperEl.appendChild(note);
        
        // Begrens antall lapper visuelt (fjern de eldste hvis mer enn 10)
        if (gullapperEl.children.length > 10) {
          gullapperEl.removeChild(gullapperEl.firstChild);
        }
  
        // Animer ut
        personEl.style.opacity = "0";
        setTimeout(() => personEl.remove(), 200);
  
      } else {
        // Straff: Mist liv
        lydNei.currentTime = 0;
        lydNei.play();
        liv--;
        
        personEl.classList.add("misfornoyd");
        // Lar den stå litt som "straff" før den forsvinner neste loop eller manuelt
        setTimeout(() => {
           if(personEl) {
               personEl.style.opacity = "0";
               setTimeout(() => personEl && personEl.remove(), 200);
           }
        }, 500);
      }
  
      tegnLiv();
      aktivPerson = null;
      sporsmalEl.textContent = "Venter på neste...";
  
      sjekkGameover("Håvard ble utbrent.");
    }
  
    function sjekkGameover(arsak) {
      if (liv <= 0) {
        lydGameover.play();
        avsluttSpill(arsak);
      }
    }
  
    // === Spillkontroll ===
    function startSpill() {
      startSkjerm.classList.add("skjult");
      sluttSkjerm.classList.add("skjult");
      
      // Nullstill variabler
      liv = totalLiv;
      intervallTid = 4000;
      aktivPerson = null;
      spillIGang = true;
      
      // Nullstill UI
      personerEl.innerHTML = "";
      gullapperEl.innerHTML = "";
      tegnLiv();
      sporsmalEl.textContent = "Velkommen på jobb! Gjør deg klar.";
  
      // Start musikk
      bakgrunnLyd.currentTime = 0;
      bakgrunnLyd.playbackRate = 1;
      bakgrunnLyd.play().catch(e => console.log("Lyd blokkert:", e));
  
      // Start loopen
      clearTimeout(gameLoopId);
      setTimeout(kjorSpillLoop, 2000); // Første person kommer om 2 sek
    }
  
    function avsluttSpill(tekst) {
      spillIGang = false;
      clearTimeout(gameLoopId);
      
      bakgrunnLyd.pause();
      
      sluttTekst.textContent = tekst;
      sluttSkjerm.classList.remove("skjult");
    }
  
    // === Event Listeners ===
    jaBtn.onclick = () => svar(true);
    neiBtn.onclick = () => svar(false);
    
    startKnapp.onclick = startSpill;
    startPaNyttBtn.onclick = startSpill;
  
    // Init
    tegnLiv();
  });