"use strict";

/* =========================================================
   CONFIGURACIÓN PRINCIPAL
   ========================================================= */
const CONFIG = {
  whatsappNumber: "525631064309",
  eventDate: new Date("2026-09-26T14:00:00-06:00"),

  /*
    Deja esta cadena vacía para usar solo WhatsApp.
    Cuando publiques Google Apps Script, pega aquí la URL que termina en /exec.
  */
  sheetsEndpoint: "https://script.google.com/macros/s/AKfycby2E1XdE5PkFQk5PCxQHf-B0Y5MG6_YTAo6WdyyAM-JNukL07Uq9KBQFFyE55OFvf9C/exec"
};

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

let selectedGender = "";
let currentSlide = 0;
let carouselTimer = null;

document.body.classList.add("invitation-locked");

function createSkyEffects() {
  const container = $("#sparkles");
  if (!container || reducedMotion) return;

  for (let i = 0; i < 46; i += 1) {
    const sparkle = document.createElement("span");
    const isStoryStar = i < 13;
    sparkle.className = `sparkle${isStoryStar ? " story-star" : ""}`;
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.setProperty("--duration", `${3.8 + Math.random() * 5.5}s`);
    sparkle.style.setProperty("--delay", `${-Math.random() * 8}s`);
    if (isStoryStar) sparkle.style.setProperty("--star-size", `${5 + Math.random() * 6}px`);
    container.appendChild(sparkle);
  }

  const meteorLayer = $("#shootingStars");
  if (!meteorLayer) return;

  const launchShootingStar = () => {
    const star = document.createElement("span");
    const startsFromLeft = Math.random() > .22;
    const startX = startsFromLeft ? -18 : 18 + Math.random() * 45;
    const startY = 5 + Math.random() * 52;
    const travelX = startsFromLeft ? 82 + Math.random() * 35 : 55 + Math.random() * 34;
    const travelY = 28 + Math.random() * 28;

    star.className = "shooting-star";
    star.style.setProperty("--start-x", `${startX}vw`);
    star.style.setProperty("--start-y", `${startY}vh`);
    star.style.setProperty("--travel-x", `${travelX}vw`);
    star.style.setProperty("--travel-y", `${travelY}vh`);
    star.style.setProperty("--angle", `${24 + Math.random() * 8}deg`);
    star.style.setProperty("--tail", `${110 + Math.random() * 90}px`);
    star.style.setProperty("--travel-time", `${1.9 + Math.random() * 1.1}s`);
    meteorLayer.appendChild(star);

    star.addEventListener("animationend", () => star.remove(), { once: true });
    window.setTimeout(launchShootingStar, 4200 + Math.random() * 5200);
  };

  window.setTimeout(launchShootingStar, 1500);
}

function setupIntroAndMusic() {
  const intro = $("#introScreen");
  const openButton = $("#openInvitationBtn");
  const music = $("#bgMusic");
  const audioButton = $("#audioBtn");
  const icon = $("#audioIcon");
  const label = $("#audioLabel");

  const refreshAudioButton = () => {
    const playing = music && !music.paused;
    audioButton?.classList.toggle("is-playing", playing);
    audioButton?.setAttribute("aria-pressed", String(playing));
    if (icon) icon.textContent = playing ? "❚❚" : "♪";
    if (label) label.textContent = playing ? "Pausar" : "Música";
  };

  const tryPlay = async () => {
    if (!music) return;
    try {
      await music.play();
    } catch {
      // Algunos navegadores necesitan otra interacción del usuario.
    }
    refreshAudioButton();
  };

  openButton?.addEventListener("click", async () => {
    intro?.classList.add("is-open");
    document.body.classList.remove("invitation-locked");
    await tryPlay();
    window.setTimeout(() => intro?.remove(), 900);
  });

  audioButton?.addEventListener("click", async () => {
    if (!music) return;
    if (music.paused) await tryPlay();
    else music.pause();
    refreshAudioButton();
  });

  music?.addEventListener("play", refreshAudioButton);
  music?.addEventListener("pause", refreshAudioButton);
  music?.addEventListener("error", () => {
    audioButton?.classList.add("is-missing");
    audioButton?.setAttribute("aria-label", "Agrega el archivo assets/audio/baby-paulo.mp3");
    if (label) label.textContent = "Sin audio";
  });
}

