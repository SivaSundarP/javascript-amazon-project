export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart'));

  if (!cart) {
      cart = [];/*[{
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOptionId: '1'
      }, {
          productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
          quantity: 1,
          deliveryOptionId: '2'
      }];*/
  }
}

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  
  const quantitySelectorElement = document.querySelector(`.js-quantity-selector-${productId}`);
  let quantitySelected;
  if (!quantitySelectorElement){
    quantitySelected = 1;
  } else {
    quantitySelected = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
  }
  if (matchingItem){
    matchingItem.quantity+=quantitySelected;
  } else {
  cart.push({
    productId,
    quantity: quantitySelected,
    deliveryOptionId: '1'   // New product
  });
  }
  saveToStorage();
}

export function removeFromCart(productId) {
    const newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });

    cart = newCart;

    saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
        matchingItem = cartItem;
        }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;

    saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
      if (productId === cartItem.productId) {
      matchingItem = cartItem;
      }
  });

  matchingItem.quantity = newQuantity;
  saveToStorage();
}
