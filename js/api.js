const inputEpisode = document.querySelector("#search-episode-input")
const episodeBtn = document.querySelector("#episode-btn")
const episodeInfos = document.querySelector("#episode-infos h2")

const inputLocation = document.querySelector("#search-location-input")
const locationBtn = document.querySelector("#location-btn")
const locationInfos = document.querySelector("#location-infos h2")

const infosContainer = document.querySelector("#infos")

const imagesContainer = document.querySelector("#images")

const text = document.querySelector("#h2")

const loadingImg = document.createElement("img")
loadingImg.id = "loading-img"
loadingImg.src = "./img/loading.png" 

// EPISODE API 
function createLiEpisode(text, className, id) {
  const li = document.createElement("li")
  li.textContent = text

  if (className) li.classList.add(className)
  if (id) li.id = id

  return li
}

function createEpisodeLis(data){
  return [
    createLiEpisode(`Name: ${data.name}`, "list", "name-episode"),
    createLiEpisode(`Date release: ${data.air_date}`, "list", "date-release"),
    createLiEpisode(`Season/Episode: ${data.episode}`, "list", "episode-season"),
    createLiEpisode(`ID: ${data.id}`, "list", "id")
  ]
}

function createDivImgInfos(){
      const divImageInfos = document.createElement("div")
      divImageInfos.classList.add("image-infos")

      return divImageInfos
}

function createUlInfosCharacter(){
      const ulCharacter = document.createElement("ul")
      ulCharacter.classList.add("ul-character")

      return ulCharacter
}

function createInfosCharacterLi(text, clasName, id){
    const li = document.createElement("li")
    li.textContent = text 

    if (clasName) li.classList.add(clasName)
    if (id) li.id = id 

    return li
}

function createCharacterLis(data){
  return [
    createInfosCharacterLi(`Name: ${data.name}`, "info-character", "name-character"),
    createInfosCharacterLi(`🌍 Origin : ${data.origin.name}`, "info-character", "origin-character"),
    createInfosCharacterLi(`🧬 Status: ${data.status}`, "info-character", "status-character"),
    createInfosCharacterLi(`🚹 Gender: ${data.gender}`, "info-character", "gender-character")
  ]
}

function validLocationEpisode(value, infos, EpisodeLocation){
  const rickImg = createRickImage()
  const inputValue = value.value
  

  if(!inputValue){
    infos.textContent = `Search for an ${EpisodeLocation}`
    infosContainer.classList.add("no-found")
    text.classList.add("hide")
    rickImg.src = `./img/rick-morty-img2.jpg`
    imagesContainer.appendChild(rickImg)
    return false 
  }
  else{
    infosContainer.classList.remove("no-found")
  }
  if(inputValue < 1 || inputValue > 51 || inputValue > 126){
    infos.textContent = `Not found ${EpisodeLocation}`
    infosContainer.classList.add("no-found")
    text.classList.add("hide")
    rickImg.src = `./img/rick-morty-img.jpg`
    imagesContainer.appendChild(rickImg)
    return false
  } else{
    infosContainer.classList.remove("no-found")
  }
  return true 
}

async function consomeApi() {

  episodeBtn.addEventListener("click", async () => {

    locationInfos.classList.add("hide")

    cleanContainers()

    if(!validLocationEpisode(inputEpisode, episodeInfos, "episode")) return 


    const inputEpisodeValue = inputEpisode.value

    const url = `https://rickandmortyapi.com/api/episode/${inputEpisodeValue}`

    try {
    [episodeInfos, imagesContainer].forEach((el) => el.innerHTML = "")

    const response = await fetch(url)
    const data = await response.json()
    console.log(data.characters)
    const characters = data.characters
     
    inputEpisode.value = ""

    const ulInfos = createUl()
    const lists = createEpisodeLis(data)

    lists.forEach((li)=>{
      ulInfos.appendChild(li)
      episodeInfos.appendChild(ulInfos)
    })
  
      text.textContent = "Characters appearing in this episode:"

      const charactersData = await Promise.all(
      characters.map(async (url) => {
        [episodeInfos, text, imagesContainer].forEach(el =>
        el.classList.remove("hide")
      )
        const response = await fetch(url)
        return response.json()
        })
      )
        charactersData.forEach((characterData) => {
        const divImageInfos = createDivImgInfos()

        const img = createImg()
        img.src = characterData.image

        const ulCharacter = createUlInfosCharacter()
        const listCharacters = createCharacterLis(characterData)

        ulCharacter.append(...listCharacters)
        divImageInfos.append(img, ulCharacter)
        imagesContainer.appendChild(divImageInfos)
      })
    } catch (error) {
      console.error("Erro ao buscar episódio", error)
    } 
  })
}

