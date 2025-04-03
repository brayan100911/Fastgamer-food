document.addEventListener("DOMContentLoaded", function() {
    const botonesAgregar = document.querySelectorAll(".producto button");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalElement = document.getElementById("total");
    const botonVaciar = document.getElementById("vaciar-carrito");
    const botonMostrarCarrito = document.getElementById("mostrar-carrito");
    const botonCerrarCarrito = document.getElementById("cerrar-carrito");
    const botonPagar = document.getElementById("pagar");
    const carritoDiv = document.getElementById("carrito");
    const contadorCarrito = document.getElementById("contador-carrito");
    const inputDescuento = document.getElementById("codigo-descuento");
    const botonAplicarDescuento = document.getElementById("aplicar-descuento");
    const selectMetodoPago = document.getElementById("metodo-pago");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Aplicar código de descuento
    botonAplicarDescuento.addEventListener("click", function() {
        const codigo = inputDescuento.value.trim().toUpperCase();
        let descuento = 0;

        const descuentos = {
            "GAMER10": 0.10,
            "PIXEL15": 0.15,
            "ENERGIA5": 0.05
        };

        if (descuentos[codigo]) {
            descuento = descuentos[codigo];
            alert(`✅ Código aplicado: ${codigo}. Descuento del ${descuento * 100}%`);
        } else {
            alert("❌ Código no válido.");
            return;
        }

        let total = carrito.reduce((acc, producto) => acc + producto.precio, 0);
        total = total - (total * descuento);
        totalElement.textContent = `$${total.toFixed(2)}`;
    });

    function actualizarCarrito() {
        if (!listaCarrito || !totalElement) return;
        
        listaCarrito.innerHTML = "";
        let total = 0;

        carrito.forEach((producto, index) => {
            total += producto.precio;
            const item = document.createElement("div");
            item.classList.add("carrito-item");

            const nombreProducto = document.createElement("span");
            nombreProducto.textContent = `${producto.nombre} - $${producto.precio.toFixed(2)}`;

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "❌";
            botonEliminar.addEventListener("click", function() {
                eliminarProducto(index);
            });

            item.appendChild(nombreProducto);
            item.appendChild(botonEliminar);
            listaCarrito.appendChild(item);
        });

        totalElement.textContent = `$${total.toFixed(2)}`;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        contadorCarrito.textContent = carrito.length;
    }

    function eliminarProducto(index) {
        carrito.splice(index, 1);
        actualizarCarrito();
    }

    botonesAgregar.forEach((boton, i) => {
        boton.addEventListener("click", function() {
            const nombreProducto = document.querySelectorAll(".producto h3")[i].textContent;
            const precioProducto = parseFloat(document.querySelectorAll(".precio")[i].textContent.replace("$", ""));
            const producto = { nombre: nombreProducto, precio: precioProducto };

            carrito.push(producto);
            actualizarCarrito();
        });
    });

    if (botonVaciar) {
        botonVaciar.addEventListener("click", function() {
            carrito = [];
            actualizarCarrito();
        });
    }

    if (botonMostrarCarrito) {
        botonMostrarCarrito.addEventListener("click", function() {
            carritoDiv.classList.add("mostrar"); // Agrega la clase para animación
            carritoDiv.style.display = "block"; // Asegura que se haga visible
            actualizarCarrito();
        });
    }
    
    if (botonCerrarCarrito) {
        botonCerrarCarrito.addEventListener("click", function() {
            carritoDiv.classList.remove("mostrar"); // Quita la clase de animación
            setTimeout(() => {
                carritoDiv.style.display = "none"; // Oculta el carrito después de la animación
            }, 300); // Espera 300ms para que termine la animación
        });
    }
    
    // Pago con diferentes métodos
    botonPagar.addEventListener("click", function() {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío. Agrega productos antes de pagar.");
            return;
        }

        const metodoPago = selectMetodoPago.value;

        if (metodoPago === "tarjeta") {
            alert("💳 Procesando pago con tarjeta...");
        } else if (metodoPago === "efectivo") {
            alert("💵 Por favor, paga en efectivo al recibir tu pedido.");
        }

        alert("✅ Pago exitoso. ¡Gracias por tu compra!");
        carrito = [];
        actualizarCarrito();
    });

    actualizarCarrito();
});

