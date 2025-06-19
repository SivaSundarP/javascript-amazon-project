import {renderOrderSummary, updateCartQuantity} from "./checkout/orderSummary.js";
import {renderPaymentSummary} from "./checkout/paymentSummary.js";

// MVC: Model View Controller
renderOrderSummary();
renderPaymentSummary();
updateCartQuantity();