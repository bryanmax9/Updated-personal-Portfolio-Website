// For the appearing Menu when Menu button is clicked
let Menu = document.querySelector("#menu-icon");
let HiddenNavList = document.querySelector(".navlist");

Menu.onclick = () => {
  Menu.classList.toggle("bx-x");
  HiddenNavList.classList.toggle("open");
};

// For the Scroll Reveal
const sr = ScrollReveal({
  distance: "65px",
  duration: 2600,
  delay: 450,
  reset: true,
});

// This will give effect to the Hero text,icons,scroll-down ,and image so that whne is loaded it appears with an effect

sr.reveal(".hero-text", { delay: 200, origin: "top" });
sr.reveal(".hero-img", { delay: 450, origin: "top" });
sr.reveal(".icons", { delay: 450, origin: "left" });
sr.reveal(".scroll-down", { delay: 450, origin: "right" });
