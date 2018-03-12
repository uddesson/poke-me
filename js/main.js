// Fetch elements from the DOM
const optionBox = document.getElementsByClassName('option-box');
const resultWrapper = document.getElementById('result-wrapper');
const resultImageWrapper = document.getElementById('result-image-wrapper');
const resultTextWrapper = document.getElementById('result-text-wrapper');

const allShapeOptions = [optionBox.upright, optionBox.quadruped, optionBox.wings];
const allColorOptions = [optionBox.green, optionBox.red, optionBox.yellow, optionBox.blue];
const allHabitatOptions = [optionBox.mountain, optionBox.forest, optionBox.grassland, optionBox[10]]; 
/* optionBox[10] is "waters-edge", but because of the "-" that can't be used for the value this way,
so I use the number 10 from the HTML-collection to identify it */

// I want the option-boxes to be the thing the user clicks to move forward
for (var i = 0; i < optionBox.length; i++){
    optionBox[i].addEventListener('click', handleUsersActions);
}

// As the user picks their attributes, the values will be set
const usersPokemonAttributes = {
    shape: '',
    color: '',
    habitat: ''
}

// These values will in turn be generated from the picked attributes
let apis = {
    shapeUrl: '',
    colorUrl: '',
    habitatUrl: ''
}

// This will be our spiritpokémon - the result!
let spiritPokemon = undefined;

function handleUsersActions(){
    let questionWrapper = this.parentElement; 
    let attributeCategory = this.parentElement.id;
    let pickedAttribute = this.id;
    let url = `http://pokeapi.salestock.net/api/v2/${attributeCategory}/${pickedAttribute}/`;
    
    switch(attributeCategory){
        case "pokemon-shape":
            usersPokemonAttributes.shape = pickedAttribute; 
            apis.shapeUrl = url;
            discardAndShowNext(questionWrapper);
            limitColorOptionsBasedOn(usersPokemonAttributes.shape);
            makeOptionsUnclickable(questionWrapper); 
            console.log(usersPokemonAttributes); //Testing
            break;

        case "pokemon-color":
            usersPokemonAttributes.color = pickedAttribute;
            apis.colorUrl = url;
            discardAndShowNext(questionWrapper);
            limitHabitatOptionsBasedOn(usersPokemonAttributes.shape, usersPokemonAttributes.color);
            makeOptionsUnclickable(questionWrapper);
            console.log(usersPokemonAttributes); //Testing
            break;

        case "pokemon-habitat": 
            usersPokemonAttributes.habitat = pickedAttribute;
            apis.habitatUrl = url;
            //Send my requests to the fetch-funciton and return a spirit pokémon
            spiritPokemon = fetchCorrespondingDataFromApis(apis);
            
            // NO 1 TODO: Make the next fetch-function wait for a spirit pokémon! 
            setTimeout(function(){fetchFacts(spiritPokemon)}, 2000);

            makeOptionsUnclickable(questionWrapper);

            // TODO: Create a submit-button if the user wants to do the test again
            console.log(usersPokemonAttributes); //Testing
            break;

        default: 
            console.log("Switch default-message"); //Testing
            break;
    }
}

/* 
** Functions controlling styling and main output to user: 
*/ 

function removeClassHidden(element){
    element.classList.remove('hidden');
}

//Will help let the user know which question to answer
function discardAndShowNext(questionWrapper){    
    //Style the answered question-wrappers so the user won't click them again (.. and they can't)
    questionWrapper.classList.add('discarded');

    //Find the next question wrapper
    const nextQuestionWrapper = questionWrapper.nextElementSibling.nextElementSibling;
    
    //Make it appear
    removeClassHidden(nextQuestionWrapper);
};

function makeOptionsUnclickable(questionWrapper){
    var range = questionWrapper.children.length;
    var i = 0;
    /* Remove all eventlisteners from option-boxes within this current questionwrapper.
    This function is called after they have been clicked */ 
    for (i = 0; i < range; i++){
        questionWrapper.children[i].removeEventListener('click', handleUsersActions);
    }
}


/* 
** Functions used for handling, fetching and returning promises + data from Pokeapi
** https://pokeapi.co/
*/ 

function fetchCorrespondingDataFromApis(apis){
    // Create variables for requesting all three api-urls with fetch()
    var apiRequestShape = fetch(`${apis.shapeUrl}`)
    .then((response) => response.json());

    var apiRequestColor = fetch(`${apis.colorUrl}`)
    .then((response) => response.json());

    var apiRequestHabitat = fetch(`${apis.habitatUrl}`)
    .then((response) => response.json());

    //These values should be set to the correct data and makes it easier to keep track of
    var allRequests = {
        "apiRequestShape":{},
        "apiRequestColor":{},
        "apiRequestHabitat":{}
    };
    
    /** Instead of reciving my promises one by one (would not have worked to compare the data) 
    I use Promise.all which takes an array of promises (what I get from the three api-requests)
    And then I can handle them all as the data is (hopefully) recived
    */
    Promise.all([apiRequestShape,apiRequestColor,apiRequestHabitat])
    .then((pokemonData) => {
    /* Since the pokemonData is an array of data from three url-requests, 
    I need to use an index to get to the different content */
    allRequests["apiRequestShape"] = pokemonData[0];

    //I only want the list of names, so I store that data into a variable using my function
    let listOfPokemonWithShape = getPokemonNamesFromArray(pokemonData[0].pokemon_species);
    
    allRequests["apiRequestColor"] = pokemonData[1];
    let listOfPokemonWithColor = getPokemonNamesFromArray(pokemonData[1].pokemon_species);
    
    allRequests["apiRequestHabitat"] = pokemonData[2];
    let listOfPokemonWithHabitat = getPokemonNamesFromArray(pokemonData[2].pokemon_species);

    spiritPokemon = findMatchingPokemon(listOfPokemonWithShape, listOfPokemonWithColor,listOfPokemonWithHabitat);    
    })

    .catch(pokemonData => {
        console.error();
        const resultText = document.
            createElement('p');
        resultText.innerText = `Something went wrong.`;
        resultTextWrapper.appendChild(resultText);
    });
    
    return spiritPokemon;    
} 

