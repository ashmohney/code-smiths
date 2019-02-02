//Notes

// zomato API Key: b7fe6dfdae0278fcd0aea628958bc00a
// google maps search places API example: https://maps.googleapis.com/maps/api/place/findplacefromtext/output?parameters // key: AIzaSyCGN_z63cy7rfrb55lTeKd4UKG1CK6OYqA
// https://maps.googleapis.com/maps/api/place/findplacefromtext/output?parameters
// curl -X GET --header "Accept: application/json" --header "user-key: b7fe6dfdae0278fcd0aea628958bc00a" "https://developers.zomato.com/api/v2.1/search?entity_id=7509&entity_type=city&count=3&cuisines=italian




//Declare variables
foodArea = $("#foodArea");
searchButton = $("#searchButton");
movieArea = $("movieArea");
othersSearched = $("#othersSearched");
regEx = /.*?,.*/;  //[^@#$%^&*+=]/;
//Array of random words to search for to use with the random button
randomSearch = [];

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

database = firebase.database();
//Initialize materialize
M.AutoInit();

/////////Declare Functions

//Restaurant API grab

/// get city ID first, then put city ID in for restaurant search along with cuisine type
const fetchRestaurant = (query) => {
    let search = $("#location").val().toLowerCase().trim();
    let cityId;
    $.ajax({
        url: query,
        method: "GET",
        headers: {
            'user-key': "b7fe6dfdae0278fcd0aea628958bc00a", 
        }
    }).then(function(cities) {
        Object.keys(cities).forEach(function(elem) {
            cityName = elem.toLowerCase.trim();
            if (cityName == search) {
                cityId = cities.id;
            } else {
                M.toast({html: "Uh oh, looks like that didn't work, please check your city and try again.", classes: "red rounded", displayLength: 1000*5});
            };
        })
        $.ajax({
            url: "https://developers.zomato.com/api/v2.1/search?entity_id=" + cityId + "&entity_type=city&count=3&cuisines=" + encodeURI($("#foodType").val().toLowerCase()),
            method: "GET",
            heders: {
                'user-key': "b7fe6dfdae0278fcd0aea628958bc00a",
            }
        }).then(function(foodInfo) {
            Object.keys(foodInfo).forEach(function(elem) {
                let foodItem = $("<div>")
                foodItem.append("<h4>").text(elem.restaurants.restaurant.name);
                foodItem.append("<p>").text("Cuisines: " + elem.restaurants.restaurant.cuisines);
                foodItem.append("<p>").text("Address: " + elem.restaurants.restaurant.location.address);
                foodArea.append(foodItem);

            })
        })
    });
};

//Open Movie API grab
// const fetchMovie = (queryMovie) => {
//     $.ajax({
//         url: queryMovie,
//         method: "GET",
//     }).then(function(movieInfo) {
//         Object.keys(movieInfo).forEach(function(elemMovie) {
//             let movieItem = $("<div>");
//             movieItem.append("<img>").addattr("src", elemMovie."poster");
//             movieItem.append("<h4>").text(elemMovie."etc etc etc"); //title
//             movieItem.append("<p>").text("Rating: " + elemMovie."etc etc etc");  
//             movieArea.append(movieItem);
//         })
        
//     });
// };


//need a function for data validation
const validate = (input) => {
    //checks input via RegEx only allowing lowercase and capital letters
    if (input.match(regEx))  {
        return true //allows next program to run if using if statement
    } else {
        M.toast({html: "Hmmm, something went wrong...", classes: "red rounded", displayLength: 1000*5});
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
    if (validate($("#location").val())) {
        userInput = $("#location").val()
        let cityQuery = "https://developers.zomato.com/api/v2.1/cities?q=" + encodeURI(userInput) + "count=6";
        fetchRestaurant(cityQuery);
    };
});