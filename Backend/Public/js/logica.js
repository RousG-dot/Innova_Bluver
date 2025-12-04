    let cart = [];
    let orderId = 1000;

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }
            
            updateCart();
            showNotification(`${name} added to cart!`);
        });
    });

    function updateCart() {
        const cartItems = document.getElementById('cartItems');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.querySelector('.cart-total');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.appendChild(emptyCartMessage);
            emptyCartMessage.style.display = 'block';
            cartTotal.textContent = '$0.00';
            checkoutBtn.disabled = true;
            return;
        }
        
        emptyCartMessage.style.display = 'none';
        checkoutBtn.disabled = false;
        
        let total = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        <p class="mb-0 text-muted">$${item.price.toFixed(2)} × ${item.quantity}</p>
                    </div>
                    <div class="d-flex align-items-center">
                        <strong class="me-3">$${itemTotal.toFixed(2)}</strong>
                        <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3';
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        notification.setAttribute('aria-atomic', 'true');
        notification.style.zIndex = '10000';
        
        notification.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        const toast = new bootstrap.Toast(notification);
        toast.show();
        
        notification.addEventListener('hidden.bs.toast', function() {
            document.body.removeChild(notification);
        });
    }

    document.getElementById('checkoutBtn').addEventListener('click', function() {
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        cartModal.hide();
        
        updateOrderSummary();
        
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
    });

    function updateOrderSummary() {
        const orderSummary = document.getElementById('orderSummary');
        const subtotalAmount = document.getElementById('subtotalAmount');
        const taxAmount = document.getElementById('taxAmount');
        const totalAmount = document.getElementById('totalAmount');
        
        orderSummary.innerHTML = '';
        
        let subtotal = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'd-flex justify-content-between mb-2';
            itemElement.innerHTML = `
                <span>${item.name} × ${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            `;
            orderSummary.appendChild(itemElement);
        });
        
        const tax = subtotal * 0.08;
        const total = subtotal + tax + 3.99;
        
        subtotalAmount.textContent = `$${subtotal.toFixed(2)}`;
        taxAmount.textContent = `$${tax.toFixed(2)}`;
        totalAmount.textContent = `$${total.toFixed(2)}`;
    }

    document.getElementById('placeOrderBtn').addEventListener('click', function() {
        const form = document.getElementById('checkoutForm');
        if (form.checkValidity()) {
            const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
            checkoutModal.hide();
            
            orderId++;
            document.getElementById('orderId').textContent = `ORD-${orderId}`;
            
            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
            confirmationModal.show();
            
            cart = [];
            updateCart();
        } else {
            form.classList.add('was-validated');
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').min = today;
        
        document.getElementById('reservationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your reservation! We will contact you shortly to confirm.');
            this.reset();
        });
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        const paymentMethodItems = document.querySelectorAll('.bluver-payment .payment-method__item-wrap');

        paymentMethodItems.forEach(item => {
            item.addEventListener('click', function () {
                const index = this.dataset.index;

                // Cambiar formulario visible
                const currentForm = document.querySelector('.bluver-payment .payment__form--show');
                if (currentForm) {
                    currentForm.classList.remove('payment__form--show');
                }

                const newForm = document.querySelector(`.bluver-payment [data-form-index="${index}"]`);
                if (newForm) {
                    newForm.classList.add('payment__form--show');
                }

                // Cambiar método activo
                const currentActive = document.querySelector('.bluver-payment .payment-method__item-wrap--active');
                if (currentActive) {
                    currentActive.classList.remove('payment-method__item-wrap--active');
                }

                this.classList.add('payment-method__item-wrap--active');
            });
        });
    });
