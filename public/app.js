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

// Add a Note
$(document).on('click', '#notes-btn', function() {
    // Empty the notes from the note section
    $('#notes').empty();
    // Save the id
    var thisId = $(this).attr('data-id');

    $.ajax({
        method: 'GET',
        url: '/article-notes/' + thisId
    }).done(function(data) {

        $('#add-notes').html("<input type='text' id='title' class='note-style' name='title' placeholder='title'><br /> <textarea type='text' id='body' class='note-style' name='body' placeholder='write note here'>" + "</textarea><br /><button data-id='" + data._id + "' class='note-style' id='save-note'>save</button>");

        // If there's a note in the article
        if (data.note) {
            
            $('#titleinput').val(data.note.title);
            $('#bodyinput').val(data.note.body);
        }
    });
});

// Save the Note
$(document).on('click', '#save-note', function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr('data-id');

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
    method: 'POST',
    url: '/notes/' + thisId,
    data: {
        // Value taken from title input
        title: $('#title').val(),
        // Value taken from note textarea
        body: $('#body').val()
    }
    }).done(function(data) {
        
        console.log(data);
        
        $('#notes').empty();
    });
    // Also, remove the values entered in the input and textarea for note entry
    $('#title').val('');
    $('#body').val('');
});


// View notes
$(document).on('click', '#all-notes', function() {
    
    var thisId = $(this).attr('data-id');

    $.ajax({
        method: 'GET',
        url: '/article-notes/' + thisId
    }).done(function(data) {
        for (var i = 0; i < data.notes.length; i++) {
            console.log(data.notes[i].body);
            $('#article-notes').text(data.notes[i].body);
        }
    });
});

