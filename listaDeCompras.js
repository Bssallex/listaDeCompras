function obterCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho")) || [];
}

// Agora recebe parâmetro para salvar qualquer carrinho que você passar
function salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

const data = new Date();
const dataBr = data.toLocaleDateString("pt-br");
document.getElementById('data').innerHTML = `Data: ${dataBr}`;

function adicionarProduto() {
    let carrinho = obterCarrinho();

    let produto = document.getElementById('produto').value.trim();
    let quantidade = parseInt(document.getElementById('quantidade').value);
    let preco = parseFloat(document.getElementById('preco').value.replace(",", "."));
    let precoTotal = quantidade * preco;

    if (!produto || isNaN(quantidade) || isNaN(preco)) {
        alert("Preencha todos os campos");
        return;
    } else if (produto == Number(produto)) {
        alert("Insira um nome de produto válido");
        document.getElementById('produto').value = "";
        return;
    } else if (carrinho.some(p => p.produto === produto)) {
        alert(`${produto} já está na lista`);
        document.getElementById('produto').value = "";
        document.getElementById('quantidade').value = "";
        document.getElementById('preco').value = "";
        return;
    }

    const item = {
        produto: produto,
        quantidade: quantidade,
        preco: precoTotal
    }

    carrinho.push(item);
    salvarCarrinho(carrinho);

    document.getElementById('produto').value = "";
    document.getElementById('quantidade').value = "";
    document.getElementById('preco').value = "";

    alert("Produto adicionado com sucesso!");

    renderizarLista();
    pegarNomeDoProduto();
    calcularTotal();
}

function pegarNomeDoProduto() {
    const carrinho = obterCarrinho();

    let select = document.getElementById('removerItem');
    if (!select) return;

    select.innerHTML = "";

    for (let p = 0; p < carrinho.length; p++) {
        const criarOption = document.createElement("option");
        criarOption.textContent = carrinho[p].produto;
        criarOption.value = carrinho[p].produto;
        select.appendChild(criarOption);
    }
}

function removerUmItem() {
    let carrinho = obterCarrinho();

    let itemParaRemover = document.getElementById('removerItem').value;
    const procurarPeloIndex = carrinho.findIndex(c => c.produto === itemParaRemover);

    if (procurarPeloIndex !== -1) {
        carrinho.splice(procurarPeloIndex, 1);
        salvarCarrinho(carrinho);

        renderizarLista();
        pegarNomeDoProduto();
        calcularTotal();
    } else {
        alert("A lista está vazia");
    }
}

function limparLista() {
    const lista = document.getElementById('listaCarrinho');
    if (lista.innerHTML === "") {
        alert("A lista já está vazia.");
        return;
    }

    localStorage.removeItem('carrinho');
    lista.innerHTML = "";
    document.getElementById('total').innerHTML = `Total: R$ 0,00`;

    const select = document.getElementById('removerItem');
    if (select) select.innerHTML = "";
}

function calcularTotal() {
    const carrinho = obterCarrinho();
    let total = carrinho.reduce((acc, item) => acc + item.preco, 0);

    const formatador = new Intl.NumberFormat('pt-br', {
        style: 'currency',
        currency: 'BRL'
    });

    document.getElementById('total').innerHTML = `Total: ${formatador.format(total)}`;
}

function renderizarLista() {
    const carrinho = obterCarrinho();
    const lista = document.getElementById('listaCarrinho');
    if (!lista) return;

    lista.innerHTML = "";

    const formatador = new Intl.NumberFormat('pt-br', {
        style: 'currency',
        currency: 'BRL'
    });

    carrinho.forEach(i => {
        const div = document.createElement('div');
        div.innerHTML = `
        <strong>Produto:</strong> ${i.produto} <br>
        <strong>Quantidade:</strong> ${i.quantidade} <br>
        <strong>Preço:</strong> ${formatador.format(i.preco)}
        `;
        div.style.marginBottom = "10px";
        lista.appendChild(div);
    });
}