function setupCountdown() {
  const fields = {
    days: $("#days"),
    hours: $("#hours"),
    minutes: $("#minutes"),
    seconds: $("#seconds")
  };

  const update = () => {
    const difference = CONFIG.eventDate.getTime() - Date.now();
    if (difference <= 0) {
      Object.values(fields).forEach((field) => { if (field) field.textContent = "00"; });
      $("#eventPassed")?.removeAttribute("hidden");
      return;
    }

    const day = 86_400_000;
    const hour = 3_600_000;
    const minute = 60_000;
    fields.days.textContent = String(Math.floor(difference / day)).padStart(2, "0");
    fields.hours.textContent = String(Math.floor((difference % day) / hour)).padStart(2, "0");
    fields.minutes.textContent = String(Math.floor((difference % hour) / minute)).padStart(2, "0");
    fields.seconds.textContent = String(Math.floor((difference % minute) / 1000)).padStart(2, "0");
  };

  update();
  window.setInterval(update, 1000);
}

function setupCarousel() {
  const slides = $$(".slide");
  const dots = $("#carouselDots");
  const carousel = $("#carousel");
  if (!slides.length || !dots) return;

  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentSlide);
      slide.setAttribute("aria-hidden", String(slideIndex !== currentSlide));
    });
    $$(".carousel-dot", dots).forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentSlide);
      dot.setAttribute("aria-current", dotIndex === currentSlide ? "true" : "false");
    });
  };

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver fotografía ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    dots.appendChild(dot);
  });

  const restartTimer = () => {
    if (reducedMotion || slides.length < 2) return;
    window.clearInterval(carouselTimer);
    carouselTimer = window.setInterval(() => showSlide(currentSlide + 1), 5200);
  };

  $("#prevSlide")?.addEventListener("click", () => { showSlide(currentSlide - 1); restartTimer(); });
  $("#nextSlide")?.addEventListener("click", () => { showSlide(currentSlide + 1); restartTimer(); });
  carousel?.addEventListener("mouseenter", () => window.clearInterval(carouselTimer));
  carousel?.addEventListener("mouseleave", restartTimer);
  carousel?.addEventListener("focusin", () => window.clearInterval(carouselTimer));
  carousel?.addEventListener("focusout", restartTimer);

  showSlide(0);
  restartTimer();
}

function setupGenderGame() {
  $$(".gender-card").forEach((button) => {
    button.addEventListener("click", () => {
      selectedGender = button.dataset.gender || "";
      $$(".gender-card").forEach((option) => {
        option.classList.toggle("is-selected", option === button);
        option.setAttribute("aria-pressed", String(option === button));
      });
      const result = $("#genderSelection");
      if (result) result.textContent = `Tu predicción: ${selectedGender}.`;
    });
  });
}

function setupRevealAnimations() {
  const items = $$(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });

  items.forEach((item) => observer.observe(item));
}

async function saveToSheet(payload) {
  if (!CONFIG.sheetsEndpoint) return false;

  try {
    await fetch(CONFIG.sheetsEndpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    return true;
  } catch (error) {
    console.warn("No fue posible registrar la confirmación.", error);
    return false;
  }
}

function setupRsvp() {
  const form = $("#rsvpForm");
  const status = $("#rsvpStatus");
  const submitButton = $("#rsvpSubmitBtn");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const payload = {
      nombre: $("#guestName").value.trim(),
      asistencia: $("#attendance").value,
      adultos: $("#adultCount").value || "1",
      prediccion: selectedGender || "Sin predicción",
      mensaje: $("#message").value.trim(),
      evento: "Baby Shower Baby Paulo"
    };

    submitButton.disabled = true;
    status.className = "rsvp-status";
    status.textContent = CONFIG.sheetsEndpoint
      ? "Guardando tu respuesta y preparando WhatsApp…"
      : "Preparando tu confirmación…";

    const saved = await saveToSheet(payload);
    const text = [
      "Hola, confirmo mi respuesta para el Baby Shower de Baby Paulo. 💙",
      "",
      `*Nombre:* ${payload.nombre}`,
      `*Asistencia:* ${payload.asistencia}`,
      `*Número de adultos:* ${payload.adultos}`,
      `*Mi predicción:* ${payload.prediccion}`,
      payload.mensaje ? `*Mensaje:* ${payload.mensaje}` : ""
    ].filter(Boolean).join("\n");

    status.textContent = saved
      ? "Respuesta registrada. Se abrirá WhatsApp para terminar la confirmación."
      : "Se abrirá WhatsApp para enviar tu confirmación.";

    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    submitButton.disabled = false;
  });
}

createSkyEffects();
setupIntroAndMusic();
setupCountdown();
setupCarousel();
setupGenderGame();
setupRevealAnimations();
setupRsvp();
