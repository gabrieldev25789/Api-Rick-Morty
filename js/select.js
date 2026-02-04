const statusSelect = document.querySelector("#status-select")
const genderSelect = document.querySelector("#gender-select")
const specieSelect = document.querySelector("#species-select")
const locationSelect = document.querySelector("#location-type-select")
const dimensionSelect = document.querySelector("#dimension-select")


async function handleSelects(){
    const url = `https://rickandmortyapi.com/api/character`

    const responseApi = await fetch(url)
    const data = await responseApi.json()

    console.log(data.results)
}

handleSelects()