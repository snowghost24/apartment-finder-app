var properties = require("../data/properties");
//var userData = require("./../server")
// exportes outs and requires app
//console.log("This is line 4", userData);
module.exports = function(app, userData) {
  console.log(userData);
  app.get("/api/properties", function(req, res) {
   console.log(userData);
    res.json(properties);
  });

  app.post("/api/properties", function(req, res) {
   console.log(userData);
    var bestMatch = {
      name: "",
      photo: "",
      propertyDifference: Infinity
    };

    // Here we take the result of the user"s 
    var userData = req.body;
    var userScores = userData.scores;
    

    // This variable will calculate the difference between the user"s scores and the scores of
    // each user in the database
    var totalDifference;

    // Here we loop through all the friend possibilities in the database.
    for (var i = 0; i < properties.length; i++) {
      var currentProperty = properties[i];
      totalDifference = 0;

      console.log(currentProperty.name);

      // We then loop through all the scores of each friend
      for (var j = 0; j < currentProperty.scores.length; j++) {
        var currentPropertyScore = currentProperty.scores[j];
        var currentUserScore = userScores[j];

        // We calculate the difference between the scores and sum them into the totalDifference
        totalDifference += Math.abs(parseInt(currentUserScore) - parseInt(currentPropertyScore));
      }

      // If the sum of differences is less then the differences of the current "best match"
      if (totalDifference <= bestMatch.propertyDifference) {
        // Reset the bestMatch to be the new friend.
        bestMatch.name = currentProperty.name;
        bestMatch.photo = currentProperty.photo;
        bestMatch.propertyDifference = totalDifference;
      }
    }

    // Finally save the user's data to the database (this has to happen AFTER the check. otherwise,
    // the database will always return that the user is the user's best friend).
    properties.push(userData);

    // Return a JSON with the user's bestMatch. This will be used by the HTML in the next page
    res.json(bestMatch);
  });
};