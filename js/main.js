async function run() {
    let limit = 10;
    let loadedPokemons = 0;

    //fetches API with 151 pokemons and saves it to data
    const data = await fetchfirstGen();

    //runs loadPokemons with the data and 0 pokemons on the site and telling it to print 10 new from 0 to 10
    loadPokemons(data, loadedPokemons, limit);
    
    //click to load 10 more
    $('#loadMoreBtn').on('click', function() {
        limit += 10;
        loadedPokemons += 10;
        //runs loadPolemons with the data and prints 10 more pokemons to the site. from the number it was before to 10 more. ex 10-20 and then 20-30....
        loadPokemons(data, loadedPokemons, limit);
    })
    
}


//fetches the 151 first pokemons and returns the data
async function fetchfirstGen() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();

        return data;

    } catch {
        $('body').append(`
        <h3>Something went wrong in the fetch</h3>
        <p>Please try again at later state</p>
    `);

    } finally {
        console.log("Finally-block");
    }
}


//displays all the data about the loaded pokemons and prints it to the site
async function loadPokemons(data, loadedPokemons, limit) {
    //clear output
    output = "";

    for(let i = loadedPokemons; i < limit; i++) {
        const pokemonObject = await fetchPokemonObject(data.results[i].url);

        //get all the types of the pokemon
        let types = '';
        for(let type of pokemonObject.types) {
            types += ` ${capitalizeFirstLetter(type.type.name)},`;
        }
        types = types.slice(0, -1)

        //get all the moves of the pokemon
        let moves = '';
        for(let move of pokemonObject.moves) {
            moves += `<li>${capitalizeFirstLetter(move.move.name)}</li>`;
        }

        //create the output
        output += `
            <section class="outerSection">
                <a href="" class="firstLink">
                    <section class="innerSection">
                        <h2>${pokemonObject.id} ${capitalizeFirstLetter(data.results[i].name)}</h2>
                        <img src="${pokemonObject.sprites.front_default}" alt="">
                        <div class="stats">
                            ${capitalizeFirstLetter(pokemonObject.stats[0].stat.name)}: ${pokemonObject.stats[0].base_stat}<br>
                            ${capitalizeFirstLetter(pokemonObject.stats[1].stat.name)}: ${pokemonObject.stats[1].base_stat}<br>
                            ${capitalizeFirstLetter(pokemonObject.stats[2].stat.name)}: ${pokemonObject.stats[2].base_stat}<br>
                            ${capitalizeFirstLetter(pokemonObject.stats[3].stat.name)}: ${pokemonObject.stats[3].base_stat}<br>
                            ${capitalizeFirstLetter(pokemonObject.stats[4].stat.name)}: ${pokemonObject.stats[4].base_stat}<br>
                            ${capitalizeFirstLetter(pokemonObject.stats[5].stat.name)}: ${pokemonObject.stats[5].base_stat}
                        </div>
                    </section>
                </a>
                <div hidden>
                    <b>Types:</b>${types}<hr>
                    <a href="" class="secoundLink">
                        <b>Click to show moves/abilities</b>
                    </a>
                    <div hidden>
                        <ul>${moves}</ul>
                    </div>
                </div>
            </section>`
    }
    //append new output(10 pokemons) to site
    $('#list').append(output)

    //click to expand for more info
    $('.firstLink').on('click', function(event) {
        event.preventDefault();
        expandPokemon(event.target);
    })

    //click to see all moves
    $('.secoundLink').on('click', function(event) {
        event.preventDefault();
        expandMoves(event.target);
    })
}


//fetches a specific pokemons url to access more data about the pokemon and returns it
async function fetchPokemonObject(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        return data;

    } catch {
        $('body').append(`
        <h3>Something went wrong in the fetch</h3>
        <p>Please try again at later state</p>
        `);
        
    } finally {
        console.log("Finally-block");
    }
}


//expands/minimizes the information section about the pokemon
function expandPokemon(target) {
    if($(target).hasClass('innerSection')) {
        $(target).parent().next().slideToggle()
    } else {
        $(target).parent().parent().next().slideToggle()
    }
}


//expands/minimizes the moveset section about the pokemon
function expandMoves(target) {
    $(target).parent().next().slideToggle()
}


//just a function that capitalizes the first letter in a string so that data that is fetched can be printed with capital first letter
function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * ##################################################################
 * #####THE CODE THAT IS RUN WHEN THE SITE IS LOADED STARTS HERE#####
 * ##################################################################
 */

let output = "";
run();