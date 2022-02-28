const urls = {
    root: 'https://pokeapi.co/api/v2/',
    pokedex: 'https://pokeapi.co/api/v2/pokedex/',
    pokemon: 'https://pokeapi.co/api/v2/pokemon/',
    firstGen: 'https://pokeapi.co/api/v2/pokemon?limit=151'
}


async function fetchfirstGen() {
    try {
        const response = await fetch(`${urls.firstGen}`);
        const data = await response.json();

        console.log(await fetchPokemonObject(data.results[1].url));
        
        
        
        for(let i in data.results) {
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

            //output it on the site
            $('main').append(`
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
                </section>
            `);
        }

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

    } catch {
        $('body').append(`
        <h3>Something went wrong in the fetch</h3>
        <p>Please try again at later state</p>
    `);

    } finally {
        console.log("Finally-block");
    }
}


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


function expandPokemon(target) {
    if($(target).hasClass('innerSection')) {
        $(target).parent().next().slideToggle()
    } else {
        $(target).parent().parent().next().slideToggle()
    }
}


function expandMoves(target) {
    $(target).parent().next().slideToggle()
}


function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}


fetchfirstGen();