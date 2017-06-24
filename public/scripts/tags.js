var categoriesArray = function () {
  var categoryObjects = $('#new-resource').data('categories');
  var categories = [];
  for (var category of categoryObjects) {
    categories.push(category.name);
  }
  return categories;
}

var setAutocomplete = function () {
  // Defining the local dataset
  var categories = categoriesArray();

  // Constructing the suggestion engine
  var categories = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: categories
  });

  // Initializing the typeahead
  $('#tag-search').typeahead({
      hint: true,
      highlight: true, /* Enable substring highlighting */
      minLength: 1 /* Specify minimum characters required for showing suggestions */
  },
  {
      name: 'categories',
      source: categories
  });
}

var createTagComponent = function (category) {
  var $tag = $(`<span class="tag">${category} <i class="glyphicon glyphicon-remove"></i></span>`);
  $('.tag-container').append($tag);
}

var tagFormHandler = function () {
  $('#tag-form').on('submit', function (event) {
    event.preventDefault();
    var category = $('#tag-search').val();
    createTagComponent(category);
  })
}

var deleteTagHandler = function () {
  $('.tag-container').on('click', '.glyphicon-remove', function () {
    $(this).closest('.tag').remove();
  })
}


$(document).ready(function () {
  setAutocomplete();
  tagFormHandler();
  deleteTagHandler();
});