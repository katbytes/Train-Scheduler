// Initialize Firebase
var config = {
    apiKey: "AIzaSyB9uNdcSC2_rrG6_Kew9S9fkcC5vEtkuME",
    authDomain: "train-scheduler-112718.firebaseapp.com",
    databaseURL: "https://train-scheduler-112718.firebaseio.com",
    projectId: "train-scheduler-112718",
    storageBucket: "train-scheduler-112718.appspot.com",
    messagingSenderId: "687756119390"
};

firebase.initializeApp(config);
var database = firebase.database();

// Button for adding train
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destName = $("#destination-input").val().trim();
    var trainStart = $("#start-input").val().trim();
    var freqTime = $("#freq-input").val().trim();

    // Creates local "temporary" object for holding data
    var newTrain = {
        name: trainName,
        role: destName,
        start: trainStart,
        rate: freqTime
    };

    // Uploads train time data to db
    database.ref().push(newTrain);

    // Logs everything to console
    // console.log(newTrain.name);
    // console.log(newTrain.role);
    // console.log(newTrain.start);
    // console.log(newTrain.rate);

    // alert("Train successfully added");
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#freq-input").val("");
});

// Create Firebase event for adding train to the db and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destName = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var freqTime = childSnapshot.val().freq;

    // alert("TrainTime before format: "+trainStart);

    var trainFirstConverted = moment(trainStart, "hh:mm").subtract(1, "years");
    var currentTime = moment();

    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    var tFrequency = freqTime;
    console.log(tFrequency);

    // Difference between the times
    var diffTime = moment().diff(moment(trainFirstConverted), "minutes");
    //console.log("DIFFERENCE IN TIME: " + diffTime);

    // Remainder
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minutes until train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // Train Info
    console.log(trainName);
    console.log(destName);
    console.log(trainStart);
    console.log(freqTime);

    var momenttrainStart = moment(trainStart);
    var today = moment(new Date());
    var trainMonths = today.diff(momenttrainStart, 'months');

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destName),
        $("<td>").text(trainStart),
        $("<td>").text(trainMonths),
        $("<td>").text(freqTime),
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});

