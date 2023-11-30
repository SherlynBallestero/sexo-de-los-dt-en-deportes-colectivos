import data from './data/data.js';

var totalGlobal = [];
var sexoGlobal = [];

function crearGradiente(svgID, gradienteID, porcentaje){
    var svg = document.getElementById(svgID);

    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    var linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    linearGradient.setAttribute("id", gradienteID);

    var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#fdcae1");

    var stop11 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop11.setAttribute("offset", porcentaje + "%");
    stop11.setAttribute("stop-color", "#fdcae1");

    var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", porcentaje + "%");
    stop2.setAttribute("stop-color", "#84b6f4");

    var stop21 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop21.setAttribute("offset", "100%");
    stop21.setAttribute("stop-color", "#84b6f4");

    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop11);
    linearGradient.appendChild(stop2);
    linearGradient.appendChild(stop21);

    defs.appendChild(linearGradient);

    svg.appendChild(defs);
}
function actualizarGradiente(gradienteID, porcentaje){

  var linearGradient = document.getElementById(gradienteID);
  let stops = [];
  

  var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "#fdcae1");
  stops.push(stop1);

  var stop11 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop11.setAttribute("offset", porcentaje + "%");
  stop11.setAttribute("stop-color", "#fdcae1");
  stops.push(stop11);

  var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute("offset", porcentaje + "%");
  stop2.setAttribute("stop-color", "#84b6f4");
  stops.push(stop2);

  var stop21 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop21.setAttribute("offset", "100%");
  stop21.setAttribute("stop-color", "#84b6f4");
  stops.push(stop21);
  
  if (porcentaje == -1){
    stop1.setAttribute("stop-color", "transparent");
    stop11.setAttribute("stop-color", "transparent");
    stop2.setAttribute("stop-color", "transparent");
    stop21.setAttribute("stop-color", "transparent");
  }

  let collect = linearGradient.getElementsByTagName("stop");
  for (let index = 0; index < collect.length; index++) {
    linearGradient.replaceChild(stops[index],collect[index]);
  }
}

function FillCountries(region, development){
  var countries = [];
  var i = -1;
  for (var country in data.countries){
    if ((data.countries[country].continent == region && data.countries[country].development == "") ||
        (data.countries[country].continent == region && development == "none") || 
        (region == "none" && data.countries[country].development == "") ||
        (region == "none" && development == "none")){
      i++;
      countries[i] = country;
    }
  }
  return countries;
}

function SelectStats(sex, region, development, filterCountry){
  
  var country_id = 'none';
  var arrayCountries = [];
  var managersXsports = [];
  var totals = [];
  var i = -1;

  //Busco el country en el json y si le encuentro le asigno el id del pais a country_id
  //sino le asigno none para el buen funcionamiento del codigo
  if (filterCountry != 'none'){
    for (var country in data.countries) {
      if (country == filterCountry) {
        country_id = filterCountry;
        break;
      }
    }
  }
  
  //Llamo a una funcion que le asigna todos los paises que se incluyen en la region
  //y el desarrollo especificado
  arrayCountries = FillCountries(region, development);

  for (var sport in data.sports) {
    i++;
    totals[i] = 0;
    managersXsports[i] = 0;
    if (sex === 'female' || sex === 'all') {
      for (var j = 0; j < data.sports[sport].female.countries.length; j++) {
        if (((data.sports[sport].female.countries[j].country_id != country_id) && (country_id != "none"))) continue;
        if (!arrayCountries.includes(data.sports[sport].female.countries[j].country_id))  continue;
        totals[i] ++;
        if (data.sports[sport].female.countries[j].manager_sex === "female") managersXsports[i]++;
      }
    }
    if (sex === 'male' || sex === 'all') {
      for (var j = 0; j < data.sports[sport].male.countries.length; j++) {
        if (((data.sports[sport].male.countries[j].country_id != country_id) && (country_id != "none"))) continue; 
        if (!arrayCountries.includes(data.sports[sport].male.countries[j].country_id)) continue;
        totals[i] ++;
        if (data.sports[sport].male.countries[j].manager_sex === "female") managersXsports[i]++;
      }
    }
  }
  var final = [];
  for (let i = 0; i < managersXsports.length; i++) {
    if (totals[i] == 0){
      final[i] = -1;
      continue;
    }
    final[i] = (managersXsports[i] * 100) / totals[i];
  }
  totalGlobal = totals;
  sexoGlobal = managersXsports;
  return final;
}




