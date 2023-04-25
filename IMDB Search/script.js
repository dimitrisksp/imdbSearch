let typingTimer;                //timer identifier
const doneTypingInterval = 1000;  //set wait time until search starts to 5 seconds
const endpoint = 'http://www.omdbapi.com/?';  //api endpoint
const apikey = '532c2fb6';    //api key

$(document).ready(function(){
    //on keyup, start the countdown
    $('#input_text').keyup(function(){
        clearTimeout(typingTimer);
        if ($('#input_text').val()) {
            typingTimer = setTimeout(doneTyping, doneTypingInterval);
        }
    });
	

    //user is finished typing
    function doneTyping () {
        console.log($("#input_text").val());

        let title = $("#input_text").val();         //Takes the value of the user's input (title)
        let urlEncodedTitle = encodeURI(title);     //Url encode the user's input (title)

        url = endpoint+'s='+urlEncodedTitle+'&apikey='+apikey;      //Build the url
        console.log(url);
        $.getJSON(url, function(data) {     //Make a call to the api with the url. data is the api json response
            let d = data['Search'];             //Take the Search field of the json response. This field contains the movie objects
            $("p").empty();                 //Clear the previous search metadatas
			$("p").css({"background-color": "white", "padding": "10px", "margin-left": "auto", "margin-right": "auto", "border": "3px solid gray", "border-radius": "10px", "box-shadow": "0 0 20px #888888"});
            for(let i = 0; i < d.length; i++) {     //For each movie object
                let obj1n = d[i];                    
                let id = obj1n['imdbID'];            //Take the id of the movie object
                try{throw obj1n}        //Because $getJSON is asynchronous and javascript is single-threaded, obj1 takes everytime the last value of 'for' (10). To solve this problem we take advantage of the fact that the CATCH block of the try/catch syntax has its own scope.
                catch(obj1){            //So, we throw obj1n, catch it in the catch block, and use the variable we caught in our callback function.
                    let url2 = endpoint+'i='+id+'&apikey='+apikey;
                    $.getJSON(url2, function(obj2) {                     //Make a new api call based on the id of the object
                        console.log(obj1.Title);
                        //text contains all the metadata that are provided for this object
                        let text = `<h1> ${obj1.Title}</h1>`;
						let other = `<br><b>Year: </b>${obj1.Year}<br>
                                <b>ID:</b> ${obj1.imdbID}<br>
                                <b>Plot:</b> ${obj2.Plot}<br>
                                <b>imdbID:</b> ${obj2.imdbID}<br>
                                <b>Type:</b> ${obj2.Type}<br>`;
						
                        let image = `<img src = "${obj1.Poster}" alt = "Movie Poster"><br>`;
                        $("img").css({"border-radius": "2px", "position": "relative"});

                        let d2 = obj2['Ratings'];       
                        let ratings = '';
                        for(let j=0; j < d2.length; j++){       //For each rating object
                            obj12 = d2[j];
                            ratings = ratings + `<div class=ratings>${obj12.Source}: ${obj12.Value}<div>`   //Add the rating object to the ratings that is going to be add to the html output
                        } 
                        ratings = "<br>" + "<b>Ratings:</b> " +"<br>"+ ratings + "<br>";
                        
                        let more = `<div id=${obj1.imdbID} class=more>More >></div>`;  //Add a div element for More with id=imdbID and class=more

                        let full = `<div id=${obj1.imdbID} class=full></div>`;  //Add a div element where the full plot will be placed if user press 'More'
						
                        $("p").append(text, image, other, ratings, full, more, "<br><br><br>");   //Add the metadata fields to the html output
                    });
                }
            }
        });
    }

    $('.content').on('click', '.more', function(){   //When a 'More' is clicked
        let idL = $(this).attr('id');                   //Take the imdbID of the movie from the corresponding More button
        let urlMore = endpoint+'i='+idL+'&plot=full&apikey='+apikey;    //Build the url
        $.getJSON(urlMore, function(obj3) {                     //Make a new api call based on the id of the object to get the full plot
            plot = "<b>Full Plot:</b> " + obj3.Plot;
            imdbRating = "<b>imdbRating:</b> " + obj3.imdbRating;
            imdbVotes = "<b>imdbVotes:</b> " + obj3.imdbVotes;
            production = "<b>Production:</b> " + obj3.Production;
            let text = '';
            //Checks if the metadata fields is in the json file. If a json contains a field then add its value to the text
            if(obj3.hasOwnProperty('BoxOffice')){
                text = text + `<b>BoxOffice:</b> ${obj3.BoxOffice}<br>`
            }
            if(obj3.hasOwnProperty('Rated')){
                text = text + `<b>Rated:</b> ${obj3.Rated}<br>`
            }
            if(obj3.hasOwnProperty('Runtime')){
                text = text + `<b>Runtime:</b> ${obj3.Runtime}<br>`
            }
            if(obj3.hasOwnProperty('Genre')){
                text = text + `<b>Genre:</b> ${obj3.Genre}<br>`
            }
            if(obj3.hasOwnProperty('Director')){
                text = text + `<b>Director:</b> ${obj3.Director}<br>`
            }
            if(obj3.hasOwnProperty('Actors')){
                text = text + `<b>Actors:</b> ${obj3.Actors}<br>`
            }
            if(obj3.hasOwnProperty('Language')){
                text = text + `<b>Language:</b> ${obj3.Language}<br>`
            }
            if(obj3.hasOwnProperty('Country')){
                text = text + `<b>Country:</b> ${obj3.Country}<br>`
            }
            if(obj3.hasOwnProperty('Awards')){
                text = text + `<b>Awards:</b> ${obj3.Awards}<br>`
            }
            if(obj3.hasOwnProperty('Metascore')){
                text = text + `<b>Metascore:</b> ${obj3.Metascore}<br>`
            }
            if(obj3.hasOwnProperty('DVD')){
                text = text + `<b>DVD:</b> ${obj3.DVD}<br>`
            }
            if(obj3.hasOwnProperty('Website')){
                text = text + `<b>Website:</b> ${obj3.Website}<br>`
            }
            if(obj3.hasOwnProperty('Writer')){
                text = text + `<b>Writer:</b> ${obj3.Writer}<br>`
            }
            $('#'+idL+'.full').append(plot);   //Add the full plot to the div element of this movie
            $('#'+idL+'.full').append("<br>", imdbRating, "<br>", imdbVotes, "<br>", production, "<br>", text);
            $('#'+idL+'.more').hide();      //Hide the 'More' button
        });  
    });

});

