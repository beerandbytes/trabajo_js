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
    const costeBase = document.getElementById('costeBase');
    const iva = document.getElementById('iva');
    const presupuestoTotal = document.getElementById('presupuestoTotal');
    const descuento = document.getElementById('descuento');
    
    // Botón y condiciones
    const condiciones = document.getElementById('condiciones');
    const enviarBtn = document.getElementById('enviarBtn');

    // Patrones de validación
    const patterns = {
        nombre: /^[a-zA-Z\s]{1,15}$/,
        apellidos: /^[a-zA-Z\s]{1,40}$/,
        telefono: /^\d{9}$/,
        email: /^[\w\-\.]+@([\w-]+\.)+[a-zA-Z]{2,}$/
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
// Función para calcular y mostrar el presupuesto (CORREGIDA)
const calcularPresupuesto = () => {
    // 1. Calcular el subtotal original sumando el producto y los extras
    let subtotalOriginal = parseFloat(producto.value) || 0;
    extras.forEach(extra => {
        if (extra.checked) {
            subtotalOriginal += parseFloat(extra.value) || 0;
        }
    });

    // 2. Calcular el importe del descuento basado en el subtotal original
    const meses = parseInt(plazo.value) || 1;
    let importeDescuento = 0;
    if (meses > 6) {
        importeDescuento = subtotalOriginal * 0.15; // 15% de descuento
    } else if (meses > 3) {
        importeDescuento = subtotalOriginal * 0.05; // 5% de descuento
    }

    // 3. Calcular el IVA sobre el subtotal original (antes de descuentos)
    const importeIva = subtotalOriginal * 0.21;

    // 4. Calcular el total final
    // (Coste original - Descuento) + IVA
    const total = (subtotalOriginal - importeDescuento) + importeIva;

    // 5. Actualizar la interfaz con los nuevos valores
    // Se usan las variables originales que apuntan a los elementos del DOM
    costeBase.textContent = `${subtotalOriginal.toFixed(2)}€`;
    descuento.textContent = `-${importeDescuento.toFixed(2)}€`; // Se añade un "-" para mayor claridad
    iva.textContent = `${importeIva.toFixed(2)}€`;
    presupuestoTotal.textContent = `${total.toFixed(2)}€`;
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
