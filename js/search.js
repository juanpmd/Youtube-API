// ##################################################################################
function init() {
    //Este init es llamado desde el src del html ("js?onload=init")
    //de Esta manera se inicia la API
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}
// ##################################################################################
function onYouTubeApiLoad() {
    gapi.client.setApiKey('AIzaSyAgifQmVZ7pWXjYJ4rZLITviMH39pFPA1g');

    //Agregue esta variable para que cada vez que unda el click el tamaño del fondo se resetee
    var sizebackground =parseInt($(".results").css("height"), 10);

    //Esta funcion es para ajustar que al inicio no se cree un scrool por exceso de fondo (modifica el tamaño del fondo para que quepa perfectamente)
    AjustarPantalla();

    $("#boton").click(function(){
      $(".results").css("height", sizebackground);
      //Estas 2 lineas es por si estas en el reproductor, si buscas otro video se abre la lista con la nueva busqueda
      $(".reproductor").fadeOut("slow").addClass("hidden");
      $(".results").fadeIn("slow").removeClass("hidden");
      $(".video").remove();
      search(); //Aqui hace la busqueda
    });

    //Esta funcion es para que no tenga que dar click sino undir la tecla "enter"
    $("#search").keypress(function (e) {
      if (e.which == 13) {
        $(".results").css("height", sizebackground);
        //Estas 2 lineas es por si estas en el reproductor, si buscas otro video se abre la lista con la nueva busqueda
        $(".reproductor").fadeOut("slow").addClass("hidden");
        $(".results").fadeIn("slow").removeClass("hidden");
        $(".video").remove();
        search(); //Aqui hace la busqueda
      }
    });

    //Esta funcion es para cuando de click a un elemento de la lista, el abra su video
    PestañaVideo();

}
// ##################################################################################
function PestañaVideo(){

  $(document).on('click','.video-lista', function(){

    //Esto es para redimensionar el bloque del video dependiendo del tamaño de pantalla
    var fondonegro =parseInt($(".reproductor").css("width"), 10);
    fondonegro = fondonegro * 0.70;
    var alturafondonegro = fondonegro / 2.225;
    $(".fondo-negro").css("height", alturafondonegro);
    var alturareproducir = alturafondonegro + 146;
    $(".menu-reproducir").css("height", alturareproducir);


    //Aqui hace las modificaciones necesarias para arreglar la pantalla de reproduccion
    var idvid = $(this).find(".id-video-lista").text();
    var nomvid = $(this).find(".nombre-cancion").text();
    //console.log("id: " + idvid);
    //console.log("nombre: " + nomvid);
    $(".reproductor").fadeIn("slow").toggleClass("hidden");
    $(".results").fadeOut("slow").toggleClass("hidden");

    var ivideo = '<iframe class="video" src="http://www.youtube.com/embed/%link%?&showinfo=0" frameborder="0" allowfullscreen></iframe>';
    ivideo = ivideo.replace("%link%", idvid);
    $(".bloque-video").append(ivideo);


    //Para organizar el tamaño del fondo
    var sizebackground =parseInt($(".menu-reproducir").css("height"), 10);
    var tamanomainresults =parseInt($(".main-results").css("height"), 10);
    console.log(sizebackground);
    console.log(tamanomainresults);

    if (sizebackground < tamanomainresults){
      $(".reproductor").css("height", tamanomainresults);
    }
    else {
      $(".reproductor").css("height", sizebackground + 50);
    }

  });

  //Este es para volver cuando se de click en el boton regresar
  $("#regresar").click(function() {
    $(".reproductor").fadeOut("slow").toggleClass("hidden");
    $(".results").fadeIn("slow").toggleClass("hidden");
    $(".video").remove();
  });
}
// ##################################################################################
function search() {
  var request = gapi.client.youtube.search.list({
    part: 'snippet',
    //Los parametros de entrada del .replace() son "/%20/g" y "+"
    //El "/%20/g" tiene un /%20 que busca coger los espacios y el /g que es global
    q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
    //q: "fiesta+de+verano",
    maxResults: 20,
    order: "relevance"
  });
  request.execute(onSearchResponse); //Aqui ejecuta el resultado
}
// ##################################################################################
function onSearchResponse(response) {
    var results = response.items;

    //utilizo esto por si ya habia undido el boton entonces borre la lista que ya esta mostrando
    $(".video-lista").remove();

    //Esto es para que cuando se unda buscar, aparezca el bloque donde estara la lista de videos
    $(".results").removeClass("hidden");

    //Esto es para cambiar color de boton boton-list
    $("#boton-list").addClass("boton-list-class2");
    $("#boton-list").removeClass("boton-list-class");

    //la var temporal es para darle un numero al id unico de cada elemento de la lista de resultados
    var temporal = 0;
    for (result in results){
      var tamartista = results[result].snippet.channelTitle.length;
      if (tamartista === 0){}
      else {
        //Esto es para modificar la longitud de los titulos
        var titulofinal = TamanoModificado(results[result].snippet.title);

        //Esto es para modificar el color de fondo de cada bloque de la lista
        var sizebackground =parseInt($(".results").css("height"), 10);
        $(".results").css("height", sizebackground + 71);

        var vistaboton = '<div class="video-lista"><div id="%id-video%" class="video-image"></div><div class="play"></div><div class="info-video"><p class="nombre-cancion">%nombre-cancion%</p> <p class="id-video-lista">%id-video-lista%</p><p class="descripcion-cancion"><span>de </span>%nombre-artista%</p></div></div>';
        vistaboton = vistaboton.replace("%nombre-cancion%", titulofinal);
        vistaboton = vistaboton.replace("%nombre-artista%", results[result].snippet.channelTitle);
        vistaboton = vistaboton.replace("%id-video-lista%", results[result].id.videoId);

        var strnum = String(temporal);
        strnum = "video" + strnum;
        vistaboton = vistaboton.replace("%id-video%", strnum);
        $(".results").append(vistaboton);

        //el strnum es para crear un id unico a cada div, luego a cada id le agrego si background para que asi no se repita
        var imagenvideo = 'url(' + results[result].snippet.thumbnails.medium.url + ')';
        var pos = "#" + strnum;
        $(pos).css('background-image', imagenvideo);
      }
      temporal = temporal+1;
      //var plantilla ='<iframe width="640" height="360" src="http://www.youtube.com/embed/%idvideo%" frameborder="0" allowfullscreen></iframe>';
    };

    //Esto es para organizar el tamaño del fondo gris (que se organice con la cantidad de resultados de la busqueda)
    sizebackground =parseInt($(".results").css("height"), 10);
    tamanomainresults =parseInt($(".main-results").css("height"), 10);
    //Esto es para que revise cuando hace una busqueda el tamano de fondo y asi lo reorganiza
    if (sizebackground < tamanomainresults){}
    else {
      $(".main-results").css("height", sizebackground + 50);
    }
}
// ##################################################################################
function TamanoModificado(titulo){
  var tamano = titulo.length;
  var i;
  var final = "";
  for (i=0;i<53;i++){
    if (i === tamano){
      return final;
    }
    else {
      final = final + titulo[i];
    }
  }
  final = final + " ...";
  return final;
}
// ##################################################################################
function AjustarPantalla() {
  var tamano = parseInt($(".main-results").css("height"), 10);
  tamano = tamano - 83;
  $(".main-results").css("height", tamano);
}
// ##################################################################################
