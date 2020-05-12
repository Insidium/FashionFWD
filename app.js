let controller;
let slideScene;

function animateSlides() {
  //initialise Controller
  controller = new ScrollMagic.Controller();
  //select slide elements
  const sliders = document.querySelectorAll(".slide");
  //select slide nav elements
  const nav = document.querySelectorAll(".nav-header");
  //loop over each slide
  sliders.forEach((slide) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    //call GSAP animations
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.InOut" },
    });
    //addimng GSAP animations
    //reveals img horiz from 0 to full width
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    //presents img as 2x scale then scales to 1x at the same time as above reveal
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    //reveals text horiz from 0 to full width at 0.75 duration after above
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    //reveals nav vertic from -100 to normal position at 0.5 duration after above
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");
  });
}

animateSlides();