//Para que no se vean vacios los graficos antes de escoger en los filtros
var a = SelectStats('all', 'none', 'none', 'none');
crearGradiente('futbol', 'F1g', a[1]);
crearGradiente('basket', 'F2g', a[0]);
crearGradiente('rugby7', 'F3g', a[2]);
crearGradiente('handball', 'F4g', a[4]);
crearGradiente('hockey', 'F5g', a[6]);
crearGradiente('softball', 'F6g', a[5]);
crearGradiente('voley', 'F7g', a[8]);
crearGradiente('polo', 'F8g', a[7]);
crearGradiente('baseball', 'F9g', a[3]);



const selectElement = document.getElementById("Sexo");
const selectRegion = document.getElementById("Region");
const selectDevelopment = document.getElementById("Desarrollo");
const selectCountry = document.getElementById("Countries");


var sexoFijo = 'all';
var regionFijo = 'none';
var desarrolloFijo = 'none';
var paisFijo = 'none';

selectElement.addEventListener("change", (event) => {
  var a = SelectStats(event.target.value, regionFijo, desarrolloFijo, paisFijo);
  sexoFijo = event.target.value;
  actualizarGradiente('F1g', a[1]);
  actualizarGradiente('F2g', a[0]);
  actualizarGradiente('F3g', a[2]);
  actualizarGradiente('F4g', a[4]);
  actualizarGradiente('F5g', a[6]);
  actualizarGradiente('F6g', a[5]);
  actualizarGradiente('F7g', a[8]);
  actualizarGradiente('F8g', a[7]);
  actualizarGradiente('F9g', a[3]);
});

selectRegion.addEventListener("change", (event) => {
  var a = SelectStats(sexoFijo, event.target.value, desarrolloFijo, paisFijo);
  regionFijo = event.target.value;
  actualizarGradiente('F1g', a[1]);
  actualizarGradiente('F2g', a[0]);
  actualizarGradiente('F3g', a[2]);
  actualizarGradiente('F4g', a[4]);
  actualizarGradiente('F5g', a[6]);
  actualizarGradiente('F6g', a[5]);
  actualizarGradiente('F7g', a[8]);
  actualizarGradiente('F8g', a[7]);
  actualizarGradiente('F9g', a[3]);
});

selectDevelopment.addEventListener("change", (event) => {
  var a = SelectStats(sexoFijo, regionFijo, event.target.value, paisFijo);
  desarrolloFijo = event.target.value;
  actualizarGradiente('F1g', a[1]);
  actualizarGradiente('F2g', a[0]);
  actualizarGradiente('F3g', a[2]);
  actualizarGradiente('F4g', a[4]);
  actualizarGradiente('F5g', a[6]);
  actualizarGradiente('F6g', a[5]);
  actualizarGradiente('F7g', a[8]);
  actualizarGradiente('F8g', a[7]);
  actualizarGradiente('F9g', a[3]);
});

selectCountry.addEventListener("change", (event) => {
  var a = SelectStats(sexoFijo, regionFijo, desarrolloFijo, event.target.value);
  paisFijo = event.target.value;
  actualizarGradiente('F1g', a[1]);
  actualizarGradiente('F2g', a[0]);
  actualizarGradiente('F3g', a[2]);
  actualizarGradiente('F4g', a[4]);
  actualizarGradiente('F5g', a[6]);
  actualizarGradiente('F6g', a[5]);
  actualizarGradiente('F7g', a[8]);
  actualizarGradiente('F8g', a[7]);
  actualizarGradiente('F9g', a[3]);
});

