const statusSelect = document.querySelector("#status-select")
const genderSelect = document.querySelector("#gender-select")
const specieSelect = document.querySelector("#species-select")
const dimensionSelect = document.querySelector("#dimension-select")

const pageInput = document.querySelector("#search-page-input")

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

async function handleSelect(prop, valor){

    if(valor){

        const pageValue = pageInput.value 
        if(!pageValue){
        alert("DIGITE UM VALOR") 
        return 
      }

        const url = `https://rickandmortyapi.com/api/character?page=${pageValue}`

        const responseApi = await fetch(url)
        const data = await responseApi.json()

        const characters = data.results

        const characterSelect = characters.filter((character) => character[prop] === valor)
        console.log(characterSelect)
        characterSelect.forEach((character)=>{

        const div = createDivImgInfos()
        div.classList.add("div-character-select")

        const img = createImg()
        img.classList.add("img-character-select")
        img.classList.remove("character-img")

        const ul = createUl() 
        ul.classList.add("ul-character-select", "hide")

        img.addEventListener("click", () => {
          ul.classList.toggle("hide")
        })

        img.src = character.image 
        createInfosCharactersSelect(character).forEach((li) => ul.appendChild(li))
        div.appendChild(img)
        div.appendChild(ul)
        imagesContainer.appendChild(div)
        array.push(div)

        toggleClassList("add", selectsContainer, inputsContainer)
        backBtn.classList.remove("hide")
    })

    console.log(data.results, pageValue)
    }
}

 statusSelect.addEventListener("change", async (e) =>{
    const target = e.target.value 

    handleSelect("status", target)
})

genderSelect.addEventListener("change", (e) => {

  const target = e.target.value

  if (!target) {
    genderSelect.value = ""
    alert("No have No have")
    return
  }

  handleSelect("gender", target)
})


specieSelect.addEventListener("change", async (e) => {
     const target = e.target.value 

     handleSelect("species", target)
})

function renderCharacter(character) {
  const div = createDivImgInfos()
  div.classList.add("div-character-select")

  const img = createImg()
  img.classList.add("img-character-select")
  img.src = character.image

  handleImageError(img)

  const ul = createUl()
  ul.classList.add("ul-character-select")

  createInfosCharactersSelect(character).forEach(li => ul.appendChild(li))

  div.appendChild(img)
  div.appendChild(ul)
  document.body.appendChild(div)

  array.push(div)

  toggleClassList("add", selectsContainer, inputsContainer)
  backBtn.classList.remove("hide")
}

async function handleDimensionSelect(dimension) {
  const response = await fetch(
    `https://rickandmortyapi.com/api/location?dimension=${dimension}`
  )
  const data = await response.json()

  data.results.forEach(async (location) => {
    for (let resident of location.residents) {
      const res = await fetch(resident)
      const character = await res.json()

      renderCharacter(character)
    }
  })
}

dimensionSelect.addEventListener("change", (e) => {
  handleDimensionSelect(e.target.value)
})

function handleImageError(imgElement) {
  imgElement.addEventListener("error", () => {
    const placeholder = createImageErrorPlaceholder()
    
    imgElement.replaceWith(placeholder)
  })
}


import { createDivImgInfos } from "./api.js"
import { createImg } from "./api.js"
import { createUl } from "./api.js"
import { createLi } from "./api.js"
import { imagesContainer } from "./api.js"
import { toggleClassList } from "./api.js"
import { selectsContainer } from "./api.js"
import { inputsContainer } from "./api.js"
import { backBtn } from "./api.js"
import { createImageErrorPlaceholder } from "./api.js"
