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

function createLi(){
      const nameLocation = document.createElement("li")
      nameLocation.classList.add("list")
      nameLocation.id = "name-location"

      const dimension = document.createElement("li")
      dimension.classList.add("list")
      dimension.id = "dimension"

      const type = document.createElement("li")
      type.classList.add("list")
      type.id = "type"

      
      const id = document.createElement("li")
      id.classList.add("list")
      id.id = "id"

      return [nameLocation, dimension, type, id]
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

            const lists = createLi()
            lists.forEach((li)=>{
              ulInfos.appendChild(li)

              if(li.id === "name-location"){
                li.textContent = `Name: ${data.name}`
              } 

              if(li.id === "dimension"){
                li.textContent = `Dimension: ${data.dimension}`
              } 
              
              if(li.id === "type"){
                li.textContent = `type: ${data.type}`
              } 
              
              if(li.id === "id"){
                li.textContent = `ID: ${data.id}`
              }
            })

            locationInfos.appendChild(ulInfos)

            imagesContainer.innerHTML = ""

            for (const residentsUrl of residents){
              imagesContainer.classList.remove("hide")

              const residentResponse = await fetch(residentsUrl)
              const residentData =  await residentResponse.json()

              text.classList.remove("hide")
              text.textContent = "Characters who belong to this place:"

              const containerResidents = document.createElement("div")
              containerResidents.classList.add("container-residents")

              const img = document.createElement("img")
              img.classList.add("character-img")
              img.src = residentData.image

              const ulResidents = document.createElement("ul")
              ulResidents.classList.add("ul-residents")

              const residentName = document.createElement("li")
              residentName.classList.add("info-character")
              residentName.id = "resident-name"
              residentName.textContent = `Name: ${residentData.name}`

              const residentGender = document.createElement("li")
              residentGender.classList.add("info-character")
              residentGender.id = "resident-gender"
              residentGender.textContent = `🚹 Gender: ${residentData.gender}`

              const residentSpecie = document.createElement("li")
              residentSpecie.classList.add("info-character")
              residentSpecie.id = "resident-specie"
              residentSpecie.textContent = `🧍‍♂️ Specie: ${residentData.species}`

              const residentStatus = document.createElement("li")
              residentStatus.classList.add("info-character")
              residentStatus.id = "resident-status"
              residentStatus.textContent = `🧬 Status: ${residentData.status}`

              ulResidents.appendChild(residentName)
              ulResidents.appendChild(residentGender)
              ulResidents.appendChild(residentSpecie)
              ulResidents.appendChild(residentStatus)

              containerResidents.appendChild(img)
              containerResidents.appendChild(ulResidents)
             
              imagesContainer.appendChild(containerResidents)
              console.log(residentData.name, residentData, residentData.image)
            }

            
        } catch{
            console.error("erro")
        }
    })
}

consomeApi2()




/*
async function consomeApi2() {
  locationBtn.addEventListener("click", async () => {
    const locationValue = inputLocation.value;
    const url = `https://rickandmortyapi.com/api/location/${locationValue}`;

    locationInfos.innerHTML = ""; // limpa antes

    try {
      const response = await fetch(url);
      const data = await response.json();
      const residents = data.residents;

      for (const residentUrl of residents) {
        const residentResponse = await fetch(residentUrl);
        const residentData = await residentResponse.json();

        locationInfos.insertAdjacentHTML(
          "beforeend",
          `
          <div class="resident-card">
            <h3>${residentData.name}</h3>
            <img src="${residentData.image}" alt="${residentData.name}">
          </div>
          `
        );
      }

    } catch (error) {
      console.error("error", error);
    }
  });
}

consomeApi2();
*/
