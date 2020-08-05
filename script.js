$(document).ready(function () {
  $("#search-button").on("click", function () {
    var searchValue = $("#search-value").val();

    // clear input box
    function clear() {
      document.geteElementById('clear-button').reset();
    };

    searchWeather(searchValue);
  });

  $(".history").on("click", "li", function () {
    searchWeather($(this).text());
  });

  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }

  function searchWeather(searchValue) {
    $("#today").html(" ");
    var weatherData;
    $.ajax({
      type: "GET",
      url: "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=2e8b98a28f9a7eb58efb3bca4955afce",
      dataType: "json",
      success: function (data) {
        // create history link for this search
        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));
          console.log(searchValue)
          makeRow(searchValue);
        }
        console.log(data)
        weatherData = data.weather[0]
        weatherTemp = Math.floor((data.main.temp - 273.15) * 9 / 5 + 32);
        console.log(weatherData)

        // clear any old content
        // create html content for current weather
        $("#today").append("<h2>Name: " + data.name + "</h2>")
        $("#today").append("<p>Temp: " + weatherTemp + " Degrees F</p>")
        $("#today").append("<p>Humidity: " + data.main.humidity + " %</p>")
        $("#today").append("<p>Wind Speed: " + data.wind.speed + " MPH</p>")

        $.ajax({
          type: "GET",
          url: "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=2e8b98a28f9a7eb58efb3bca4955afce",
          dataType: "json",
          success: function (uvdata) {
            console.log(uvdata)
            var uv = $("<p>").text("UV Index: ");
            var btn = $("<span>").addClass("btn btn-sm").text(uvdata[0].value);
            
            
              if(uvdata[0].value > 8) {
                $(btn).css("background-color", "red")
                $(btn).css("color", "white")
              }

              uv.append(btn);
          $("#today").append(uv)
          getForecast(searchValue);
          }
          // $("#today").append(weatherData)

          // merge and add to page

          // call follow-up api endpoints

        })
      }
    })
  }

  function getForecast(searchValue) {
    $.ajax({
      type: "GET",
      url: "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=2e8b98a28f9a7eb58efb3bca4955afce",
      dataType: "json",
      success: function (data) {
        console.log(data);
        // overwrite any existing content with title and empty row
        $("#forecast").html(" ");
        // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {
          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

            $("#forecast").append(`<div class='card'>
            <div class="card-body">
            <h5 class="card-title">${data.list[i].dt_txt}</h5>
            <div><p class="card-text">${data.list[i].weather[0].description}</p></div>
            <div><p class="card-text">Temperature: ${Math.floor((data.list[i].main.temp - 273.15) * 9 / 5 + 32)} degrees F</p></div>
            <div><p class="card-text">Humidity: ${data.list[i].main.humidity} %</p></div>
            `
        
            // create html elements for a bootstrap card


            // merge together and put on page
            )};
          $("#forecast").append(data)
        }
      }
    });
  }

  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=2e8b98a28f9a7eb58efb3bca4955afce",
      dataType: "json",
      success: function (data) {
        var uv = $("<p>").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(data.value);

        // change color depending on uv value

        $("#today .card-body").append(uv.append(btn));
      }
    });
  }

  // get current history, if any
  var history = JSON.parse(window.localStorage.getItem("history")) || [];

  if (history.length > 0) {
    searchWeather(history[history.length - 1]);
  }

  for (var i = 0; i < history.length; i++) {
    makeRow(history[i]);
  }
});
