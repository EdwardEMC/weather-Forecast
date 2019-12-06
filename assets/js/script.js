$(document).ready(function(){
     //Variable to offset the response list to skip to a new day, always starting with 'tomorrow' (3hr info blocks)
    var APIKey = "f9443d1cf060b0a35d32964b1f1de721";
    var tracker = parseInt(localStorage.getItem("tracker"));
    var y = findY(); //id marker for buttons
    
    checkStorage(); //checks to see if anything is in the local storage
    loadSaved(); //loads saved searches as buttons
    locationFind(); //finds the users geolocation and uses that to display initial landing page information

    //function to find the current location
    function locationFind() {
        navigator.geolocation.getCurrentPosition(function(position){
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            var queryURLW = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&appid="+APIKey; //weather
            var queryURLF = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&units=metric&appid="+APIKey; //forecast
            requests(queryURLW, queryURLF);  
        }, 
        function(){ //if location access is denied, loads default adelaide if there has been no previous searches
            if(localStorage.getItem("tracker")===null) {
                city = "adelaide"; 
            }  
            else {
                city = localStorage.getItem(tracker-1); //last known search value
            }

            var queryURLW = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid="+APIKey; //weather
            var queryURLF = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid="+APIKey; //forecast
            requests(queryURLW, queryURLF);
        })
    }

    //loading the current city on page opening
    function requests(queryURLW, queryURLF){
        
        $.ajax({
            url: queryURLW, //current weather
            METHOD: "GET"
        }).done(function(response){
            console.log(response);
            currentWeather(response);
            
            var long = response.coord.lon;
            var lati = response.coord.lat;

            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/uvi/forecast?appid="+APIKey+"&lat="+lati+"&lon="+long+"&cnt=2", //UV index
                METHOD: "GET"
            }).done(function(response){
                console.log(response);
                uvDisplay(response);
                
                $.ajax({
                    url: queryURLF, //5 day forecast
                    METHOD: "GET"
                }).done(function(response){
                    console.log(response);
                    displayWeather(response);
                    ajaxPassed(response.city.name);

                //Adding in functions to check if the ajax failed
                }).fail(function(){
                    alert("Ajax request failed, city doesn't not exist or check the spelling");
                    return;
                });
            }).fail(function(){
                alert("Ajax request failed, city doesn't not exist or check the spelling");
                return;
            });
        }).fail(function(){
            alert("Ajax request failed, city doesn't not exist or check the spelling");
            return;
        });
    }

    //function to search the cities
    function citySearch(city) {
        //emptying individually as they are dynamically created (can just create the columns dynamically next time to reduce)
        $(".cityName").empty();
        $(".cityDate").empty();
        $("#day0").html("");
        $("#day1").html("");
        $("#day2").html("");
        $("#day3").html("");
        $("#day4").html("");
        $("#day5").html("");

        var queryURLW = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid="+APIKey; //weather
        var queryURLF = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid="+APIKey; //forecast
        requests(queryURLW, queryURLF);
    }

    //loading any previous searches on document load
    function loadSaved(){   
        for(x=0; x<tracker; x++) { 
            var city = localStorage.getItem(x);
            buttonCreation(x, city);
        }
    }

    //function to set the Id of search buttons/check if theres saved searches/continue id naming from last saved
    function checkStorage(){ 
        if(tracker) {
            y = tracker;
        } 
        else {
            y = 0;
        }
    }

    //function to display the uv index
    function uvDisplay(response) {
        var uvIndex = $("<p>").text("UV index: ");
        var value = $("<p>").text(response[0].value);

        value.attr("class", "badge badge-danger");

        uvIndex.append(value);
        $("#day0").append(uvIndex);
    }

    //function to display the current weather
    function currentWeather(response) {
        //Displaying the city name and the current date in the title
        var city = $("<h1>").text(response.name);
        var date = $("<h1>").text(moment().format('MMMM Do YYYY'));
        var day = $("#day0");

        $(".cityName").append(city);
        $(".cityDate").append(date);

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
        i = timeRead(response);
        console.log(i);
        for(i = timeRead(response), e=1; i<40; i+8, e++) { //'e' starting at 1 as to skip the 'current' day and post the following ones to the forecast area

            var day = $("#day"+e);
            
            //Displaying the days and the conditions
            var dayName = $("<h4>").text(daySort(e));
            var temp = $("<p>").text("Temp: "+maxTemp(i, response));
            var weather = $("<p>").text("Weather: "+response.list[i].weather[0].main);
            var humidity = $("<p>").text("Humidity: "+averageHum(i, response)+"%");
            var weatherPic = $("<img>").attr("src", pictureSort(response.list[i].weather[0].main));
            dayName.attr("style", "color:black; text-align:center;");

            day.append(dayName);
            day.append(weatherPic);
            day.append(temp);
            day.append(humidity);
            day.append(weather);  

            i=i+8; //As the forecast is in 3 hour intervals, this skips from one day to the next
        }
    }

    //function allowing for time chnages to the 3hr blocks time stamp (updates)
    function timeRead(response) {
        var time = response.list[0]["dt_txt"];
        var hour = time.charAt(11)+time.charAt(12);
        return Math.floor(((24-parseInt(hour))/3));
    }

    //function to display the maximum temperature
    function maxTemp(i, response) {
        var maxT = [];
        for(x=0, z=i; x<8; z++, x++) {
            if(response.list[z]) { //checking if the location exists (last day only has one 3hr block)
                maxT.push(response.list[z].main.temp);
            }
        }
        return Math.max(...maxT);
    }

    //function to find the average humidity
    function averageHum(i, response) {
        var avgH = [];
        for(x=0, z=i; x<8; z++, x++) {
            if(response.list[z]) { //checking if the location exists (last day only has one 3hr block)
                avgH.push(response.list[z].main.humidity);
            }
        }
        var total = 0;
        for(x=0; x<avgH.length; x++){
            total+=avgH[x];
        }
        return Math.floor(total/avgH.length);
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
        else if(weather==="Windy") {
            return "assets/images/windy.png"
        }
        else if(weather==="Snow") {
            return "assets/images/snowy.png"
        }
        else {
            return "assets/images/cloudy.png"
        }
    }

    //function to create past search buttons
    function buttonCreation(y, city) {
        var button = $("<button>").val(city);
        button.text(city);
        button.addClass("btn btn-info");
        button.attr("id", y);
        button.attr("style", "margin-top:5px; width:100%;");
        $(".pastSearches").append(button);
    }

    //function to detect if ajax has passed and if so create buttons (checks if citeis are real)
    function ajaxPassed(city) {
        //Add condition to see if the city is real/if it is already on the list----------------------------------------
        var alreadyButtons = [];

        for(x=0; x<y; x++) {
            alreadyButtons.push($("#"+x).val());
        }
        
        if(!alreadyButtons.includes(city)) {
            buttonCreation(y, city);
            localStorage.setItem(y, city);   
            y=y+1;
            localStorage.setItem("tracker", y); //saving the position of y as to continue making new button id's from where it left off
        }
    }
    
    //function to set y and see if there is a saved value
    function findY() {
        if(localStorage.getItem("tracker")===null) {
            return 0; 
        }  
        else {
            return tracker;
        }
    }

    //listener event for the search button
    $("#searchBtn").on("click", function(){
        event.preventDefault();
        var city = $("#search").val().trim();
        
        if(city) {
            citySearch(city);
        }
    });

    //listener to decide which past search was clicked
    $(".pastSearches").on("click", function(event){
        event.preventDefault();
        var city = event.target.value;
        citySearch(city);
    });

    //listener to clear the past searches
    $(".clearButton").on("click", function(){
        if(confirm("This will delete all previous search history")) {
            localStorage.clear();
            location.reload();
        }
    });
});