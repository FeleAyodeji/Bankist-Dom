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
