let controller;
let slideScene;
let pageScene;

function animateSlides() {
  //initialise Controller
  controller = new ScrollMagic.Controller();
  //select slide elements
  const sliders = document.querySelectorAll(".slide");
  //select slide nav elements
  const nav = document.querySelectorAll(".nav-header");
  //loop over each slide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    //call GSAP animations
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.InOut" },
    });

    //adding GSAP animations
    //reveals img horiz from 0 to full width
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    //presents img as 2x scale then scales to 1x at the same time as above reveal
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    //reveals text horiz from 0 to full width at 0.75 duration after above
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    //reveals nav vertic from -100 to normal position at 0.5 duration after above
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");

    //create scroll scene
    slideScene = new ScrollMagic.Scene({
      //trigger slide element
      triggerElement: slide,
      //trigger position at quarter of slide
      triggerHook: 0.25,
      //after animation run, don't run again on reverse scroll
      reverse: false,
    })
      //set to run on each slide
      .setTween(slideTl)
      //adding white debug indicators for scenes (named slide)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
      })
      .addTo(controller);

    //new animation
    const pageTl = gsap.timeline();
    //check to see if slides exist after current slide
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    //corrects the transition of next slide to animation vertically sooner
    pageTl.fromTo(nextSlide, { y: "0" }, { y: "50%" });
    //fades and scales down elements on scroll
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    //reverse the vertical animation above after short delay
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");

    //new scroll scene
    //does above animation for full length and starts at top of slide
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "page",
        indent: 200,
      })
      //setting pin anchors scroll in place so it looks like animations are occuring on the spot
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}

//target class "cursor"
let mouse = document.querySelector(".cursor");
//target span in mouseover
let mouseText = mouse.querySelector("span");

//cursor circle highlighting animation
function cursor(e) {
  //add style to top and left, Y and X axis respectively
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  //the target of the mouse is the item moused over
  const item = e.target;
  //add active classes for animations on mouseover
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    //add backgroun colour fill up effect
    gsap.to(".title-swipe", 1, { y: "0%" });
    //show some mouse innertext
    mouseText.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    //remove background colour fill up effect
    gsap.to(".title-swipe", 1, { y: "100%" });
    mouseText.innerText = "";
  }
}

//listen for mouse movement and cursor function on window
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);

animateSlides();
