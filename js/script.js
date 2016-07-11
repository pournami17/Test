
window.onload = function(){
    defaultDate();
};

loadJson('project.json',"projectList");
loadJson('activityType.json',"activityList");

var prevDate;
var hoursBurned = 0;
var minsBurned = 0;
var total = 8;
var showEntry = [];

//Function to load multiple JSON

function loadJson(url,selectId) {
    var xmlhttpResp = new XMLHttpRequest();
    xmlhttpResp.overrideMimeType("application/json");
    xmlhttpResp.open('GET', url, true);
    xmlhttpResp.onreadystatechange = function () {
              if (xmlhttpResp.readyState == 4 && xmlhttpResp.status == "200") {
              loadSelect(JSON.parse(xmlhttpResp.responseText),selectId);
              }
        };
    xmlhttpResp.send(null);
}

// Function  to populate Select Boxes using JSON

function loadSelect(populateList,divID){
  
    if(divID == "activityList"){
        for (i in populateList) {
          var opt = document.createElement("option");
          opt.text = populateList[i].activityTypeName;
          opt.value = populateList[i].activityTypeName;
          var select =document.getElementById("activityList");
          select.appendChild(opt);
        }
    }

    if(divID == "projectList"){
        for (i in populateList) {
          var opt = document.createElement("option");
          opt.text = populateList[i].projectName;
          opt.value = populateList[i].projectName;
          var select =document.getElementById("projectList");
          select.appendChild(opt);
        }
    }  
  
}

// Function to display last seven dates in Date Select box

function defaultDate(){

    var today;
    var dateArray = [];
    var dateOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    };

    for (i=0 ; i<8 ; i++) {
        today = new Date();
        day = today.getDate();
        var olderDate = new Date(today.setDate(day - i)); //Setting Dates
        
            dateArray.push(olderDate.toLocaleDateString("en-US", dateOptions));
        
      
    }
    for (j=7 ; j >=0; j--) {
        var opt = document.createElement("option");
        opt.text = dateArray[j];
        opt.value = j;
        var select =document.getElementById("dateList");
        select.appendChild(opt);
    }
    select.selectedIndex = 7;
}

document.getElementById("submitBtn").addEventListener("click", function(event){
    event.preventDefault();
    submitStatusForm();
});

//Function for validation

function validateFields() {
  if(document.getElementById("message").value == ""){
    var elErrorMsg = document.getElementById("errorMsg");
    elErrorMsg.style.display = "block";
    return false;
  }
  return true;
}

//Function to submit form

function submitStatusForm() {
    if (validateFields()) {
        document.getElementById("errorMsg").style.display = "none";

        var dateList = document.getElementById('dateList'),
            projectList= document.getElementById('projectList'),
            activityList = document.getElementById('activityList'),
            hrs = document.getElementById('hours'),
            mins = document.getElementById('minutes'),
            msg = document.getElementById('message');


        var date = dateList.options[dateList.selectedIndex].text,
            dateVal = dateList.options[dateList.selectedIndex].value,
            project = projectList.options[projectList.selectedIndex].value,
            activity = activityList.options[activityList.selectedIndex].value,
            timeHrs = hrs.options[hrs.selectedIndex].text,
            timeHrsVal = hrs.options[hrs.selectedIndex].value,
            timeMinutes = mins.options[mins.selectedIndex].text,
            timeMinutesVal = mins.options[mins.selectedIndex].value
            description = msg.value;
        
        showEntry.push({date, project, activity, timeHrs, timeMinutes, description});

        console.log(showEntry);

        prevDate = date;

        calTime(dateList, date, dateVal, timeHrs, timeHrsVal, hrs, mins, timeMinutes, timeMinutesVal) ;
      
        var setContent = '';
        for ( var j=0; j<showEntry.length; j++){
          setContent += "<div class='displayList'><div class='listDateCnt'><span class = 'listDate' id = 'listDate'>"+showEntry[j].date+"</span>"
                  +"</div><div class= 'listDescriptionCnt'> <span class= 'listDescription' id = 'listDescription'>"+showEntry[j].description+"</span></div>"
          +"<div class= 'listTimeCnt'><p><span class= 'listTime' id ='listTime'>"+showEntry[j].timeHrs+"</span><span class= 'listTime' id ='listTime'>"+":"+showEntry[j].timeMinutes+"</span>"
          +"</p><p>"+showEntry[j].activity+"</p><p>"+showEntry[j].project+"</p></div></div>";
          
        }
        document.getElementById('displayLog').innerHTML = setContent;
        clearText();
    }
    
}

//Function to clear text

function clearText() {
    document.getElementById("message").value = "";
}

//Function to calculate time
 
function calTime(elDateList, elDate, elDateVal, elTimeHrs, elTimeHrsVal, elHrs, elMins, elTimeMinutes, elTimeMinutesVal){
    console.log("Date: "+elDate);
    console.log("Value of Date:" +elDateVal);
    console.log("Time:" +elTimeHrs);

    
    console.log("Prev Date: " + prevDate);

    //condition to check mins
    if(elTimeMinutes == 15){
      elMins.selectedIndex = 3;
      setTime(elTimeHrs, elDateList, elHrs, elMins, elTimeHrsVal, elTimeMinutesVal, elTimeMinutes);
      
    }
    else if(elTimeMinutes == 30){
      elMins.selectedIndex = 2;
      setTime(elTimeHrs, elDateList, elHrs, elMins, elTimeHrsVal, elTimeMinutesVal, elTimeMinutes);
      
    }
    else if(elTimeMinutes == 45){
      elMins.selectedIndex = 1;
      setTime(elTimeHrs, elDateList, elHrs, elMins, elTimeHrsVal, elTimeMinutesVal, elTimeMinutes);
      
    }
    else {
      elMins.selectedIndex = 0;
      setTime(elTimeHrs, elDateList, elHrs, elMins, elTimeHrsVal, elTimeMinutesVal, elTimeMinutes);
      
    }
}

//Function to calculate hours

function setTime(elTimeHrs, elDateList, elHrs, elMins, elTimeHrsVal, elTimeMinutesVal , elTimeMinutes) {
   

    if(elTimeHrs<8) {

      console.log("Time less than 8 hrs");
      if ((elTimeMinutes == 15) ||(elTimeMinutes == 30) || (elTimeMinutes == 45)) {
        total = total - (elHrs.selectedIndex + 1);
        
        console.log(minsBurned);
        elHrs.selectedIndex = total;
          if(total == -1){
            elHrs.selectedIndex = 8;
            elMins.selectedIndex = 0;
            total = 8;
            if(elDateList.selectedIndex != 7){
              elDateList.selectedIndex = elDateList.selectedIndex + 1;
            }
          }
       }
      else {
          total = total - elHrs.selectedIndex;
          elHrs.selectedIndex = total;
          if(total == 0){
            elHrs.selectedIndex = 8;
            total = 8;
            if(elDateList.selectedIndex != 7){
              elDateList.selectedIndex = elDateList.selectedIndex + 1;
            }
          }
       }
    }
    else {
      console.log("time greater than 8 hrs");
      elHrs.selectedIndex = 8;
      elTimeMinutes.selectedIndex = 0;
      
      if(elDateList.selectedIndex != 7){
        elDateList.selectedIndex = elDateList.selectedIndex + 1;
      }
      else{
        console.log("Date index: " + elDateList.selectedIndex);
        elHrs.selectedIndex = 0;
      }
      console.log("time index: " + elMins.selectedIndex);
    }
}