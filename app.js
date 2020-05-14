let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
  //initialise Controller
  controller = new ScrollMagic.Controller();
  //select slide elements
  const sliders = document.querySelectorAll('.slide');
  //select slide nav elements
  const nav = document.querySelectorAll('.nav-header');
  //loop over each slide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector('.reveal-img');
    const img = slide.querySelector('img');
    const revealText = slide.querySelector('.reveal-text');
    //call GSAP animations
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: 'power2.InOut' },
    });

    //adding GSAP animations
    //reveals img horiz from 0 to full width
    slideTl.fromTo(revealImg, { x: '0%' }, { x: '100%' });
    //presents img as 2x scale then scales to 1x at the same time as above reveal
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1');
    //reveals text horiz from 0 to full width at 0.75 duration after above
    slideTl.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.75');
    //reveals nav vertic from -100 to normal position at 0.5 duration after above
    slideTl.fromTo(nav, { y: '-100%' }, { y: '0%' }, '-=0.5');

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
      // .addIndicators({
      //   colorStart: "white",
      //   colorTrigger: "white",
      //   name: "slide",
      // })
      .addTo(controller);

    //new animation
    const pageTl = gsap.timeline();
    //check to see if slides exist after current slide
    let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
    //corrects the transition of next slide to animation vertically sooner
    pageTl.fromTo(nextSlide, { y: '0' }, { y: '50%' });
    //fades and scales down elements on scroll
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    //reverse the vertical animation above after short delay
    pageTl.fromTo(nextSlide, { y: '50%' }, { y: '0%' }, '-=0.5');

    //new scroll scene
    //does above animation for full length and starts at top of slide
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: '100%',
      triggerHook: 0,
    })
      // .addIndicators({
      //   colorStart: "white",
      //   colorTrigger: "white",
      //   name: "page",
      //   indent: 200,
      // })
      //setting pin anchors scroll in place so it looks like animations are occuring on the spot
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}

//target class "cursor"
const mouse = document.querySelector('.cursor');
//target span in mouseover
const mouseText = mouse.querySelector('span');
//target burger menu
const burger = document.querySelector('.burger');

//cursor circle highlighting animation
function cursor(e) {
  //add style to top and left, Y and X axis respectively
  mouse.style.top = e.pageY + 'px';
  mouse.style.left = e.pageX + 'px';
}

function activeCursor(e) {
  //the target of the mouse is the item moused over
  const item = e.target;
  //add active classes for animations on mouseover
  if (item.id === 'logo' || item.classList.contains('burger')) {
    mouse.classList.add('nav-active');
  } else {
    mouse.classList.remove('nav-active');
  }
  if (item.classList.contains('explore')) {
    mouse.classList.add('explore-active');
    //add backgroun colour fill up effect
    gsap.to('.title-swipe', 1, { y: '0%' });
    //show some mouse innertext
    mouseText.innerText = 'Tap';
  } else {
    mouse.classList.remove('explore-active');
    //remove background colour fill up effect
    gsap.to('.title-swipe', 1, { y: '100%' });
    mouseText.innerText = '';
  }
}

//toggle nav menu overlay
function navToggle(e) {
  //if target isn't active, add the class to it, else remove
  if (!e.target.classList.contains('active')) {
    e.target.classList.add('active');
    //change burger lines to black and rotate into an X
    gsap.to('.line1', 0.5, { rotate: '45', y: 5, background: '#000' });
    gsap.to('.line2', 0.5, { rotate: '-45', y: -5, background: '#000' });
    //change logo colour to black
    gsap.to('#logo', 1, { color: '#000' });
    //expand out the nav menu overlay
    gsap.to('.nav-bar', 1, { clipPath: 'circle(2500px at 100% -10%' });
    //add hide class to avoid scroll in nav menu
    document.body.classList.add('hide');
  } else {
    e.target.classList.remove('active');
    //change burger lines back to original
    gsap.to('.line1', 0.5, { rotate: '0', y: 0, background: '#f0ffff' });
    gsap.to('.line2', 0.5, { rotate: '0', y: 0, background: '#f0ffff' });
    //change logo colour to original
    gsap.to('#logo', 1, { color: '#f0ffff' });
    //retract the nav menu overlay
    gsap.to('.nav-bar', 1, { clipPath: 'circle(50px at 100% -10%' });
    //remove hide class
    document.body.classList.remove('hide');
  }
}

//barbajs page transitions
const logo = document.querySelector('#logo');
barba.init({
  views: [
    {
      //for home page
      namespace: 'home',
      //run animate slides
      beforeEnter() {
        animateSlides();
        //set href of logo in nav to home page
        logo.href = './index.html';
      },
      //get rid of the following before page is left
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    //for fashion sub page
    {
      namespace: 'fashion',
      beforeEnter() {
        //reset href of logo in nav to home page after transition
        logo.href = '../index.html';
        detailAnimation();
        gsap.fromTo(
          '.nav-header',
          1,
          { y: '100%' },
          { y: '0%', ease: 'power2.inOut' }
        );
      },
      //get rid of the following before page is left
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      //leaving current container and entering next one - animations
      leave({ current, next }) {
        let done = this.async();
        //run a gsap opacity animation with swipe
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          '.swipe',
          0.75,
          { x: '-100%' },
          { x: '0%', onComplete: done },
          '-=0.5'
        );
      },
      enter({ current, next }) {
        let done = this.async();
        //scroll to top of page on enter
        window.scrollTo(0, 0);
        //run a gsap opacity animation with swipe
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        tl.fromTo(
          '.swipe',
          0.75,
          { x: '0%' },
          { x: '100%', stagger: 0.25, onComplete: done }
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
      },
    },
  ],
});

//add ScrollMagic effects for fashion sub page
function detailAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll('.detail-slide');
  //add animation for each slide, similar to home page
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defaults: { duration: 1 } });
    let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, '-=1');
    //create new detail scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: '100%',
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      .addTo(controller);
  });
}
//event listeners
window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);
burger.addEventListener('click', navToggle);
