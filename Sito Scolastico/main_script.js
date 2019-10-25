//Classe pannello che contiente un oggetto del DOM
//Possiede contenuti tra cui se è aperto, chiuso

class panel {
    constructor(class_name, classes = "open") {
        this.toggle_op = false;
        this.object = $(class_name);
        this.name = class_name;
        this.class = classes;
    }

    //Funzione toggle - Tiene in memoria lo stato precedente e lo inverte
    //Utilizzata ad esempio per il tasto del menù mobile

    toggle() {
        this.toggle_op = !this.toggle_op;
        if (this.toggle_op)
            this.open();
        else
            this.close();
    }

    //Funzione Open - Apertura, aggiunta della classe
    open() {
        this.object.addClass(this.class);
    }

    //Funzione Close - Chiusura, rimozione della classe
    close() {
        this.object.removeClass(this.class);
    }

}


    //Funzione night_mode()
    //Controlla se il body possiede la classe night, se la possiede la toglie. Viceversa la aggiunge
function night_mode() {
    if ($("body").hasClass("night")) {      //Se il body ha la classe night
        $("body").removeClass("night");     //Rimuovo la classe
        document.cookie = "night=false";    //E imposto il cookie a false
    } else {
        $("body").addClass("night");        //Se non era attiva la aggiungo
        document.cookie = "night=true";     //Ed imposto il cookie a true
    }
}

//Creazione della variabile Obscure (Pannello che oscura il resto dello schermo alla comparsa di una finestra)
var obs = new panel(".obscure");
//Pannello che mostra le immagini ingrandite - Al fine di vedere l'immagine
var img_panel = new panel(".image_vision");
//Aggiunta della classe al menu (Se è aperto o chiuso)
var mobile_menu = new panel(".menu");
//Pannello con testo
var content_vision = new panel(".panel_vision");
//Pannello per la visione dei media animati
var video_panel = new panel(".video_vision");
//Croce che permette la chiusura del pannello video
var cross_video = $(".video_zoom_out.close-cross");
//Dimensione della finestra
var window_size;
//Dimensione dell'immagine da usare durante gli zoom
var image_size;

//Evento click- Richiama una callback (Funzione Anonima)
$(".toggle").click(function () {
    var callback_active, callback_normal, param = [];
    callback_active = $(this).attr("call-act");
    callback_normal = $(this).attr("call");
    param = $(this).attr("params").split(",");

    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $(this).children().html($(this).children().html().replace(" (Attivo)", ""));
        window[callback_normal](param);
    } else {
        $(this).addClass("active");
        $(this).children().html($(this).children().html() + " (Attivo)");
        window[callback_active](param);
    }

});


//Evento - window è una variabile di javascript - Ogni volta che ridimensiono una immagine svolgo cio che si trova all'interno
$(window).resize(function () {
    window_size = {
        window_height: $(window).height(),      //Funzione Height() che ritorna l'altezza
        window_width: $(window).width()         //Funzione width() che ritorna la larghezza
    };

    image_size = {
        image_height: $(".image_vision").height(),      //Ritorno l'altezza con la funzione height() dell'immagine
        image_width: $(".image_vision").width()         //Ritorno la larghezza con la funzione width() dell'immagine
    };

    //Calcolo per la dimensione dell'immagine
    img_panel.object.css("--height", (window_size.window_height / 2) - (image_size.image_height / 2));
    video_panel.object.css("--height", ""+window_size.window_height-50+"px");
});


    //Ready function - La funzione diventa disponibile quando il file è caricato
    //la funzione viene eseguita quando il DOM è pronto ad eseguire il codice JavaScript.
$(document).ready(function () {
    var cookies = document.cookie;
    if (cookies == "night=true") {        //Se nei cookie night=true
        $("[call=night_mode]").click();   //Passo alla visione night
    }

    setTimeout(function () {    //Chiusura del pannello di caricamento
        $(".open_page").addClass("close");    //Aggiunta della classe close
    }, 800);                    //Tempo prima che venga aggiunta la classe close

});

//Quando .toZoom o .box_zoom (L'add equivale ad un OR ) viene cliccato
$(".toZoom").add(".box_zoom").click(function () {
    window_size = {
        //Vengono prelevate le dimensioni attuali della finestra
        window_height: $(window).height(),
        window_width: $(window).width()
    };
    obs.open();   //Eseguo l'obscure
    img_panel.open();  //Apro il l'immagine full screen
    img_panel.object.attr("src", $(this).attr("src"));    //Aggiungo l'attributo src dell'immagine cliccata
    setTimeout(function () {
        image_size = {
            //Prelevo le dimensioni dell'immagine
            image_height: img_panel.object.height(),
            image_width: img_panel.object.width()
        };
        img_panel.object.css("--height", (window_size.window_height / 2) - (image_size.image_height / 2));
        //Vado a calcolare ed ad assegnare la dimensione al fine di tenerla centrata verticalmente
    }, 0);
    $("body").css("overflow-y", "hidden");    //Elimino l'overflow al fine di far scomparire la scroll bar
});


//Evento click - Parte con il trigger di close image
$(".close_img").click(function () {
    $("body").css("overflow-y", "auto");    //Ritorna l'overflow normale (se c'è)
    obs.close();    //Faccio scomparire l'obscure
    img_panel.close();   //Chiudo il pannello contenente l'immagine
});

//Quando viene cliccato il tastino del menu mobile
$(".mobile_menu_button").click(function () {

    mobile_menu.toggle();   //Attivo la tendina del menu / Disattivo se era attiva

});

var actual;
$(".open_vision").click(function () {
    var destination = $(this).attr("destination");
    content_vision.open();
    $(content_vision.name + " ._header").fadeIn(500);
    setTimeout(function () {
        actual = $(content_vision.name + " [content = " + destination + "]");
        actual.fadeIn(500);
        obs.open();
    }, 250);
    $("body").css("overflow-y", "hidden");
});

$(".close_content_vision").click(function () {
    actual.fadeOut(500);
    $(content_vision.name + " ._header").fadeOut(500);
    setTimeout(function () {
        $("body").css("overflow-y", "auto");
        content_vision.close();
        obs.close();
    }, 500);
});


$(window).resize(function(){

});

$(".video_zoom").click(function () {
    window_size = {
        window_height: $(window).height(),
        window_width: $(window).width()
    };

    var content = $(this).attr("src");
    video_panel.open();
    video_panel.object.attr("src", content);
    obs.open();
    video_panel.object.addClass("video_zoom_out");
    $("body").css("overflow-y", "hidden");
    video_panel.object.css("--height", ""+window_size.window_height-50+"px");
    cross_video.fadeIn(0);
});
$(".video_zoom_out").click(function () {
    if (video_panel.object.hasClass("open")) {
        obs.object.removeClass("video_zoom_out");
        obs.close();
        video_panel.object.attr("src", "");
        video_panel.close();
        cross_video.fadeOut(0);
        $("body").css("overflow-y", "auto");
    }
});
