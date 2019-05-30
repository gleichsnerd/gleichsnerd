import $ from "jquery";
import TVStatic from "./tv-static"
import TVScreen from "./tv-screen";

function scrollToTop(id) {
    $('html, body').animate({
        scrollTop: $(`#${id}`).offset().top
    }, 0);
}

const handleURLChange = function(event) {
    if(event.newURL.indexOf("#") === -1) {
        scrollToTop("static");
        homeScrollerTimeout = autoScrollToHome();
    }
};

if(window.HashChangeEvent) {
    window.onhashchange = handleURLChange
} else {
    window.addEventListener("hashchange"), function(event) {
        event.newURL = document.URL;
    }
}

const autoScrollToHome = function() {
    return setTimeout(() => {
        //TODO - Reenable auto scroll once static page dev is done
        if(false && location.href.indexOf("#") === -1 ) {
            history.pushState({}, "gleichsnerd", "#home");
            scrollToTop("home");
        }
    }, 3000);
}

//TODO - Cancel timeout if they use one of the tv buttons
let homeScrollerTimeout = autoScrollToHome();

const tvScreen = new TVScreen("tv-screen");
const tvStatic = new TVStatic("tv-static");