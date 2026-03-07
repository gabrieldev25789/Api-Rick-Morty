const statusSelect = document.querySelector("#status-select")
const genderSelect = document.querySelector("#gender-select")
const specieSelect = document.querySelector("#species-select")
const locationSelect = document.querySelector("#location-select")

const pageInput = document.querySelector("#search-page-input")

function validSelect(value, boolean, infos){
    toggleClassList("add", banner)
  
    const rickImg = createRickImage()
    infos.textContent = `Search for an ${value}`
      infosContainer.classList.add("no-found")
      rickImg.src = `./img/rick-morty-img2.jpg`
      imagesContainer.appendChild(rickImg)
      toggleClassList("add", selectsContainer, inputsContainer, text) 
      toggleClassList("remove", infosContainer, backBtn, imagesContainer)
  
      if(boolean === true){
      rickImg.src = `./img/rick-morty-img.jpg`
      infos.textContent = `Not found ${value}`
      }
      return false 
}

function handleCharactersNotFound(characterSelect){
        if (characterSelect.length === 0) {
         validSelect("character", true, episodeInfos)
         selectsContainer.classList.remove("hide")
        } else{
          infosContainer.classList.add("hide")
        }  
}

let array = []

function createCharacterCard(character) {
  const div = createDivImgInfos()
  div.classList.add("div-character-select")

  const img = createImg()
  img.classList.add("img-character-select")
  img.src = character.image

  handleImageError(img)

  const ul = createUl()
  ul.classList.add("ul-character-select", "hide")

  img.addEventListener("click", () => {
    ul.classList.toggle("hide")
  })

  createCharacterLisListClass(character)
    .forEach(li => ul.appendChild(li))

  div.appendChild(img)
  div.appendChild(ul)

  return div
}

function renderCharacters(characters) {
  characters.forEach(character => {
    const card = createCharacterCard(character)
    imagesContainer.appendChild(card)
    array.push(card)
  })

  toggleClassList("add", selectsContainer, inputsContainer)
  backBtn.classList.remove("hide")
}

function renderCharacter(character) {
  renderCharacters([character])
}

async function handleSelect(prop, valor) {
  if (!valor) return

  const pageValue = pageInput.value

  if (!pageValue) {
    validSelect("page", false, episodeInfos)
    return
  }

  const url = `https://rickandmortyapi.com/api/character?page=${pageValue}`

  const responseApi = await fetch(url)
  const data = await responseApi.json()

  const characters = data.results

  const characterSelect = characters.filter(
    character => character[prop] === valor
  )

  handleCharactersNotFound(characterSelect)
  renderCharacters(characterSelect)
  selectsContainer.classList.remove("hide")
}

const selects = [
  { element: statusSelect, type: "status" },
  { element: genderSelect, type: "gender" },
  { element: specieSelect, type: "species" },
]

selects.forEach(({ element, type }) => {

  element.addEventListener("change", (e) => {
    imagesContainer.innerHTML = ""
    inputCharacter.value = ""

    selects.forEach(({ element: otherElement }) => {
      if (otherElement !== e.target) {
        otherElement.value = ""
        locationSelect.value = ""
      }
    })

    handleSelect(type, e.target.value)
  })
})


async function handleLocationSelect(location) {
  try {
    imagesContainer.innerHTML = ""
    selects.forEach((el) => el.value = "")

    const pageValue = pageInput.value

    const response = await fetch(
      `https://rickandmortyapi.com/api/character?page=${pageValue}`
    )

    const data = await response.json()

    let found = false

    for (const character of data.results) {
      if (character.location.name === location) {
        found = true
        renderCharacter(character)
        selectsContainer.classList.remove("hide")
        infosContainer.classList.add("hide")
      }
    }

    if(found === false){
      validSelect("character", true, episodeInfos)
      locationInfos.classList.add("hide")
      selectsContainer.classList.remove("hide")
      infosContainer.classList.remove("hide")
    }

    console.log(found)

  } catch (error) {
    console.error(error)
  }
}

locationSelect.addEventListener("change", (e) =>{
  [statusSelect, genderSelect, specieSelect, inputCharacter].forEach((el)=> el.value = "")

  imagesContainer.innerHTML = ""

  handleLocationSelect(e.target.value)
})

function handleImageError(imgElement) {
  imgElement.addEventListener("error", () => {
    const placeholder = createImageErrorPlaceholder()
    imgElement.replaceWith(placeholder)
  })
}

backBtn.addEventListener("click", () =>{
  [statusSelect, genderSelect, specieSelect, locationSelect].forEach((el)=> el.value = "")
  imagesContainer.innerHTML = ""
})

import { createDivImgInfos } from "./api.js"
import { createImg } from "./api.js"
import { createUl } from "./api.js"
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
import { createCharacterLisListClass } from "./api.js"
import { locationInfos } from "./api.js"

