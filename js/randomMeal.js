fetch("https://www.themealdb.com/api/json/v1/1/random.php")
  .then(response => {
    if (!response.ok) {
      throw new Error("API request failed");
    }

    return response.json();
  })
  .then(data => {
    const meal = data.meals[0];
    document.getElementById("randomMealImage").src = meal.strMealThumb;
    document.getElementById("randomMealImage").alt = meal.strMeal;
  })
  .catch(error => {
    console.error("Error fetching random meal:", error);
  });