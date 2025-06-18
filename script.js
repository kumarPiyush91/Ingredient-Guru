const input = document.getElementById('search-input');
const button = document.getElementById('search-btn');
const recipeList = document.getElementById('recipes');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.getElementById('close');

async function fetchMealsByIngredient(ingredient) {
  recipeList.innerHTML = `<p>Loading...</p>`;
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await res.json();
    if (!data.meals) {
      recipeList.innerHTML = `<p>No recipes found for "${ingredient}".</p>`;
      return;
    }

    recipeList.innerHTML = "";
    data.meals.slice(0, 12).forEach(meal => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
      `;
      card.addEventListener('click', () => showMealDetails(meal.idMeal));
      recipeList.appendChild(card);
    });
  } catch (error) {
    recipeList.innerHTML = `<p>Failed to fetch recipes.</p>`;
    console.error(error);
  }
}

async function showMealDetails(mealId) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await res.json();
    const meal = data.meals[0];

    modalBody.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h2>${meal.strMeal}</h2>
      <p><strong>Category:</strong> ${meal.strCategory}</p>
      <p><strong>Area:</strong> ${meal.strArea}</p>
      <p><strong>Instructions:</strong></p>
      <p>${meal.strInstructions}</p>
      <a href="${meal.strYoutube}" target="_blank">▶️ Watch on YouTube</a>
    `;

    modal.classList.remove('hidden');
  } catch (error) {
    console.error("Failed to fetch meal details:", error);
  }
}

button.addEventListener('click', () => {
  const ingredient = input.value.trim();
  if (ingredient) {
    fetchMealsByIngredient(ingredient);
  }
});

input.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    button.click();
  }
});

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});
