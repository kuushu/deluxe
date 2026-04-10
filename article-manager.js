class ArticleManager {
    constructor() {
        this.storageKey = 'customArticles';
    }

    // получение всех новостей из хранилища
    getArticles() {
        const articles = localStorage.getItem(this.storageKey);
        return articles ? JSON.parse(articles) : [];
    }

    saveArticle(article) {
        const articles = this.getArticles();
        article.id = Date.now(); // как в методичке
        articles.unshift(article);
        localStorage.setItem(this.storageKey, JSON.stringify(articles));
        return article;
    }

    deleteArticle(id) {
        const articles = this.getArticles();
        const filtered = articles.filter(article => article.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    }
}


const articleManager = new ArticleManager();

if (document.getElementById('articleForm')) {
    const form = document.getElementById('articleForm');
    const imageInput = document.getElementById('articleImage');
    const imagePreview = document.getElementById('imagePreview');

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '<span class="preview-text">No image selected</span>';
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('articleTitle').value;
        const date = document.getElementById('articleDate').value;
        const description = document.getElementById('articleDescription').value;
        const imageFile = imageInput.files[0];

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const article = {
                    title: title,
                    date: date,
                    description: description,
                    image: event.target.result // конвертация в бейс64 для хранилища
                };

                articleManager.saveArticle(article);
                alert('Article created successfully!');
                window.location.href = 'news.html';
            };
            reader.readAsDataURL(imageFile);
        } else {
            const article = {
                title: title,
                date: date,
                description: description,
                image: null
            };

            articleManager.saveArticle(article);
            alert('Article created successfully!');
            window.location.href = 'news.html';
        }
    });
}


if (document.querySelector('.news-cards-grid')) {
    const grid = document.querySelector('.news-cards-grid');
    const customArticles = articleManager.getArticles();

    customArticles.forEach(article => {
        const articleCard = document.createElement('div');
        articleCard.className = 'news-article-card custom-article';
        articleCard.dataset.articleId = article.id;

        const imageDiv = document.createElement('div');
        imageDiv.className = 'news-article-image';
        
        if (article.image) {
            imageDiv.style.backgroundImage = `url(${article.image})`;
            imageDiv.style.backgroundSize = 'cover';
            imageDiv.style.backgroundPosition = 'center';
        } else {
            imageDiv.style.backgroundColor = '#2a2a2a';
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'news-article-content';
        
        contentDiv.innerHTML = `
            <div class="news-article-date">${article.date}</div>
            <h3 class="news-article-title">${article.title}</h3>
            <div class="news-article-text">${article.description}</div>
            <button class="delete-article-btn" onclick="deleteArticle(${article.id})">Delete Article</button>
        `;

        articleCard.appendChild(imageDiv);
        articleCard.appendChild(contentDiv);

        grid.insertBefore(articleCard, grid.firstChild);
    });
}

function deleteArticle(id) {
    if (confirm('Are you sure you want to delete this article?')) {
        articleManager.deleteArticle(id);
        location.reload();
    }
}
