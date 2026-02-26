// Seleção de elementos 

const inputEpisode = document.querySelector("#search-episode-input")
const episodeBtn = document.querySelector("#episode-btn")
const episodeInfos = document.querySelector("#episode-infos h2")

const pageInput = document.querySelector("#search-page-input")
const pageBtn = document.querySelector("#page-btn")

const inputCharacter = document.querySelector("#search-character-input")
const characterBtn = document.querySelector("#character-btn")

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

const introH1 = document.querySelector("#intro h1") 

const characterArea = document.querySelector("#character-area")

const searchBtns = document.querySelectorAll(".search-btn")
const selects = document.querySelectorAll(".filter-select")

const selectAreaH2 = document.querySelector("#selects-container h2")

// Remover o container de inputs ao clicar em qualquer btn
searchBtns.forEach((el)=>{
  el.addEventListener("click", () =>{
    toggleClassList("add", inputsContainer, introH1)
  })
})

// Adiciona ou remove a classe "hide" dinamicamente
function toggleClassList(action, ...elements) {
  elements
    .filter(Boolean)
    .forEach(el => el.classList[action]("hide"))
}

// Restaura o estado inicial da aplicação.
// Limpa inputs, reseta selects, ajusta visibilidade
// dos elementos e remove conteúdos renderizados.

function back(){

  [pageInput, inputCharacter].forEach((el)=> el.value = "")
  toggleClassList("remove", introH1, banner)
  toggleClassList("add", characterArea, backBtn, selectsContainer)
  imagesContainer.innerHTML = ""
  toggleClassList("add", infosContainer, text)
  if(!imagesContainer.classList.contains("hide")){ 
  inputsContainer.classList.remove("hide")
  return 
  }

  selects.forEach((select)=>{
    select.value = ""
  })
      toggleClassList("remove", inputsContainer)
      toggleClassList("add", imagesContainer, infosContainer) 
      toggleClassList("add", backBtn, text)

      array.forEach((el)=>{
        el.remove()
    })   
}

// Chama função back 
backBtn.addEventListener("click", () =>{
  back()
})

// Cria img de carregamento 
const loadingImg = document.createElement("img")
loadingImg.id = "loading-img"
loadingImg.src = "./img/loading.png" 

// EPISODE API ...................................................

// Cria li que será utilizado varias vezes durante o codigo 
function createLi(text, className, id) {
  const li = document.createElement("li")
  li.textContent = text

  if (className) li.classList.add(className)
  if (id) li.id = id

  return li
}

// Função que cria infos dos episodios 
function createEpisodeLis(data){
  return [
    createLi(`Name: ${data.name}`, "list", "name-episode"),
    createLi(`Date release: ${data.air_date}`, "list", "date-release"),
    createLi(`Season/Episode: ${data.episode}`, "list", "episode-season"),
    createLi(`ID: ${data.id}`, "list", "id")
  ]
}

// Cria div de imagens para adicionar imagens e infos dos personagens 
function createDivImgInfos(){
      const divImageInfos = document.createElement("div")
      divImageInfos.classList.add("image-infos")

      return divImageInfos
}

// Cria ul pra adicionar infos dos personagens 
function createUlInfosCharacter(){
      const ulCharacter = document.createElement("ul")
      ulCharacter.classList.add("ul-character")

      return ulCharacter
}

// Cria li de personagens
function createCharacterLis(data) {
  return [
    createLi(`🆔 ID: ${data.id}`, "info-character", "id-character"),
    createLi(`🧬 Name: ${data.name}`, "info-character", "name-character"),
    createLi(`👽 Species: ${data.species}`, "info-character", "species-character"),
    createLi(`⚧ Gender: ${data.gender}`, "info-character", "gender-character"),
    createLi(`🌌 Status: ${data.status}`, "info-character", "status-character"),
    createLi(`🌍 Origin: ${data.origin?.name}`, "info-character", "origin-character"),
    createLi(`📍 Location: ${data.location?.name}`, "info-character", "location-character")
  ]
}

// Valida o input de episódio ou localização.
// Verifica se está vazio ou fora do limite permitido,
// exibe mensagens/feedback visual e retorna false em caso de erro.

