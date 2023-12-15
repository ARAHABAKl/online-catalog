"use strict"
//==========================================
import { ERROR_SERVER, NO_ITEMS_CART } from './constants.js';
import { 
    showErrorMessage,
    setBasketLocalStorage,
    getBasketLocalStorage,
    checkingRelevanceValueBasket
} from './utils.js';

const cart = document.querySelector('.cart');
let productsData = [];


getProducts();
cart.addEventListener('click', delProductBasket);


async function getProducts() {
    try {

        if (!productsData.length) {
            const res = await fetch('../data/products.json');
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            productsData = await res.json();
        }
        
        loadProductBasket(productsData);

    } catch (err) {
        showErrorMessage(ERROR_SERVER);
        console.log(err.message);
    }
}

function loadProductBasket(data) {
    cart.textContent = '';

    if (!data || !data.length) {
        showErrorMessage(ERROR_SERVER)
        return;
    }

    checkingRelevanceValueBasket(data);
    const basket = getBasketLocalStorage();

    if(!basket || !basket.length) {
        showErrorMessage(NO_ITEMS_CART)
        return;
    }

    const findProducts = data.filter(item => basket.includes(String(item.id)));

    if(!findProducts.length) {
        showErrorMessage(NO_ITEMS_CART)
        return;
    }

    renderProductsBasket(findProducts);
}

function delProductBasket(event) {
    const targetButton = event.target.closest('.cart__del-card');
    if (!targetButton) return;

    const card = targetButton.closest('.cart__product');
    const id = card.dataset.productId;
    const basket = getBasketLocalStorage();

    const newBasket = basket.filter(item => item !== id);
    setBasketLocalStorage(newBasket);

    getProducts()
}


function renderProductsBasket(arr) {
    arr.forEach(card => {
        const { id, img, title, price } = card;

        const cardItem = 
        `
        <div class="cart__product" data-product-id="${id}">
            <div class="cart__img">
                <img src="./images/${img}" alt="${title}">
            </div>
            <div class="cart__title">${title}</div>
            <div class="cart__block-btns">
                <button class="cart__minus">-</button>
                <div class="cart__count">1</div>
                <button class="cart__plus">+</button>
            </div>
            <div class="cart__price">
                <span>${price}</span>
            </div>
            <div class="cart__del-card">
                <div class="del_card">
                    <svg  xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
                    <line y1="-0.5" x2="17.5227" y2="-0.5" transform="matrix(0.727587 0.686015 -0.727587 0.686015 0.250488 0.843262)"/>
                    <line y1="-0.5" x2="17.5227" y2="-0.5" transform="matrix(-0.727587 0.686015 -0.727587 -0.686015 13 0.135986)"/>
                    </svg>
                </div>
            </div>
        </div>
        <img class="line" src="/images/Line 1.svg" alt="">
        `;

        cart.insertAdjacentHTML('beforeend', cardItem);
    });
}

