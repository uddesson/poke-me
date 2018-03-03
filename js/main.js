//Fetch elements from the DOM
var attributeImages = document.getElementsByTagName('img');

//Make every image the 
for (var i = 0; i < attributeImages.length; i++){
    attributeImages[i].addEventListener('click', savePickedAttribute);
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
    
    switch(attributeCategory){
        case "shape":
            usersPokemonAttributes.shape = pickedAttribute;
            //fetch(api/v2/pokemon-shape/${pickedAttribute})
            //function for removing this.eventlistener and class hidden from next question wrapper?
            break;

        case "color":
            usersPokemonAttributes.color = pickedAttribute;
            //fetch(api/v2/pokemon-shape/${pickedAttribute})
            //function for removing this.eventlistener and class hidden from next question wrapper?
            break;

        case "habitat":
            usersPokemonAttributes.habitat = pickedAttribute;
            //fetch(api/v2/pokemon-shape/${pickedAttribute})
            //function for removing this.eventlistener and class hidden from next question wrapper?
            break;

        default: 
            console.log("Switch default-message");
            break;
    }

    console.log(usersPokemonAttributes); // WORKS!! For e.x {shape: "wings", color: "red", habitat: "grassland"}
    
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