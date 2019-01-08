console.log('Index loaded');

function articlesCheck() {
    if ($('#articles').children().length < 1) {
        let error = $('<div>').addClass('error')
        let message = $('<h2>').addClass('message').text('No Articles');

        error.append(message);

        $('#articles').append(error);
    }
}
articlesCheck();

$('.scrape-btn').on('click', event => {
    event.preventDefault();
    $('.error').remove();
    let message = $('<h2>').addClass('message').text('Scraping...');
    let loading = $('<div>').addClass('success').append(message);
    $(loading).insertAfter('hr');
    $.get('/api/scrape').then(data => {
        $('.success').remove();
        let notification = $('<div>');
        let button = $('<button>');
        let message = $('<h2>').addClass('message');
        if (data === 'Scrape Complete') {
            message.text('Scrape Complete');
            notification.addClass('success');
            button.addClass('refresh-btn').text('Refresh');
        } else {
            message.text('Scrape Failed');
            notification.addClass('error');
            button.addClass('close-btn').text('Close');
        }
        notification.append(message, button);
        notification.insertAfter('hr');
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

$(document).on('click', '.article-btn', event => {
    let target = $(event.currentTarget)
    let id = target.data('id');

    $.post(`/api/save/${id}`).then(data => {
        let parent = target.parent();
        parent.empty();
        parent.addClass('success');
        let message = $('<p>').addClass('message').text('Article saved.');
        parent.append(message);
        setTimeout(() => {
            parent.remove();
        }, 1000);
    });
});

$(document).on('click', '.close-btn', event => {
    $(event.target).parent().remove();
    articlesCheck();
});

$(document).on('click', '.delete-btn', event => {
    let target = $(event.target);
    let targetArticle = target.closest('.notes');

    $.post(`/api/uncomment/${$(targetArticle).attr('id')}`, { id: target.data('id') }).then(data => {
        target.parent().remove();
    });
});

$(document).on('click', '.refresh-btn', event => {
    location.reload();
});