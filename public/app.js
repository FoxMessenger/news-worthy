// when going to /articles, we'll see all the articles we scraped
$.getJSON('/all-articles', function(data) {
  
    // for every entry in the data list we get...
    for (var i = 0; i < data.length; i++) {

        //... create the following information on our page
        $('#articles').append('<p><strong>' + data[i].title + '</strong></p>' + "<li data-id='" + data[i]._id + "'>" + "<a href='http://www.theonion.com" + data[i].link + "'>" + data[i].image + '</a></li><br />');
        $('#articles').append("<a class='btn btn-primary btn-block' id='notes-btn' data-id='" + data[i]._id + "' type='button' role='button'>Add Note</a>");
        $('#articles').append("<a class='btn btn-primary btn-block' id='all-notes' data-id='" + data[i]._id + "' type='button' role='button'>View Notes</a><hr />");
    }

});


// // Get all Notes
// $(document).on('click', '#all-notes', function() {
//     var thisId = $(this).attr('data-id');

//     // Now make an ajax call for the Article
//     $.ajax({
//         method: 'GET',
//         url: '/article-notes/' + thisId
//     })
//     // With that done, add the note information to the page
//     .done(function(data) {
//         // console.log(data);
//         $('#article-notes').append("words")
//         }
//     });
// });


// Add a Note
$(document).on('click', '#notes-btn', function() {
    // Empty the notes from the note section
    $('#notes').empty();
    // Save the id from the p tag
    var thisId = $(this).attr('data-id');

    // Now make an ajax call for the Article
    $.ajax({
        method: 'GET',
        url: '/article-notes/' + thisId
    })
    // With that done, add the note information to the page
    .done(function(data) {
        // console.log(data);

        $('#add-notes').html("<input type='text' class='note-style' name='title' placeholder='title'> <textarea type='text' class='note-style'name='body' placeholder='write note here'>" + "</textarea><br /><button data-id='" + data._id + "' class='note-style' id='savenote'>save</button>");

        // If there's a note in the article
        if (data.note) {
            // Place the title of the note in the title input
            $('#titleinput').val(data.note.title);
            // Place the body of the note in the body textarea
            $('#bodyinput').val(data.note.body);
        }
    });
});


// Save the Note
$(document).on('click', '#savenote', function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr('data-id');

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
    method: 'POST',
    url: '/articles-notes/' + thisId,
    data: {
        // Value taken from title input
        title: $('#titleinput').val(),
        // Value taken from note textarea
        body: $('#bodyinput').val()
    }
    })
    // With that done
    .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $('#notes').empty();
    });

    // Also, remove the values entered in the input and textarea for note entry
    $('#titleinput').val('');
    $('#bodyinput').val('');
});
