import "./threeParticles";
import "./scss/style.scss";
import anime from "animejs/lib/anime.es.js";

import Swiper, { Pagination, FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
Swiper.use([Pagination, FreeMode]);

// Init vars
import * as contentful from "contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

// API keys

const spacekey = process.env.CONTENTFUL_SPACE_ID;
const accesskey = process.env.CONTENTFUL_ACCESS_KEY;

// ******************************
//     INIT SELECTORS
// ******************************

const menuLinks = document.querySelectorAll(".menu-modal__link");
const burgerButton = document.querySelector("#burger");
const projectModal = document.querySelector("#projectModal");
const projectModalClose = document.querySelector(".project-close");
const menuModal = document.querySelector("#menuModal");
const menuModalInner = document.querySelector(".project-modal__container");
const htmlElem = document.querySelector("html");
const projectContainer = document.querySelector(".project-modal__inner");

let entriesLoaded = {
  agency: false,
  freelance: false,
  fun: false,
};

// init contentful client

var contentfulClient = contentful.createClient({
  space: spacekey,
  accessToken: accesskey,
});

// ******************************
//     CONTENTFUL API CALLS
// ******************************

// get agency entry
contentfulClient
  .getEntry("6GY5mAJGGknPYxMklqhj30")
  .then(function (entries) {
    sliderAgencyContent(entries.fields.order);
    entriesLoaded.agency = true;
  })
  .then(() => {
    modalEventListener();
  });

// get Freelance entry
contentfulClient
  .getEntry("f7t38a85d8ERoF2ytjiSe")
  .then(function (entries) {
    sliderFreelanceContent(entries.fields.order);
    entriesLoaded.freelance = true;
  })
  .then(() => {
    modalEventListener();
  });

// get 'for fun' entry
contentfulClient
  .getEntry("7G1bILJ2aQE2edDeYMTaO0")
  .then(function (entries) {
    sliderFunContent(entries.fields.order);
    entriesLoaded.fun = true;
  })
  .then(() => {
    modalEventListener();
  });

// *************************
//     EVENT LISTENERS
// *************************

burgerButton.addEventListener("click", (e) => {
  toggleMenu();
});

menuLinks.forEach((item) => {
  item.addEventListener("click", (e) => {
    toggleMenu();
  });
});

projectModal.addEventListener("click", (e) => {
  if (projectModal == e.target) {
    closeProjectModal();
  }
});

projectModalClose.addEventListener("click", (e) => {
  closeProjectModal();
});

// ******************************
//     FUNCTIONS
// ******************************

const toggleMenu = () => {
  burgerButton.classList.toggle("open");
  menuModal.classList.toggle("active");
  htmlElem.classList.toggle("disable-scroll");
};

const openProjectModal = (id) => {
  projectModal.classList.add("active");
  document.querySelector("html").classList.add("disable-scroll");
  projectModalClose.classList.add("active");
  menuModalInner.classList.add("active");

  if (id) {
    getProjectInfo(id);
  }
};

const closeProjectModal = () => {
  projectModal.classList.remove("active");
  document.querySelector("html").classList.remove("disable-scroll");
  projectModalClose.classList.remove("active");
  menuModalInner.classList.remove("active");
  projectContainer.innerHTML = `
  
  <figure class="project-modal__skeleton--hero"></figure>

  <div class="project-modal__content">
    <h2 class="project-modal__skeleton--header">Website Title</h2>

    <div class="project-modal__description project-modal__skeleton--description">
      <p>
        description Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi accusantium officiis perferendis soluta voluptate rerum tempora error quibusdam ex quam! Molestias adipisci recusandae repellat, dolorum velit reiciendis voluptatum, repudiandae officiis aliquam illum in,
        aperiam numquam! Cupiditate amet ea corrupti voluptas neque ipsum perspiciatis, officiis temporibus officia quam ipsam esse voluptate?
      </p>
    </div>
  </div>
  `;
};

const modalEventListener = () => {
  // Get all swiper slides and the contentful ID's
  if (Object.values(entriesLoaded).every(Boolean)) {
    document.querySelectorAll(".swiper-slide[data-sysid]").forEach((item) => {
      item.addEventListener("click", (e) => {
        openProjectModal(item.getAttribute("data-sysid"));
      });
    });
  } else {
    // console.log("entries not loaded yet!");
  }
};

// get project id

const getProjectInfo = (id) => {
  let projectHtml = "";

  contentfulClient.getEntry(id).then(function (item) {
    const { websiteName, agencyName, websiteUrl, featuredImage, techStack, description } = item.fields;
    projectHtml = `
    <figure>
    <img src="http:${featuredImage.fields.file.url}" alt="${featuredImage.fields.file.fileName}" />
    </figure>
    <div class="project-modal__content">
      <h2>${websiteName}</h2>
      ${agencyName ? "<h3>" + agencyName + "</h3>" : ""}
      <a href="${websiteUrl}" target="_blank">${websiteUrl}</a>
      ${techStack ? "<h3 class='project-modal__tech'>Tech Stack: " + techStack + "</h3>" : ""}
      <div class="project-modal__description">
      ${description ? documentToHtmlString(description) : "<p>No description yet...</p>"}
      </div>
    </div>
 
    `;
    projectContainer.innerHTML = projectHtml;
  });
};

// ******************************
//        SWIPERS/CAROUSEL
// ******************************

const sliderAgencyContent = (items) => {
  const agencySwiperWrapper = document.querySelector("#agencySwiper");
  let swiperHtml = "";

  for (let item of items) {
    const { websiteName, agencyName, featuredImage } = item.fields;
    swiperHtml =
      swiperHtml +
      `
    <div class="swiper-slide" data-sysid="${item.sys.id}" >
      <h2>${websiteName}</h2>
      <h3>${agencyName}</h3>
      <figure class="swiper__img-container">
        <img src="http:${featuredImage.fields.file.url}" alt="${featuredImage.fields.file.fileName}" />
      </figure>
    </div>
    `;
  }
  agencySwiperWrapper.innerHTML = swiperHtml;

  // Init agency swiper carousel

  const agencySwiper = new Swiper(".agency-work__swiper", {
    slidesPerView: 1, // mobile settings
    spaceBetween: 20, // mobile settings
    freeMode: true,
    loop: true,
    grabCursor: true,
    pagination: {
      el: ".agency-work__pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    },
  });
};

const sliderFreelanceContent = (items) => {
  const freelanceSwiperWrapper = document.querySelector("#freelanceSwiper");
  let swiperHtml = "";
  for (let item of items) {
    const { websiteName, featuredImage } = item.fields;
    swiperHtml =
      swiperHtml +
      `
    <div class="swiper-slide" data-sysid="${item.sys.id}">
      <h2>${websiteName}</h2>
      <figure class="swiper__img-container">
        <img src="http:${featuredImage.fields.file.url}" alt="${featuredImage.fields.file.fileName}" />
      </figure>
    </div>
    `;
  }
  freelanceSwiperWrapper.innerHTML = swiperHtml;

  // Init freelance swiper carousel

  const freelanceSwiper = new Swiper(".freelance-work__swiper", {
    slidesPerView: 1, // mobile settings
    spaceBetween: 20, // mobile settings
    freeMode: true,
    loop: true,
    grabCursor: true,
    pagination: {
      el: ".freelance-work__pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    },
  });
};

const sliderFunContent = (items) => {
  const funSwiperWrapper = document.querySelector("#funSwiper");
  let swiperHtml = "";
  for (let item of items) {
    const { websiteName, featuredImage } = item.fields;
    swiperHtml =
      swiperHtml +
      `
    <div class="swiper-slide" data-sysid="${item.sys.id}">
      <h2>${websiteName}</h2>
      <figure class="swiper__img-container">
        <img src="http:${featuredImage.fields.file.url}" alt="${featuredImage.fields.file.fileName}" />
      </figure>
    </div>
    `;
  }
  funSwiperWrapper.innerHTML = swiperHtml;

  // Init fun swiper carousel

  const funSwiper = new Swiper(".fun-work__swiper", {
    slidesPerView: 1, // mobile settings
    spaceBetween: 20, // mobile settings
    freeMode: true,
    loop: true,
    grabCursor: true,
    pagination: {
      el: ".fun-work__pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    },
  });
};

// *******************************************
//        FONTS/ANIME ANIMATIONS
// *******************************************

// Wrap every letter in a span
var textWrapper = document.querySelector(".ml7 .letters");
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime
  .timeline({ loop: false })
  .add({
    targets: ".ml7 .letter",
    opacity: 0,
    // duration: 1000,
    easing: "easeOutExpo",
    delay: (el, i) => 50 * i,
    // delay: 1000,
  })
  .add({
    targets: ".ml7 .letter",
    translateY: ["1.1em", 0],
    // translateX: ["0.55em", 0],
    translateZ: 0,
    opacity: 1,
    rotateZ: [90, 0],
    duration: 750,
    easing: "easeOutExpo",
    delay: (el, i) => 50 * i,
  });
