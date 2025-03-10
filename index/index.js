// Seleciona o formulário e a lista de usuários na página
const form = document.querySelector("#form");
const userList = document.querySelector("#users_list");

// Função para cadastrar ou editar um usuário
const cadastrar = (verbo, id) => {
    let nome;
    let email;
    let password;
    let url;

    // Se for um novo cadastro (POST), pega os valores dos inputs principais
    if (verbo == 'POST') {
        nome = input_nome.value;
        email = input_email.value;
        password = input_password.value;
        url = "http://localhost:8080/users";
    } else { // Se for edição (PUT), pega os valores dos inputs de edição
        nome = input_nome_editar.value;
        email = input_email_editar.value;
        password = input_password_editar.value;
        url = `http://localhost:8080/users/${id}`;
    }

    // Verifica se os campos não estão vazios antes de enviar
    if (nome != '' && email != '' && password != '') {
        const newUser = { nome, email, password }; // Cria um objeto com os dados do usuário
        const formattedUser = JSON.stringify(newUser); // Converte o objeto para JSON

        // Faz uma requisição para a API usando fetch
        fetch(url, {
            method: verbo, // Método HTTP (POST ou PUT)
            body: formattedUser, // Corpo da requisição contendo os dados do usuário
            headers: { "Content-Type": "application/json" } // Define o cabeçalho como JSON
        }).then((res) => {
            console.log(res); // Exibe a resposta no console
            getUsers(); // Atualiza a lista de usuários na tela
        }).catch((error) => {
            console.error(error); // Exibe erros no console caso haja falhas
        });
    }
};

// Função para buscar os usuários da API e exibi-los na tela
const getUsers = () => {
    fetch("http://localhost:8080/users")
        .then((res) => {
            if (res.ok) return res.json(); // Converte a resposta para JSON se estiver tudo certo
            else console.error(res);
        })
        .then((dados) => {
            console.table(dados); // Exibe os dados dos usuários no console em formato de tabela
            showUsers(dados); // Exibe os usuários na página
        });
};

// Função para exibir a lista de usuários na tela
const showUsers = (dados) => {
    userList.innerHTML = ''; // Limpa a lista antes de exibir os novos usuários

    dados.forEach(user => {
        const newForm = document.createElement('form'); // Cria um novo formulário para cada usuário
        const newInputNome = document.createElement('input');
        const newInputEmail = document.createElement('input');
        const newInputPassword = document.createElement('input');
        const newButtonDiv = document.createElement('div');
        const newButtonEditar = document.createElement('button');
        const newButtonDeletar = document.createElement('button');
        const newButtonAdicionar = document.createElement('button');

        newButtonDiv.className = 'form_container_button';
        newButtonEditar.textContent = '✏️'; // Ícone de edição
        newButtonDeletar.textContent = '🗑️'; // Ícone de deletar

        // Desabilita os campos para evitar edição direta
        newInputNome.disabled = true;
        newInputEmail.disabled = true;
        newInputPassword.disabled = true;

        // Preenche os inputs com os dados do usuário
        newInputNome.value = user.nome;
        newInputEmail.value = user.email;
        newInputPassword.value = user.password;

        // Evento de edição de usuário
        newButtonEditar.addEventListener('click', (event) => {
            event.preventDefault();
            newButtonDiv.removeChild(newButtonDeletar);
            newButtonDiv.removeChild(newButtonEditar);
            newButtonDiv.appendChild(newButtonAdicionar);

            // Habilita os inputs para edição
            newInputNome.disabled = false;
            newInputEmail.disabled = false;
            newInputPassword.disabled = false;

            // Define IDs para os inputs editáveis
            newInputNome.id = 'input_nome_editar';
            newInputEmail.id = 'input_email_editar';
            newInputPassword.id = 'input_password_editar';

            // Evento de confirmação da edição
            newButtonAdicionar.addEventListener('click', (event) => {
                event.preventDefault();
                cadastrar('PUT', user.id);
            });
        });

        // Evento de exclusão de usuário
        newButtonDeletar.addEventListener('click', (event) => {
            event.preventDefault();
            const confirmacao = confirm("Deseja prosseguir com a exclusão?");
            if (confirmacao) {
                deletar(user.id);
                userList.removeChild(newForm); // Remove o usuário da interface
            }
        });

        // Monta o formulário de cada usuário na tela
        newForm.appendChild(newInputNome);
        newForm.appendChild(newInputEmail);
        newForm.appendChild(newInputPassword);
        newButtonDiv.appendChild(newButtonEditar);
        newButtonDiv.appendChild(newButtonDeletar);
        newForm.appendChild(newButtonDiv);
        userList.appendChild(newForm);
    });

    criarNovo(); // Adiciona o formulário para cadastrar novos usuários
};

// Função para criar o formulário de um novo usuário
const criarNovo = () => {
    const newForm = document.createElement('form');
    const newInputNome = document.createElement('input');
    const newInputEmail = document.createElement('input');
    const newInputPassword = document.createElement('input');
    const newButtonDiv = document.createElement('div');
    const newButtonAdicionar = document.createElement('button');

    newButtonDiv.className = 'form_container_button';
    newButtonAdicionar.textContent = 'Adicionar';

    // Define os placeholders dos campos
    newInputNome.placeholder = 'Digite o nome';
    newInputEmail.placeholder = 'Digite o email';
    newInputPassword.placeholder = 'Digite a senha';

    // Define IDs para os inputs
    newInputNome.id = 'input_nome';
    newInputEmail.id = 'input_email';
    newInputPassword.id = 'input_password';

    // Evento para adicionar um novo usuário
    newButtonAdicionar.addEventListener('click', (event) => {
        event.preventDefault();
        cadastrar('POST');
    });

    // Monta o formulário de novo usuário na tela
    newForm.appendChild(newInputNome);
    newForm.appendChild(newInputEmail);
    newForm.appendChild(newInputPassword);
    newButtonDiv.appendChild(newButtonAdicionar);
    newForm.appendChild(newButtonDiv);
    userList.appendChild(newForm);
};

// Função para deletar um usuário da API
const deletar = (id) => {
    fetch(`http://localhost:8080/users/${id}`, {
        method: 'DELETE'
    })
    .then((res) => console.log(res)) // Exibe a resposta no console
    .catch((error) => console.error(error)); // Exibe erros no console caso haja falhas
};

// Carrega os usuários ao carregar a página
window.onload = getUsers();
