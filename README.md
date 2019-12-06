# assignment6
A simple weather forecast that presents the user with the current weather and a five day forecast which is updated every 3 hours with the use of API's.

[![Landing Page](/assets/images/screenShots/landingPage.jpeg?raw=true "Landing Page") ]

The user is first asked for access to their location data and will be on any refresh, if accepted the landing page will link to the user's current city and add a button of that city to the previous search area, if denied it will load the last known search or the default of Adelaide if no previous searches have been made.

![Location](/assets/images/screenShots/location.jpeg?raw=true "Location") 

Upon clicking search the input will be checked; if the input is blank and if the city gives a valid ajax request response it dynamically creates a new button with the searched value on it. Clicking this newly formed button will trigger a search for that button's 'value'. The user can input the same city in the search area as many times as they like instead of clicking the button made for it but only one button will ever be created for that particular city.

![Dynamic Buttons](/assets/images/screenShots/dynamicButtons.jpeg?raw=true "Dynamic Buttons") 

Searches are saved to the local storage and on a refresh or new page load any previous searches will be displayed as buttons ready to be re-queried.

![Local Storage](/assets/images/screenShots/localStorage.jpeg?raw=true "Local Storage") 

# Built with

Bootstrap\
Jquery\
Moment.js\
OpenWeatherMap

# Authors 

Edward Coad

# Acknowledgements

bootstrap.com\
stackoverflow.com\
w3school.com\
momentjs.com\
openweathermap.org
