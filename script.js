'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////

// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////////////////////////
//scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); // getting the cordinates of the element er are scrolling to
  section1.scrollIntoView({ behaviour: 'smooth' });
});

///////////////////////////////////////////////////////////////////

//Page navigation

//By using foreach on the nav buttons to navigate, this procedure isnt 100 accurate

/* document.querySelectorAll('nav__link').forEach(function (el) {
  el.addEventListener('clcik', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behaviour: 'smooth' });
  });
}); */

//By using event delegation
//1. add event listener to common parent element
//2. determine what element originated the event

document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();

    // Matching strategy: Ignore clicks that do not happen on one of the nav links and navigate after hitting the nav link.
    if (event.target.classList.contains('nav__link')) {
      const targetId = event.target.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      // Scroll to the target element smoothly
      targetElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  });
/////////////////////////////////////////////////////////////////////////////////////
//Tabbed Component

tabsContainer.addEventListener('click', function (event) {
  const clickedTab = event.target.closest('.operations__tab');

  // Guard clause if no tab is clicked
  if (!clickedTab) {
    return;
  }

  // Remove active classes from all tabs
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  // Remove active classes from all content areas
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Activate the clicked tab
  clickedTab.classList.add('operations__tab--active');

  // Activate the corresponding content area
  const clickedTabContent = document.querySelector(
    `.operations__content--${clickedTab.dataset.tab}` // Access the value of the "tab" data attribute
  );
  clickedTabContent.classList.add('operations__content--active');
});

//////////////////////////////////////////////////////////////////////////////////
//Menu fade animation

const handleHover = function (opacity) {
  return function (event) {
    // Check if the hovered element has the "nav__link" class
    if (event.target.classList.contains('nav__link')) {
      const link = event.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');
      // Set opacity for sibling links
      siblings.forEach(el => {
        if (el !== link) {
          el.style.opacity = opacity;
        }
      });
      // Set opacity for the logo
      logo.style.opacity = opacity;
    }
  };
};
// Add event listeners for mouseover and mouseout events, with different opacity values
nav.addEventListener('mouseover', handleHover(0.5));
nav.addEventListener('mouseout', handleHover(1));

/////////////////////////////////////////////////////////////////////////////////////////
//Sticky Navigation

/* const initialCoords = section1.getBoundingClientRect();

// Handle scroll event
const handleScroll = () => {
  const scrollY = window.scrollY;
  // Check if the scroll position is below the initial position of section1
  if (scrollY > initialCoords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
// Add scroll event listener
window.addEventListener('scroll', handleScroll);
 */

//sticky navigation: using Intersection observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

// Callback function for Intersection Observer
const stickyNav = function (entries) {
  const [entry] = entries;

  // If the header is not intersecting with the viewport, add the 'sticky' class to the navigation
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    // If the header is intersecting with the viewport, remove the 'sticky' class from the navigation
    nav.classList.remove('sticky');
  }
};

// Create a new Intersection Observer instance
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`, // Sets a margin of -90px for the root (viewport) bounding box
});

// Start observing the header element
headerObserver.observe(header);

////////////////////////////////////////////////////////////////////////

//Reveal Sections : using Observer intersection APi

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  // If the section is not intersecting with the viewport, return and do nothing
  if (!entry.isIntersecting) {
    return;
  }

  // Remove the 'section--hidden' class to reveal the section
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

// Create a new Intersection Observer instance
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// Observe each section and add the 'section--hidden' class initially
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//////////////////////////////////////////////////////////////////////////
//Lazy Loading images'

const imgTargets = document.querySelectorAll('img[data-src]');

const loading = function (entries, observer) {
  const [entry] = entries;

  // If the image is not intersecting with the viewport, return and do nothing
  if (!entry.isIntersecting) {
    return;
  }

  // Replace the src attribute with the data-src attribute to load the image
  entry.target.src = entry.target.dataset.src;

  // Listen for the 'load' event to remove the 'lazy-img' class after the image has loaded
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // Stop observing the image after it has been loaded
  observer.unobserve(entry.target);
};

// Create a new Intersection Observer instance
const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // Add a 200px margin around the root (viewport)
});

// Observe each image target
imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////////////////////////////////////////////////////

//implementing slider component
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

let currentSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotsContainer.insertAdjacentElement(
      'beforeend',
      `< button class="dots__dot" data-slide='${i}'></button>`
    );
  });
};

//show the active dot
const activateDots = function (slide) {
  document
    .querySelectorAll('.dots_dot')
    .forEach(dot => dot.classList.remove('dots_dot--active'));

  document
    .querySelector(`.dots__dot[data-slide= "${slide}"]`)
    .classList.add('dots__dot--active');
};

// Function to move to a specific slide
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

// Function to move to the next slide
const nextSlide = function () {
  // If it's the last slide, move to the first slide (looping behavior)
  currentSlide = (currentSlide + 1) % maxSlide;
  goToSlide(currentSlide);
  activateDots(currentSlide);
};

// Function to move to the previous slide
const prevSlide = function () {
  // If it's the first slide, move to the last slide (looping behavior)
  currentSlide = (currentSlide - 1 + maxSlide) % maxSlide;
  goToSlide(currentSlide);
  activateDots(currentSlide);
};

const init = function () {
  goToSlide(0);
  //createDots();
  activateDots(0);
};

init();

// Listen for a click on the "Next" button and move to the next slide
btnRight.addEventListener('click', nextSlide);

// Listen for a click on the "Previous" button and move to the previous slide
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDots(slide);
  }
});
