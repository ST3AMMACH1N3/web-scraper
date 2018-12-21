console.log('Index loaded');

$.get('/api/scrape').then(() => {
    $.get('/api/article').then((data) => {
        console.log(data);
    })
});