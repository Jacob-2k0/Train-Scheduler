
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var newRow;


var config = {
    apiKey: "AIzaSyBPEzY6jHnshfp68eKhS_5Td382BVokEi0",
    authDomain: "fir-test-cfc4d.firebaseapp.com",
    databaseURL: "https://fir-test-cfc4d.firebaseio.com",
    projectId: "fir-test-cfc4d",
    storageBucket: "fir-test-cfc4d.appspot.com",
    messagingSenderId: "21394469148"
};
firebase.initializeApp(config);

var database = firebase.database();


$(window).ready( function() {
    
    var time = 60;
   
    setInterval( function() {
        
        time--;
        
        $('#time').html("Auto Refresh in: " + time + "s");
        
        if (time === 0) {
            
            location.reload()
        }    
        
        
    }, 1000 );
    
});


$("body").on("click", ".btn", function(event) {
    event.preventDefault();

    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#firstTrainTime").val().trim();
    frequency = $("#frequency").val().trim();

    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainName").val("");
    $("#frequency").val("");

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    })
});


database.ref().on("child_added", function(snapshot) {

    trainName = snapshot.val().trainName;
    destination = snapshot.val().destination;
    firstTrainTime = snapshot.val().firstTrainTime;
    frequency = snapshot.val().frequency;
  
    var firstTrainMoment = moment(firstTrainTime, 'HH:mm');
    var nowMoment = moment();
  
    var minutesSinceFirstArrival = nowMoment.diff(firstTrainMoment, 'minutes');
    var minutesSinceLastArrival = minutesSinceFirstArrival % frequency;
    var minutesAway = frequency - minutesSinceLastArrival;
  
    var nextArrival = nowMoment.add(minutesAway, 'minutes');
    var formatNextArrival = nextArrival.format("HH:mm");

    newRow = $("<tr>");
    newRow.append($("<td>" + trainName + "</td>"));
    newRow.append($("<td>" + destination + "</td>"));
    newRow.append($("<td>" + frequency + "</td>"));
    newRow.append($("<td>" + formatNextArrival + "</td>"));
    newRow.append($("<td>" + minutesAway + "</td>"));

    $(".table").append(newRow);

  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


