// Lógica para el formulario de presupuesto
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formularioPresupuesto');
    if (!form) return;

    // Campos de contacto
    const nombre = document.getElementById('nombre');
    const apellidos = document.getElementById('apellidos');
    const telefono = document.getElementById('telefono');
    const email = document.getElementById('email');

    // Campos de presupuesto
    const producto = document.getElementById('producto');
    const plazo = document.getElementById('plazo');
    const extras = document.querySelectorAll('.extra');
    
    // Elementos del desglose de precio
    const costeBaseEl = document.getElementById('costeBase');
    const ivaEl = document.getElementById('iva');
    const presupuestoTotalEl = document.getElementById('presupuestoTotal');
    
    // Botón y condiciones
    const condiciones = document.getElementById('condiciones');
    const enviarBtn = document.getElementById('enviarBtn');

    // Patrones de validación
    const patterns = {
        nombre: /^[a-zA-Z\s]{1,15}$/,
        apellidos: /^[a-zA-Z\s]{1,40}$/,
        telefono: /^\d{9}$/,
        email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    };

    // Objeto para almacenar el estado de validación
    const validationState = {
        nombre: false,
        apellidos: false,
        telefono: false,
        email: false
    };

    // Función para validar un campo
    const validateField = (field, regex) => {
        if (regex.test(field.value)) {
            field.classList.add('is-valid');
            field.classList.remove('is-invalid');
            validationState[field.id] = true;
        } else {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            validationState[field.id] = false;
        }
        checkFormValidity();
    };

    // Función para calcular y mostrar el presupuesto
    const calcularPresupuesto = () => {
        // 1. Obtener el precio base del producto
        let subtotal = parseFloat(producto.value) || 0;
        
        // 2. Sumar el coste de los extras seleccionados
        extras.forEach(extra => {
            if (extra.checked) {
                subtotal += parseFloat(extra.value) || 0;
            }
        });

        // 3. Aplicar descuento según el plazo
        const meses = parseInt(plazo.value) || 1;
        if (meses > 6) {
            subtotal *= 0.85; // 15% de descuento
        } else if (meses > 3) {
            subtotal *= 0.95; // 5% de descuento
        }
        
        // 4. Calcular el IVA y el total
        const iva = subtotal * 0.21;
        const total = subtotal + iva;

        // 5. Actualizar la interfaz con los nuevos valores
        costeBaseEl.textContent = `${subtotal.toFixed(2)}€`;
        ivaEl.textContent = `${iva.toFixed(2)}€`;
        presupuestoTotalEl.textContent = `${total.toFixed(2)}€`;
    };

    // Función para comprobar la validez general del formulario y habilitar/deshabilitar el botón
    const checkFormValidity = () => {
        const allValid = Object.values(validationState).every(state => state === true);
        enviarBtn.disabled = !(allValid && condiciones.checked);
    };

    // Asignar los listeners a los eventos de los campos
    const setupEventListeners = () => {
        // Validación de datos de contacto
        nombre.oninput = () => validateField(nombre, patterns.nombre);
        apellidos.oninput = () => validateField(apellidos, patterns.apellidos);
        telefono.oninput = () => validateField(telefono, patterns.telefono);
        email.oninput = () => validateField(email, patterns.email);
        
        // Recalcular presupuesto ante cualquier cambio en las opciones
        producto.onchange = calcularPresupuesto;
        plazo.oninput = calcularPresupuesto;
        extras.forEach(extra => extra.onchange = calcularPresupuesto);
        
        // Comprobar validez al aceptar condiciones
        condiciones.onchange = checkFormValidity;

        // Manejar el envío del formulario
        form.onsubmit = (e) => {
            e.preventDefault();
            if (!enviarBtn.disabled) {
                alert('¡Presupuesto enviado con éxito!');
                form.reset();
                // Resetear estilos de validación
                Object.keys(validationState).forEach(key => {
                    document.getElementById(key).classList.remove('is-valid', 'is-invalid');
                    validationState[key] = false;
                });
                calcularPresupuesto();
                checkFormValidity();
            }
        };

        // Manejar el reseteo del formulario
        form.onreset = () => {
            // Da un pequeño respiro al navegador para que resetee los campos antes de actuar
            setTimeout(() => {
                Object.keys(validationState).forEach(key => {
                    document.getElementById(key).classList.remove('is-valid', 'is-invalid');
                    validationState[key] = false;
                });
                calcularPresupuesto();
                checkFormValidity();
            }, 0);
        };
    };

    // Ejecución inicial
    calcularPresupuesto();
    setupEventListeners();
});
