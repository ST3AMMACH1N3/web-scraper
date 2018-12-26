console.log('Saved loaded')

$(document).on('click', '.article-btn', (event) => {
    let target = $(event.currentTarget);
    let id = target.data('id');
    
    $.post(`/api/unsave/${id}`).then(data => {
        let parent = target.parent();
        parent.empty();
        let message = $('<p>').text('Article no longer saved.');
        parent.append(message);
        setTimeout(() => {
            parent.remove();
        }, 1000);
    });   
});