function validLocationEpisode(input, infos, EpisodeLocation, value) {
  const rickImg = createRickImage()
  const inputValue = Number(input.value)

  const limits = {
    "search-episode-input": 51,
    "search-location-input": 126
  }

  const maxLimit = limits[value.id]

   if (!inputValue) {
    infos.textContent = `Search for an ${EpisodeLocation}`
    infosContainer.classList.add("no-found")

    rickImg.src = `./img/rick-morty-img2.jpg`
    imagesContainer.appendChild(rickImg)

    toggleClassList("add", inputsContainer, text)
    toggleClassList("remove", infosContainer, backBtn, imagesContainer)

    return false
  }

  if (maxLimit && (inputValue <= 0 || inputValue > maxLimit)) {
    infos.textContent = `Not found ${EpisodeLocation}`
    inputEpisode.value = ""
    inputLocation.value = ""
    inputLocation.disabled = false
    infosContainer.classList.add("no-found")

    rickImg.src = `./img/rick-morty-img.jpg`
    imagesContainer.appendChild(rickImg)

    toggleClassList("remove", imagesContainer, infosContainer, backBtn)
    toggleClassList("add", text, inputsContainer)

    return false
  }

  infosContainer.classList.remove("no-found")
  return true
}

// Chamar função que lida com os episodios 
episodeBtn.addEventListener("click", handleEpisodeClick)

// Manipula a busca de episódio.
// Valida o input, busca dados do episódio,
// carrega seus personagens e renderiza tudo na interface.

async function handleEpisodeClick() {
  pageInput.value = ""

  cleanContainers();
  toggleClassList("add", banner, locationInfos)

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
  } 
}

// Função que faz o fetch dos episodios 
async function fetchEpisode(id) {
  const response = await fetch(`https://rickandmortyapi.com/api/episode/${id}`)
  return response.json()
}

// Delay assíncrono para controlar tempo entre requisições
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Busca múltiplos personagens da API em blocos (chunks)
// Divide os IDs para evitar erro 429 (Too Many Requests)
// Implementa delay entre requisições
// Retorna array final unificado com todos os personagens

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

// Renderiza as informações principais do episódio na interface
// Limpa conteúdo anterior e insere nova lista com dados formatados
// Atualiza estado visual da UI (mostra infos e esconde inputs)

function renderEpisodeInfo(data) {
  episodeInfos.innerHTML = ""

  const ulInfos = createUl()
  createEpisodeLis(data).forEach(li => ulInfos.appendChild(li))
  episodeInfos.appendChild(ulInfos)
    toggleClassList("add", inputsContainer) 
    toggleClassList("remove", episodeInfos, infosContainer)
}
 
// Renderiza todos os personagens de um episódio
// Exibe imagem + informações detalhadas de cada personagem
// Trata erro de carregamento de imagem com placeholder
// Atualiza estado visual da interface

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

// Controla estado de erro na busca por página ou personagem
// Atualiza mensagens, imagem de feedback e estado visual da interface
// Retorna false para interromper fluxo de execução

function validPageCharacter(value, boolean, infos){
  locationInfos.innerHTML = ""
  selectsContainer.classList.add("hide")

  toggleClassList("add", banner)

  const rickImg = createRickImage()
  infos.textContent = `Search for an ${value}`
    infosContainer.classList.add("no-found")
    rickImg.src = `./img/rick-morty-img2.jpg`
    imagesContainer.appendChild(rickImg)
    toggleClassList("add", inputsContainer, text)
    toggleClassList("remove", infosContainer, backBtn, imagesContainer)

    if(boolean === true){
    rickImg.src = `./img/rick-morty-img.jpg`
    infos.textContent = `Not found ${value}`
    selectsContainer.classList.remove("hide")
    }
    return false 
}

// Cria lista de <li> com informações do personagem
// Utiliza classe específica para versão de exibição com filtros/select
// Retorna array de elementos já prontos para inserção no DOM

function createCharacterLisListClass(data) {
  return [
    createLi(`🆔 ID: ${data.id}`, "list-select", "id-character"),
    createLi(`🧬 Name: ${data.name}`, "list-select", "name-character"),
    createLi(`👽 Species: ${data.species}`, "list-select", "species-character"),
    createLi(`⚧ Gender: ${data.gender}`, "list-select", "gender-character"),
    createLi(`🌌 Status: ${data.status}`, "list-select", "status-character"),
    createLi(`🌍 Origin: ${data.origin?.name}`, "list-select", "origin-character"),
    createLi(`📍 Location: ${data.location?.name}`, "list-select", "location-character")
  ]
}

