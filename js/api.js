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
function createLi(text, className, id) {
  const li = document.createElement("li")
  li.textContent = text

  if (className) li.classList.add(className)
  if (id) li.id = id

  return li
}

function createEpisodeLis(data){
  return [
    createLi(`Name: ${data.name}`, "list", "name-episode"),
    createLi(`Date release: ${data.air_date}`, "list", "date-release"),
    createLi(`Season/Episode: ${data.episode}`, "list", "episode-season"),
    createLi(`ID: ${data.id}`, "list", "id")
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

function validLocationEpisode(input, infos, EpisodeLocation, value){
  const rickImg = createRickImage()
  const inputValue = input.value
  console.log(value)

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

  if(value.id === "search-episode-input" && value.value > 51 
  || value.id === "search-location-input" && value.value > 126){
    infos.textContent = `Not found ${EpisodeLocation}`
      inputLocation.disabled = false;
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


episodeBtn.addEventListener("click", handleEpisodeClick)

async function handleEpisodeClick() {
  cleanContainers()
  locationInfos.classList.add("hide")

  if (!validLocationEpisode(inputEpisode, episodeInfos, "episode", inputEpisode)) return

  const episodeValue = inputEpisode.value
  inputEpisode.value = ""

  try {
    const data = await fetchEpisode(episodeValue)
    renderEpisodeInfo(data)

    if (!validResidents(data.characters, createRickImage())) return

    renderEpisodeCharacters(await fetchCharacters(data.characters))
  } catch (err) {
    console.error("Erro ao buscar episódio", err)
  }
}

async function fetchEpisode(id) {
  const response = await fetch(`https://rickandmortyapi.com/api/episode/${id}`)
  return response.json()
}

async function fetchCharacters(characters) {
  imagesContainer.appendChild(loadingImg)
  return Promise.all(
    characters.map(url => fetch(url).then(r => r.json()))
  )
}

function renderEpisodeInfo(data) {
  episodeInfos.innerHTML = ""
  episodeInfos.classList.remove("hide")

  const ulInfos = createUl()
  createEpisodeLis(data).forEach(li => ulInfos.appendChild(li))
  episodeInfos.appendChild(ulInfos)
}

function renderEpisodeCharacters(charactersData) {
  imagesContainer.innerHTML = ""
  text.classList.remove("hide")
  imagesContainer.classList.remove("hide")

  text.textContent = "Characters appearing in this episode:"

  charactersData.forEach(character => {
    const container = createDivImgInfos()

    const img = createImg()
    img.src = character.image

    const ul = createUlInfosCharacter()
    createCharacterLis(character).forEach(li => ul.appendChild(li))

    container.append(img, ul)
    imagesContainer.appendChild(container)
  })
}

// LOCATION API 
function createUl(){
    const ulInfos = document.createElement("ul")
    ulInfos.id = "ul-infos"

    return ulInfos
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
    createLi(`Name: ${data.name}`, "list", "name-location"),
    createLi(`Dimension: ${data.dimension}`, "list", "dimension"),
    createLi(`Type: ${data.type}`, "list", "type"),
    createLi(`ID: ${data.id}`, "list", "id")
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
let isLoading = false

async function fetchResidents(residents) {
  imagesContainer.appendChild(loadingImg)
  return Promise.all(
    residents.map(url => fetch(url).then(r => r.json()))
  )
}

function chunkArray(arr, size = 20) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

  
async function handleLocationClick() {
  if (isLoading) return;
  isLoading = true;

  locationBtn.disabled = true;
  inputLocation.disabled = true;

  cleanContainers();
  locationInfos.classList.remove("hide");

  if (!validLocationEpisode(inputLocation, locationInfos, "location", inputLocation)) {
    isLoading = false;
    return;
  }

  const locationValue = inputLocation.value.trim();
  inputLocation.value = "";

  try {
    const locationData = await fetchLocation(locationValue);
    renderLocationInfo(locationData);

    if (!validResidents(locationData.residents, createRickImage())) {
      isLoading = false;
      return;
    }

    // Mostrar loading
    imagesContainer.innerHTML = "";
    imagesContainer.appendChild(loadingImg);

    const residentIds = locationData.residents
      .map(url => url.split('/').pop())  
      .filter(id => id); 
      let residentsData = [];

    if (residentIds.length > 0) {
      const chunks = chunkArray(residentIds, 20);
    
      for (const chunk of chunks) {
      const bulkUrl = `https://rickandmortyapi.com/api/character/${chunk.join(",")}`;
      
        const response = await fetch(bulkUrl);

        if (!response.ok) {
          throw Object.assign(
          new Error("Too Many Requests"),
        { status: response.status }
          )
        }

    const data = await response.json();
    residentsData.push(...(Array.isArray(data) ? data : [data]));
      };
    }
  
    renderResidents(residentsData);

  }
  catch (err) {
    showErrorMessage(err)
    console.error("Erro ao carregar localização/residentes:", err);
  } 
  finally {
      isLoading = false;
      locationBtn.disabled = false;
      inputLocation.disabled = false;
  }


async function fetchLocation(id) {
  const response = await fetch(`https://rickandmortyapi.com/api/location/${id}`);
  if (!response.ok) {
    throw new Error(`Location não encontrada: ${response.status}`);
  }
  return response.json();
}


function renderResidents(residentsData) {
  imagesContainer.innerHTML = "";
  text?.classList.remove("hide");
  imagesContainer.classList.remove("hide");
  text.textContent = "Characters who belong to this place:";

  if (residentsData.length === 0) {
    imagesContainer.innerHTML = "<p>Nenhum residente encontrado.</p>";
    return;
}

 residentsData.forEach(resident => {
  const container = createContainerResidents();
  const img = createImg();

  img.loading = "lazy";
  img.decoding = "async";

  img.dataset.src = resident.image;

  img.onerror = () => {
    img.src = "fallback.png";
  };

  imageObserver.observe(img);

  const ul = createUlResidents();
  createResidentLis(resident).forEach(li => ul.appendChild(li));

  container.append(img, ul);
  imagesContainer.appendChild(container);
});

  };
}

const imageObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      img.src = img.dataset.src;

      imageObserver.unobserve(img);
    });
  },
  {
    rootMargin: "200px",
    threshold: 0.01
  }
);

function renderLocationInfo(data) {
  const ulInfos = createUl()
  createLocationLis(data).forEach(li => ulInfos.appendChild(li))
  locationInfos.appendChild(ulInfos)
}

function showErrorMessage(err) {
  imagesContainer.innerHTML = ""
  imagesContainer.classList.remove("hide")
  text.classList.remove("hide")

  if (err.status === 429 || err.message.includes("429")) {
    text.textContent =
      "Muitas requisições de uma vez. Atualize a página e tente novamente."
  } else {
    text.textContent =
      "Falha na busca. Verifique sua conexão e tente novamente."
  }
}
