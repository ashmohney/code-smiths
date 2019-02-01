// zomato API Key: b7fe6dfdae0278fcd0aea628958bc00a
// google maps search places API example: https://maps.googleapis.com/maps/api/place/findplacefromtext/output?parameters // key: AIzaSyCGN_z63cy7rfrb55lTeKd4UKG1CK6OYqA
// https://maps.googleapis.com/maps/api/place/findplacefromtext/output?parameters

//declare variables
foodArea = $("#foodArea");
//array of random words to search for to use with the random button


//Restaurant API grab
const fetchRestaurant = (query) => {
    $.ajax({
        url: query,
        method: "GET",
    }).then(function(foodInfo) {
        foodArea.text(foodInfo."Whatever we need");
    });
};


//need a function for data validation
const validate = (input) => {
    
}
//button event that grabs user input
//populate areas with information frim API's
$("#searchButton").click(function(event) {
    userInput = validate($("#searchArea").val())
    queryURL = "super cool URL" + userInput + "more of the super cool URL" ;
    fetchRestaurant(queryURL);

})
// 