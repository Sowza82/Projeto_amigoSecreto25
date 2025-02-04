let amigos = [];

// Função para adicionar amigo à lista
function adicionarAmigo() {
    const nomeAmigo = document.getElementById('amigo').value.trim();

    if (nomeAmigo === '') {
        alert('Por favor, insira um nome!');
        return;
    }

    // Validação aprimorada: permite letras com acentos e espaços, mas não números ou caracteres especiais indevidos
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nomeAmigo)) {
        alert('O nome do amigo não pode conter números ou caracteres especiais!');
        return;
    }

    if (amigos.includes(nomeAmigo)) {
        alert('Este nome já foi adicionado!');
        return;
    }

    amigos.push(nomeAmigo);
    atualizarLista();
    document.getElementById('amigo').value = '';
    salvarLista();
}

// Função para atualizar a lista de amigos na interface
function atualizarLista() {
    const listaAmigos = document.getElementById('listaAmigos');
    listaAmigos.innerHTML = '';

    amigos.forEach((amigo, index) => {
        const li = document.createElement('li');
        li.textContent = amigo;

        const removerBtn = document.createElement('button');
        removerBtn.textContent = '❌';
        removerBtn.classList.add('btn', 'btn-danger', 'ms-2');
        removerBtn.onclick = () => removerAmigo(index);

        li.appendChild(removerBtn);
        listaAmigos.appendChild(li);
    });
}

// Função para remover um amigo da lista
function removerAmigo(index) {
    amigos.splice(index, 1);
    atualizarLista();
    salvarLista();
}

// Função para resetar a lista de amigos e limpar o sorteio
function resetarLista() {
    amigos = [];
    atualizarLista();
    salvarLista();

    document.getElementById('resultado').innerHTML = '';
    document.getElementById('reset-container').style.display = 'none';
}

// Função para sortear um amigo secreto aleatório
function sortearAmigo() {
    if (amigos.length === 0) {
        alert('Adicione ao menos um amigo!');
        return;
    }

    const resultado = document.getElementById('resultado');
    resultado.textContent = 'Sorteando...';

    setTimeout(() => {
        const sorteado = amigos[Math.floor(Math.random() * amigos.length)];
        resultado.textContent = `${sorteado} é o amigo secreto!`;

        gerarConfetes();
        document.getElementById('reset-container').style.display = 'block';
    }, 2000);
}

// Função para gerar confetes
function gerarConfetes() {
    const numConfetes = 50;
    const confetesContainer = document.getElementById('confetes-container');
    
    for (let i = 0; i < numConfetes; i++) {
        const confete = document.createElement('div');
        confete.classList.add('confete');
        confete.style.position = 'absolute';
        confete.style.left = `${Math.random() * 100}%`;
        confete.style.top = '-10px';
        confete.style.animation = `queda 2s ease-out forwards`;
        confete.style.width = `${Math.random() * 10 + 5}px`;
        confete.style.height = `${Math.random() * 10 + 5}px`;
        confete.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;
        confete.style.borderRadius = '50%';
        
        confetesContainer.appendChild(confete);

        setTimeout(() => confete.remove(), 2000);
    }
}

// Função para sortear todos os amigos sem que ninguém tire a si mesmo
function sortearAmigos() {
    if (amigos.length < 2) {
        alert('Você precisa de pelo menos 2 amigos para realizar o sorteio!');
        return;
    }

    let sorteados = [...amigos];
    let resultados = [];
    let tentativas = 0;
    let sucesso = false;

    while (tentativas < 100) {
        sorteados = [...amigos].sort(() => Math.random() - 0.5);
        if (!amigos.some((amigo, i) => amigo === sorteados[i])) {
            sucesso = true;
            break;
        }
        tentativas++;
    }

    if (!sucesso) {
        alert('Não foi possível sortear sem que alguém tirasse a si mesmo. Tente novamente.');
        return;
    }

    amigos.forEach((amigo, i) => {
        resultados.push(`${amigo} tirou ${sorteados[i]}`);
    });

    document.getElementById('resultado').innerHTML = resultados.join('<br>');
}

// Função para salvar a lista de amigos no LocalStorage
function salvarLista() {
    localStorage.setItem('amigos', JSON.stringify(amigos));
}

// Função para carregar a lista de amigos do LocalStorage
function carregarLista() {
    const listaSalva = JSON.parse(localStorage.getItem('amigos'));
    if (listaSalva) {
        amigos = listaSalva;
        atualizarLista();
    }
}

// Evento para carregar a lista ao iniciar a página
window.onload = carregarLista;

// Evento para adicionar amigo ao pressionar Enter no input
document.getElementById('amigo').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        adicionarAmigo();
    }
});
