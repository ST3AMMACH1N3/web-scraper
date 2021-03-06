console.log('Saved loaded')

function articlesCheck() {
    if ($('#articles').children().length < 1) {
        let error = $('<div>').addClass('error')
        let message = $('<h2>').addClass('message').text('No Articles Saved');

        error.append(message);
    
        $('#articles').append(error);
    }
}
articlesCheck();

$('.article-btn').on('click', event => {
    let target = $(event.currentTarget);
    let id = target.data('id');
    
    $.post(`/api/unsave/${id}`).then(data => {
        let parent = target.parent();
        let note = $(`#${id}`).remove();
        parent.empty();
        parent.addClass('error');
        let message = $('<p>').addClass('message').text('Article no longer saved.');
        parent.append(message);
        setTimeout(() => {
            parent.remove();
            articlesCheck();
        }, 1000);
    });   
});

$('.view-btn').on('click', event => {
    let target = $(event.target);

    if (target.attr('data-visible') === 'false') {
        target.attr('data-visible', 'true');
        target.text('Hide Notes');
        $(`#${target.data('id')}`).removeClass('hidden');
    } else {
        target.attr('data-visible', 'false');
        target.text('View Notes');
        $(`#${target.data('id')}`).addClass('hidden');
    }
});

$(document).on('click', '.delete-btn', event => {
    let target = $(event.target);
    let targetArticle = target.closest('.notes');

    $.post(`/api/uncomment/${$(targetArticle).attr('id')}`, {id: target.data('id')}).then(data => {
        target.parent().remove();
    });
});

$('.submit-btn').on('click', event => {
    let target = $(event.currentTarget);
    let id = target.data('id');

    let parent = target.parent();

    let textArea = parent.find('.textarea');
    console.log(textArea.val());
    
    $.post(`/api/comment/${id}`, { text: textArea.val() }).then(data => {
        textArea.val('');
        let div = $('<div>').addClass('note');
        let p = $('<p>').text(data.text);
        let button = $('<button>').addClass('delete-btn').attr('data-id', data._id).text('Delete Comment');
        div.append(p, button);
        div.insertBefore(parent);
    });
});