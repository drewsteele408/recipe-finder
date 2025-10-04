const resultsContainer = document.getElementById('results');
const randomRecipeButton = document.getElementById('searchBtn');
const emptyStatePanel = document.getElementById('empty');


function renderRecipeCard(recipe) {
    // Clear any previous data/content
    resultsContainer.innerHTML = "";

    if(!recipe) {
        const message = "<p>Couldn't find a recipe. Try again.</p>"
        if (emptyStatePanel) {
            emptyStatePanel.hidden = false;
            emptyStatePanel.innerHTML = message;
        } else {
            resultsContainer.innerHTML = message;
        }
        return;
    }

    // Get up to 20 ingredients and show a short preview

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredientName = recipe[`strIngredient${i}`];
        const ingredientMeasure = recipe[`strMeasure${i}`];
        if (ingredientName && ingredientName.trim()) {
            ingredients.push(
                `${ingredientMeasure ? ingredientMeasure.trim() + " " : ""}${ingredientName.trim()}`
            );
        }
    }

    const previewIngredientList = ingredients.slice(0, 6);

    // Build the card element 
    const recipeCardElement = document.createElement("article");
    recipeCardElement.className = "card";
    recipeCardElement.innerHTML = `
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy" />
    <div class="meta">
      <h3>${recipe.strMeal}</h3>
      <div class="sub">
        ${recipe.strArea ? recipe.strArea : ""} 
        ${recipe.strCategory ? "• " + recipe.strCategory : ""}
      </div>

      ${
        previewIngredientList.length
          ? `<h4>Ingredients</h4><ul>${previewIngredientList
              .map((text) => `<li>${text}</li>`)
              .join("")}</ul>`
          : ""
      }

      ${
        recipe.strInstructions
          ? `<h4>Instructions</h4><p>${recipe.strInstructions}</p>`
          : ""
      }
    </div>
    `;

    if (emptyStatePanel) emptyStatePanel.hidden = true;
    resultsContainer.appendChild(recipeCardElement);
}


// Get a random recipe from theMealDB api and display it

async function fetchAndRenderRecipe() {
    try {
        resultsContainer.setAttribute("aria-busy", "true");
        resultsContainer.innerHTML = "<p>Loading a tasty idea...</p>";

        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const payload = await response.json();
        const recipe = payload && payload.meals ? payload.meals[0] : null;

        renderRecipeCard(recipe);
    } catch(error) {
        console.error(error);
        resultsContainer.innerHTML = "<p>Something went wrong. Please try again</p>";
    } finally {
        resultsContainer.setAttribute("aria-busy", "false");
    }
}

if (randomRecipeButton) {
    randomRecipeButton.addEventListener("click", fetchAndRenderRecipe);
}