// Fluxo principal da busca por personagens por página
// Valida entrada, busca dados da API, trata resultados inválidos,
// renderiza personagens e atualiza estado da interface

let valueInput 

async function logPages() {
  const pageValue = pageInput.value

  updatePageTitle(pageValue)
  characterArea.classList.remove("hide")

  if (!validatePage(pageValue)) return

  const results = await fetchCharactersByPage(pageValue)

  if (!handleInvalidResults(results)) return

  renderCharacters(results)
  updateUIState()

  valueInput = pageValue
}

// Atualiza o titulo da pagina 
function updatePageTitle(pageValue){
  selectAreaH2.innerHTML = `
    Search characters / specifications on this page <br>
    (page ${pageValue})
  `
}

// Valida se input da pagina tem algum valor digitado 
function validatePage(pageValue) {
  if (!pageValue) {
    characterArea.classList.add("hide")
    validPageCharacter("page", false, episodeInfos)
    return false
  }
  return true
}

// Faz o fetch nos personagens com base no valor da pagina 
async function fetchCharactersByPage(pageValue) {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character?page=${pageValue}`
  )
  const data = await response.json()
  return data.results
}


// Valida o resultado da requisição.
// Se não houver dados, oculta elementos da interface e retorna false.
// Caso contrário, retorna true.

function handleInvalidResults(results) {
  if (!results) {
    characterArea.classList.add("hide")
    validPageCharacter("page", true, episodeInfos)
    selectsContainer.classList.add("hide")
    return false
  }
  return true
}

// Renderiza a lista de personagens na tela.
// Para cada personagem, cria a estrutura (imagem + infos),
// adiciona evento de toggle e insere no container.

function renderCharacters(results) {
  results.forEach((result) => {
    selectsContainer.classList.remove("hide")

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

    createCharacterLisListClass(result).forEach((li) =>
      ul.appendChild(li)
    )

    div.appendChild(img)
    div.appendChild(ul)
    imagesContainer.appendChild(div)
  })
}

// Atualiza o estado da interface,
// exibindo botão de voltar e ajustando visibilidade dos elementos principais.

function updateUIState() {
  toggleClassList("add", inputsContainer)
  backBtn.classList.remove("hide")
  banner.classList.add("hide")
}

// Chama a função de logPages 
pageBtn.addEventListener("click", logPages)

// Renderiza um único personagem na tela,
// criando sua estrutura (imagem + infos) e atualizando o estado da interface.

function renderCharacter(character) {
  
  const div = createDivImgInfos()
  div.classList.add("div-character-select")

  const img = createImg()
  img.classList.add("img-character-select")
  img.src = character.image

  const ul = createUl()
  ul.classList.add("ul-character-select")

  createCharacterLisListClass(character).forEach(li => ul.appendChild(li))

  div.appendChild(img)
  div.appendChild(ul)
  imagesContainer.appendChild(div)

  toggleClassList("add", inputsContainer)
  backBtn.classList.remove("hide")
  banner.classList.add("hide")
}

// Trata os dados recebidos (array ou objeto único)
// e renderiza os personagens na tela, atualizando a interface.

function handleCharacters(data) {

  if (Array.isArray(data)) {
    data.forEach(character => renderCharacter(character))
  } else {
    renderCharacter(data)
  }

  toggleClassList("add", inputsContainer)
  backBtn.classList.remove("hide")
  banner.classList.add("hide")
}

// Manipula a busca de personagem.
// Valida o input, busca os dados da API,
// trata erro de índice inválido e renderiza um ou vários personagens.

async function handleCharacterClick() {
  selects.forEach((el)=> el.value = "")
  selectsContainer.classList.remove("hide")
  imagesContainer.innerHTML = ""

  if(inputCharacter.value === ""){
    validPageCharacter("character", false, episodeInfos)
    selectsContainer.classList.remove("hide")
    return 
  } 

  const characterValue = inputCharacter.value

  const page = `https://rickandmortyapi.com/api/character?page=${valueInput}`
 
    const valueResponse = await fetch(page)
    const data = await valueResponse.json()

    const results = data.results
    if(results){
      infosContainer.classList.add("hide")
    }
 
    if(!characterValue){
      handleCharacters(results)
    }
    else{
        const index = Number(characterValue) - 1

        if(index < 0 || index >= results.length) {
          validPageCharacter("character", true, episodeInfos)
          return
        }

      const character = results[index]

      handleCharacters(character)
  }
}

