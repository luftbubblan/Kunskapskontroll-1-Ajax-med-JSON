async function run() {
    //variables used to determine how many pokemons that are shown and that will be loaded
    let loadedPokemons = 0;
    let limit = 10;

    //fetches API with 151 pokemons and saves it to data
    const data = await fetchfirstGen();

    //appends 10 pokemons to the site by running loadPokemons with the data, 0 and 10
    $('#list').append(await loadPokemons(data, loadedPokemons, limit));

    //shows number of pokemons loaded out of 151
    $('#counter').html(`<h2>Number of pokemons shown: ${limit}/151</h2>`)

    //click to load 10 more
    $('#loadMoreBtn').on('click', async function() {
        //hiddes the button and shows a loading text
        $(this).toggleClass("hidden");
        $("#loading").toggleClass("hidden");
        //uncomment next line to simulate a slow loading API
        // await new Promise(resolve => setTimeout(resolve, 3000));

        //code that makes it so that loadPokemons function loads the next 10 pokemons
        limit += 10;
        loadedPokemons += 10;

        //if 150 pokemons are loaded there is only one more left to load so varables change so that happens and the loadMoreBtn is removed
        if(limit == 160) {
            limit = 151;
            loadedPokemons = 150;

            $('#loadMoreBtn').remove();
        }

        //appends 10 pokemons to the site by running loadPokemons with the data, and the previous numbers but 10 higher. ex 10-20 and then 20-30....
        $('#list').append(await loadPokemons(data, loadedPokemons, limit));

        //updates shows number of pokemons loaded out of 151
        $('#counter').html(`<h2>Number of pokemons shown: ${limit}/151</h2>`)

        //shows the button and hiddes a loading text
        $(this).toggleClass("hidden")
        $("#loading").toggleClass("hidden");
    })
}


//fetches the 151 first pokemons and returns the data
async function fetchfirstGen() {
    const firstGenUrl = "https://pokeapi.co/api/v2/pokemon?limit=151"
    try {
        //limit = the number of pokemons that is fetched(151 pokemons in the first generation)
        const response = await fetch(firstGenUrl);
        const data = await response.json();

        return data;

    } catch {
        $('#list').append(`
            <div id="error">
                <h3>Connection to server error</h3>
                <p>Can not connect to "${firstGenUrl}"</p>
            </div>
        `);
        $('#loadMoreBtn').toggleClass("hidden");

    } finally {
        console.log("Finally-block in runfetchfirstGen");
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
                        <img class="pokemonImg" src="${pokemonObject.sprites.front_default}" alt="">
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
    //returns the output
    return output  
}


//fetches a specific pokemons url to access more data about the pokemon and returns it
async function fetchPokemonObject(pokemonUrl) {
    try {
        const response = await fetch(pokemonUrl);
        const data = await response.json();

        return data;

    } catch {
        $('#list').append(`
            <div id="error">
                <h3>Connection to server error</h3>
                <p>Can not connect to "${pokemonUrl}"</p>
            </div>
        `);
        $('#loadMoreBtn').toggleClass("hidden");
        
    } finally {
        console.log("Finally-block in fetchPokemonObject");
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


//eventListner that handels both expands on click
$(document).on('click', function(event) {
    
    //click pokemon to expand for more info
    if($(event.target).hasClass('innerSection') || $(event.target).hasClass('stats') || $(event.target).is('h2') || $(event.target).is('img')) {
        event.preventDefault();
        expandPokemon(event.target);
        
        //click text to see all moves
    } if($(event.target).is('b')) {
        event.preventDefault();
        expandMoves(event.target);
    }
})


/**
 * ##################################
 * #####RUNNING CODE STARTS HERE#####
 * ##################################
 */

let output = "";
run();