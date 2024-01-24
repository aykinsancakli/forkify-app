// Import all the exports from the './model.js' module and bundle them into a single object named model
// Allow to access the exported functions and objects using the model object
import * as model from './model.js';

import { MODAL_CLOSE_SEC } from './config.js';

// Polyfilling
import 'core-js/actual';

// Polyfilling async functions
import 'regenerator-runtime/runtime';

// Import the object created from the RecipeView class (can access all the methods & properties)
import recipeView from './views/recipeView.js';

// Import the object created from the SearchView class
import searchView from './views/searchView.js';

// Import the object created from the resultsView
import resultsView from './views/resultsView.js';

// Import the object created from the paginationView
import paginationView from './views/paginationView.js';

// Import ...
import bookmarksView from './views/bookmarksView.js';

import addRecipeView from './views/addRecipeView.js';

///////////////////////////////////////////////////////////
// Create control recipes function (APPLICATON LOGIC)
// <--------------- Recipes -------------------->

// HOT MODULE => STATE REMAINS THE SAME
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // Get the URL and get rid of # to get recipe ID
    const id = window.location.hash.slice(1);

    // Prevent possible errors (e.g reloading the page without /#recipeid)
    if (!id) return;

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 3) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // Show loading spinner until the loadRecipe fetches the data
    recipeView.renderSpinner();

    // 1) Loading recipe
    // Load recipe and store it in the state object (outcome of the function)
    await model.loadRecipe(id);

    // 2) Rendering recipe
    // Call the render method on the recipeView instance created from recipeView class
    // model.state.recipe is the state mutated by loadRecipe function
    recipeView.render(model.state.recipe);

    // Catch block (catching it when errors propagate down)
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

///////////////////////////////////////////////////////////
// <--------------- Search Results -------------------->

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // 2) Load search results
    // Manipulate state
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// ALL OF THE FUNCTIONS HERE COULD ALSO CALLED HANDLERS LIKE HANDLERECIPES ETC, THEY ARE SIMPLY EVENT HANDLERS THAT WILL RUN WHENEVER SOME EVENT HAPPENS.

// Pagination controller
const controlPagination = function (goToPage) {
  // Render results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// Bookmark Controller
const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Control adding new recipes
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
  location.reload();
};

// MVC Publisher-Subscriber Pattern
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
