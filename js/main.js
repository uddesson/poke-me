//Fetch elements from the DOM
var optionImages = document.getElementsByTagName('img');

//Make every image the 
for (var i = 0; i < optionImages.length; i++){
    optionImages[i].addEventListener('click', savePickedOption);
}

function savePickedOption(){
    //Outputs id of that option, for ex. picked favourite shape could read "fish"
    console.log(this.parentElement.parentElement.id) 

    /* Should work for all of the questions, 
    not just for a specific one */
}

/* Store users picked options in an object (?), 
that would in the end look something like this */
const usersPokemonAttributes = {
    color: red, 
    shape: tentacles,
    habitat: sea
} 

/*  IDEA NOTES:

    Every time the user pickes an option - send them in as values to fetch()
    and fetch corresponding data from pokeapi. For ex. user picks "red" 
    as their favourite color. A list of pokemon with that attribute is fetched
    from api/v2/pokemon-species/color/red, which gives us the names of those pokemon
    
    We store them as a list of names. 

    When the user has picked all of their options, we'll have three(!) lists of pokemon
    names whose attributes fit the "picked option". 
    
    Then I can loop through these lists and find the first pokemon (name) that exists
    in all three lists. That would be the result.

    I could then fetch some more data on that pokemon from  api/v2/pokemon-species/name
    for e.x they all have a short description (string) in english

    Also .. somehow save the fetched data, maybe in sessionStorage, to avoid 
    maybe having to download that same "pokemon" again 

*/