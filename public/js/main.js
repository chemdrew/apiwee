$(document).ready(function(){
    init();
    domEvents();
    addRemoveEvent();
    addToggleEvent();
});

var apiwee = {};

function init() {
    apiwee.saveKeys = {};
}

function domEvents() {
    $('#new-api-key').click(function(e){
        e.preventDefault();
        var addedElement = $('#api-keys').prepend(
        `<li class="api-key-config">
            <div class="drop-cover" ondrop="drop(event)" ondragover="dragover(event)" ondragleave="dragleave(event)"></div>
            <div class="key-name" contenteditable="true">${randomString(40)}</div><div class="key-remove">delete</div>
            <div class="active-toggle">
                <div class="active-title">active</div>
                <div class="toggle-button active-true">
                    <button></button>
                </div>
            </div>
            <ul class="permitted-routes"></ul>
        </li>`);
        addedElement.children().first().find('.key-remove').click(function(e){
            e.preventDefault();
            $(e.target).parent().remove();
        });
        addedElement.children().first().find('.toggle-button').click(function(e){
            $(this).toggleClass('active-true');
            $(this).toggleClass('active-false');
        });
    });

    $('#save-configuration').click(function(e){
        var data = {}
        var apiKeys = $('#api-keys').children();
        var i = 0, j = 0;
        for (i; i < apiKeys.length; i++) {
            var apiKey = $(apiKeys[i]).find('.key-name').text();
            data[apiKey] = {
                routes: [],
                locked: true
            }
            var routes = $(apiKeys[i]).find('.key-route');
            j = 0;
            for (j; j < routes.length; j++) {
                data[apiKey].routes.push( $(routes[j]).text() );
            }
            console.log( $($(apiKeys[i]).find('.toggle-button')) );
            console.log( $($(apiKeys[i]).find('.toggle-button')).hasClass('active-true') );
            data[apiKey].locked = $($(apiKeys[i]).find('.toggle-button')).hasClass('active-true') ? false : true;
        }
        apiwee.saveKeys = data;
        $('.popup-background-cover').fadeIn(300);
        $('.save-popup').fadeIn(300);
    });

    $('.save-popup-confirm').click(function(){
        apiwee.saveKeys.username = $('#username').val();
        apiwee.saveKeys.password = $('#password').val();
        $('#username').val('');
        $('#password').val('');
        $('.save-popup').fadeOut(200);
        $('.popup-background-cover').fadeOut(200);
        $.ajax({
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            url : '/apiwee/configurations',
            type : 'PATCH',
            data : JSON.stringify(apiwee.saveKeys),
            xhrFields:{
                withCredentials:true
            },
            success : function(response, textStatus, jqXhr) {
                alert('saved');
            },
            error : function(jqXHR, textStatus, errorThrown) {
                alert('unable to save, please try again');
            }
        });
    });

    $('.save-popup-cancel').click(function(){
        $('.save-popup').fadeOut(200);
        $('.popup-background-cover').fadeOut(200);
    });
}

function addRemoveEvent() {
    $('.key-remove').click(function(e){
        e.preventDefault();
        $(e.target).parent().remove();
    });
}

function addToggleEvent() {
    $('.toggle-button').click(function(e){
        $(this).toggleClass('active-true');
    });
}

var draggedElement;

function dragstart (e) {
    draggedElement = e.target;
    $('.drop-cover').css({
        'z-index': '2'
    });
}

function dragend (e) {
    draggedElement = undefined;
    $('.drop-cover').css({
        'z-index': '-2'
    });
}

function dragover(e) {
    e.preventDefault();
    $(e.target).parent().css({
        'background-color': '#DEDBF3'
    });
}

function dragleave(e) {
    e.preventDefault();
    $(e.target).parent().css({
        'background-color': 'white'
    });
}

function drop(e) {
    e.preventDefault();
    $(e.target).parent().css({
        'background-color': 'white'
    });
    $($(e.target).parent().find('.permitted-routes')).append(
    `<li>
        <div class="key-route">${$(draggedElement).text().trim()}</div>
        <div class="key-remove">×</div>
    </li>`
    ).children().last().find('.key-remove').click(function(e){
        e.preventDefault();
        $(e.target).parent().remove();
    });
}

function randomString(length, characters) {
    var text = '';
    characters = characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    length = length || 25;

    for( var i=0; i < length; i++ )
        text += characters.charAt(Math.floor(Math.random() * characters.length));
    return text;
}

function getParameterByName(name, url) {
    url = url || window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}