//Notes

// zomato API Key: b7fe6dfdae0278fcd0aea628958bc00a
// google maps search places API example: https://maps.googleapis.com/maps/api/place/findplacefromtext/output?parameters // key: AIzaSyCGN_z63cy7rfrb55lTeKd4UKG1CK6OYqA
// https://maps.googleapis.com/maps/api/place/findplacefromtext/output?parameters



//Declare Firebase
var config = {
    apiKey: "AIzaSyDQ9TbJ1PsU3IWxpx7P18t13RkhWXdRffA",
    authDomain: "anightout-1548896687179.firebaseapp.com",
    databaseURL: "https://anightout-1548896687179.firebaseio.com",
    projectId: "anightout-1548896687179",
    storageBucket: "anightout-1548896687179.appspot.com",
    messagingSenderId: "912754439954"
  };
  firebase.initializeApp(config);
//Declare variables
foodArea = $("#foodArea");
searchButton = $("#searchButton");
movieArea = $("movieArea");
othersSearched = $("#othersSearched");
database = firebase.database();

//array of random words to search for to use with the random button
randomSearch = [];

/////////Declare Functions

//Restaurant API grab
const fetchRestaurant = (query) => {
    $.ajax({
        url: query,
        method: "GET",
    }).then(function(foodInfo) {
        foodArea.text(foodInfo."Whatever we need");
    });
};

//Open Movie API grab
const fetchMovie = (queryMovie) => {
    $.ajax({
        url: queryMovie,
        method: "GET",
    }).then(function(movieInfo) {
        movieArea.text(movieInfo."Whatever movie stuff")
    });
};


//need a function for data validation
const validate = (input) => {
    //checks input via RegEx only allowing lowercase and capital letters
    if (input == /[a-zA-Z][^0-9][^$%&.|*+=?/]/)  {
        return true //allows next program to run if using if statement
    } else {
        alert("Nice try hacker!")
        return false
    }
};

//Push/Pull from database for others searched for area

const updateSearchHistory = (search) => {
    database.ref("/searchHistory").push(search);
    database.ref("/searchHistory").on("value", function(snapshot) {
        info = snapshot.val();
        othersSearched.empty();
        Object.keys(info).forEach(function(elem) {
           searchItem = $("<p>");
           searchItem.text(elem);
            othersSearched.append(searchItem); //will just create a list of each item, need to sort based on occurrences
        });  
    })
};

//////////Run functions

//button event that grabs user input
//populate areas with information frim API's
searchButton.click(function(event) {
    //checks only runs if user input is valid
    if (validate($("#searchArea").val())) {
        userInput = $("#searchArea").val()
        queryURL = "super cool URL" + userInput + "more of the super cool URL" ; //need for movie and restaurant super cool URLs
        fetchRestaurant(queryURL);
        fetchMovie(queryMovie);
    };

})
// 