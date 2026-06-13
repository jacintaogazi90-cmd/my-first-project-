const products = [
  { id: 1, name: "Coca-Cola Classic", desc: "The original, timeless taste since 1886.", price: 2.49, emoji: "🥤" },
  { id: 2, name: "Diet Coke", desc: "All the taste, zero calories.", price: 2.49, emoji: "🧃" },
  { id: 3, name: "Coca-Cola Zero Sugar", desc: "Zero sugar, full Coca-Cola taste.", price: 2.49, emoji: "⚫" },
  { id: 4, name: "Sprite", desc: "Crisp lemon-lime refreshment.", price: 2.29, emoji: "💚" },
  { id: 5, name: "Fanta Orange", desc: "Bursting with fruity orange flavor.", price: 2.29, emoji: "🍊" },
  { id: 6, name: "Coca-Cola Variety Pack", desc: "12-pack mix of your favourite Coke drinks.", price: 18.99, emoji: "📦" },
];

let cart = [];

function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-emoji">${p.emoji}</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="product-price">$${p.price.toFixed(2)}</div>
      <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join('');
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  showToast(`${product.emoji} ${product.name} added to cart!`);
}

function updateCart() {
  const count = cart.reduce((sum, c) => sum + c.qty, 0);
  document.getElementById('cart-count').textContent = count;

  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  itemsEl.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-emoji">${c.emoji}</div>
      <div class="cart-item-info">
        <strong>${c.name}</strong>
        <span>$${c.price.toFixed(2)} each</span>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${c.id}, -1)">−</button>
        <span>${c.qty}</span>
        <button class="qty-btn" onclick="changeQty(${c.id}, 1)">+</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  document.getElementById('cart-total').textContent = total.toFixed(2);
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  updateCart();
}

function toggleCart() {
  document.getElementById('cart-sidebar').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('active');
}

function checkout() {
  cart = [];
  updateCart();
  toggleCart();
  showToast('🎉 Order placed! Thank you for your purchase.');
}

function handleSubmit(e) {
  e.preventDefault();
  e.target.reset();
  showToast('✅ Message sent! We\'ll get back to you soon.');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

renderProducts();
