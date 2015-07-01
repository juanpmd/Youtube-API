// ##################################################################################
function init() {
    //Este init es llamado desde el src del html ("js?onload=init")
    //de Esta manera se inicia la API
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}
// ##################################################################################
function onYouTubeApiLoad() {
    gapi.client.setApiKey('AIzaSyAgifQmVZ7pWXjYJ4rZLITviMH39pFPA1g');
    $("#boton").click(function(){
      search(); //Aqui hace la busqueda
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

    //Esto es para cambiar color de boton boton-list
    $("#boton-list").addClass("boton-list-class2");
    $("#boton-list").removeClass("boton-list-class");

    for (result in results){
      var tamartista = results[result].snippet.channelTitle.length;
      if (tamartista === 0){}
      else {
        //Esto es para modificar la longitud de los titulos
        var titulofinal = TamanoModificado(results[result].snippet.title);

        //Esto es para modificar el color de fondo de cada bloque de la lista
        var sizebackground =parseInt($(".results").css("height"), 10);
        $(".results").css("height", sizebackground + 71);

        var vistaboton = '<div class="menu-videos"><div class="video-lista"><div class="play"></div><div class="info-video"><p class="nombre-cancion">%nombre-cancion%</p><p class="descripcion-cancion"><span>de </span>%nombre-artista%</p></div></div>';
        vistaboton = vistaboton.replace("%nombre-cancion%", titulofinal);
        vistaboton = vistaboton.replace("%nombre-artista%", results[result].snippet.channelTitle);
        $(".results").append(vistaboton);
      }
      //var plantilla ='<iframe width="640" height="360" src="http://www.youtube.com/embed/%idvideo%" frameborder="0" allowfullscreen></iframe>';
    };
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
