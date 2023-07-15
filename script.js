'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

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

////////////////////////////////////////////////////////
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

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //matching strategy : the aim of this code is to ignore clicks that  do not happen on one of the nav links and also navigate after hitting the nav link.

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behaviour: 'smooth',
    }); //The scrollIntoView() method is a built-in JavaScript function that scrolls the element into the visible area of the browser window. It can be used to automatically scroll to a specific element on a web page.
  }
});
