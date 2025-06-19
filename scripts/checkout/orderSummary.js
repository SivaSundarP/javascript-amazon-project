import {calculateCartQuantity, cart, removeFromCart, updateDeliveryOption, updateQuantity} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
        const {productId} = cartItem;
        const matchingProduct = getProduct(productId);
        
        const deliveryOptionId = cartItem.deliveryOptionId;

        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const today = dayjs();
        const deliveryDate = today.add(
            deliveryOption.deliveryDays,
            'days'
        );
        const dateString = deliveryDate.format(
            'dddd, MMMM D'
        );

        cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">
                Delivery date: ${dateString}
                </div>

                <div class="cart-item-details-grid">
                <img class="product-image"
                    src="${matchingProduct.image}">

                <div class="cart-item-details">
                    <div class="product-name">
                    ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                    $${formatCurrency(matchingProduct.priceCents)}
                    </div>
                    <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                    <span>
                        Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                        Update
                    </span>
                    <input class="update-quantity-input js-update-quantity-input-${matchingProduct.id}">
                    <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>

                    <span class="delete-quantity-link link-primary js-delete-link-${matchingProduct.id} js-delete-link" data-product-id="${matchingProduct.id}">
                        Delete
                    </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                    Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(matchingProduct, cartItem)}
                </div>
                </div>
            </div>
        `;
    });

    function deliveryOptionsHTML(matchingProduct, cartItem) {
        let html = '';

        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(
                deliveryOption.deliveryDays,
                'days'
            );
            const dateString = deliveryDate.format(
                'dddd, MMMM D'
            );
            const priceString = deliveryOption.priceCents === 0
                ? 'FREE'
                : `$${formatCurrency(deliveryOption.priceCents)} -`;
            
            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
            html += `
                <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio" ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                    <div class="delivery-option-date">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        ${priceString} Shipping
                    </div>
                    </div>
                </div>
            `;
        });

        return html;
    }
    document.querySelector('.js-order-summary')
        .innerHTML = cartSummaryHTML;

    document.querySelectorAll('.js-delete-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                removeFromCart(productId);

                const conatiner = document.querySelector(`.js-cart-item-container-${productId}`);

                conatiner.remove();
                updateCartQuantity();
                renderPaymentSummary();
            });
        });
    
    document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {
                const {productId, deliveryOptionId} = element.dataset;
                updateDeliveryOption(productId, deliveryOptionId);
                renderOrderSummary();
                updateCartQuantity();
                renderPaymentSummary();
            });
        });
    
    document.querySelectorAll('.js-update-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                console.log('Update', productId);

                console.log(link.innerHTML);

                const cartContainerElement = document.querySelector(`.js-cart-item-container-${productId}`);

                cartContainerElement.classList.add('is-editing-quantity');

            });
        });
    
    function saveButtonFunction(productId) {

        const newQuantity = document.querySelector(`.js-update-quantity-input-${productId}`).value;

        if (newQuantity<0 || newQuantity>1000) {
            alert('Quantity should be in between 0 and 1000.');
        } else if (newQuantity) {
            updateQuantity(productId, Number(newQuantity))
            renderOrderSummary();
            updateCartQuantity();
            renderPaymentSummary();
        }
        
        const cartContainerElement = document.querySelector(`.js-cart-item-container-${productId}`);

        cartContainerElement.classList.remove('is-editing-quantity');
    }

    document.querySelectorAll('.js-save-link')
        .forEach((link) => {
            const {productId} = link.dataset;
            link.addEventListener('click', () => {
                saveButtonFunction(productId);
            });

            const inputElement = document.querySelector(`.js-update-quantity-input-${productId}`);
            inputElement.addEventListener('keydown', (event) => {
                if (event.key === 'Enter'){
                    saveButtonFunction(productId);
                }
            });
        });
}

export function updateCartQuantity() {
    document.querySelector('.js-return-to-home-link').innerHTML = `${calculateCartQuantity()} items`;
}

