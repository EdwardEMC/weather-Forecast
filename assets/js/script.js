$(document).ready(function(){
    var z = 8; //variable to keep track of the list length in minMax and display
    var x = 0; //offset value to start for loops at in order to skip from one day to another in the 'days' list
    var i = 0;

    //function to request the api data
    var city = "adelaide"; //replace with geolocation API
    var APIKey = "f9443d1cf060b0a35d32964b1f1de721";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid="+APIKey;

    $.ajax({
        url: queryURL,
        METHOD: "GET"
    }).then(function(response){
        console.log(response);

        //Displaying the city name and the current date in the title
        var city = $("<h1>").text(response.city.name);
        var date = $("<h1>").text(moment().format('MMMM Do YYYY'));

        $(".cityName").append(city);
        $(".cityDate").append(date);

        displayWeather(response);
        
    })

    function displayWeather(response){
        //for loop to cycle through the days
        for(i, e=0; i<40; i+8, e++) {
            //function to find the minimum/maximum temperature of the day as well as the rainfall for every 3 hour selection (api based)
            function minMax() {
                maxTempArray = [];
                minTempArray = [];
                for(x; x<z; x++) {
                    maxTempArray.push(response.list[x].main.temp_max);  
                    minTempArray.push(response.list[x].main.temp_min); 
                       
                }
            }
            minMax();

            //Displaying the days and the conditions
            var day = $("<h4>").text(daySort(e));
            var maxTemp = $("<p>").text("Max Temp: "+Math.max(...maxTempArray));
            var minTemp = $("<p>").text("Min Temp: "+Math.min(...minTempArray));
            var weather = $("<p>").text("Weather: "+response.list[i+3].weather[0].main);
            var humidity = $("<p>").text("Humidity: "+response.list[i+3].main.humidity+"%");
            var windSpeed=$("<p>").text("Wind speed: "+response.list[i+3].wind.speed+"m/s");
            var description = $("<p>").text("Type: "+response.list[i+3].weather[0].description);
            //Find uv index
            //Get photo depicting the weather

            day.attr("style", "color:white; text-align:center;");

            $("#day"+e).append(day);
            $("#day"+e).append(maxTemp);
            $("#day"+e).append(minTemp);
            $("#day"+e).append(humidity);
            $("#day"+e).append(windSpeed);
            $("#day"+e).append(weather);
            $("#day"+e).append(description);  

            z=z+8;
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
})