//Get an array of the data I want - only the Pokemon names
function getPokemonNamesFromArray(arrayWithPokemonData){
    let pokemonNames = [];

        for (var i = 0; i < arrayWithPokemonData.length; i++){
            pokemonNames.push(arrayWithPokemonData[i].name);
        }
    return pokemonNames; 
}

function findMatchingPokemon(shape, color, habitat){
    let matchingPokemon = []; //Will be the list of matching names
    
    /* Filtering out all names (strings in array) that will pass 
    through the following if statements */
    shape.filter(function(name){

        /* Using indexOf I can check if the name is present in the other two arrays, 
        (the return value should not be -1) and push that name into my array of matching Pokémon */
        if((color.indexOf(name) !== -1) == true 
        && (habitat.indexOf(name) !== -1) == true)
        {
            matchingPokemon.push(name);
        }    
    });

    // TODO: Maybe pick a random one?
    spiritPokemon = matchingPokemon[0]; 
    console.log(spiritPokemon); // Testing
    return spiritPokemon;
}

function fetchFacts(spiritPokemon){
    let spiritPokemonurl = `http://pokeapi.salestock.net/api/v2/pokemon/${spiritPokemon}/`;

    fetch(spiritPokemonurl)
    .then((pokemonData) => pokemonData.json())
  
    .then((pokemonData) => {
        console.log(`Your spiritpokemon is: ${spiritPokemon}`);
        console.log(pokemonData.sprites.front_default);
       
        const pokemonImage = document.
            createElement('img');
            pokemonImage.src = pokemonData.sprites.front_default;
            pokemonImage.alt = spiritPokemon;
            resultImageWrapper.appendChild(pokemonImage);      

        const resultText = document.
            createElement('p');
            resultText.innerText = `Your spiritpokémon today is ${spiritPokemon}.`;
            resultTextWrapper.appendChild(resultText);    
    })
    
    .catch(pokemonData => {
        console.error();
    });
}

function limitColorOptionsBasedOn(shape){
    switch(shape){
        case "upright":
            for(var i = 0; i < allColorOptions.length; i++){
                removeClassHidden(allColorOptions[i]);
            }
        break;

        case "quadruped":
            for(var i = 0; i < allColorOptions.length; i++){
                if(allColorOptions[i].id != "red"){
                    removeClassHidden(allColorOptions[i]);
                }
            }
        break;

        case "wings":
            for(var i = 0; i < allColorOptions.length; i++){
                if((allColorOptions[i].id != "yellow")
                && (allColorOptions[i].id != "green")){
                    removeClassHidden(allColorOptions[i]);
                }
            }
        break;
    }
}

function limitHabitatOptionsBasedOn(shape,color){
    switch (shape){
        case "upright":
            if(color == "green"){
                for(var i = 0; i < allHabitatOptions.length; i++){
                    if(allHabitatOptions[i].id != "waters-edge"){
                        removeClassHidden(allHabitatOptions[i]);
                    }
                }
            }
            else if(color == "yellow"){
                for(var i = 0; i < allHabitatOptions.length; i++){
                    if(allHabitatOptions[i].id != "mountain"){
                        removeClassHidden(allHabitatOptions[i]);
                    }
                }
            }
            else if(color == "red"){
                for(var i = 0; i < allHabitatOptions.length; i++){
                    if((allHabitatOptions[i].id != "forest") 
                    && (allHabitatOptions[i].id != "waters-edge")){
                        removeClassHidden(allHabitatOptions[i]);
                    }
                }
            }
            else if(color == "blue"){
                for(var i = 0; i < allHabitatOptions.length; i++){
                    if((allHabitatOptions[i].id != "forest") 
                    && (allHabitatOptions[i].id != "mountain")){
                        removeClassHidden(allHabitatOptions[i]);
                    }
                }
            }
        break;
        
        case "quadruped":
            if(color == "green"){
                for(var i = 0; i < allHabitatOptions.length; i++){
                    if((allHabitatOptions[i].id != "waters-edge") 
                    && (allHabitatOptions[i].id != "mountain")){
                        removeClassHidden(allHabitatOptions[i]);
                    }
                }
            }
            else if(color == "yellow"){
                for(var i = 0; i < allHabitatOptions.length; i++){
                    if(allHabitatOptions[i].id != "waters-edge"){
                        removeClassHidden(allHabitatOptions[i]);
                    }
                }
            }
            else if(color == "blue"){
                for(var i = 0; i < allHabitatOptions.length; i++){
                    if((allHabitatOptions[i].id != "forest") 
                    && (allHabitatOptions[i].id != "mountain")){
                        removeClassHidden(allHabitatOptions[i]);
                    }
                }
            }
        break;

        case "wings":
            if(color == "red"){
                for(var i = 0; i < allHabitatOptions.length; i++){
                    if(allHabitatOptions[i].id != "grassland"){
                        removeClassHidden(allHabitatOptions[i]);
                    }
                }
            }
            else if(color == "blue"){
                for(var i = 0; i < allHabitatOptions.length; i++){
                    if(allHabitatOptions[i].id != "mountain"){
                        removeClassHidden(allHabitatOptions[i]);
                    }
                }
            }
        break;

        default: 
        console.log("Switch default-message"); //Testing
        break;
    }
}