// Este script carga noticias de Hacker News y las muestra en la sección de noticias.
document.addEventListener('DOMContentLoaded', () => {
    const RSS_URL = "https://news.ycombinator.com/rss";
    const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

    const newsFeedContainer = document.getElementById('news-feed');
    const loader = document.getElementById('loader');
    
    // Si no estamos en la página de inicio, no ejecutar el código.
    if (!newsFeedContainer) return;

    // Emojis adaptados a temas de tecnología
    const getTopicEmoji = (title) => {
        const lowerCaseTitle = title.toLowerCase();
        const topicMap = {
            'python': '🐍', 'javascript': '📜', 'rust': '🦀', 'go': '🐹', 'java': '☕', 'c++': '🔗',
            'google': '🇬', 'apple': '🍎', 'microsoft': '🪟', 'amazon': '📦', 'meta': '🇫', 'tesla': '🚗',
            'ai': '🤖', 'ml': '🧠', 'security': '🔒', 'data': '📊', 'cloud': '☁️', 'linux': '�',
            'web': '🌐', 'api': '🔌', 'server': '🖥️', 'database': '🗄️', 'startup': '🚀',
            'crypto': '₿', 'blockchain': '🔗'
        };
        for (const keyword in topicMap) {
            if (lowerCaseTitle.includes(keyword)) return topicMap[keyword];
        }
        return '👨‍💻'; // Emoji por defecto
    };

    // Función para renderizar las noticias en el HTML
    const renderNews = (items) => {
        let feedHtml = '';
        const itemsToShow = items.slice(0, 3); // Limitar a 3 noticias

        if (itemsToShow.length === 0) {
            feedHtml = `<div class="col-12"><p class="text-center text-muted">No se encontraron noticias.</p></div>`;
        } else {
            itemsToShow.forEach(item => {
                const title = item.title;
                const link = item.link;
                const emoji = getTopicEmoji(title);

                feedHtml += `
                    <div class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
                        <div class="card shadow-sm w-100">
                            <div class="card-emoji-container">
                                <span class="card-emoji">${emoji}</span>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">
                                    <!-- Se añade la clase stretched-link para que toda la card sea clicable -->
                                    <a href="${link}" target="_blank" rel="noopener noreferrer" class="stretched-link">${title}</a>
                                </h5>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        newsFeedContainer.innerHTML = feedHtml;
    };
    
    // Cargar las noticias
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error(`Error en la red: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            if(loader) loader.style.display = 'none';
            if (data.status !== 'ok') throw new Error('El feed RSS no se pudo cargar.');
            renderNews(data.items);
        })
        .catch(error => {
            console.error('Error al obtener el feed RSS:', error);
            if(loader) loader.style.display = 'none';
            newsFeedContainer.innerHTML = `<div class="alert alert-danger text-center" role="alert">No se pudieron cargar las noticias.</div>`;
        });
});
