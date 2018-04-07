# Pokéme Test

A highly accurate test that will show you which Pokémon is your _spiritpokémon_. Try it yourself at [pokeme.uddesson.se](http://pokeme.uddesson.se/). 

Oh, and the way I'm pronouncing the name in my head is "Poké-me". Like, Pokémon + me. Get it? ~~Nevermind.~~

## Resources
I've used the [Pokéapi v2](https://pokeapi.co/), which provides a great open database filled with thousands of Pokémon-related facts and objects.

### Built With
* Sass

### Process
After previously having practiced to fetch information from open API:s with an input field and presenting search results, I wanted to make something different. So I decided on a silly little test, where the user would control the outcome by picking their preferred options. 

I ran into a couple of logical problems along the way, mainly how I would give the user several options so they would feel in control of the result - but still limit their options so a matching Pokémon would be found. In the end I think it turned out quite alright.

### Todo
* Present more facts about the spiritpokémon, maybe a desciption, some stats etc.
* Find ways of optimizing the fetching, to make the results appear faster.
* Remove anchorlinks as the questionwrapper is 'discarded'. Or replace them entierly. 
* Make some sort of smooth transition for when the result is presented and the loading icon disappears. Same thing with the anchor links. It's kinda rough without any scroll effect.
* Maybe add a footer and improve the styling.