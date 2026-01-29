const inputEpisode = document.querySelector("#search-episode-input")
const episodeBtn = document.querySelector("#episode-btn")
const episodeInfos = document.querySelector("#episode-infos h2")

const pageInput = document.querySelector("#search-page-input")
const pageBtn = document.querySelector("#page-btn")

const inputCharacter = document.querySelector("#seach-character-input")
const characterBtn = document.querySelector("#character-btn")
const characterInfos = document.querySelector("#character-infos")

const inputLocation = document.querySelector("#search-location-input")
const locationBtn = document.querySelector("#location-btn")
const locationInfos = document.querySelector("#location-infos h2")

const infosContainer = document.querySelector("#infos")

const imagesContainer = document.querySelector("#images")

const text = document.querySelector("#h2")

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
    inputLocation.disabled = false
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
  if (isEpisodeLoading) return;

  lockEpisodeUI();

  cleanContainers();
  locationInfos.classList.add("hide");

  try {
    if (!validLocationEpisode(inputEpisode, episodeInfos, "episode", inputEpisode)) {
      return;
    }

    const episodeValue = inputEpisode.value;
    inputEpisode.value = "";

    const data = await fetchEpisode(episodeValue);
    renderEpisodeInfo(data);

    if (!validResidents(data.characters, createRickImage())) return;

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

    img.onerror = () => {
      img.remove();
      container.prepend(createImageErrorPlaceholder());
    };

    const ul = createUlInfosCharacter()
    createCharacterLis(character).forEach(li => ul.appendChild(li))

    container.append(img, ul)
    imagesContainer.appendChild(container)
  })
}

// CHARACTER API..................................................

characterBtn.addEventListener("click", hanldeCharacterClick)

async function hanldeCharacterClick(){
  const pageUrl = await logPages()
  console.log(pageUrl)

    const url = `https://rickandmortyapi.com/api/character?page=${pageUrl}`

    const responseUrl = await fetch(url)
    const responsePage = await responseUrl.json()
    const resultsPage = responsePage.results
    const container = createDivImgInfos()

    resultsPage.forEach((result)=>{
      const ul = document.createElement("ul")
      ul.id = "ul-page"

      const name = document.createElement("li")
      name.id = "name-page"
      name.textContent = result.name 

      const img = document.createElement("img")
      img.src = `${result.image}`
      img.id = "page-img"

      imagesContainer.appendChild(img)
      ul.appendChild(name)
      imagesContainer.appendChild(ul)

    })
    console.log(responsePage.results)

    /*console.log(responsePage)
    console.log(url)*/

    const response = await fetch(url)
    const data = await response.json()
    const results = data.results
    results.forEach((result)=>{
      /*console.log(result)*/
    })

    /*console.log(data)*/

    const page = new URL(response.url).searchParams.get("page") || 1;
    console.log("Página atual:", page);
}


async function logPages() {
  const pageValue = pageInput.value
  const page = `https://rickandmortyapi.com/api/character?page=${pageValue}`

  const urlPage = await fetch(page)
  const responseUrlPage = await urlPage.json()
  const results = responseUrlPage.results

  const pageTitle = document.createElement("h2")
  pageTitle.id = "page-title"
  pageTitle.textContent = `Pagina atual: ${pageValue}`
  document.body.appendChild(pageTitle) 

  results.forEach((el)=>{
  /*console.log(el.name, el.origin)*/
  })

  return pageValue
}

pageBtn.addEventListener("click", logPages)

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

  let residentsController = null;

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

locationBtn.addEventListener("click", handleLocationClick)
let isLoading = false

async function handleLocationClick() {
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
  locationBtn.disabled = true;
  inputLocation.disabled = true;

  cleanContainers();
  locationInfos.classList.remove("hide");

  imagesContainer.innerHTML = "";
  imagesContainer.appendChild(loadingImg);
}

function stopLoading() {
  isLoading = false;
  locationBtn.disabled = false;
  inputLocation.disabled = false;
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
  text?.classList.remove("hide");
  imagesContainer.classList.remove("hide");
  text.textContent = "Characters who belong to this place:";

  if (residentsData.length === 0) {
    const rickImg = createImg()
    rickImg.src = `./img/rick-morty-img.jpg`
    rickImg.id = "rick-img"
    rickImg.classList.remove("character-img")
    text.textContent =  "No character belong to this place"
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
      /*img.src = "fallback.png";*/

      imageObserver.unobserve(img); 
      img.remove();                

      const placeholder = createImageErrorPlaceholder();
      container.prepend(placeholder);
    };

    imageObserver.observe(img);

    const ul = createUlResidents();
    createResidentLis(resident).forEach(li => ul.appendChild(li));

    container.append(img, ul);
    imagesContainer.appendChild(container);
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
  div.innerHTML = `<p>Imagens não carregadas</p>
                <br>
                    Tente novamente.`;

  return div;
}


/*
function handle(){

document.addEventListener("click", (e) =>{

  if(target.id === "search-episode-input"){
    let target = e.target
    console.log("episode-input", target)
    target = episodeBtn 
    console.log(target)
  }
})

return target 
}
*/





