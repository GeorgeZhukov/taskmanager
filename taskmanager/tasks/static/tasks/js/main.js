/**
 * Created by george on 3/23/15.
 */

function setPage(html) {
    // check redirect
    if (typeof html === 'object') {
        changePage(html.location);
        return false;
    }
    var virtualPage = $('<div></div>');
    virtualPage.html(html);
    var pageHTML = $('#page', virtualPage).html();
    $('#page').html(pageHTML);
    bindForms();
    bindLinks();
}

function goBack() {
    changePage(prev_location);
}

function changeTaskStatus(task_id) {
    $('.task-' + task_id).toggleClass('task-done');

    $.ajax({
        url: '/task/' + task_id + '/toggle/',
        type: 'GET',
        error: function (data) {
            // revert
            $('.task-' + task_id).toggleClass('task-done');
        }
    });

    // request
}

function changePage(url) {
    if (prev_location != current_location)
        prev_location = current_location;
    current_location = url;

    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
            setPage(data);
        },
        error: function (data) {
            setPage(data);
        }
    });
}

function bindForms() {
    $('form').on('submit', function (event) {
        event.preventDefault();

        $.ajax({
            url: this.action ? this.action : current_location,
            type: this.method,
            data: $(this).serialize(),
            complete: function (data) {
                if (data.status == 400) {
                    setPage(data.responseJSON.html);
                    return false;
                }
                setPage(data);
            }
        });

        return false;
    });
}
function bindLinks() {
    $('a').on('click', function (event) {
        if (this.href != '#') {
            event.preventDefault();
            changePage(this.href);
            return false;
        }
    });
}

$(function () {
    prev_location = window.location;
    current_location = window.location;

    bindLinks();
    bindForms();

    history.pushState(null, null, '/');
    window.addEventListener('popstate', function (event) {
        history.pushState(null, null, '/');
    });
});