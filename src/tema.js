const toggleContainer = document.querySelector(".toggle-container");
const toggle = document.querySelector(".toggle");
const tempAtual = document.getElementById("temp-atual");
const root = document.documentElement;
const body = document.querySelector("body");
const boxDias = document.querySelectorAll(".box-dias");
const pesCidade = document.getElementById("cidade");
const boxLow = document.querySelectorAll(".box-low");
const btn = document.querySelector(".btn-pesquisa");
const cor70 = document.querySelectorAll(".cor-70");
const cor90 = document.querySelectorAll(".cor-90");
const cor100 = document.querySelectorAll(".cor-100");
const titleHeader = document.querySelector("h2"); 


toggle.addEventListener('click', () => {
    toggleContainer.classList.toggle("light");
    toggle.classList.toggle("light");

    body.classList.toggle("bg-light");

    boxDias.forEach(item => {
        item.classList.toggle("box-light");
    });

    boxLow.forEach(box => {
        box.classList.toggle("low-dark");
    });

    cor70.forEach(item7 => {
        item7.classList.toggle("black-70");
    });

    cor90.forEach(item9 => {
        item9.classList.toggle("black-90");
    });

    cor100.forEach(item10 => {
        item10.classList.toggle("black-100");
    });

    titleHeader.classList.toggle("title-header");
    pesCidade.classList.toggle("input-light");
    tempAtual.classList.toggle("temp-light");

    btn.classList.toggle("btn-light");
});
