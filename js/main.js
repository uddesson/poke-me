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

//These values will be generated from the picked attributes
let apis = {
    shapeUrl: '',
    colorUrl: '',
    habitatUrl: ''
}

function setAndFetchPickedAttribute(){
    
    let pickedAttribute = this.parentElement.parentElement.id;
    let attributeCategory = this.parentElement.parentElement.parentElement.id;
    let url = ` http://pokeapi.salestock.net/api/v2/${attributeCategory}/${pickedAttribute}/`;
    
    switch(attributeCategory){
        case "pokemon-shape":
            usersPokemonAttributes.shape = pickedAttribute;
            //Use url to fetch pokemon with selected shape from api
            apis.shapeUrl = url;
            console.log(usersPokemonAttributes); //Testing
            break;

        case "pokemon-color":
            usersPokemonAttributes.color = pickedAttribute;
            apis.colorUrl = url;
            console.log(usersPokemonAttributes); //Testing
            break;

        // I make sure this is the last thing the user picks (fix with styling)
        case "pokemon-habitat": 
            usersPokemonAttributes.habitat = pickedAttribute;
            apis.habitatUrl = url;
            console.log(usersPokemonAttributes); //Testing
            
            //Send my requests (the object with different url:s) to the fetch-funciton
            fetchCorrespondingDataFromApis(apis)
           
            break;

        default: 
            console.log("Switch default-message"); //Testing
            break;
    }
}


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