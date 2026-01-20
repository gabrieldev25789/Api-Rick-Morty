const inputEpisode = document.querySelector("#search-episode-input")
const episodeBtn = document.querySelector("#episode-btn")
const episodeInfos = document.querySelector("#episode-infos")

const inputLocation = document.querySelector("#search-location-input")
const locationBtn = document.querySelector("#location-btn")
const locationInfos = document.querySelector("#location-infos")

const imagesContainer = document.querySelector("#images")

const text = document.querySelector("#h2")

let imageInfos = []

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

    const ulInfos = document.createElement("ul")
    ulInfos.id = "ul-infos"

    const nameEpisode = document.createElement("li")
    nameEpisode.classList.add("list")
    nameEpisode.id = "name-episode"
    nameEpisode.textContent = `Name: ${data.name}` 

    const dateRealese = document.createElement("li")
    dateRealese.classList.add("list")
    dateRealese.id = "date-realese"
    dateRealese.textContent = `Date realese: ${data.air_date}`

    const episodeSeason = document.createElement("li")
    episodeSeason.classList.add("list")
    episodeSeason.id = "episode-season"
    episodeSeason.textContent = `Season/Episode: ${data.episode}`

    const id = document.createElement("li")
    id.classList.add("list")
    id.id = "episode-season"
    id.textContent = `ID: ${data.id}`

    ulInfos.appendChild(nameEpisode)
    ulInfos.appendChild(dateRealese)
    ulInfos.appendChild(episodeSeason)
    ulInfos.appendChild(id)

    episodeInfos.appendChild(nameEpisode)
    episodeInfos.appendChild(dateRealese)
    episodeInfos.appendChild(episodeSeason)
    episodeInfos.appendChild(id)

     for ( const characterUrl of characters ){
        [episodeInfos, text, imagesContainer].forEach((el) => el.classList.remove("hide"))
        const characterResponse = await fetch(characterUrl);
        const characterData = await characterResponse.json();
        const imageCharacter = characterData.image

        const divImageInfos = document.createElement("div")
        divImageInfos.classList.add("image-infos")

        imageInfos.push(divImageInfos)

        text.textContent = "Characters appearing in this episode:"

        const img = document.createElement("img")
        img.classList.add("character-img")
        img.src = imageCharacter 

        const ulCharacter = document.createElement("ul")
        ulCharacter.classList.add("ul-character")

        const nameCharacter = document.createElement("li")
        nameCharacter.classList.add("info-character")
        nameCharacter.id = "name-character"
        nameCharacter.textContent = `Name: ${characterData.name}` 
        
        const originCharacter = document.createElement("li")
        originCharacter.classList.add("info-character")
        originCharacter.id = "origin-character"
        originCharacter.textContent = `🌍 Origin: ${characterData.origin.name}` 
        
        const statusCharacter = document.createElement("li")
        statusCharacter.classList.add("info-character")
        statusCharacter.id = "status-character"
        statusCharacter.textContent = `🧬 Status: ${characterData.status}` 

        const genderCharacter = document.createElement("li")
        genderCharacter.classList.add("info-character")
        genderCharacter.id = "gender-character"
        genderCharacter.textContent = `🚹 Gender: ${characterData.gender}` 

        divImageInfos.appendChild(img)
        ulCharacter.appendChild(nameCharacter)
        ulCharacter.appendChild(originCharacter)
        ulCharacter.appendChild(statusCharacter)
        ulCharacter.appendChild(genderCharacter)
        divImageInfos.appendChild(ulCharacter)
      
        imagesContainer.appendChild(divImageInfos)
    }

      console.log(episodeInfos)
    } catch (error) {
      console.error("Erro ao buscar episódio", error)
    } 
  })
}

consomeApi()

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

async function consomeApi2(){
    locationBtn.addEventListener("click", async () =>{
    const ulInfos = createUl()

        locationInfos.innerHTML = ""
        locationInfos.classList.remove("hide")
        const locationValue = inputLocation.value
        validInput()

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
