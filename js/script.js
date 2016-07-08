
window.onload = function(){
    defaultDate();
    enableBtn();
    geoFindLocation();
    initialize();
};

loadJson('project.json',"projectList");
loadJson('activityType.json',"activityList");


var prevDate;
var hoursBurned = 0;
var minsBurned = 0;
var total = 8;
var showEntry = [];
var geocoder;

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

// Function to display last seven dates in Date Select box if geolocation is successful

function success(pos){
      var latitude = pos.coords.latitude;
      var longitude = pos.coords.longitude;
      console.log("latitude ", latitude);
      console.log("longitude ", longitude);
      codeLatLng(lat, lng);
      var today;
      var dateArray = [];
    
      for (i=0 ; i<8 ; i++) {
        today = new Date();
        day = today.getDate();
        var olderDate = new Date(today.setDate(day - i)); //Setting Dates
        if(!(latitude == 8.5499495)&&(longitude == 76.87785)) {
            dateArray.push( ('0' + olderDate.getDate()).slice(-2) + '/' + ('0' + (olderDate.getMonth()+1)).slice(-2) + '/' + olderDate.getFullYear());
        }
        else {
          dateArray.push(('0' + (olderDate.getMonth()+1)).slice(-2) + '/' + ('0' + olderDate.getDate()).slice(-2) + '/' +  olderDate.getFullYear());
        }
        date = dateArray[i];
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

  function error(err) {
      console.warn('ERROR (' + err.code + '):' + err.message);
  }

//Function to find user location

function geoFindLocation() {
  navigator.geolocation.getCurrentPosition(success, error);
}

function initialize() {
    geocoder = new google.maps.Geocoder();
}

  function codeLatLng(lat, lng) {

    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      //console.log(results);
        if (results[1]) {
        var indice=0;
        for (var j=0; j<results.length; j++)
        {
            if (results[j].types[0]=='locality')
                {
                    indice=j;
                    break;
                }
            }
        alert('The good number is: '+j);
        console.log(results[j]);
        for (var i=0; i<results[j].address_components.length; i++)
            {
                if (results[j].address_components[i].types[0] == "locality") {
                        //this is the object you are looking for
                        city = results[j].address_components[i];
                    }
                if (results[j].address_components[i].types[0] == "administrative_area_level_1") {
                        //this is the object you are looking for
                        region = results[j].address_components[i];
                    }
                if (results[j].address_components[i].types[0] == "country") {
                        //this is the object you are looking for
                        country = results[j].address_components[i];
                    }
            }

            //city data
            alert(city.long_name + " || " + region.long_name + " || " + country.short_name)


            } else {
              alert("No results found");
            }
        //}
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }

document.getElementById("submitBtn").addEventListener("click", function(event){
    event.preventDefault();
    submitStatusForm();
});

document.getElementById("message").addEventListener("keyup", function(){
    var description = document.getElementById('message');
    var counterID = document.getElementById('counter');
    var maxLimit = 20;
    textCounter(description, counterID, maxLimit);
    enableBtn();
});

//Function to enable/disable SAVE btn

function enableBtn() {
    if(document.getElementById("message").value != '') {
      document.getElementById("submitBtn").disabled = false;
    }
    else {
      document.getElementById("submitBtn").disabled = true;
    }
}

//Function for validation

function validateFields() {
  if(document.getElementById("message").value == ""){
    var elErrorMsg = document.getElementById("errorMsg");
    elErrorMsg.style.display = "block";
    return false;
  }
  return true;
}

// Function to calculate remaining characters 

function textCounter(elDescription, elCounter, elMaxLimit) {
  var elDescriptionValLength = elDescription.value.replace(/\s/g, '').length;
  var spaces = elDescription.value.split(' ').length - 1;
    if(elDescriptionValLength > elMaxLimit ){
      elDescription.value = elDescription.value.substr(0, elMaxLimit + spaces);
    }
    else {
        elCounter.value = elMaxLimit - elDescriptionValLength;
    }
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
            
        // var maxLimit = 10;

        var date = dateList.options[dateList.selectedIndex].text,
            dateVal = dateList.options[dateList.selectedIndex].value,
            project = projectList.options[projectList.selectedIndex].value,
            activity = activityList.options[activityList.selectedIndex].value,
            timeHrs = hrs.options[hrs.selectedIndex].text,
            timeHrsVal = hrs.options[hrs.selectedIndex].value,
            timeMinutes = mins.options[mins.selectedIndex].text,
            timeMinutesVal = mins.options[mins.selectedIndex].value,
            description = msg.value;

        // textCounter(description, counter, maxLimit);
        
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
        document.getElementById('counter').value = 20;
        enableBtn();
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