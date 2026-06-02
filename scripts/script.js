const campoBusca = document.getElementById("campo-busca");
const listaFilmes = document.getElementById("lista-filmes");

const API_KEY = "SUA_CHAVE_API_AQUI";

const URL_BASE = "https://api.themoviedb.org/3";
const URL_IMAGEM = "https://image.tmdb.org/t/p/w500";

// Função para mostrar os resultados buscados
function mostrarResultados(lista) {
    listaFilmes.innerHTML = "";

    lista.forEach(item => {

        // se caso o item não tiver imagem/poster, ele será ignorado
        if(!item.poster_path) {
            return; // quebra o código aqui
        }

        const titulo = item.title || item.name;

        // pega a nota do filme/série. Se não tiver, mostra "N/A"
        const nota = item.vote_average || "N/A";

        const div = document.createElement("div");
        div.classList.add("filme");

        div.innerHTML = `
                <img src="${URL_IMAGEM + item.poster_path}" alt="${titulo}">
                <div class="info">
                    <h3>${titulo}</h3>
                    <span>⭐ ${nota}</span>
                </div>
        `;

        listaFilmes.appendChild(div);
    })
}

// Função assíncrona para buscar filmes e séries pelo termo digitado
async function buscarTitulos(termoDigitado) {

    // tenta executar a busca na API
    try {
        const resposta = 
                await fetch(`${URL_BASE}/search/multi?api_key=${API_KEY}&query=${termoDigitado}&language=pt-BR`)
        
        const dados = await resposta.json(); // converte a resposta da api em json

        console.log(dados)
        console.log(dados.results)
        mostrarResultados(dados.results)
    }
    catch(erro) {
        console.error("Erro na busca: ", erro);
    }
}

// Faz uma requisição para a API buscando filmes populares
async function buscarPopulares() {
    try {
        const resposta = await fetch(`${URL_BASE}/movie/popular?api_key=${API_KEY}&language=pt-BR`);

        const dados = await resposta.json();
        mostrarResultados(dados.results);
    }
    catch(erro) {
        console.error("Erro ao carregar populares: ", erro);
    }
}

// Adiciona um evento que será executado quando a página terminar de carregar
// O evento chama a função de buscarPoplares ao abrir a página
window.addEventListener("load", buscarPopulares);

// Adiciona um evento no input (campoBusca) para detectar quando o usuário digitar algo
campoBusca.addEventListener("input", () => {
    const termoDigitado = campoBusca.value.trim();

    // Se o usuário digitou mais de 2 caracteres, faz a busca
    if(termoDigitado.length > 2) {
        buscarTitulos(termoDigitado);
    } else {
        // se tiver 2 caracteres ou menos, volta a mostrar os populares
        buscarPopulares();
    }
})