window.onload = function() {
  var svg1 = document.getElementById('basket');
  var svg1b = document.getElementById('basketball');
  var svg2 = document.getElementById('futbol');
  var svg2b = document.getElementById('soccerball');
  var svg3 = document.getElementById('rugby7');
  var svg3b = document.getElementById('rugbyball');
  var svg4 = document.getElementById('handball');
  var svg4b = document.getElementById('handballball');
  var svg5 = document.getElementById('hockey');
  var svg5b = document.getElementById('hockeyball');
  var svg6 = document.getElementById('softball');
  var svg6b = document.getElementById('softballball');
  var svg7 = document.getElementById('voley');
  var svg7b = document.getElementById('voleyball');
  var svg8 = document.getElementById('polo');
  var svg8b = document.getElementById('poloball');
  var svg9 = document.getElementById('baseball');
  var svg9b = document.getElementById('baseballball');
  const cartel = document.querySelector('#cartel');
  const sexoGlobalSum = 0;
  const totalGlobalSum = 0;

  svg1.addEventListener('click', function(){
    svg1b.style.rotate = '360deg';
    setTimeout(function(){
      svg1b.style.rotate = '0deg';;
      }, 500);
  });
  svg1.addEventListener('mouseover', (event) => {
    cartel.style.display = 'block';
    
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobal[0]}
                    <br>Equipos dirigidos por hombres ${totalGlobal[0] - sexoGlobal[0]}
                    <br>Equipos totales ${totalGlobal[0]}`;
  });
  svg1.addEventListener('mouseout',() => {
    var sexoGlobalSum = 0;
    var totalGlobalSum = 0;
    for (let i = 0; i < 9; i++) {
      sexoGlobalSum += sexoGlobal[i];
      totalGlobalSum += totalGlobal[i];
    }
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobalSum}
                    <br>Equipos dirigidos por hombres ${totalGlobalSum - sexoGlobalSum}
                    <br>Equipos totales ${totalGlobalSum}`;
  });

  svg2.addEventListener('click', function(){
      svg2b.style.rotate = '360deg';
      setTimeout(function(){
        svg2b.style.rotate = '0deg';;
        }, 500);
  });
  svg2.addEventListener('mouseover', (event) => {
    cartel.style.display = 'block';
    
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobal[1]}
                    <br>Equipos dirigidos por hombres ${totalGlobal[1] - sexoGlobal[1]}
                    <br>Equipos totales ${totalGlobal[1]}`;
  });
  svg2.addEventListener('mouseout',() => {
    var sexoGlobalSum = 0;
    var totalGlobalSum = 0;
    for (let i = 0; i < 9; i++) {
      sexoGlobalSum += sexoGlobal[i];
      totalGlobalSum += totalGlobal[i];
    }
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobalSum}
                    <br>Equipos dirigidos por hombres ${totalGlobalSum - sexoGlobalSum}
                    <br>Equipos totales ${totalGlobalSum}`;
  });

  svg3.addEventListener('click', function(){
      svg3b.style.rotate = '360deg';
      setTimeout(function(){
        svg3b.style.rotate = '0deg';;
        }, 500);
  });
  svg3.addEventListener('mouseover', (event) => {
    cartel.style.display = 'block';
    
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobal[2]}
                    <br>Equipos dirigidos por hombres ${totalGlobal[2] - sexoGlobal[2]}
                    <br>Equipos totales ${totalGlobal[2]}`;
  });
  svg3.addEventListener('mouseout',() => {
    var sexoGlobalSum = 0;
    var totalGlobalSum = 0;
    for (let i = 0; i < 9; i++) {
      sexoGlobalSum += sexoGlobal[i];
      totalGlobalSum += totalGlobal[i];
    }
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobalSum}
                    <br>Equipos dirigidos por hombres ${totalGlobalSum - sexoGlobalSum}
                    <br>Equipos totales ${totalGlobalSum}`;
  });

  svg4.addEventListener('click', function(){
      svg4b.style.rotate = '360deg';
      setTimeout(function(){
        svg4b.style.rotate = '0deg';;
        }, 500);
  });
  svg4.addEventListener('mouseover', (event) => {
    cartel.style.display = 'block';
    
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobal[4]}
                    <br>Equipos dirigidos por hombres ${totalGlobal[4] - sexoGlobal[4]}
                    <br>Equipos totales ${totalGlobal[4]}`;
  });
  svg4.addEventListener('mouseout',() => {
    var sexoGlobalSum = 0;
    var totalGlobalSum = 0;
    for (let i = 0; i < 9; i++) {
      sexoGlobalSum += sexoGlobal[i];
      totalGlobalSum += totalGlobal[i];
    }
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobalSum}
                    <br>Equipos dirigidos por hombres ${totalGlobalSum - sexoGlobalSum}
                    <br>Equipos totales ${totalGlobalSum}`;
  });

  svg5.addEventListener('click', function(){
    svg5b.style.top = "-80px";
    setTimeout(function(){
      svg5b.style.top = "0px";
      }, 500);
  });
  svg5.addEventListener('mouseover', (event) => {
    cartel.style.display = 'block';
    
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobal[6]}
                    <br>Equipos dirigidos por hombres ${totalGlobal[6] - sexoGlobal[6]}
                    <br>Equipos totales ${totalGlobal[6]}`;
  });
  svg5.addEventListener('mouseout',() => {
    var sexoGlobalSum = 0;
    var totalGlobalSum = 0;
    for (let i = 0; i < 9; i++) {
      sexoGlobalSum += sexoGlobal[i];
      totalGlobalSum += totalGlobal[i];
    }
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobalSum}
                    <br>Equipos dirigidos por hombres ${totalGlobalSum - sexoGlobalSum}
                    <br>Equipos totales ${totalGlobalSum}`;
  });

  svg6.addEventListener('click', function(){
      svg6b.style.rotate = '360deg';
      setTimeout(function(){
        svg6b.style.rotate = '0deg';;
        }, 500);
  });
  svg6.addEventListener('mouseover', (event) => {
    cartel.style.display = 'block';
    
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobal[5]}
                    <br>Equipos dirigidos por hombres ${totalGlobal[5] - sexoGlobal[5]}
                    <br>Equipos totales ${totalGlobal[5]}`;
  });
  svg6.addEventListener('mouseout',() => {
    var sexoGlobalSum = 0;
    var totalGlobalSum = 0;
    for (let i = 0; i < 9; i++) {
      sexoGlobalSum += sexoGlobal[i];
      totalGlobalSum += totalGlobal[i];
    }
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobalSum}
                    <br>Equipos dirigidos por hombres ${totalGlobalSum - sexoGlobalSum}
                    <br>Equipos totales ${totalGlobalSum}`;
  });

  svg7.addEventListener('click', function(){
      svg7b.style.rotate = '360deg';
      setTimeout(function(){
        svg7b.style.rotate = '0deg';;
        }, 500);
  });
  svg7.addEventListener('mouseover', (event) => {
    cartel.style.display = 'block';
    
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobal[8]}
                    <br>Equipos dirigidos por hombres ${totalGlobal[8] - sexoGlobal[8]}
                    <br>Equipos totales ${totalGlobal[8]}`;
  });
  svg7.addEventListener('mouseout',() => {
    var sexoGlobalSum = 0;
    var totalGlobalSum = 0;
    for (let i = 0; i < 9; i++) {
      sexoGlobalSum += sexoGlobal[i];
      totalGlobalSum += totalGlobal[i];
    }
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobalSum}
                    <br>Equipos dirigidos por hombres ${totalGlobalSum - sexoGlobalSum}
                    <br>Equipos totales ${totalGlobalSum}`;
  });

  svg8.addEventListener('click', function(){
      svg8b.style.rotate = '360deg';
      setTimeout(function(){
        svg8b.style.rotate = '0deg';;
        }, 500);
  });
  svg8.addEventListener('mouseover', (event) => {event.clientY
    cartel.style.display = 'block';
    
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobal[7]}
                    <br>Equipos dirigidos por hombres ${totalGlobal[7] - sexoGlobal[7]}
                    <br>Equipos totales ${totalGlobal[7]}`;
  });
  svg8.addEventListener('mouseout',() => {
    var sexoGlobalSum = 0;
    var totalGlobalSum = 0;
    for (let i = 0; i < 9; i++) {
      sexoGlobalSum += sexoGlobal[i];
      totalGlobalSum += totalGlobal[i];
    }
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobalSum}
                    <br>Equipos dirigidos por hombres ${totalGlobalSum - sexoGlobalSum}
                    <br>Equipos totales ${totalGlobalSum}`;
  });

  svg9.addEventListener('click', function(){
      svg9b.style.rotate = '360deg';
      setTimeout(function(){
        svg9b.style.rotate = '0deg';;
        }, 500);
  });
  svg9.addEventListener('mouseover', (event) => {
    cartel.style.display = 'block';
    
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobal[3]}
                    <br>Equipos dirigidos por hombres ${totalGlobal[3] - sexoGlobal[3]}
                    <br>Equipos totales ${totalGlobal[3]}`;
  });
  svg9.addEventListener('mouseout',() => {
    var sexoGlobalSum = 0;
    var totalGlobalSum = 0;
    for (let i = 0; i < 9; i++) {
      sexoGlobalSum += sexoGlobal[i];
      totalGlobalSum += totalGlobal[i];
    }
    cartel.innerHTML = `Equipos dirigidos por mujeres ${sexoGlobalSum}
                    <br>Equipos dirigidos por hombres ${totalGlobalSum - sexoGlobalSum}
                    <br>Equipos totales ${totalGlobalSum}`;
  });

  //Cartel que sale cuando le pasas el mouse por encima a la grafica
  

  
};

//1 0 2 4 6 5 8 7 3
//f b r m h s v w p

function GetCountryNames(countries){
  var countryNames = [];
  for (var i = 0; i < countries.length; i++) {
    countryNames[i] = data.countries[countries[i]].country_name;
  }
  return ordenarArray(countryNames);
}
var select = document.getElementById("Countries");
var nombres = FillCountries('none', 'none');
var countryNames = GetCountryNames(nombres);

for (var i = 0; i < nombres.length; i++) {
  var option = document.createElement("option");
  option.text = countryNames[i];
  option.value = nombres[i];
  select.add(option);
}

function ordenarArray(array){
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array.length - 1; j++) {
      if (array[j] > array[j + 1]) {
        var temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
  return array;
}