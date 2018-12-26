console.log('Index loaded');

$(document).on('click', '.article-btn', (event) => {
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