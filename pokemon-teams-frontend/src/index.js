const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons/`

fetch(TRAINERS_URL)
.then(resp => resp.json())
.then(trainers => getTrainer(trainers))

function renderPokemons(pokemons, ul) {   
    pokemons.forEach(p => {
        if (p.nickname !== undefined) {
            const li = document.createElement('li')
            li.innerHTML = `
            ${p.nickname} (${p.species}) 
            <button class="release" 
            data-pokemon-id=${p.id}>Release</button>
            `
            ul.append(li)
            const button = li.querySelector('button')
            button.addEventListener("click", () => {
                releasePokemon(button, li) 
            })
        }
        
    })

}

function getTrainer(trainers){
    const main = document.querySelector('main')
    for(const trainer of trainers){
        const trainerDiv = document.createElement('div')
        trainerDiv.classList.add = "card"
        trainerDiv.dataset.id = trainer.id
        trainerDiv.innerHTML = `
        <p>${trainer.name}</p>
        <button data-trainer-id=${trainer.id}>Add Pokemon</button>
        `
        
        const ul = document.createElement('ul')
        renderPokemons(trainer.pokemons, ul)
        addPokemonButton(trainerDiv.querySelector('button'), ul)
        trainerDiv.append(ul)
        main.append(trainerDiv)
    }
    
    
}

function addPokemonButton(button, ul) {

    button.addEventListener('click', function(e) {

            fetch(POKEMONS_URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "trainer_id": button.getAttribute('data-trainer-id')
                })
            }).then(response => response.json())
            .then(pokemon => {
                renderPokemons([pokemon], ul)
                
            })


        })
}

function releasePokemon(button, li) {   
    const id = button.getAttribute('data-pokemon-id')
    console.log(id)
    fetch(POKEMONS_URL + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": id
        })
    }).then(response => response.json())
    .then(pokemon => {
        li.remove()
    })
}