class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    // Get value
    const query = this._parentEl.querySelector('.search__field').value;

    // Clear inputs
    this._clearInput();

    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

// Create an instance of SearchView to be used in controller.js
export default new SearchView();
