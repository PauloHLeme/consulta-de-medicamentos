let cardConainer = document.querySelector(".card-container");
let dados = [];
let searchInput = document.querySelector(".search-container input");

async function buscarDados() {
    let resposta = await fetch("data.json");
    dados = await resposta.json();
}

async function iniciarBusca() {
    if (dados.length === 0) {
        await buscarDados();
    }

    let termoBusca = searchInput.value.trim().toLowerCase();
    let dadosFiltrados = dados.filter(dado => dado.nome.toLowerCase().includes(termoBusca));

    renderizarCards(dadosFiltrados);
}

function renderizarCards(dados) {
    if (dados.length === 0) {
        cardConainer.innerHTML = `<p class="no-results">Nenhum medicamento encontrado. Tente um termo de busca diferente.</p>`;
        return;
    }

    cardConainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
            <h2>${dado.nome}</h2>
            <h3>Princípio Ativo: ${dado.principioAtivo}</h3>
            <p>${dado.descricao}</p>
            <h4>Indicações</h4>
            <p>${dado.indicacoes}</p>            
            <details class="collapsible">
                <summary>Efeitos Colaterais</summary>
                <div class="collapsible-content">
                    <div class="efeitos-wrapper">
                        ${Object.entries(dado.efeitosColaterais).map(([categoria, efeitos]) => `
                            <div class="efeitos-categoria">
                                <strong class="categoria">${categoria}</strong>
                                <ul>
                                    ${efeitos.map(efeito => `<li>${efeito}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </details>

            <a href=${dado.linkBula} target="_blank" rel="noopener noreferrer">Leia a Bula Completa</a>
        `
        cardConainer.appendChild(article);
    }
}

// Adiciona um listener para o evento 'input' para busca em tempo real
searchInput.addEventListener("input", iniciarBusca);

// Carrega todos os medicamentos quando a página é iniciada
async function carregarPagina() {
    await iniciarBusca();
}
carregarPagina();

// Adiciona rolagem suave para o topo ao clicar no título
document.getElementById('link-home').addEventListener('click', function(event) {
    event.preventDefault(); // Impede o comportamento padrão do link de pular para o topo
    
    document.querySelector('main').scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});