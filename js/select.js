const statusSelect = document.querySelector("#status-select")
const genderSelect = document.querySelector("#gender-select")
const specieSelect = document.querySelector("#species-select")
const locationSelect = document.querySelector("#location-type-select")
const dimensionSelect = document.querySelector("#dimension-select")

const pageValue = Math.ceil(Math.random() * 42) 


function createInfosCharactersSelect(data){
    return [
    createLi(`🧬 Name: ${data.name}`, "list-select", "name-location"),
    createLi(`👽 Specie: ${data.species}`, "list-select", "species"),
    createLi(`⚧ Gender: ${data.gender}`, "list-select", "gender"),
    createLi(`📍 Location: ${data.location.name}`, "list-select", "location"),
    createLi(`🌌 Origin: ${data.origin.name}`, "list-select", "origin"),
    createLi(`🆔 ID: ${data.id}`, "list-select", "id")
    ]
}

let array = []

async function handleSelects(){
    const url = `https://rickandmortyapi.com/api/character?page=${pageValue}`

    const responseApi = await fetch(url)
    const data = await responseApi.json()

    const characters = data.results

    statusSelect.addEventListener("change", (e) =>{
        const target = e.target.value 

    if(target === "alive"){
        const characterAlive = characters.filter((character) => character.status === "Alive")
        console.log(characterAlive)
        characterAlive.forEach((character)=>{

        const div = createDivImgInfos()
        div.classList.add("div-character-select")

        const img = createImg()
        img.classList.add("img-character-select")
        img.classList.remove("character-img")

        const ul = createUl() 
        ul.classList.add("ul-character-select")

        img.src = character.image 
        createInfosCharactersSelect(character).forEach((li) => ul.appendChild(li))
        div.appendChild(img)
        div.appendChild(ul)
        document.body.appendChild(div)
        array.push(div)

        toggleClassList("add", selectsContainer, inputsContainer)
        backBtn.classList.remove("hide")
        })
    }
})

    console.log(data.results, pageValue)
}

handleSelects()