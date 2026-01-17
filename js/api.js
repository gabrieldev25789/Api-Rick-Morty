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

      const ulInfos = document.createElement("ul")
      ulInfos.id = "ul-infos"

    const nameEpisode = document.createElement("li")
    nameEpisode.classList.add("list")
    nameEpisode.id = "name-episode"
    nameEpisode.textContent = data.name 

    const dateRealese = document.createElement("li")
    dateRealese.classList.add("list")
    dateRealese.id = "date-realese"
    dateRealese.textContent = data.air_date

    const episodeSeason = document.createElement("li")
    episodeSeason.classList.add("list")
    episodeSeason.id = "episode-season"
    episodeSeason.textContent = data.episode

    ulInfos.appendChild(nameEpisode)
    ulInfos.appendChild(dateRealese)
    ulInfos.appendChild(episodeSeason)

    episodeInfos.appendChild(nameEpisode)
    episodeInfos.appendChild(dateRealese)
    episodeInfos.appendChild(episodeSeason)

      console.log(episodeInfos)
    } catch (error) {
      console.error("Erro ao buscar episódio", error)
    } 
    
  })
}

consomeApi()