consomeApi()

// LOCATION API 
function createUl(){
    const ulInfos = document.createElement("ul")
    ulInfos.id = "ul-infos"

    return ulInfos
}

function createLiLocation(text, className, id) {
  const li = document.createElement("li")
  li.textContent = text

  if (className) li.classList.add(className)
  if (id) li.id = id

  return li
}

function createLiResidents(text, clasName, id){
    const li = document.createElement("li")
    li.textContent = text 

    if (clasName) li.classList.add(clasName)
    if (id) li.id = id

    return li 
}

function createContainerResidents(){
      const containerResidents = document.createElement("div")
      containerResidents.classList.add("container-residents")

      return containerResidents
  }

function createImg(){
      const img = document.createElement("img")
      img.classList.add("character-img")

      return img 
}

function createUlResidents(){
      const ulResidents = document.createElement("ul")
      ulResidents.classList.add("ul-residents")

      return ulResidents
}

function createLocationLis(data) {
  return [
    createLiLocation(`Name: ${data.name}`, "list", "name-location"),
    createLiLocation(`Dimension: ${data.dimension}`, "list", "dimension"),
    createLiLocation(`Type: ${data.type}`, "list", "type"),
    createLiLocation(`ID: ${data.id}`, "list", "id")
  ]
}

function createResidentLis(data){
  return [
    createLiResidents(`Name: ${data.name}`, "info-character", "resident-name"),
    createLiResidents(`🚹 Gender: ${data.gender}`, "info-character", "resident-gender"),
    createLiResidents(`🧍‍♂️ Specie: ${data.species}`, "info-character", "resident-specie"),
    createLiResidents(`🧬 Status: ${data.status}`, "info-character", "resident-status")
  ]
}

function createRickImage(){
    const img = document.createElement("img")
    img.id = "rick-img"

    return img 
}

function validResidents(residents, rickImg){
      if (residents.length === 0) {
        imagesContainer.classList.remove("hide")
        text.classList.remove("hide")
        text.textContent = "No character belong to this place."
        rickImg.src = `./img/rick-morty-img.jpg`
        imagesContainer.appendChild(rickImg)
        return false
      }
      return true 
}

function cleanContainers(){
    episodeInfos.innerHTML = ""
    locationInfos.innerHTML = ""
    imagesContainer.innerHTML = ""
}

locationBtn.addEventListener("click", handleLocationClick)

async function handleLocationClick() {
  cleanContainers()
  locationInfos.classList.remove("hide")

  if(!validLocationEpisode(inputLocation, locationInfos, "location")) return 

  const locationValue = inputLocation.value
  inputLocation.value = ""

  try {
    const data = await fetchLocation(locationValue)
    renderLocationInfo(data)

    if (!validResidents(data.residents, createRickImage())) return

    renderResidents(await fetchResidents(data.residents))
  } catch (err){
    console.error(err)
  }
}

async function fetchLocation(id) {
  const response = await fetch(`https://rickandmortyapi.com/api/location/${id}`)
  return response.json()
}

async function fetchResidents(residents) {
  imagesContainer.appendChild(loadingImg)
  return Promise.all(
    residents.map(url => fetch(url).then(r => r.json()))
  )
}

function renderLocationInfo(data) {
  const ulInfos = createUl()
  createLocationLis(data).forEach(li => ulInfos.appendChild(li))
  locationInfos.appendChild(ulInfos)
}

function renderResidents(residentsData) {
  imagesContainer.innerHTML = ""
  text?.classList.remove("hide")
  imagesContainer.classList.remove("hide")
  text.textContent = "Characters who belong to this place:"

  residentsData.forEach(resident => {
    const container = createContainerResidents()
    const img = createImg()
    img.src = resident.image

    const ul = createUlResidents()
    createResidentLis(resident).forEach(li => ul.appendChild(li))

    container.append(img, ul)
    imagesContainer.appendChild(container)
  })
}




