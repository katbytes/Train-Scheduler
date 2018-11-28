// Initialize Firebase
var config = {
    apiKey: "AIzaSyB9uNdcSC2_rrG6_Kew9S9fkcC5vEtkuME",
    authDomain: "train-scheduler-112718.firebaseapp.com",
    databaseURL: "https://train-scheduler-112718.firebaseio.com",
    // projectId: "train-scheduler-112718",
    storageBucket: "train-scheduler-112718.appspot.com",
    // messagingSenderId: "687756119390"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function (e) {
    e.preventDefault();

    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainTime = $("#first-train-time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    if (trainName !== "" && destination !== "" && firstTrainTime !== "" && frequency !== "") {

        var newEntry = {
            "train-name": trainName,
            destination: destination,
            "first-train-time": firstTrainTime,
            frequency: frequency
        };

        database.ref("/info").push(newEntry);

        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-time-input").val("");
        $("#frequency-input").val("");
    };
});

database.ref("/info").on("child_added", function (childsnapshot) {
    // console.log(childsnapshot.val());

    var tFrequency = childsnapshot.val().frequency;
    var firstTrainTimeConverter = moment(childsnapshot.val()["first-train-time"], "HHmm");
    var militaryTime = firstTrainTimeConverter.format("HH:mm A");
    // console.log(militaryTime);

    var diffTime = moment().diff(firstTrainTimeConverter, "minutes");
    // console.log(diffTime);
    var tRemainder = diffTime % tFrequency;
    // console.log(tRemainder);
    var tMinutesTillTrain = tFrequency - tRemainder;
    // console.log(tMinutesTillTrain);
    var nextTrainMins = moment().add(tMinutesTillTrain, "minutes")
    var nextArrival = moment(nextTrainMins).format("HH:mm A");
    // console.log(nextTrain);

    var newEntryObj = {
        trainName: childsnapshot.val()["train-name"],
        destination: childsnapshot.val().destination,
        frequency: childsnapshot.val().frequency,
        nextArrival: nextArrival,
        minsAway: tMinutesTillTrain
    };

    // var newEntryObjString = JSON.stringify(newEntryObj);
    // console.log(newEntryObj);
    // console.log(newEntryObjString);

    var tr = $("<tr>");
    tr.addClass(childsnapshot.key);
    tr.append(
        $("<td>").text(newEntryObj.trainName).addClass("name"),
        $("<td>").text(newEntryObj.destination).addClass("destination"),
        $("<td>").text(newEntryObj.frequency).addClass("frequency"),
        $("<td>").text(newEntryObj.nextArrival).addClass("time"),
        $("<td>").text(newEntryObj.minsAway).addClass("minsAway"),
    );
    $("#train-table").append(tr);
});
