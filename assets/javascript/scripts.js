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
//Declare variables
foodArea = $("#foodArea");
searchButton = $("#searchButton");
movieArea = $("#movieArea");
othersSearched = $("#othersSearched");
database = firebase.database();
// regEx = /^[0-9]{5}(?:-[0-9]{4})?$/

database = firebase.database();
//Initialize materialize
M.AutoInit();

/////////Declare Functions


function reverseObject(object) {
    var newObject = {};
    var keys = [];

    for (var key in object) {
        keys.push(key);
    }

    for (var i = keys.length - 1; i >= 0; i--) {
      var value = object[keys[i]];
      newObject[keys[i]]= value;
    }       

    return newObject;
  };

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
        console.log(cities, search);
        cities.location_suggestions.forEach(function(elem) {
            console.log(elem, typeof elem);
            cityName = elem.name.toLowerCase().trim();
            if (cityName.match(search)) {
                console.log("matched!")
                cityId = elem.id;
            } else {
                // M.toast({html: "Uh oh, looks like that didn't work, please check your city and try again.", classes: "red rounded", displayLength: 1000*5});
            };
        })
        $.ajax({
            url: "https://developers.zomato.com/api/v2.1/search?entity_id=" + cityId + "&entity_type=city&count=3&cuisines=chinese", //encodeURI($("#foodType").val().toLowerCase()), commenting out for testing only
            method: "GET",
            headers: {
                'user-key': "b7fe6dfdae0278fcd0aea628958bc00a",
            }
        }).then(function(foodInfo) {
            foodArea.empty();
            // M.toast({html: "Holy crap it worked and now we just need t"})
            foodInfo.restaurants.forEach(function(elem) {
                let foodItem = $("<div>");
                let foodPic = $("<img>").attr("src", elem.restaurant.photos_url);
                let foodName = $("<h4>").text(elem.restaurant.name);
                let foodType = $("<p>").text("Cuisines: " + elem.restaurant.cuisines);
                let foodAddress = $("<p>").text("Address: " + elem.restaurant.location.address);
                let foodMenu = $("<a>").attr("src", elem.restaurant.menu_url);
                foodItem.append(foodPic, foodName, foodType, foodMenu, foodAddress);
                foodArea.append(foodItem);

            })
        })
    });
};

// 0: {id: 28, name: "Action"}
// 1: {id: 12, name: "Adventure"}
// 2: {id: 16, name: "Animation"}
// 3: {id: 35, name: "Comedy"}
// 4: {id: 80, name: "Crime"}
// 5: {id: 99, name: "Documentary"}
// 6: {id: 18, name: "Drama"}
// 7: {id: 10751, name: "Family"}
// 8: {id: 14, name: "Fantasy"}
// 9: {id: 36, name: "History"}
// 10: {id: 27, name: "Horror"}
// 11: {id: 10402, name: "Music"}
// 12: {id: 9648, name: "Mystery"}
// 13: {id: 10749, name: "Romance"}
// 14: {id: 878, name: "Science Fiction"}
// 15: {id: 10770, name: "TV Movie"}
// 16: {id: 53, name: "Thriller"}
// 17: {id: 10752, name: "War"}
// 18: {id: 37, name: "Western"}


//Open Movie API grab
const fetchMovie = (queryMovie) => {
    let movieAccessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkODQyMmI3NWMwZjA3MDZhMWU4MWQ3Y2U0NmY1ZmFlYiIsInN1YiI6IjVjNTVkZGNjOTI1MTQxMGUxZDRlMjk5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eRGYq9bPnbUtdjchP3MacCSTppqtX4wHHkjF3E-Hzb8";
    let movieURL = "https://api.themoviedb.org/3/discover/movie?with_genres=";
    let movieKey = "&api_key=d8422b75c0f0706a1e81d7ce46f5faeb&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1";
    let movieGenre = "";
    let posterURL = "https://image.tmdb.org/t/p/w500";
    $.ajax({
        url: movieURL + movieGenre + movieKey,
        method: "GET",
    }).then(function(movieInfo) {
        console.log(movieInfo);
        movieArea.empty();

        if (movieInfo.results[0].genre_ids[0] == "#movie-choice") {
        
        console.log(movieInfo.results[0].genre_ids[0]);

        
        let movieItem = $("<div>");
        let moviePoster = $("<img>").addClass("responsive-img").attr("src", posterURL + movieInfo.results[0].poster_path);
        let movieTitle = $("<h5>").text(movieInfo.results[0].title).addClass("center-align");
        let movieSummary = $("<p>").text(movieInfo.results[0].overview);

        movieItem.append(moviePoster);
        movieItem.append(movieTitle);
        movieItem.append(movieSummary);

        movieArea.prepend(movieItem);

        } else {
            movieInfo.results.forEach((results, index) => {
                console.log(results);
                
            });
    };
    });
};



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

// const updateSearchHistory = (search) => {
//     database.ref("/searchHistory").push(
//         {
//             searchText: search,
//             timeStamp: firebase.database.ServerValue.TIMESTAMP,
//         });
//     database.ref("/searchHistory").orderByChild("timeStamp").once("value", function(snapshot) {
//         info = snapshot.val();
//         console.log(info);
//         console.log(reverseObject(info));
        // for (let key in info) {
        //     descendingTime.push(key.timeStamp);
        // };
        
        // othersSearched.empty();

        // Object.keys(info).forEach(function(elem) {
        //     searchItem = $("<p>");
        //     searchItem.text(elem);
        //     othersSearched.append(searchItem); //will just create a list of each item, need to sort based on occurrences
        //     searchList ++
        //     if (searchList == 5) {
        //         break;
        //     }
        //     });  
//     });
// };

//////////Run functions

//button event that grabs user input
//populate areas with information frim API's
searchButton.click(function(event) {
    //checks only runs if user input is valid
    if (validate($("#location").val())) {
        userInput = $("#location").val();
        let cityQuery = "https://developers.zomato.com/api/v2.1/cities?q=" + encodeURI(userInput) + "count=6";
        fetchRestaurant(cityQuery);
        fetchMovie();
        
    };
    updateSearchHistory($("#location").val());
});