// Chama a função de handleCharacterClick 
characterBtn.addEventListener("click", handleCharacterClick)

// LOCATION API.....................................................
// Cria Ul que será usado durante o codigo 

function createUl(){
    const ulInfos = document.createElement("ul")
    ulInfos.id = "ul-infos"

    return ulInfos
}

// Cria container de residents 

function createContainerResidents(){
      const containerResidents = document.createElement("div")
      containerResidents.classList.add("container-residents")

      return containerResidents
  }

// Cria e retorna um elemento <img> com a classe padrão de personagem.

function createImg(){
      const img = document.createElement("img")
      img.classList.add("character-img")

      return img 
}

// Cria ul para adicionar infos dos residents 

function createUlResidents(){
      const ulResidents = document.createElement("ul")
      ulResidents.classList.add("ul-residents")

      return ulResidents
}

// Cria li para adicionar infos da localização 

function createLocationLis(data) {
  return [
    createLi(`Name: ${data.name}`, "list", "name-location"),
    createLi(`Dimension: ${data.dimension}`, "list", "dimension"),
    createLi(`Type: ${data.type}`, "list", "type"),
    createLi(`ID: ${data.id}`, "list", "id")
  ]
}

// Cria img de rick para ser adicionada quando não tiver infos / quando o user não digitar nada nas buscas 

function createRickImage(){
    const img = document.createElement("img")
    img.id = "rick-img"

    return img 
}

// Valida se a localização possui residentes.
// Caso não tenha, exibe mensagem e imagem padrão.
// Retorna false se estiver vazio, ou true se houver dados.

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

// Limpa os containers 
function cleanContainers(){
  [episodeInfos, locationInfos, imagesContainer].forEach((el)=>{el.innerHTML = ""})
}

// Divide um array em vários subarrays menores
// com base no tamanho definido (padrão: 20 itens por bloco).

function chunkArray(arr, size = 20) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

let residentsController = null;

// Renderiza as informações da localização,
// criando a lista e adicionando ao container.

function renderLocationInfo(data) {
  const ulInfos = createUl()
  createLocationLis(data).forEach(li => ulInfos.appendChild(li))
  locationInfos.appendChild(ulInfos)
}

// Trata erros da aplicação.
// Exibe mensagem específica para erro 429 (muitas requisições)
// ou mensagem genérica para outras falhas.

function showErrorMessage(err) {
  imagesContainer.innerHTML = ""
  toggleClassList("remove", imagesContainer, text)
 
  if (err.status === 429 || err.message.includes("429")) {
    text.textContent =
      "Too many requests at once. Refresh the page and try again."
      toggleClassList("add", banner, inputsContainer, introH1)
       backBtn.classList.remove("hide")

  } else {
    text.textContent =
      "Search failed. Check your connection and try again."
      toggleClassList("add", banner, inputsContainer, introH1)
       backBtn.classList.remove("hide")
  }
}

// Chama a função de handleLocationClick 

locationBtn.addEventListener("click", handleLocationClick)

// Manipula a busca de localização.
// Controla estado de loading, valida o ID,
// busca dados da localização e seus residentes,
// trata erros e finaliza o carregamento.

let isLoading = false

