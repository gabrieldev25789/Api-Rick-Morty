const inputEpisode = document.querySelector("#search-episode-input")
const episodeBtn = document.querySelector("#episode-btn")
const episodeInfos = document.querySelector("#episode-infos")

const inputLocation = document.querySelector("#search-location-input")
const locationBtn = document.querySelector("#location-btn")
const locationInfos = document.querySelector("#location-infos")

const imagesContainer = document.querySelector("#images")

const text = document.querySelector("#h2")

let imageInfos = []

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

async function consomeApi() {

  episodeBtn.addEventListener("click", async () => {
        locationInfos.classList.add("hide")

    if(inputEpisode.value === ""){
        episodeInfos.textContent = "Search for an apisode"    
    return
    }  if(inputEpisode.value >= 52){
        episodeInfos.textContent = "Not found episode"
        text.classList.add("hide")
        imagesContainer.classList.add("hide")
        return
    }
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
    console.log(data)
    lists.forEach((li)=>{
      console.log(li)
      ulInfos.appendChild(li)
      episodeInfos.appendChild(ulInfos)
    })
  
     for ( const characterUrl of characters ){
        [episodeInfos, text, imagesContainer].forEach((el) => el.classList.remove("hide"))
        const characterResponse = await fetch(characterUrl);
        const characterData = await characterResponse.json();
        const imageCharacter = characterData.image

        const divImageInfos = createDivImgInfos()
        imageInfos.push(divImageInfos)

        text.textContent = "Characters appearing in this episode:"

        const img = createImg()
        img.src = imageCharacter 

        const ulCharacter = createUlInfosCharacter()

        const listCharacters = createCharacterLis(characterData)

        divImageInfos.appendChild(img)

        listCharacters.forEach((li)=>{
          console.log(li)
          divImageInfos.appendChild(ulCharacter)
          ulCharacter.appendChild(li)
        })

        imagesContainer.appendChild(divImageInfos)
      }

      console.log(episodeInfos)
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

function validInput(){
   const ulInfos = createUl()

  if(inputLocation.value >= 127){
      locationInfos.textContent = "Location not found"
      ulInfos.innerHTML = ""
      return 
    }
}

function createRickImage(){
    const img = document.createElement("img")
    img.id = "rick-img"

    return img 
}

async function consomeApi2(){
    locationBtn.addEventListener("click", async () =>{
    const ulInfos = createUl()

        locationInfos.innerHTML = ""
        locationInfos.classList.remove("hide")
        const locationValue = inputLocation.value
        /*validInput()*/

        const url = `https://rickandmortyapi.com/api/location/${locationValue}`
        
        try{
          [episodeInfos, text, imagesContainer].forEach((el) => el.classList.add("hide"))
          
            const response = await fetch(url)
            const data = await response.json()
            const residents = data.residents

            inputLocation.value = ""

            const lists = createLocationLis(data)

            lists.forEach((li)=>{
              ulInfos.appendChild(li)
            })

            locationInfos.appendChild(ulInfos)

            imagesContainer.innerHTML = ""
            const rickImg = createRickImage()

            if (residents.length === 0) {
            imagesContainer.classList.remove("hide")
            text.classList.remove("hide")
            text.textContent = "No character belong to this place."
            rickImg.src = `./img/rick-morty-img.jpg`

            imagesContainer.appendChild(rickImg)
            return
          }

            const residentsData = await Promise.all(
              residents.map(url =>
              fetch(url).then(response => response.json())))

              imagesContainer.classList.remove("hide")
              text.classList.remove("hide")
              text.textContent = "Characters who belong to this place:"

              residentsData.forEach((residentData) => {
              const containerResidents = createContainerResidents()

              const img = createImg()
              img.src = residentData.image

              const ulResidents = createUlResidents()

              const listResidents = createResidentLis(residentData)
              listResidents.forEach(li => ulResidents.appendChild(li))

              containerResidents.append(img, ulResidents)
              imagesContainer.appendChild(containerResidents)
              })
          } 
            catch{
              console.error("erro")
        }
    })
}

consomeApi2()
