console.log('Index loaded');

$(document).on('click', '.article-btn', event => {
    let target = $(event.currentTarget)
    let id = target.data('id');
    
    $.post(`/api/save/${id}`).then(data => {
        let parent = target.parent();
        parent.empty();
        let message = $('<p>').text('Article saved.');
        parent.append(message);
        setTimeout(() => {
            parent.remove();
        }, 1000);
    });
});

$('.scrape-btn').on('click', event => {
    event.preventDefault();
    $.get('/api/scrape').then(data => {
        if (data === 'Scrape Complete') {
            location.reload();
        } else {
            console.log(data)
        }
    });
})