const form = document.querySelector("#form");
const userList = document.querySelector("#users_list");

const cadastrar = (verbo, id) => {

    let nome;
    let email;
    let password;
    let url;
    if (verbo == 'POST') {
        nome = input_nome.value;
        email = input_email.value;
        password = input_password.value;
        url = "http://localhost:8080/users"
    } else {
        nome = input_nome_editar.value;
        email = input_email_editar.value;
        password = input_password_editar.value;
        url = `http://localhost:8080/users/${id}`
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
    fetch("http://localhost:8080/users")
        .then((res) => {
            if (res.ok) return res.json();
            else console.error(res);
        })
        .then((dados) => {
            console.table(dados);
            showUsers(dados);
        })
}


const showUsers = (dados) => {
    userList.innerHTML = '';
    dados.forEach(user => {
        const newForm = document.createElement('form');
        const newInputNome = document.createElement('input');
        const newInputEmail = document.createElement('input');
        const newInputPassword = document.createElement('input');
        const newButtonDiv = document.createElement('div');
        const newButtonEditar = document.createElement('button');
        const newButtonDeletar = document.createElement('button');
        const newButtonAdicionar = document.createElement('button');

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
    fetch(`http://localhost:8080/users/${id}`, {
        method: 'DELETE'
    })
        .then((res) => console.log(res))
        .catch((error) => console.error(error))
}

window.onload = getUsers();