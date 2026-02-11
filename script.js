let cart = [];
let userLocation = "Sin ubicación";

let currentItem = {};
let selectedExtras = [];

const toppingsData = {
  burger: [
    { name: "Queso", price: 500 },
    { name: "Bacon", price: 700 },
    { name: "Huevo", price: 400 }
  ],
  pizza: [
    { name: "Extra queso", price: 600 },
    { name: "Aceitunas", price: 300 },
    { name: "Pepperoni", price: 800 }
  ]
};

function useLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    userLocation =
      `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
    document.getElementById("locationText").innerText =
      "Ubicación guardada ✅";
  });
}

function openToppings(name, basePrice, type) {
  currentItem = { name, basePrice, type };
  selectedExtras = [];

  document.getElementById("modalTitle").innerText = name;

  const container = document.getElementById("toppingsButtons");
  container.innerHTML = "";

  toppingsData[type].forEach(extra => {
    const btn = document.createElement("button");
    btn.innerText = `+ ${extra.name} ($${extra.price})`;

    btn.onclick = () => {
      btn.classList.toggle("active");

      if (selectedExtras.includes(extra)) {
        selectedExtras = selectedExtras.filter(e => e !== extra);
      } else {
        selectedExtras.push(extra);
      }
    };

    container.appendChild(btn);
  });

  document.getElementById("toppingsModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("toppingsModal").classList.add("hidden");
}

function confirmToppings() {
  let notes = document.getElementById("notes").value;

  let totalPrice = currentItem.basePrice;
  let extrasText = "";

  selectedExtras.forEach(e => {
    totalPrice += e.price;
    extrasText += `+ ${e.name}\n`;
  });

  cart.push({
    name: currentItem.name,
    price: totalPrice,
    extras: extrasText,
    notes
  });

  document.getElementById("notes").value = "";
  closeModal();
  updateCart();
}

function updateCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    container.innerHTML += `
      <p>
        ${item.name} - $${item.price}
        <button onclick="removeItem(${index})">❌</button>
      </p>
    `;
  });

  document.getElementById("totalPrice").innerText = "$" + total;
}

function removeItem(i) {
  cart.splice(i, 1);
  updateCart();
}

function clearCart() {
  cart = [];
  updateCart();
}

function sendWhatsApp() {
  let text = "🍔 Pedido Tutto Premium:\n\n";

  cart.forEach(item => {
    text += `${item.name}\n${item.extras}\n${item.notes}\n---\n`;
  });

  text += `📍 Ubicación: ${userLocation}`;

  let phone = "2644517816";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`);
}

/* ADMIN OCULTO */
let tapCount = 0;
document.getElementById("logoTap").addEventListener("click", () => {
  tapCount++;
  if (tapCount >= 5) {
    let pass = prompt("Contraseña Admin:");
    if (pass === "tutto2026") {
      document.getElementById("adminPanel").classList.remove("hidden");
    }
    tapCount = 0;
  }
});

function closeAdmin() {
  document.getElementById("adminPanel").classList.add("hidden");
}