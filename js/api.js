const inputEpisode = document.querySelector("#search-episode-input")
const episodeBtn = document.querySelector("#episode-btn")
const episodeInfos = document.querySelector("#episode-infos h2")

const pageInput = document.querySelector("#search-page-input")
const pageBtn = document.querySelector("#page-btn")

const inputCharacter = document.querySelector("#search-character-input")
const characterBtn = document.querySelector("#character-btn")
const characterInfos = document.querySelector("#character-infos")

const inputLocation = document.querySelector("#search-location-input")
const locationBtn = document.querySelector("#location-btn")
const locationInfos = document.querySelector("#location-infos h2")

const infosContainer = document.querySelector("#infos")

const imagesContainer = document.querySelector("#images")

const text = document.querySelector("#h2")

const inputsContainer = document.querySelector("#inputs-container")
const selectsContainer = document.querySelector("#selects-container")
const backBtn = document.querySelector("#back")
backBtn.classList.add("hide")

const banner = document.querySelector("#banner")
const inputsAreaText = document.querySelector("#inputs-h2") 
const introH1 = document.querySelector("#intro h1") 

const characterArea = document.querySelector("#character-area")

function toggleClassList(action, ...elements) {
  elements
    .filter(Boolean)
    .forEach(el => el.classList[action]("hide"))
}

[pageBtn, characterBtn, locationBtn, episodeBtn].forEach((el)=>{
  el.addEventListener("click", () =>{
    introH1.classList.add("hide")
  })
})

function back(){
  toggleClassList("remove", introH1,  inputsAreaText, banner)
  toggleClassList("add", characterArea, backBtn)
    imagesContainer.innerHTML = ""
    inputCharacter.value = ""
    toggleClassList("add", infosContainer, text)
  if(!imagesContainer.classList.contains("hide")){
    toggleClassList("remove", inputsContainer, selectsContainer)
    return 
  } 

  const selects = document.querySelectorAll(".filter-select")
  selects.forEach((select)=>{
    select.value = ""
  })
      toggleClassList("remove", selectsContainer, inputsContainer)
      toggleClassList("add", imagesContainer, infosContainer) // add
      toggleClassList("add", backBtn, text) // add
      array.forEach((el)=>{
        el.remove()
    })   
}

backBtn.addEventListener("click", () =>{
  back()
})

const loadingImg = document.createElement("img")
loadingImg.id = "loading-img"
loadingImg.src = "./img/loading.png" 

// EPISODE API ...................................................
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

function createCharacterLis(data){
  return [
    createLi(`Name: ${data.name}`, "info-character", "name-character"),
    createLi(`🌍 Origin : ${data.origin.name}`, "info-character", "origin-character"),
    createLi(`🧬 Status: ${data.status}`, "info-character", "status-character"),
    createLi(`🚹 Gender: ${data.gender}`, "info-character", "gender-character")
  ]
}

function validLocationEpisode(input, infos, EpisodeLocation, value){
  const rickImg = createRickImage()
  const inputValue = input.value
  console.log(value)

  if(!inputValue){
    infos.textContent = `Search for an ${EpisodeLocation}`
    infosContainer.classList.add("no-found")
    rickImg.src = `./img/rick-morty-img2.jpg`
    imagesContainer.appendChild(rickImg)
    toggleClassList("add", selectsContainer, inputsContainer, text) // add
    toggleClassList("remove", infosContainer, backBtn, imagesContainer)
    return false 
  }
  else{
    infosContainer.classList.remove("no-found")
  }

  if(value.id === "search-episode-input" && value.value > 51 
  || value.id === "search-location-input" && value.value > 126){
    infos.textContent = `Not found ${EpisodeLocation}`
    inputLocation.disabled = false
    infosContainer.classList.add("no-found")
    rickImg.src = `./img/rick-morty-img.jpg`
    imagesContainer.appendChild(rickImg)
    toggleClassList("remove", imagesContainer, infosContainer, backBtn)
    toggleClassList("add", text, selectsContainer, inputsContainer) // add
    return false
  } else{
    infosContainer.classList.remove("no-found")
  }
  return true 
}

let isEpisodeLoading = false;

function lockEpisodeUI() {
  isEpisodeLoading = true;
  episodeBtn.disabled = true;
  inputEpisode.disabled = true;
}

function unlockEpisodeUI() {
  isEpisodeLoading = false;
  episodeBtn.disabled = false;
  inputEpisode.disabled = false;
}

