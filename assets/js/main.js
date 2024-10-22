// OPEN & CLOSE CART
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#cart-close");

cartIcon.addEventListener("click", () => {
  cart.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cart.classList.remove("active");
});

// Start when the document is ready
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

// =============== START ====================
function start() {
  addEvents();
}

// ============= UPDATE & RERENDER ===========
function update() {
  addEvents();
  updateTotal();
}

// =============== ADD EVENTS ===============
function addEvents() {
  // Remove items from cart
  let cartRemove_btns = document.querySelectorAll(".cart-remove");
  console.log(cartRemove_btns);
  cartRemove_btns.forEach((btn) => {
    btn.addEventListener("click", handle_removeCartItem);
  });

  // Change item quantity
  let cartQuantity_inputs = document.querySelectorAll(".cart-quantity");
  cartQuantity_inputs.forEach((input) => {
    input.addEventListener("change", handle_changeItemQuantity);
  });

  // Add item to cart
  let addCart_btns = document.querySelectorAll(".add-cart");
  addCart_btns.forEach((btn) => {
    btn.addEventListener("click", handle_addCartItem);
  });

  // Buy Order
  const buy_btn = document.querySelector(".btn-buy");
  buy_btn.addEventListener("click", handle_buyOrder);
}

// ============= HANDLE EVENTS FUNCTIONS =============
let itemsAdded = [];

function handle_addCartItem() {
  let product = this.parentElement;
  let title = product.querySelector(".product-title").innerHTML;
  let price = product.querySelector(".product-price").innerHTML;
  let imgSrc = product.querySelector(".product-img").src;
  console.log(title, price, imgSrc);

  let newToAdd = {
    title,
    price,
    imgSrc,
  };

// Cek jika produk sudah ada di keranjang
    if (itemsAdded.find((el) => el.title === newToAdd.title)) {
        alert("Produk '" + newToAdd.title + "' sudah ada di keranjang!");
        return; // Kembali jika produk sudah ada
    } else {
        // Tampilkan notifikasi dengan pilihan OK dan Cancel
        let orderNumber = itemsAdded.length + 1; // Menghitung nomor pesanan
        let confirmation = confirm(itemsAdded.length === 0 
            ? "Pesanan pertama produk '" + newToAdd.title + "' berhasil ditambahkan. Klik OK untuk melanjutkan atau Cancel untuk membatalkan."
            : "Pesanan " + orderNumber + " produk '" + newToAdd.title + "' berhasil ditambahkan. Klik OK untuk melanjutkan atau Cancel untuk membatalkan.");

        // Jika pengguna memilih OK, tambahkan produk ke keranjang
        if (confirmation) {
            itemsAdded.push(newToAdd); // Menambahkan produk ke keranjang
            alert("Pesanan " + orderNumber + " produk '" + newToAdd.title + "' ditambahkan ke keranjang.");
            
            // Memperbarui jumlah item di keranjang
            document.getElementById("item-count").textContent = itemsAdded.length; // Menampilkan jumlah item di keranjang
        } else {
            // Jika dibatalkan, tidak melakukan apa-apa dan mengembalikan eksekusi
            alert("Pesanan dibatalkan.");
            return; // Menghentikan eksekusi lebih lanjut
        }
}


  // Add product to cart
  let cartBoxElement = CartBoxComponent(title, price, imgSrc);
  let newNode = document.createElement("div");
  newNode.innerHTML = cartBoxElement;
  const cartContent = cart.querySelector(".cart-content");
  cartContent.appendChild(newNode);

  update();
}

function handle_removeCartItem() {
  this.parentElement.remove(); // Remove the cart item from the display

  // Update the itemsAdded array to remove the corresponding item
  itemsAdded = itemsAdded.filter(
    (el) => el.title !== this.parentElement.querySelector(".cart-product-title").innerHTML
  );

  // Update the displayed item count
  document.getElementById("item-count").textContent = itemsAdded.length; // Update the cart item count

  update(); // Call update to refresh totals and any other necessary updates
}


function handle_changeItemQuantity() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1;
  }
  this.value = Math.floor(this.value); // to keep it integer

  update();
}

