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

function changePage(url) {
    prev_location = url;
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
            url: this.action ? this.action : prev_location,
            type: this.method,
            data: $(this).serialize(),

            success: function (data) {
                setPage(data);
            },
            error: function (data) {
                setPage(data);
            }
        });

        return false;
    });
}
function bindLinks() {
    $('a').on('click', function (event) {
        if (this.href != '#'){
            event.preventDefault();
            changePage(this.href);
            return false;
        }
    });
}

$(function () {
    prev_location = window.location;

    bindLinks();
    bindForms();
});