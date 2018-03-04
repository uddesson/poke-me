//Fetch elements from the DOM
var attributeImages = document.getElementsByTagName('img');

//Clicking an image will "save" it's attribute and send it along to the fetch-function
for (var i = 0; i < attributeImages.length; i++){
    attributeImages[i].addEventListener('click', setAndFetchPickedAttribute);
}

//As the user picks their attributes, the values will be set
const usersPokemonAttributes = {
    shape: '',
    color: '',
    habitat: ''
}

function savePickedAttribute(){
    //Outputs id of that attribute, for ex. picked favourite shape could read "fish"
    let pickedAttribute = this.parentElement.parentElement.id;
    let attributeCategory = this.parentElement.parentElement.parentElement.id;
    let url = ` http://pokeapi.salestock.net/api/v2/${attributeCategory}/${pickedAttribute}/`;
    
    switch(attributeCategory){
        case "pokemon-shape":
            usersPokemonAttributes.shape = pickedAttribute;
            //Use url to fetch pokemon with selected shape from api
            var shapeUrl = APIurl; 
            break;

        case "pokemon-color":
            usersPokemonAttributes.color = pickedAttribute;
            var colorUrl = APIurl; 
            break;

        case "pokemon-habitat":
            usersPokemonAttributes.habitat = pickedAttribute;
            var habitatUrl = APIurl; 
            break;

        default: 
            console.log("Switch default-message");
            break;
    }

    console.log(usersPokemonAttributes); // For e.x {shape: "wings", color: "red", habitat: "grassland"}
    
}

//Need to fech ALL the urls AFTER the user has picked all of their attributes. Somehow.


function fetchPokemonsWithAttribute(attributeCategory,pickedAttribute){
    fetch(`https://pokeapi.co/api/v2/${attributeCategory}/${pickedAttribute}/`) 
        .then(function(response){ //Hopefully recive data
            return response.json(); 
        })

        .then(function(pokemonData){ 
            const arrayWithPokemonData = pokemonData.pokemon_species; //Returns array of objects with id, url and name

            let pokemonNames = getPokemonNamesFromArray(arrayWithPokemonData);
            console.log(pokemonNames); //Array of pokemon names with the picked attribute!! 
        })

        .catch(function(error){
            console.log(error)
        })

}

function getPokemonNamesFromArray(arrayWithPokemonData){
    let pokemonNames = [];

        for (var i = 0; i < arrayWithPokemonData.length; i++){
            pokemonNames.push(arrayWithPokemonData[i].name);
        }
    
    console.log(pokemonNames); //Array with pokemon names!! 
    return pokemonNames; 
     
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