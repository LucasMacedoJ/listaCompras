// Seleciona os elementos do DOM
const form = document.getElementById('shopping-form');
const itemInput = document.getElementById('item');
const quantityInput = document.getElementById('quantity');
const imageUrlInput = document.getElementById('image-url');
const shoppingList = document.getElementById('shopping-list');
const clearListButton = document.getElementById('clear-list');

// Itens pré-registrados
const defaultItems = [
    { name: 'Maçã', quantity: 3, bought: false, imageUrl: '../imagens/maca.jpeg' },
    { name: 'Pão', quantity: 2, bought: false, imageUrl: 'https://panattos.com.br/uploads/produtos/2017/07/pao-frances-fermentacao-super-longa-massa-congelada.jpg' },
    { name: 'Leite', quantity: 1, bought: false, imageUrl: '../imagens/leite.jpeg' },
];

// Carrega a lista de compras do LocalStorage
document.addEventListener('DOMContentLoaded', loadShoppingList);

// Adiciona um evento de submit ao formulário
form.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita o recarregamento da página
    addItem(itemInput.value, parseInt(quantityInput.value), imageUrlInput.value); // Adiciona o item com quantidade e imagem
    itemInput.value = ''; // Limpa o campo de input
    quantityInput.value = ''; // Limpa o campo de quantidade
    imageUrlInput.value = ''; // Limpa o campo de URL da imagem
});

// Função para adicionar ou atualizar um item na lista
function addItem(item, quantity, imageUrl) {
    let exists = false;

    // Verifica se o item já existe na lista
    const listItems = shoppingList.getElementsByTagName('li');
    for (let i = 0; i < listItems.length; i++) {
        const liItem = listItems[i].childNodes[1].textContent.split(' (')[0];
        if (liItem === item) {
            const currentQuantity = parseInt(listItems[i].getAttribute('data-quantity'));
            const newQuantity = currentQuantity + quantity; // Atualiza a quantidade
            listItems[i].textContent = `${item} (${newQuantity})`; // Atualiza o texto
            listItems[i].setAttribute('data-quantity', newQuantity); // Atualiza o atributo de quantidade
            // Atualiza a imagem, se fornecida
            if (imageUrl) {
                const img = listItems[i].querySelector('img');
                img.src = imageUrl;
            }
            exists = true;
            break;
        }
    }

    // Se o item não existir, adiciona novo item
    if (!exists) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.setAttribute('data-quantity', quantity); // Armazena a quantidade

        // Adiciona a imagem se fornecida
        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.className = 'item-image';
            li.appendChild(img);
        }

        // Adiciona o texto do item
        const textNode = document.createTextNode(`${item} (${quantity})`);
        li.appendChild(textNode);

        // Botão para marcar como comprado
        const boughtBtn = document.createElement('button');
        boughtBtn.textContent = 'Comprado';
        boughtBtn.className = 'btn btn-success btn-sm ml-2';
        boughtBtn.onclick = function() {
            li.classList.toggle('bought'); // Marca ou desmarca como comprado
            saveShoppingList(); // Atualiza o LocalStorage
        };

        // Cria um botão de remover
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remover';
        removeBtn.className = 'btn btn-danger btn-sm';
        removeBtn.onclick = function() {
            shoppingList.removeChild(li); // Remove o item da lista
            saveShoppingList(); // Atualiza o LocalStorage
        };

        // Adiciona os botões ao item
        li.appendChild(boughtBtn);
        li.appendChild(removeBtn);
        shoppingList.appendChild(li); // Adiciona o item à lista
    }

    saveShoppingList(); // Atualiza o LocalStorage
}

// Função para carregar a lista de compras do LocalStorage
function loadShoppingList() {
    const items = JSON.parse(localStorage.getItem('shoppingList')) || [];
    
    // Se não houver itens no LocalStorage, adiciona os itens padrão
    if (items.length === 0) {
        defaultItems.forEach(({ name, quantity, bought, imageUrl }) => {
            addItem(name, quantity, imageUrl);
        });
    } else {
        items.forEach(({ name, quantity, bought, imageUrl }) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.setAttribute('data-quantity', quantity); // Armazena a quantidade

            // Adiciona a imagem se fornecida
            if (imageUrl) {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.className = 'item-image';
                li.appendChild(img);
            }

            // Adiciona o texto do item
            const textNode = document.createTextNode(`${name} (${quantity})`);
            li.appendChild(textNode);

            // Marca como comprado se necessário
            if (bought) {
                li.classList.add('bought');
            }

            // Botão para marcar como comprado
            const boughtBtn = document.createElement('button');
            boughtBtn.textContent = 'Comprado';
            boughtBtn.className = 'btn btn-success btn-sm ml-2';
            boughtBtn.onclick = function() {
                li.classList.toggle('bought'); // Marca ou desmarca como comprado
                saveShoppingList(); // Atualiza o LocalStorage
            };

            // Cria um botão de remover
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.className = 'btn btn-danger btn-sm';
            removeBtn.onclick = function() {
                shoppingList.removeChild(li); // Remove o item da lista
                saveShoppingList(); // Atualiza o LocalStorage
            };

            // Adiciona os botões ao item
            li.appendChild(boughtBtn);
            li.appendChild(removeBtn);
            shoppingList.appendChild(li); // Adiciona o item à lista
        });
    }
}

// Função para salvar a lista de compras no LocalStorage
function saveShoppingList() {
    const items = [];
    const listItems = shoppingList.getElementsByTagName('li');
    for (let i = 0; i < listItems.length; i++) {
        const itemName = listItems[i].childNodes[1].textContent.split(' (')[0];
        const quantity = parseInt(listItems[i].getAttribute('data-quantity'));
        const bought = listItems[i].classList.contains('bought'); // Verifica se o item está comprado
        const imageUrl = listItems[i].querySelector('img') ? listItems[i].querySelector('img').src : ''; // Obtém a URL da imagem, se houver
        items.push({ name: itemName, quantity, bought, imageUrl }); // Salva o nome, a quantidade e o estado
    }
    localStorage.setItem('shoppingList', JSON.stringify(items)); // Atualiza
}
