document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('heroSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const allHeroes = document.querySelectorAll('[data-name]');

    let currentSeries = 'all';

    function filterHeroes() {
        const query = searchInput.value.toLowerCase().trim();

        allHeroes.forEach(hero => {
            const name = (hero.getAttribute('data-name') || "").toLowerCase();
            const series = hero.getAttribute('data-series');

            const matchesSearch = name.includes(query);
            const matchesSeries = (currentSeries === 'all' || series === currentSeries);

            if (matchesSearch && matchesSeries) {
                hero.style.display = ""; 
            } else {
                hero.style.display = "none"; 
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterHeroes);
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const parentDiv = btn.parentElement; 
            const selectedFilter = btn.getAttribute('data-filter');

            // вкл/выкл
            if (currentSeries === selectedFilter) {
                // нажатие
                currentSeries = 'all';
                parentDiv.classList.remove('active');
            } else {
                // Remove .active from ALL category divs first
                document.querySelectorAll('[class^="category-"]').forEach(div => {
                    div.classList.remove('active');
                });

                // стиль
                currentSeries = selectedFilter;
                parentDiv.classList.add('active');
            }

            filterHeroes();
        });
    });
});