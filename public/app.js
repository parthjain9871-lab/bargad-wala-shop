fetch("/api/products")
  .then(r => r.json())
  .then(products => {
    const div = document.getElementById("products");
    products.forEach(p => {
      div.innerHTML += `
        <div class="card">
          <img src="/uploads/${p.image}">
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
          <a href="/product.html?id=${p.id}">View</a>
        </div>
      `;
    });
  });
