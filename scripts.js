
// Liste de produits (exemple)
const products = [
        {
          id: 1,
          name: "Téléphone Samsung Galaxy a24",
          price: 1046,
          image: "image/a24.jpg",
          currency: "TND",
          liked: false
        },
        {
          id: 2,
          name: "Ordinateur Portable HP",
          price: 2400,
          image: "image/hp.jpeg",
          currency: "TND",
          liked: false
        },
        {
          id: 3,
          name: "Casque Audio Sony",
          price: 400,
          image: "image/sonyheadset.jpeg",
          currency: "TND",
          liked: false
        },
        {
          id: 4,
          name: "Souris Gaming Logitech",
          price: 210,
          image: "image/souris.jpeg",
          currency: "TND",
          liked: false
        },
        {
          id: 5,
          name: "Disque Dur Externe 1 To",
          price: 110,
          image: "image/disque.jpeg",
          currency: "TND",
          liked: false
        },
        {
          id: 6,
          name: "Tablette graphique Wacom",
          price: 800,
          image: "image/tablette.jpeg",
          currency: "TND",
          liked: false
        },
        {
          id: 7,
          name: "Enceinte Bluetooth JBL",
          price: 350,
          image: "image/jbl.jpg",
          currency: "TND",
          liked: false
        },
        {
          id: 8,
          name: "Clavier Mécanique Razer",
          price: 450,
          image: "image/razer.jpeg",
          currency: "TND",
          liked: false
        }

      
    // ... Ajouter d'autres produits de manière similaire
  ];
  
  // Variables pour le panier et la devise
  let cart = [];
  let currency = "TND"; // Devise par défaut
  
  // Fonction pour afficher les produits
  function displayProducts() {
    const productsSection = document.querySelector('.products');
    productsSection.innerHTML = '';
  
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product');
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price} ${product.currency}</p>
        <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
        <i class="${product.liked ? 'fas fa-heart red-heart' : 'far fa-heart like'}" data-id="${product.id}"></i>

      `;
  
      productsSection.appendChild(productElement);
    });
  }
  

  
  // Gestion de l'ajout au panier
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart')) {
      const productId = parseInt(event.target.dataset.id);
      const productToAdd = products.find(product => product.id === productId);
  
      const existingItem = cart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ ...productToAdd, quantity: 1 });
      }
  
      displayCart();
    }
  });
  
  // Gestion de la suppression du panier
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-from-cart')) {
      const productId = parseInt(event.target.dataset.id);
      const itemIndex = cart.findIndex(item => item.id === productId);
      cart.splice(itemIndex, 1);
  
      displayCart();
    }
  });
  
  // Gestion de l'ajustement de la quantité dans le panier
  document.addEventListener('change', function(event) {
    if (event.target.classList.contains('quantity')) {
      const productId = parseInt(event.target.dataset.id);
      const newQuantity = parseInt(event.target.value);
  
      const cartItem = cart.find(item => item.id === productId);
      cartItem.quantity = newQuantity;
  
      displayCart();
    }
  });
  
  // Gestion de l'icône "Coeur" pour aimer les produits
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('like')) {
      const productId = parseInt(event.target.dataset.id);
      const product = products.find(product => product.id === productId);
      product.liked = !product.liked;
  
      displayProducts();
    }
  });
  
  function displayCart() {
    const cartSection = document.querySelector('.cart-content');
    cartSection.innerHTML = '';
  
    if (cart.length === 0) {
      cartSection.innerHTML = '<p>Le panier est vide.</p>';
    } else {
      cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>${item.quantity} x ${item.price} ${item.currency} = ${item.quantity * item.price} ${item.currency}</p>
          <button class="remove-from-cart" data-id="${item.id}">Supprimer</button>
          <input type="number" class="quantity" value="${item.quantity}" data-id="${item.id}">
        `;
  
        cartSection.appendChild(cartItem);
      });
  
      const total = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
      cartSection.innerHTML += `<h3>Total: ${total} ${cart[0].currency}</h3>`;
    }
  }
  
  // Ouvrir et fermer la fenêtre modale du panier
  const cartIcon = document.querySelector('.cart-icon');
  const cartModal = document.querySelector('.cart-modal');
  const closeCartButton = document.querySelector('.close-cart');
  
  cartIcon.addEventListener('click', function() {
    cartModal.classList.remove('hidden');
    displayCart();
  });
  
  closeCartButton.addEventListener('click', function() {
    cartModal.classList.add('hidden');
  });
  
  let oldSelectedCurrency =null;
  if (!oldSelectedCurrency) {
    oldSelectedCurrency = 'TND';
  }
  const currencySelector = document.getElementById('currency-selector');

  currencySelector.addEventListener('change', function () {
    const selectedCurrency = currencySelector.value;
    console.log(oldSelectedCurrency)

    fetch(`https://open.er-api.com/v6/latest/${oldSelectedCurrency}`)
      .then(response => response.json())
      .then(data => {
        const rates = data.rates;
  
        products.forEach(product => {

            // Convertir les prix en fonction du taux de change
            const conversionRate = rates[selectedCurrency];
            product.currency = selectedCurrency;
            product.price = (product.price * conversionRate).toFixed(2);

        });
  
  
        // Mettre à jour l'affichage des produits avec les nouveaux prix convertis
        displayProducts();
        displayCart();
        oldSelectedCurrency=selectedCurrency
      })
      .catch(error => console.error('Erreur lors de la récupération des taux de change :', error));
  });
  
  

  displayProducts();
  displayCart();

 