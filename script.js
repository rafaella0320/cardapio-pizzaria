const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
});

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
});

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-card-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");

        const price = parseFloat(parentButton.getAttribute("data-price"));

        addToCart(name, price);
    }
});

function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();

};

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.innerHTML = `
        <div class = "flex items-center justify-between"> 
            <div> 
                <p class = "font-medium">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class = "font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button class = "remove-from-cart-btn" data-name="${item.name}"> 
                Remover
            </button>
        </div>
        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

};

cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        };

        cart.splice(index, 1);
        updateCartModal();
    };
};

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-customRed")
        addressWarn.classList.add("hidden")
    }
});

checkoutBtn.addEventListener("click", function () {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops! O restaurante está fechado.",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    };

    if (cart.length === 0) return;

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    };

    let message = "Seu pedido:\n";
    const cartItems = cart.map((item) => {
        return (
            `${item.name} - Quantidade: (${item.quantity}) - Preço: R$${(item.price * item.quantity).toFixed(2)}`
        );
    }).join("\n");

    message += cartItems;
    message += `\nTotal do pedido: ${cartTotal.textContent}`;
    const encodedMessage = encodeURIComponent(message);
    const phone = "+5521972994385";

    window.open(`https://wa.me/${phone}?text=${encodedMessage}%0AEndereço: ${addressInput.value}`, "_blank");

    cart = [];
    updateCartModal();

});

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 24;
};

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-customRed");
    spanItem.classList.add("bg-customGreen");
} else {
    spanItem.classList.remove("bg-customGreen");
    spanItem.classList.add("bg-customRed");
};
