$(document).ready(function(){
    var i = 7; //Variable to offset the response list to skip to a new day, always starting with 'tomorrow'

    //function to request the api data
    var city = "adelaide"; //replace with geolocation API
    var APIKey = "f9443d1cf060b0a35d32964b1f1de721";
   
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid="+APIKey, //current weather
        METHOD: "GET"
    }).then(function(response){
        console.log(response);

        currentWeather(response);
        
        var long = response.coord.lon;
        var lat = response.coord.lat;

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi/forecast?appid="+APIKey+"&lat="+lat+"&lon="+long+"&cnt=1", //UV index
            METHOD: "GET"
        }).then(function(response){
            console.log(response);
            uvDisplay(response);
        })
    })

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid="+APIKey, //5 day forecast
        METHOD: "GET"
    }).then(function(response){
        console.log(response);
        displayWeather(response);
    })

    //listener event for the search button

    //function to display the uv index
    function uvDisplay(response) {
        var uvIndex = $("<p>");
        var value = $("<p>").text(response[0].value);

        value.attr("class", "badge badge-danger");
        uvIndex.text("UV index: ");

        uvIndex.append(value);
        $("#day0").append(uvIndex);
    }

    //function to display the current weather
    function currentWeather(response) {
        //Displaying the city name and the current date in the title
        var city = $("<h1>").text(response.name);
        var date = $("<h1>").text(moment().format('MMMM Do YYYY'));

        $(".cityName").append(city);
        $(".cityDate").append(date);

        var day = $("#day0");

        var dayName = $("<h3>").text(moment().format("dddd"));
        var temp = $("<p>").text("Temp: "+response.main.temp);
        var weather = $("<p>").text("Weather: "+response.weather[0].main);
        var description = $("<p>").text("Type: "+response.weather[0].description);
        var humidity = $("<p>").text("Humidity: "+response.main.humidity+"%");
        var windSpeed = $("<p>").text("Wind speed: "+response.wind.speed+"m/s");
        var weatherPic = $("<img>").attr("src", pictureSort(response.weather[0].main));

        dayName.attr("style", "color:black; text-align:center;");
        
        day.append(dayName);
        day.append(weatherPic);
        day.append(temp);
        day.append(humidity);
        day.append(windSpeed);
        day.append(weather);
        day.append(description);
    }

    //function to display to 5 day forecast
    function displayWeather(response) {
        //for loop to cycle through the days
        for(i, e=1; i<40; i+8, e++) {

            var day = $("#day"+e);

            //Displaying the days and the conditions
            var dayName = $("<h4>").text(daySort(e));
            var temp = $("<p>").text("Temp: "+response.list[i].main.temp);
            var weather = $("<p>").text("Weather: "+response.list[i].weather[0].main);
            var humidity = $("<p>").text("Humidity: "+response.list[i].main.humidity+"%");
            var weatherPic = $("<img>").attr("src", pictureSort(response.list[i].weather[0].main));

            dayName.attr("style", "color:black; text-align:center;");

            day.append(dayName);
            day.append(weatherPic);
            day.append(temp);
            day.append(humidity);
            day.append(weather);  

            i=i+8;
        }
    }
    
    //function to display the current days
    function daySort(param){
        var weekArray = [];
        for(d=0; d<7; d++) {
            weekArray.push(moment(new Date()).add(d, "day").format("dddd"));
        }
        return weekArray[param];
    }

    //function to sort out which weather related picture to display
    function pictureSort(weather){
        if(weather==="Clear") {
            return "assets/images/sunny.png"
        }
        else if(weather==="Storms") {
            return "assets/images/stormy.png"
        }
        else if(weather==="Rain") {
            return "assets/images/rainy.png"
        }
        else {
            return "assets/images/cloudy.png"
        }
    }
})