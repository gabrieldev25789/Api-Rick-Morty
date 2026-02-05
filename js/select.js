const statusSelect = document.querySelector("#status-select")
const genderSelect = document.querySelector("#gender-select")
const specieSelect = document.querySelector("#species-select")
const locationSelect = document.querySelector("#location-type-select")
const dimensionSelect = document.querySelector("#dimension-select")

const pageValue = Math.ceil(Math.random() * 10) 



function createInfosCharactersSelect(data){
    return [
    createLi(`Name: ${data.name}`, "list", "name-location"),
    createLi(`Dimension: ${data.species}`, "list", "species"),
    createLi(`Type: ${data.gender}`, "list", "gender"),
    createLi(`ID: ${data.id}`, "list", "id")
    ]
}

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
        const img = createImg()
        const ul = createUl() 
        img.src = character.image 
        createInfosCharactersSelect(character).forEach((li) => ul.appendChild(li))
        div.appendChild(img)
        div.appendChild(ul)
        document.body.appendChild(div)
        })
    }
})

    console.log(data.results, pageValue)
}

handleSelects()