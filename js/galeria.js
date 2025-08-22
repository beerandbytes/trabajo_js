// Script para la galería dinámica
document.addEventListener('DOMContentLoaded', function () {
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal) {
        galleryModal.addEventListener('show.bs.modal', function (event) {
            // Botón que activó el modal
            const triggerElement = event.relatedTarget;
            // Extraer información de los atributos
            const imageSrc = triggerElement.getAttribute('src');
            const imageAlt = triggerElement.getAttribute('alt');
            
            // Actualizar el contenido del modal
            const modalTitle = galleryModal.querySelector('.modal-title');
            const modalImage = galleryModal.querySelector('#modalImage');

            modalTitle.textContent = imageAlt;
            modalImage.src = imageSrc;
        });
    }
});
