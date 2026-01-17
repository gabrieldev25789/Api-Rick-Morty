const input = document.querySelector("#search-input")
const button = document.querySelector("#search-button")
const episodeInfos = document.querySelector("#infos")

async function consomeApi() {

  button.addEventListener("click", async () => {
    const inputValue = input.value

    const url = `https://rickandmortyapi.com/api/episode/${inputValue}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)

      input.value = ""

      const nome = document.createElement("p")
      nome.textContent = data.name 

      episodeInfos.appendChild(nome)
      console.log(episodeInfos)
    } catch (error) {
      console.error("Erro ao buscar episódio", error)
    } 
  })
}

consomeApi()