episodeBtn.addEventListener("click", handleEpisodeClick)

async function handleEpisodeClick() {
  banner.classList.add("hide")
  inputsAreaText.classList.add("hide")
  pageInput.value = ""
  if (isEpisodeLoading) return;

  lockEpisodeUI();

  cleanContainers();
  locationInfos.classList.add("hide");

  try {
  if (!validLocationEpisode(inputEpisode, episodeInfos, "episode", inputEpisode)) return

    const episodeValue = inputEpisode.value;
    inputEpisode.value = "";

    const data = await fetchEpisode(episodeValue);
    renderEpisodeInfo(data);

    if (!validResidents(data.characters, createRickImage())) return 

    const characters = await fetchCharacters(data.characters);
    renderEpisodeCharacters(characters);

  } catch (err) {
    console.error("Erro ao buscar episódio", err);

  } finally {
    unlockEpisodeUI(); 
  }
}

async function fetchEpisode(id) {
  const response = await fetch(`https://rickandmortyapi.com/api/episode/${id}`)
  return response.json()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchCharacters(characters) {
  imagesContainer.appendChild(loadingImg)

  const ids = characters
    .map(url => url.split("/").pop())
    .filter(Boolean);

  const chunks = chunkArray(ids, 20);
  const result = [];

  for (const chunk of chunks) {
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/${chunk.join(",")}`
      );

      if (!response.ok) {
        throw new Error("Falha ao buscar personagens");
      }

      const data = await response.json();
      result.push(...(Array.isArray(data) ? data : [data]));

      await sleep(400); // anti-429
    } catch (err) {
      console.warn("Falha em um bloco de personagens", err);
    }
  }

  return result;
}

function renderEpisodeInfo(data) {
  episodeInfos.innerHTML = ""

  const ulInfos = createUl()
  createEpisodeLis(data).forEach(li => ulInfos.appendChild(li))
  episodeInfos.appendChild(ulInfos)
    toggleClassList("add", selectsContainer, inputsContainer) // add
    toggleClassList("remove", episodeInfos, infosContainer)
}
 
function renderEpisodeCharacters(charactersData) {
  [text, imagesContainer].forEach((el => el?.classList.remove("hide")))
  imagesContainer.innerHTML = ""

  text.textContent = "Characters appearing in this episode:"

  charactersData.forEach(character => {
    const container = createDivImgInfos()

    const img = createImg()
    img.src = character.image

    img.onerror = () => {
      img.remove();
      container.prepend(createImageErrorPlaceholder());
    };

    const ul = createUlInfosCharacter()
    createCharacterLis(character).forEach(li => ul.appendChild(li))

    container.append(img, ul)
    imagesContainer.appendChild(container)
    backBtn.classList.remove("hide")
    banner.classList.add("hide")

  })
}

// CHARACTER API..................................................

function validPageCharacter(value, boolean, infos){
 
  banner.classList.add("hide")
  inputsAreaText.classList.add("hide")
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

function createInfosLiCharacter(data){
  return [
    createLi(`🧬 Name: ${data.name}`, "list-select", "name"),
    createLi(`👽 Specie: ${data.species}`, "list-select", "specie"),
    createLi(`⚧ Gender: ${data.gender}`, "list-select", "gender"),
    createLi(`📍 Location: ${data.location.name}`, "list-select", "location"),
    createLi(`🌌 Status: ${data.status}`, "list-select", "status"),
    createLi(`🆔 ID: ${data.id}`, "list-select", "id")
  ]
}

let valueInput 

async function logPages(){
  characterArea.classList.remove("hide")
  inputsAreaText.classList.add("hide")
  const pageValue = pageInput.value
  if(!pageValue){
    validPageCharacter("page", false, episodeInfos)
    return 
  }
  const page = `https://rickandmortyapi.com/api/character?page=${pageValue}`
 
   const valueResponse = await fetch(page)
    const data = await valueResponse.json()
   
    const results = data.results 
      if(!results){
        validPageCharacter("page", true, episodeInfos)
      }   
    results.forEach((result)=>{   
      const div = createDivImgInfos()
      div.classList.add("div-character-select")

      const img = createImg()
      img.classList.add("img-character-select")
      img.classList.remove("character-img")
      img.src = result.image 

      const ul = createUl()
      ul.classList.add("ul-character-select", "hide")

      img.addEventListener("click", () => {
          ul.classList.toggle("hide")
      })

      createInfosLiCharacter(result).forEach((li) => ul.appendChild(li))

      div.appendChild(img)
      div.appendChild(ul)
      toggleClassList("add", selectsContainer, inputsContainer)
      backBtn.classList.remove("hide")
      banner.classList.add("hide")
      imagesContainer.appendChild(div)
    })

  console.log(page)

  valueInput = pageValue
}


pageBtn.addEventListener("click", logPages)

function createLiCharacterByPage(data){
  return [
    createLi(`🧬 Name: ${data.name}`, "list-select", "name-location"),
    createLi(`👽 Specie: ${data.species}`, "list-select", "species"),
    createLi(`⚧ Gender: ${data.gender}`, "list-select", "gender"),
    createLi(`📍 Location: ${data.location.name}`, "list-select", "location"),
    createLi(`🌌 Origin: ${data.origin.name}`, "list-select", "origin"),
    createLi(`🆔 ID: ${data.id}`, "list-select", "id")
    ]
}

function renderCharacter(character) {
  inputsAreaText.classList.add("hide")
  
  const div = createDivImgInfos()
  div.classList.add("div-character-select")

  const img = createImg()
  img.classList.add("img-character-select")
  img.src = character.image

  const ul = createUl()
  ul.classList.add("ul-character-select")

  createLiCharacterByPage(character).forEach(li => ul.appendChild(li))

  div.appendChild(img)
  div.appendChild(ul)
  imagesContainer.appendChild(div)

  toggleClassList("add", selectsContainer, inputsContainer)
  backBtn.classList.remove("hide")
  banner.classList.add("hide")
}

function handleCharacters(data) {

  if (Array.isArray(data)) {
    data.forEach(character => renderCharacter(character))
  } else {
    renderCharacter(data)
  }

  toggleClassList("add", selectsContainer, inputsContainer)
  backBtn.classList.remove("hide")
  banner.classList.add("hide")
}

async function handleCharacterClick() {
  imagesContainer.innerHTML = ""
    if(pageInput.value === ""){
      validPageCharacter("page")
      return
  }  

  if(inputCharacter.value === ""){
    validPageCharacter("character")
    return 
  }
  
  const characterValue = inputCharacter.value

  const page = `https://rickandmortyapi.com/api/character?page=${valueInput}`
 
    const valueResponse = await fetch(page)
    const data = await valueResponse.json()

    const results = data.results

    if(!characterValue){
      handleCharacters(results)

      /*createElemtntCharacterClick(results)*/
    }
    else{
        const index = Number(characterValue) - 1

        if(index < 0 || index >= results.length) {
          alert("Personagem não encontrado nessa página")
          return
        }

      const character = results[index]

      handleCharacters(character)

      /*createListCharacters(character)*/
  }
}

characterBtn.addEventListener("click", handleCharacterClick)


// LOCATION API.....................................................
function createUl(){
    const ulInfos = document.createElement("ul")
    ulInfos.id = "ul-infos"

    return ulInfos
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
    createLi(`Name: ${data.name}`, "info-character", "resident-name"),
    createLi(`🚹 Gender: ${data.gender}`, "info-character", "resident-gender"),
    createLi(`🧍‍♂️ Specie: ${data.species}`, "info-character", "resident-specie"),
    createLi(`🧬 Status: ${data.status}`, "info-character", "resident-status")
  ]
}

function createRickImage(){
    const img = document.createElement("img")
    img.id = "rick-img"

    return img 
}

function validResidents(residents, rickImg){
      if(residents.length === 0) {
        [imagesContainer, text].forEach((el)=>{el.classList.remove("hide")})
        text.textContent = "No character belong to this place."
        rickImg.src = `./img/rick-morty-img.jpg`
        imagesContainer.appendChild(rickImg)

        return false
      }
      return true 
}

function cleanContainers(){
  [episodeInfos, locationInfos, imagesContainer].forEach((el)=>{el.innerHTML = ""})
}

function chunkArray(arr, size = 20) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

  let residentsController = null;

  function renderLocationInfo(data) {
  const ulInfos = createUl()
  createLocationLis(data).forEach(li => ulInfos.appendChild(li))
  locationInfos.appendChild(ulInfos)
}

function showErrorMessage(err) {
  imagesContainer.innerHTML = ""
  toggleClassList("remove", imagesContainer, text)
 
  if (err.status === 429 || err.message.includes("429")) {
    text.textContent =
      "Too many requests at once. Refresh the page and try again."
  } else {
    text.textContent =
      "Search failed. Check your connection and try again."
  }
}

locationBtn.addEventListener("click", handleLocationClick)
let isLoading = false

async function handleLocationClick() {
  banner.classList.add("hide")
  inputsAreaText.classList.add("hide")

  pageInput.value = ""
  if (isLoading) return;

  startLoading();

  try {
    const locationId = getAndValidateLocationId();

    if (!locationId) return;

    const locationData = await loadLocation(locationId);
    const residentsData = await loadResidents(locationData.residents);

    renderResidents(residentsData);

  } catch (err) {
    if (err.name === "AbortError") return;

    showErrorMessage(err);
    console.error("Erro ao carregar localização/residentes:", err);

  } finally {
    stopLoading();
  }
}

function startLoading() {
  isLoading = true;
  [locationBtn, inputLocation].forEach((el)=> el.disabled = true)

  cleanContainers();
  locationInfos.classList.remove("hide");
  imagesContainer.innerHTML = "";
  imagesContainer.appendChild(loadingImg);
}

function stopLoading() {
  isLoading = false;
  [locationBtn, inputLocation].forEach((el) => el.disabled = false)
}

function getAndValidateLocationId() {
  if (!validLocationEpisode(inputLocation, locationInfos, "location", inputLocation)) {
    loadingImg.classList.add("hide")
    return null;
  }

  const value = inputLocation.value.trim();
  inputLocation.value = "";

  return value;
}

async function loadLocation(id) {
  const locationData = await fetchLocation(id);
  renderLocationInfo(locationData);

  return locationData;
}

async function loadResidents(residentsUrls) {
  if (!residentsUrls?.length) return [];

  residentsController?.abort();
  residentsController = new AbortController();

  const residentIds = residentsUrls
  .map(url => url.split("/").pop())
  .filter(Boolean);

  const chunks = chunkArray(residentIds, 20);
  let residentsData = [];

  for (const chunk of chunks) {
    const bulkUrl = `https://rickandmortyapi.com/api/character/${chunk.join(",")}`;
    const response = await fetch(bulkUrl, {
    signal: residentsController.signal
    });

    if (!response.ok) {
      throw Object.assign(
        new Error("Too Many Requests"),
        { status: response.status }
      );
    }

    const data = await response.json();
    residentsData.push(...(Array.isArray(data) ? data : [data]));

    await sleep(400);
  }

  return residentsData;
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
  [text, imagesContainer].forEach((el) => el.classList.remove("hide"))

  text.textContent = "Characters who belong to this place:";

  if (residentsData.length === 0) {
    const rickImg = createImg()
    rickImg.src = `./img/rick-morty-img.jpg`
    rickImg.id = "rick-img"
    rickImg.classList.remove("character-img")
    text.textContent = "No character belong to this place"
    imagesContainer.appendChild(rickImg)
    return;
  }

  residentsData.forEach(resident => {
    const container = createContainerResidents();
    const img = createImg();

    img.loading = "lazy";
    img.decoding = "async";
    img.dataset.src = resident.image;

    img.onerror = () => {
      imageObserver.unobserve(img); 
      img.remove();                

      const placeholder = createImageErrorPlaceholder();
      container.prepend(placeholder);
    };

    imageObserver.observe(img);

    const ul = createUlResidents();
    createResidentLis(resident).forEach(li => ul.appendChild(li))

    container.append(img, ul);
    imagesContainer.appendChild(container);
    toggleClassList("remove", infosContainer,backBtn)
    toggleClassList("add", selectsContainer,inputsContainer) // add
  });
}

const imageObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      if (!img.dataset.src) return;

      img.src = img.dataset.src;
      img.removeAttribute("data-src");

      imageObserver.unobserve(img);
    });
  },
  {
    root: imagesContainer,
    rootMargin: "200px",
    threshold: 0.01
  }
);

function createImageErrorPlaceholder() {
  const div = document.createElement("div");
  div.className = "image-error";
  div.textContent = "IMAGE NOT LOADED"

  return div;
}

export { createDivImgInfos }
export { createImg }
export { createUl }
export { createLi }
export { imagesContainer }
export { toggleClassList }
export { selectsContainer }
export { inputsContainer }
export { backBtn }
export { createImageErrorPlaceholder }
