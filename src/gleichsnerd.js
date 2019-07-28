import $ from "jquery";
import TVStatic from "./tv-static"
import TVScreen from "./tv-screen";
import DVDScreen from "./dvd-screen";

import css from "../style.less";

let tvScreen, 
    tvStatic,
    dvdScreen,
    homeScrollerTimeout;

function scrollToTop(id) {
    $('html, body').animate({
        scrollTop: $(`#${id}`).offset().top
    }, 0);
}

const handleURLChange = function(event) {
    if(event.oldURL.indexOf("/modern") !== event.newURL.indexOf("/modern")) {
        initStyling()
    }
    if(event.newURL.indexOf("#") === -1) {
        scrollToTop("tv-static");
        homeScrollerTimeout = autoScrollToHome();
    }
};

function switchToModernStyle() {
    document.body.classList.remove("retro");
    document.body.classList.add("modern");
}

function switchToRetroStyle() {
    document.body.classList.add("retro");
    document.body.classList.remove("modern");
}

function isRequestingModernStyling() {
    return location.href.indexOf("/modern") > -1;
}

function initStyling() {
    if(isRequestingModernStyling()) {
        switchToModernStyle();
    } else {
        switchToRetroStyle();
    }
}

function initCanvases() {
    if(!isRequestingModernStyling()) {
        tvScreen = new TVScreen("tv-screen");
        tvStatic = new TVStatic("tv-static");
        dvdScreen = new DVDScreen("dvd-screen");
    }
}

function autoScrollToHome() {
    return setTimeout(() => {
        //TODO - Reenable auto scroll once static page dev is done
        if(location.href.indexOf("#") === -1 ) {
            history.pushState({}, "gleichsnerd", "#home");
            $("#home").addClass("hidden");
            tvScreen.channelSwitch("03", () => { $("#home").removeClass("hidden"); });
            scrollToTop("home");
        }
    }, 3000);
}

if (window.HashChangeEvent) {
    window.onhashchange = handleURLChange
} else {
    window.addEventListener("hashchange"), function (event) {
        event.newURL = document.URL;
    }
}

initStyling();
initCanvases();

homeScrollerTimeout = isRequestingModernStyling() ? null : autoScrollToHome();