async function handleLocationClick() {
  infosContainer.classList.remove("hide")
  banner.classList.add("hide")

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

// Inicia o estado de loading.
// Desativa inputs, limpa containers
// e exibe a imagem de carregamento.

function startLoading() {
  isLoading = true;
  [locationBtn, inputLocation].forEach((el)=> el.disabled = true)

  cleanContainers();
  locationInfos.classList.remove("hide");
  imagesContainer.innerHTML = "";
  imagesContainer.appendChild(loadingImg);
}

// Finaliza o estado de loading,
// reativando os elementos desabilitados.

function stopLoading() {
  isLoading = false;
  [locationBtn, inputLocation].forEach((el) => el.disabled = false)
}


// Valida o input da localização.
// Se for inválido, interrompe o fluxo.
// Caso válido, limpa o campo e retorna o ID informado.

function getAndValidateLocationId() {
  if (!validLocationEpisode(inputLocation, locationInfos, "location", inputLocation)) {
    loadingImg.classList.add("hide")
    return 
  }

  loadingImg.classList.remove("hide")
  const value = inputLocation.value.trim();
  inputLocation.value = "";

  return value;
}

// Busca os dados da localização pelo ID,
// renderiza suas informações e retorna os dados obtidos.

async function loadLocation(id) {
  const locationData = await fetchLocation(id);
  renderLocationInfo(locationData);

  return locationData;
}

// Carrega os residentes de uma localização.
// Divide os IDs em blocos, faz requisições em lote,
// controla cancelamento com AbortController
// e retorna todos os residentes carregados.

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

// Verifica se há residentes carregados.
// Caso esteja vazio, exibe mensagem e imagem padrão,
// ajustando a interface.

function validResidentsData(residentsData){
    if (residentsData.length === 0) {
    const rickImg = createImg()
    rickImg.src = `./img/rick-morty-img.jpg`
    rickImg.id = "rick-img"
    rickImg.classList.remove("character-img")
    text.textContent = "No character belong to this place"
    toggleClassList("remove", locationInfos, backBtn)
    imagesContainer.appendChild(rickImg)
    return;
  }
}

// Faz a requisição da localização pelo ID.
// Lança erro caso a resposta não seja válida
// e retorna os dados em formato JSON.

async function fetchLocation(id) {
  const response = await fetch(`https://rickandmortyapi.com/api/location/${id}`);
  if (!response.ok) {
    throw new Error(`Location não encontrada: ${response.status}`);
  }
  return response.json();
}

// Renderiza os residentes da localização.
// Trata estado vazio, aplica lazy loading nas imagens
// e monta a estrutura de cada personagem na interface.

function renderResidents(residentsData) {
  imagesContainer.innerHTML = "";
  [text, imagesContainer].forEach((el) => el.classList.remove("hide"))

  text.textContent = "Characters who belong to this place:";

  validResidentsData(residentsData)

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
    createCharacterLis(resident).forEach(li => ul.appendChild(li))

    container.append(img, ul);
    imagesContainer.appendChild(container);
    toggleClassList("remove", infosContainer,backBtn)
    toggleClassList("add", inputsContainer)
  });
}

// Observer para lazy loading de imagens.
// Carrega a imagem apenas quando ela entra na área visível,
// melhora performance e remove a observação após carregar.

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

// Cria e retorna um placeholder exibido
// quando a imagem do personagem falha ao carregar.

function createImageErrorPlaceholder() {
  const div = document.createElement("div");
  div.className = "image-error";
  div.textContent = "IMAGE NOT LOADED"

  return div;
}

// Controla a exibição do botão "voltar ao topo".
// Mostra o botão apenas quando há rolagem suficiente
// e o usuário atinge o final da página.

const btnTop = document.getElementById("btnTop")

function checkButtonVisibility() {
  const currentScroll = window.scrollY
  const viewportHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  const totalScrollable = documentHeight - viewportHeight
  const isLargeScroll = totalScrollable > 800
  const reachedBottom = currentScroll + viewportHeight >= documentHeight - 5

  if (isLargeScroll && reachedBottom) {
    btnTop.style.display = "block"
  } else {
    btnTop.style.display = "none"
  }
}

window.addEventListener("scroll", checkButtonVisibility)
window.addEventListener("resize", checkButtonVisibility)
checkButtonVisibility()

btnTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
})

// Permite acionar um botão ao pressionar "Enter" no input.
// Vincula dinamicamente input e botão pelos seus IDs.

function activateButtonOnEnter(inputId, buttonId) {
  const input = document.getElementById(inputId)
  const button = document.getElementById(buttonId)

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      button.click()
    }
  })
}

activateButtonOnEnter("search-episode-input", "episode-btn")
activateButtonOnEnter("search-page-input", "page-btn")
activateButtonOnEnter("search-location-input", "location-btn")
activateButtonOnEnter("search-character-input", "character-btn")

// Exporta funções utilitárias e referências de elementos da interface,
// permitindo reutilização e organização modular da aplicação.

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
export { infosContainer }
export { episodeInfos }
export { createRickImage }
export { text }
export { inputCharacter }
export { createCharacterLisListClass }
export { locationInfos }
