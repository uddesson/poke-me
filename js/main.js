//Fetch elements from the DOM
var attributeImages = document.getElementsByTagName('img');
const resultWrapper = document.getElementById('result-wrapper');
const resultImageWrapper = document.getElementById('result-image-wrapper');
const resultTextWrapper = document.getElementById('result-text-wrapper');

const optionBox = document.getElementsByClassName('option-box');
const allShapeOptions = [optionBox.upright, optionBox.quadruped, optionBox.wings];
const allColorOptions = [optionBox.green, optionBox.red, optionBox.yellow, optionBox.blue];
const allHabitatOptions = [optionBox.mountain, optionBox.forest, optionBox.grassland, optionBox[10]]; 
/* optionBox[10] is "waters-edge", but because of the "-" I can't print the id name 
so I use the number 10 from the HTML-collection to identify it */
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

let spiritPokemon = undefined;
//These values will be generated from the picked attributes
let apis = {
    shapeUrl: '',
    colorUrl: '',
    habitatUrl: ''
}


    let questionWrapper = this.parentElement.parentElement.parentElement;
    let pickedAttribute = this.parentElement.parentElement.id;
    let attributeCategory = this.parentElement.parentElement.parentElement.id;
    let url = ` http://pokeapi.salestock.net/api/v2/${attributeCategory}/${pickedAttribute}/`;
    
    switch(attributeCategory){
        case "pokemon-shape":
            usersPokemonAttributes.shape = pickedAttribute;
            //Use url to fetch pokemon with selected shape from api
            apis.shapeUrl = url;
            styleWrapperByAction(questionWrapper)
            console.log(usersPokemonAttributes); //Testing
            break;

        case "pokemon-color":
            usersPokemonAttributes.color = pickedAttribute;
            apis.colorUrl = url;
            styleWrapperByAction(questionWrapper)
            console.log(usersPokemonAttributes); //Testing
            break;

        // I make sure this is the last thing the user picks (fix with styling)
        case "pokemon-habitat": 
            usersPokemonAttributes.habitat = pickedAttribute;
            apis.habitatUrl = url;
            console.log(usersPokemonAttributes); //Testing
            
            //Send my requests (the object with different url:s) to the fetch-funciton
            fetchCorrespondingDataFromApis(apis)
           
            spiritPokemon = fetchCorrespondingDataFromApis(apis);
            break;

        default: 
            console.log("Switch default-message"); //Testing
            break;
    }
}

//Will help let the user know which question to answer
function styleWrapperByAction(questionWrapper){    
    //Style the answered question-wrappers so the user won't click them again
    questionWrapper.classList.add('discarded');

    //FIX: Need to remove the eventlistener as well, so they really CAN'T

    //Find the next question wrapper
    const nextQuestionWrapper = questionWrapper.nextElementSibling.nextElementSibling;
    
    //Make it appear
    nextQuestionWrapper.classList.remove('hidden');
};

function fetchCorrespondingDataFromApis(apis){
    // Create variables for requesting all three api-urls with fetch()
    var apiRequestShape = fetch(`${apis.shapeUrl}`)
    .then(function(response){ 
        return response.json()
        });

    var apiRequestColor = fetch(`${apis.colorUrl}`)
    .then(function(response){
        return response.json()
    });

    var apiRequestHabitat = fetch(`${apis.habitatUrl}`)
    .then(function(response){
        return response.json()
    });

    //The values should be set to the correct data
    var allRequests = {
        "apiRequestShape":{},
        "apiRequestColor":{},
        "apiRequestHabitat":{}
    };
    
    
    /**Instead of reciving my promises one by one (would not have worked to compare the data) 
    I use Promise.all which takes an array of promises (what I get from the three api-requests)
    And then I can handle them all as the data is (hopefully) recived
    */
    Promise.all([apiRequestShape,apiRequestColor,apiRequestHabitat])
        .then(function(pokemonData){
        /* Since the pokemonData is an array of data from three url-requests, 
        I need to use an index to get to the different content */
        allRequests["apiRequestShape"] = pokemonData[0];

        //I only want the list of names, so I store that data into a variable using my function
        let listOfPokemonWithShape = getPokemonNamesFromArray(pokemonData[0].pokemon_species);
        
        allRequests["apiRequestColor"] = pokemonData[1];
        let listOfPokemonWithColor = getPokemonNamesFromArray(pokemonData[1].pokemon_species);
        
        allRequests["apiRequestHabitat"] = pokemonData[2];
        let listOfPokemonWithHabitat = getPokemonNamesFromArray(pokemonData[2].pokemon_species);
        
        console.log(listOfPokemonWithShape);
        console.log(listOfPokemonWithColor);
        console.log(listOfPokemonWithHabitat);

        //Work in progress
        findMatchingPokemon(listOfPokemonWithShape,listOfPokemonWithColor,listOfPokemonWithHabitat);

        });
        
    }

function getPokemonNamesFromArray(arrayWithPokemonData){
    let pokemonNames = [];

        for (var i = 0; i < arrayWithPokemonData.length; i++){
            pokemonNames.push(arrayWithPokemonData[i].name);
        }
    
    console.log(pokemonNames); //Array with pokemon names!! 
    return pokemonNames; 
     
}

//New draft for finding matching names in different lists 
function findMatchingPokemon(shape,color,habitat){
    let matchingPokemon = []; //I want to save the matching names here
    
    /* Filtering out all names (strings in array) that will pass 
    through the following if statements */
    shape.filter(function(name){

        /* Using indexOf I can check if the name is present in the other two arrays, 
        (the return value should not be -1) and push that name into my array of matching Pokemon*/
        if((color.indexOf(name) !== -1) == true 
        && (habitat.indexOf(name) !== -1) == true){
            matchingPokemon.push(name);
            
        }  

    });

    
    if(matchingPokemon.length == 0){
        console.log('No match') //For testing 
        return;
    }
    
    else{
        console.log(matchingPokemon);
        spiritPokemon = matchingPokemon[0];
        return spiritPokemon;
}

/*  IDEA NOTES:

    Every time the user pickes an option - send them in as values to fetch()
    and fetch corresponding data from pokeapi. For ex. user picks "red" 
    as their favourite color. A list of pokemon with that attribute is fetched
    from api/v2/pokemon-species/color/red, which gives us the names of those pokemon
    
    We store them as a list of names. 
    There aren't that many exact matching pokemon right now, so I need to decide on a way
    of handling this. One way would be to limit the options to 3 !4. And make sure those
    three are the categories that contain the most pokémon-species.

    When the user has picked all of their options, we'll have three(!) lists of pokemon
    names whose attributes fit the "picked option". 
    
    Then I can loop through these lists and find the first pokemon (name) that exists
    in all three lists. That would be the result.

    I could then fetch some more data on that pokemon from  api/v2/pokemon-species/name
    for e.x they all have a short description (string) in english

    Also .. somehow save the fetched data, maybe in sessionStorage, to avoid 
    maybe having to download that same "pokemon" again 

*/