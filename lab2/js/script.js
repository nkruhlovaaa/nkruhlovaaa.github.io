document.addEventListener("DOMContentLoaded", function () {
    let products = document.querySelectorAll(".product-card");

    // Оновлення кошика
    const cartItems = document.getElementById("cart-items");
    const totalPriceElem = document.getElementById("total-price");
    const clearCartButton = document.getElementById("clear-cart");

    const toggleCartButton = document.getElementById("toggle-cart"); // Кнопка для приховування кошика
    const commentForm = document.getElementById("comment-form"); // Форма коментарів
    const commentList = document.getElementById("comment-list"); // Список коментарів
    //завдання 3
    function updateCart() {
        cartItems.innerHTML = "";
        let totalPrice = 0;
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.forEach(item => {
            let li = document.createElement("li");
            li.innerHTML = `
                ${item.name} - <span class="quantity">${item.quantity}</span> x ${item.price} грн
                <button class="decrease" data-id="${item.id}">-</button>
                <button class="increase" data-id="${item.id}">+</button>
            `;
            cartItems.appendChild(li);
            totalPrice += item.quantity * item.price;
        });

        totalPriceElem.textContent = totalPrice + " грн";
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    cartItems.addEventListener("click", function(event) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let productId = event.target.getAttribute("data-id");

        let productIndex = cart.findIndex(item => item.id === productId);
        if (productIndex === -1) return;

        if (event.target.classList.contains("increase")) {
            cart[productIndex].quantity += 1;
        } else if (event.target.classList.contains("decrease")) {
            cart[productIndex].quantity -= 1;
            if (cart[productIndex].quantity === 0) {
                cart.splice(productIndex, 1);
            }
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    });
        // 1 завдання 
    let i = 0;
    while (i < products.length) {
        let availabilityText = products[i].querySelector("p:nth-of-type(2)").textContent;
        if (availabilityText.includes("Ні")) {
            products[i].style.display = "none";
        }
        i++;
    }

    i = 0;
    while (i < products.length) {
        let product = products[i];
        let priceText = product.querySelector("p").textContent;
        let ratingText = product.querySelector("p:nth-of-type(3)").textContent;
        let price = parseInt(priceText.replace(/\D/g, ""), 10);
        let rating = ratingText.split("★").length - 1;

        if (price > 3000) {
            product.style.backgroundColor = "#ebf6fa"; // Голубий фон для дорогих товарів
        } else if (price < 1000) {
            product.style.backgroundColor = "#eaeee0"; // Зелений фон для дешевих товарів
        }

        if (rating === 5) {
            product.style.border = "2px solid gold"; // Золота обводка для 5-зіркових товарів
        }

        let addButton = product.querySelector(".add-to-cart");
        //Завдання 2
        // Використовуємо назву товару як унікальний ID
        let productId = product.querySelector("h3").textContent; 
        addButton.setAttribute("data-id", productId);

        addButton.addEventListener("click", function () {
            addButton.textContent = "Товар у кошику";
            addButton.disabled = true;

            let productName = product.querySelector("h3").textContent;
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let existingProduct = cart.find(item => item.id === productId);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: price,
                    quantity: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        });

        product.addEventListener("mouseenter", function () {
            product.style.backgroundColor = "#f0f0f0";
        });

        product.addEventListener("mouseleave", function () {
            product.style.backgroundColor = price > 3000 ? "#ebf6fa" : price < 1000 ? "#eaeee0" : "white";
        });

        i++;
    }

    clearCartButton.addEventListener("click", function () {
        localStorage.removeItem("cart");
        updateCart();
    });

    toggleCartButton.addEventListener("click", function () {
        if (cartItems.style.display === "none") {
            cartItems.style.display = "block";
            totalPriceElem.style.display = "block";
        } else {
            cartItems.style.display = "none";
            totalPriceElem.style.display = "none";
        }
    });

    commentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let commentInput = document.getElementById("comment-input");
        let commentText = commentInput.value.trim();

        if (commentText === "") {
            alert("Коментар не може бути порожнім!");
            return;
        }

        let li = document.createElement("li");
        li.textContent = commentText;
        commentList.appendChild(li);
        commentInput.value = "";
    });

    updateCart();
});
