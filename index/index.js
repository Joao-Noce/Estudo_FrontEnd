const form = document.querySelector("#form");
const userList = document.querySelector("#users_list_cards");
const ulList = document.querySelector("#users_list_ul");
const divList = document.querySelector("#users_list_div");

const cadastrar = (verbo, id) => {

    let nome;
    let email;
    let password;
    let url;
    if (verbo == 'POST') {
        nome = input_nome.value;
        email = input_email.value;
        password = input_password.value;
        url = "http://localhost:5000/users"
    } else {
        nome = input_nome_editar.value;
        email = input_email_editar.value;
        password = input_password_editar.value;
        url = `http://localhost:5000/users/${id}`
    }
    if (nome != '' && email != '' && password != '') {
        const newUser = { nome, email, password }
        const formattedUser = JSON.stringify(newUser);

        fetch(url, {
            method: verbo,
            body: formattedUser
        }).then((res) => {
            console.log(res);
            getUsers();
        }).catch((error) => {
            console.error(error);
        })
    }
}

const getUsers = () => {
    fetch("http://localhost:5000/users")
        .then((res) => {
            if (res.ok) return res.json();
            else console.error(res);
        })
        .then((dados) => {
            console.table(dados);
            // showUsers(dados);
            // lista(dados);
            listaDiv(dados);
        })
}


const showUsers = (dados) => {
    userList.innerHTML = '';
    dados.forEach(user => {
        const newForm = document.createElement('form');
        const newSpanId = document.createElement('span');
        const newInputNome = document.createElement('input');
        const newInputEmail = document.createElement('input');
        const newInputPassword = document.createElement('input');
        const newButtonDiv = document.createElement('div');
        const newButtonEditar = document.createElement('button');
        const newButtonDeletar = document.createElement('button');
        const newButtonAdicionar = document.createElement('button');

        newSpanId.textContent = user.id;
        newButtonDiv.className = 'form_container_button';
        newButtonAdicionar.textContent = 'Adicionar';

        newButtonDiv.className = 'form_container_button';
        newButtonEditar.textContent = '✏️';
        newButtonDeletar.textContent = '🗑️';

        newInputNome.disabled = true;
        newInputEmail.disabled = true;
        newInputPassword.disabled = true;

        newInputNome.value = user.nome;
        newInputEmail.value = user.email;
        newInputPassword.value = user.password;

        newButtonEditar.addEventListener('click', (event) => {
            event.preventDefault();
            newButtonDiv.removeChild(newButtonDeletar);
            newButtonDiv.removeChild(newButtonEditar);
            newButtonDiv.appendChild(newButtonAdicionar);
            newInputNome.disabled = false;
            newInputEmail.disabled = false;
            newInputPassword.disabled = false;
            newInputNome.id = 'input_nome_editar'
            newInputEmail.id = 'input_email_editar'
            newInputPassword.id = 'input_password_editar'

            newButtonAdicionar.addEventListener('click', (event) => {
                event.preventDefault();
                cadastrar('PUT', user.id);
            })
        })

        newButtonDeletar.addEventListener('click', (event) => {
            event.preventDefault();
            const confirmacao = confirm("Deseja prosseguir com a exclusão?");
            if (confirmacao) {
                deletar(user.id);
                userList.removeChild(newForm);
            }
        })

        newForm.appendChild(newSpanId);
        newForm.appendChild(newInputNome);
        newForm.appendChild(newInputEmail);
        newForm.appendChild(newInputPassword);
        newButtonDiv.appendChild(newButtonEditar);
        newButtonDiv.appendChild(newButtonDeletar);
        newForm.appendChild(newButtonDiv);
        userList.appendChild(newForm);
    });

    criarNovo();

}

const criarNovo = () => {
    const newForm = document.createElement('form');
    const newInputNome = document.createElement('input');
    const newInputEmail = document.createElement('input');
    const newInputPassword = document.createElement('input');
    const newButtonDiv = document.createElement('div');
    const newButtonAdicionar = document.createElement('button');

    newButtonDiv.className = 'form_container_button';
    newButtonAdicionar.textContent = 'Adicionar';

    newInputNome.placeholder = 'Digite o nome'
    newInputEmail.placeholder = 'Digite o email'
    newInputPassword.placeholder = 'Digite a senha'

    newInputNome.id = 'input_nome'
    newInputEmail.id = 'input_email'
    newInputPassword.id = 'input_password'

    newButtonAdicionar.addEventListener('click', (event) => {
        event.preventDefault();
        cadastrar('POST');
    })

    newForm.appendChild(newInputNome);
    newForm.appendChild(newInputEmail);
    newForm.appendChild(newInputPassword);
    newButtonDiv.appendChild(newButtonAdicionar);
    newForm.appendChild(newButtonDiv);
    userList.appendChild(newForm);
}

const deletar = (id) => {
    fetch(`http://localhost:5000/users/${id}`, {
        method: 'DELETE'
    })
        .then((res) => console.log(res))
        .catch((error) => console.error(error))
}

const lista = (dados) => {
    ulList.innerHTML = '';
    dados.forEach(user => {
        const newLine = document.createElement('li');
        newLine.textContent = `Nome: ${user.nome} | Email: ${user.email}`;

        ulList.appendChild(newLine);
        ulList.innerHTML += `<br>`;
    });
}

const listaDiv = (dados) => {
    divList.innerHTML = '';
    dados.forEach(user => {
        const newDiv = document.createElement('div');
        const newSpanNome = document.createElement('span');
        const newSpanEmail = document.createElement('span');
        const newSpanSenha = document.createElement('span');
        const newEditar = document.createElement('button');
        const newDeletar = document.createElement('button');

        newEditar.textContent = 'Editar';
        newDeletar.textContent = 'Deletar';

        newSpanNome.textContent = user.nome + ' - ';
        newSpanEmail.textContent = user.email + ' - ';
        newSpanSenha.textContent = user.password;

        newDeletar.addEventListener('click', (event) => {
            deletar(user.id);
            divList.removeChild(newDiv);
        })
        newEditar.addEventListener('click', (event) => {
            newSpanNome.id = 'span_nome';
            newSpanEmail.id = 'span_email';
            newSpanSenha.id = 'span_senha';

            const novoNome = prompt("Digite o novo Nome: ", newSpanNome.textContent);
            const novoEmail = prompt("Digite o novo Email: ", newSpanEmail.textContent);
            const novoSenha = prompt("Digite o novo Senha: ", newSpanSenha.textContent);
            newSpanNome.textContent = novoNome;
            newSpanEmail.textContent = novoEmail;
            newSpanSenha.textContent = novoSenha;
            editar(user.id);

        })
        newDiv.appendChild(newSpanNome);
        newDiv.appendChild(newSpanEmail);
        newDiv.appendChild(newSpanSenha);
        newDiv.appendChild(newEditar);
        newDiv.appendChild(newDeletar);
        divList.appendChild(newDiv);
    });
}



function editar(id) {

    const nome = document.getElementById('span_nome').textContent;
    const email = document.getElementById('span_email').textContent;
    const password = document.getElementById('span_senha').textContent;

    fetch(`http://localhost:5000/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            nome,
            email,
            password
        })

    }).then((res) => {
        console.log(res);
        getUsers();

    }).catch((error) => {
        console.log(error);
    })

}

window.onload = getUsers();