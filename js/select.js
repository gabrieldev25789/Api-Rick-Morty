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


function validSelect(value, boolean, infos){
    toggleClassList("add", banner)
  
    const rickImg = createRickImage()
    infos.textContent = `Search for an ${value}`
      infosContainer.classList.add("no-found")
      rickImg.src = `./img/rick-morty-img2.jpg`
      imagesContainer.appendChild(rickImg)
      toggleClassList("add", selectsContainer, inputsContainer, text) // add
      toggleClassList("remove", infosContainer, backBtn, imagesContainer)
  
      if(boolean === true){
      rickImg.src = `./img/rick-morty-img.jpg`
      infos.textContent = `Not found ${value}`
      }
      return false 
}

let array = []

async function handleSelect(prop, valor){

    if(valor){

        const pageValue = pageInput.value 
        if(!pageValue){
        validSelect("page", false, episodeInfos)
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

        toggleClassList("add",  inputsContainer)
        backBtn.classList.remove("hide")
    })

    console.log(data.results, pageValue)
    }
}







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
  imagesContainer.appendChild(div)

  /*document.body.appendChild(div)

  array.push(div) */

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

let selects = [statusSelect, genderSelect, specieSelect]

statusSelect.addEventListener("change", async (e) =>{
  imagesContainer.innerHTML = ""
  inputCharacter.value = ""

    const target = e.target.value 

    handleSelect("status", target)
})

genderSelect.addEventListener("change", (e) => {
  imagesContainer.innerHTML = ""
  inputCharacter.value = ""

  const target = e.target.value

  if (!target) {
    genderSelect.value = ""
    alert("No have No have")
    return
  }

  handleSelect("gender", target)
})

specieSelect.addEventListener("change", async (e) => {
      imagesContainer.innerHTML = ""
      inputCharacter.value = ""
     const target = e.target.value 

     handleSelect("species", target)
})

dimensionSelect.addEventListener("change", (e) => {
  imagesContainer.innerHTML = ""
  inputCharacter.value = ""
  
  selects.forEach((el)=>{
    if(el){
      el.value = ""
    }
  })

  handleSelect("dimension", handleDimensionSelect(e.target.value))

})

function handleImageError(imgElement) {
  imgElement.addEventListener("error", () => {
    const placeholder = createImageErrorPlaceholder()
    imgElement.replaceWith(placeholder)
  })
}

backBtn.addEventListener("click", () =>{
  [statusSelect, genderSelect, specieSelect, dimensionSelect].forEach((el)=> el.value = "")
  console.log("AQUI")
  imagesContainer.innerHTML = ""
})



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
import { infosContainer } from "./api.js"
import { episodeInfos } from "./api.js"
import { createRickImage } from "./api.js"
import { text } from "./api.js"
import { inputCharacter } from "./api.js"
