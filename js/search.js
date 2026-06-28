// This script is used to handle all of the fetch requests to the API

// This function should handle the search stuff from the search bar, it grabs a list of results from the user inputted string
function handleSearchSubmit(event) {
    event.preventDefault();
    const query = document.getElementById('searchBox').value.trim();
    if (query) {
        window.location.href = `searchResults.html?q=${encodeURIComponent(query)}`;
    }
}

// This search function should take the search result and render it in the searchResults page
async function fetchAndRenderResults() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    const resultsList = document.getElementById('results-list');

    if (!query || !resultsList) return;

    resultsList.innerHTML = '<li>Loading...</li>';

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!data.meals) {
        resultsList.innerHTML = '<li>No recipes found. Try a different search!</li>';
        return;
    }

    // results will be in an array so this will just go through the array and show each result
    resultsList.innerHTML = data.meals.map(meal => `
        <li>
            <a href="recipe.html?id=${meal.idMeal}"><h3>${meal.strMeal}</h3></a>
            <span>${meal.strArea} &middot; ${meal.strCategory}</span>
        </li>
    `).join('');
}

// This takes one specific recipe and actually gets everything for the recipe.html page
async function fetchAndRenderRecipe() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id || !document.getElementById('meal-name')) return;

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    const meal = data.meals?.[0];
    if (!meal) return;

    // identifies the appropriate elements to put the fetched data:

    // meal name + browser tab title
    document.getElementById('meal-name').textContent = meal.strMeal;
    document.title = meal.strMeal;

    // alternate name (maybe another language)
    const alternateEl = document.getElementById('meal-alternate');
    if (meal.strMealAlternate) {
        alternateEl.textContent = meal.strMealAlternate;
    } else {
        alternateEl.style.display = 'none';
    }

    // meal category and meal area (country of origin kinda thing)
    document.getElementById('meal-category').textContent = meal.strCategory;
    document.getElementById('meal-area').textContent = meal.strArea;

    // meal tags
    const tagsEl = document.getElementById('meal-tags');
    if (meal.strTags) {
        meal.strTags.split(',').forEach(tag => {
            const li = document.createElement('li');
            li.textContent = tag.trim();
            tagsEl.appendChild(li);
        });
    }

    // the meal image src link
    const img = document.getElementById('meal-image');
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;
    document.getElementById('meal-image-link').href = meal.strMealThumb;

    // the source of the image for photo credits
    const imageSourceEl = document.getElementById('meal-image-source');
    if (meal.strImageSource) {
        imageSourceEl.href = meal.strImageSource;
    } else {
        imageSourceEl.style.display = 'none';
    }

    // list of ingredients
    const ingredientsList = document.getElementById('ingredients-list');
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`<li><span>${measure}</span> ${ingredient}</li>`);
        }
    }
    ingredientsList.innerHTML = ingredients.join('');

    // list of meal prep instructions
    const instructionsEl = document.getElementById('instructions');
    const lines = meal.strInstructions.split(/\r\n|\r|\n/).filter(line => line.trim());

    const isTimingLine = line => /prep|cook|ready/i.test(line);
    const firstLine = lines[0];
    if (firstLine && isTimingLine(firstLine)) {
        document.getElementById('meal-time').textContent = firstLine;
        lines.shift();
    }

    lines.forEach(line => {
        const li = document.createElement('li');
        li.textContent = line;
        instructionsEl.appendChild(li);
    });

    // some recipes have a youtube link or something showing how to do it
    const videoEl = document.getElementById('meal-video');
    if (meal.strYoutube) {
        const videoId = meal.strYoutube.split('v=')[1];
        videoEl.src = `https://www.youtube.com/embed/${videoId}`;
    } else {
        videoEl.closest('section').style.display = 'none';
    }

    // the src of where the recipe came from, likely another recipe website with ads
    const sourceEl = document.getElementById('meal-source');
    if (meal.strSource) {
        sourceEl.href = meal.strSource;
        sourceEl.textContent = meal.strSource;
    } else {
        sourceEl.closest('section').style.display = 'none';
    }
}

// This is the search form and adds the event listener to the button
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', handleSearchSubmit);
}

// executes the scriptsss
fetchAndRenderResults();
fetchAndRenderRecipe();
