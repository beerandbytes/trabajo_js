// Script para inicializar el mapa de contacto
document.addEventListener('DOMContentLoaded', () => {
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
        // Coordenadas de la ubicación (ej. centro de Madrid)
        const lat = 40.416775;
        const lon = -3.703790;

        // Crear el mapa
        const map = L.map('map').setView([lat, lon], 15);

        // Añadir la capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Añadir un marcador
        L.marker([lat, lon]).addTo(map)
            .bindPopup('<b>WebCorp</b><br>Nuestras oficinas.')
            .openPopup();
    }
});
