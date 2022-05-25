var cityName = "";
var unitGlobal = "fahrenheit";

  function titleCase(str) {
    return str.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.substring(1);
    }).join(' ');
  }
  
  function fullDay(str) {
    switch (str) {
      case 'Tue':
        return 'Tuesday';
      case 'Wed':
        return 'Wednesday';
      case 'Thu':
        return 'Thursday';
      case 'Sat':
        return 'Saturday';
      default:
        return str + 'day';
    }
  }

  function clearDatabse(){
    $.ajax({
      url: 'https://localhost:7235/api/weather',
      type: 'DELETE',
      success: function(result) {
            console.log(result);
      }
    });
  }

  function writeForecastInDatabase(model){

    $.ajax({
      async: true,
      type: 'POST',
      cache: true,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      url: 'https://localhost:7235/api/weather',
      data : JSON.stringify(model),
      success: (result, textStatus, jqXhr) => {
      },
      error(jqXhr, textStatus, aError) {
          }
      });

  }

  function getDaysWithHighTemp(city){
    var $databaseweather = $('.databaseweather'),
        $databaseforecast = $('#forecastDaysAbove')

    $.ajax({
      async: true,
      type: 'GET',
      cache: true,
      url: 'https://localhost:7235/api/weather/' + city,
      success: (result, textStatus, jqXhr) => {
        
        var forecast = result.forecast;
        
        var arr = [];
        var length = forecast.length;
        for (var i = 0; i < length; i++) {
          arr[i] = ("<div class='block'><h3 class='secondary'>" + forecast[i].date + "</h3><h2 class='high'>" + forecast[i][unitGlobal].high + "</h2><h4 class='secondary'>" + forecast[i][unitGlobal].low + "</h4></div>");
        }
          $databaseforecast.html(arr.join(''));

        console.log(result);
      },
      error(jqXhr, textStatus, aError) {
          }
      });
  }

  
  $(function() {
    
    var $wrapper = $('.wrapper'),
      $panel = $wrapper.find('.panel'),
      $city = $panel.find('#city'),
      $weather = $panel.find('.weather'),
      $group = $panel.find('.group'),
      $dt = $group.find('#dt'),
      $description = $group.find('#description'),
      $wind = $group.find('#wind'),
      $humidity = $group.find('#humidity'),
      $temperature = $weather.find('#temperature'),
      $temp = $temperature.find('#temp'),
      $icon = $temp.find('#condition'),
      $tempNumber = $temp.find('#num'),
      $celsius = $temp.find('#celsius'),
      $fahrenheit = $temp.find('#fahrenheit'),
      $forecast = $weather.find('#forecast'),
      $search = $wrapper.find('search'),
      $form = $search.find('form'),
      $button = $form.find('#button');

      $( "#clearDb" ).click(function() {
        clearDatabse();
      });

      $( "#showdays" ).click(function() {
        getDaysWithHighTemp(cityName);
      });
      
  
    function getWeather(input) {
  
      var appid = '58b6f7c78582bffab3936dac99c31b25';
      var requestWeather = $.ajax({
        dataType: 'json',
        url: '//api.openweathermap.org/data/2.5/weather',
        data: {
          q: input,
          units: 'imperial',
          appid: appid
        }
      });
      var requestForecast = $.ajax({
        dataType: 'json',
        url: '//api.openweathermap.org/data/2.5/forecast/daily',
        data: {
          q: input,
          units: 'imperial',
          cnt: '7',
          appid: appid
        }
      });
  
      $fahrenheit.addClass('active').removeAttr('href');
      $celsius.removeClass('active').attr("href", '#');
      $icon.removeClass();
      $button.removeClass().addClass('button transparent');
  
      
      requestWeather.done(function(data) {
  
        var weather = document.getElementById('weather');
        if (data.cod === '404') {
          $city.html('city not found');
          setBackground('color404', 'button404');
          weather.style.display = 'none';
        } else weather.style.display = '';
  
        var dt = new Date(data.dt * 1000).toString().split(' ');
      
        var title = data.sys.country
          ? data.name + ', ' + data.sys.country
          : data.name;
  
        $city.html(title);
        $tempNumber.html(Math.round(data.main.temp));
        $description.html(titleCase(data.weather[0].description));
        $wind.html('Wind: ' + data.wind.speed + ' mph');
        $humidity.html('Humidity ' + data.main.humidity + '%');
        $dt.html(fullDay(dt[0]) + ' ' + dt[4].substring(0, 5));
  
        $celsius.on('click', toCelsius);
        $fahrenheit.on('click', toFahrenheit);
  
        function toCelsius() {
          $(this).addClass('active').removeAttr('href');
          $fahrenheit.removeClass('active').attr('href', '#');
          $tempNumber.html(Math.round((data.main.temp - 32) * (5 / 9)));
        }
  
        function toFahrenheit() {
          $(this).addClass('active').removeAttr('href');
          $celsius.removeClass('active').attr("href", '#');
          $tempNumber.html(Math.round(data.main.temp));
        }
  
        function setBackground(background, button) {
          $('body').removeClass().addClass(background);
          $button.off().hover(function() {
            $(this).removeClass('transparent').addClass(button);
          }, function() {
            $(this).removeClass().addClass('button transparent');
          });
        }
        
  
        if (data.main.temp >= 77) setBackground('hot', 'button-hot');
        else if (data.main.temp >= 68) setBackground('warm', 'button-warm');
        else if (data.main.temp >= 59) setBackground('cool', 'button-cool');
        else setBackground('cold', 'button-cold');
  
        switch (data.weather[0].icon) {
          case '01d':
            $icon.addClass('wi wi-day-sunny');
            break;
          case '02d':
            $icon.addClass('wi wi-day-sunny-overcast');
            break;
          case '01n':
            $icon.addClass('wi wi-night-clear');
            break;
          case '02n':
            $icon.addClass('wi wi-night-partly-cloudy');
            break;
        }
  
        switch (data.weather[0].icon.substr(0, 2)) {
          case '03':
            $icon.addClass('wi wi-cloud');
            break;
          case '04':
            $icon.addClass('wi wi-cloudy');
            break;
          case '09':
            $icon.addClass('wi wi-showers');
            break;
          case '10':
            $icon.addClass('wi wi-rain');
            break;
          case '11':
            $icon.addClass('wi wi-thunderstorm');
            break;
          case '13':
            $icon.addClass('wi wi-snow');
            break;
          case '50':
            $icon.addClass('wi wi-fog');
            break;
        }
      });
  
      requestForecast.done(function(data) {
  
        $celsius.on('click', toCelsius);
        $fahrenheit.on('click', toFahrenheit);
  
        var forecast = [];
        var forecastDatabase = [];
        var length = data.list.length;
        for (var i = 1; i < length; i++) {
          
          forecast.push({
            date: new Date(data.list[i].dt * 1000).toString().split(' ')[0],
            fahrenheit: {
              high: Math.round(data.list[i].temp.max),
              low: Math.round(data.list[i].temp.min),
            },
            celsius: {
              high: Math.round((data.list[i].temp.max - 32) * (5 / 9)),
              low: Math.round((data.list[i].temp.min - 32) * (5 / 9))
            }
          });
        }
        //////////////////////////////////////////////////////////////

        var databaseData = {
          City : input,
          forecast: forecast
        };
        /////////////////////////////
        

        writeForecastInDatabase(databaseData);

        function toCelsius() {
          doForecast('celsius');
          unitGlobal = 'celsius';
        }
  
        function toFahrenheit() {
          doForecast('fahrenheit');
          unitGlobal = 'fahrenheit';
        }
  
        function doForecast(unit) {
          var arr = [];
          var length = forecast.length;
          for (var i = 0; i < length; i++) {
            arr[i] = ("<div class='block'><h3 class='secondary'>" + forecast[i].date + "</h3><h2 class='high'>" + forecast[i][unit].high + "</h2><h4 class='secondary'>" + forecast[i][unit].low + "</h4></div>");
          }
          $forecast.html(arr.join(''));
        }
  
        doForecast('fahrenheit');
      });
    }
  
    $form.submit(function(event) {
      cityName = document.getElementById('search').value;
      var inputLength = cityName.length;
      if (inputLength) getWeather(cityName);
      event.preventDefault();
    });
  
  });