function handle_buyOrder() {
    if (itemsAdded.length <= 0) {
        alert("Belum Ada Pemesanan & Silakan Melakukan Pemesanan terlebih dahulu.");
        return;
    }

    // Gather user information
    const fullName = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const paymentConfirmed = document.getElementById("payment-confirmation").checked; // Checkbox for payment confirmation

    if (!fullName || !email || !phone || !address || !paymentConfirmed) {
        alert("Silakan lengkapi formulir dan konfirmasi pembayaran Anda sebelum melakukan pemesanan.");
        return; // Exit the function if the form is not filled or payment is not confirmed
    }

    // Gather order details
    let orderDetails = `*Order Details:*\n`;
    itemsAdded.forEach(item => {
        orderDetails += `- ${item.title}: Rp ${item.price}\n`;
    });

    
    const totalPrice = document.getElementById("total-price").textContent;
    orderDetails += `\n*Total Price:* Rp ${totalPrice}\n\n`; // Added "Rp" to the total price

    // Add user info to the order details
    orderDetails += `*Customer Information:*\n`;
    orderDetails += `Name: ${fullName}\n`;
    orderDetails += `Email: ${email}\n`;
    orderDetails += `Phone: ${phone}\n`;
    orderDetails += `Address: ${address}\n`;
    orderDetails += `Payment Confirmed: ${paymentConfirmed ? 'Yes' : 'No'}\n`; // Include payment confirmation status

    // Add thank you note
    orderDetails += `\n*Pesanan anda akan segera kami terima, setelah melakukan transaksi pembayaran & kirim bukti pembayaran disini.*\n`;

    // Create a WhatsApp link
    const whatsappNumber = "6287877611218";
    const encodedMessage = encodeURIComponent(orderDetails);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

    // Redirect to WhatsApp
    window.open(whatsappUrl, "_blank");

    // Clear the cart and show a success message
    const cartContent = cart.querySelector(".cart-content");
    cartContent.innerHTML = "";
    alert("Pesanan Anda Berhasil & Terima kasih telah berbelanja bersama kami :)");
    itemsAdded = [];

    update();
}
// Ambil elemen-elemen yang dibutuhkan
const searchInput = document.getElementById('search-input');
const barcodeButton = document.getElementById('barcode');
const clearButton = document.getElementById('clear-button');
const barcodeDisplay = document.getElementById('barcode-display'); // Div untuk menampilkan barcode
const fullBarcodeImg = document.getElementById('full-barcode-img');

// Fungsi untuk menampilkan atau menyembunyikan gambar barcode di layar
function toggleBarcode() {
    if (barcodeDisplay.style.display === 'none' || barcodeDisplay.style.display === '') {
        barcodeDisplay.style.display = 'block'; // Tampilkan gambar barcode
    } else {
        barcodeDisplay.style.display = 'none'; // Sembunyikan gambar barcode
    }
}

// Fungsi untuk membersihkan input dan menyembunyikan gambar barcode
function clearInput() {
    searchInput.value = ''; // Kosongkan input
    barcodeDisplay.style.display = 'none'; // Sembunyikan gambar barcode di layar
    clearButton.style.display = 'none'; // Sembunyikan tombol clear
}

// Event listener untuk tombol barcode
barcodeButton.addEventListener('click', toggleBarcode);

// Event listener untuk tombol clear
clearButton.addEventListener('click', clearInput);

// Menyembunyikan tombol clear saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', function() {
    clearButton.style.display = 'none';
    barcodeDisplay.style.display = 'none'; // Sembunyikan gambar barcode pada awalnya
});


function updateTotal() {
    let cartBoxes = document.querySelectorAll(".cart-box");
    const totalElement = cart.querySelector(".total-price");
    const orderTotalElement = document.getElementById("total-price"); // Reference to the total price in the form
    const productListElement = document.getElementById("product-list"); // Reference to the product list in the form
    let total = 0;

    // Clear the product list in the order form
    productListElement.innerHTML = "";

    cartBoxes.forEach((cartBox) => {
        let priceElement = cartBox.querySelector(".cart-price");
        let titleElement = cartBox.querySelector(".cart-product-title"); // Reference to the product title
        let price = parseFloat(priceElement.innerHTML.replace("Rp ", "").replace(/\./g, "").replace(",", "."));
        let quantity = cartBox.querySelector(".cart-quantity").value;
        total += price * quantity;

        // Create list item for the selected product
        let li = document.createElement("li");
        li.textContent = `${titleElement.innerHTML}: Rp ${price.toLocaleString('id-ID')} x ${quantity}`; // Format the product info
        productListElement.appendChild(li);
    });

    total = Math.round(total);

    // Update total prices in both the cart and the order form
    totalElement.innerHTML = "Rp " + total.toLocaleString('id-ID');
    orderTotalElement.innerHTML = total.toLocaleString('id-ID'); // Update the order form's total price
}
document.getElementById('search-button').addEventListener('click', function (e) {
    e.preventDefault();
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const productBoxes = document.querySelectorAll('.product-box');
    let hasResults = false; // Flag to check if there are any matching products

    productBoxes.forEach(product => {
        const productTitle = product.querySelector('.product-title').textContent.toLowerCase();
        if (productTitle.includes(searchInput)) {
            product.style.display = 'block'; // Show matching product
            hasResults = true; // At least one match found
        } else {
            product.style.display = 'none'; // Hide non-matching product
        }
    });

    // Show the clear button if the search input is not empty
    document.getElementById('clear-button').style.display = searchInput ? 'inline' : 'none';
});

// Clear button functionality
document.getElementById('clear-button').addEventListener('click', function () {
    // Clear the search input field
    document.getElementById('search-input').value = '';
    // Reset the display of all products
    const productBoxes = document.querySelectorAll('.product-box');
    productBoxes.forEach(product => {
        product.style.display = 'block'; // Show all products
    });
    // Hide the clear button
    this.style.display = 'none';
});


// ============= HTML COMPONENTS =============
function CartBoxComponent(title, price, imgSrc) {
  return `
    <div class="cart-box">
        <img src=${imgSrc} alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <!-- REMOVE CART  -->
        <i class='bx bxs-trash-alt cart-remove'></i>
    </div>`;
}
