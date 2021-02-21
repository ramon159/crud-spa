const ajax = function (url, method, data, callback) {
    axios({
        method: method,
        url: url,
        data: data,
    })
        .then((response) => {
            return callback(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
};
const table = document.getElementById('viewData');

const createElement = (id, name, age) => {

    const tr = `        
        <tr id="${id}">
            <td><input type="checkbox"></td>
            <td class="name">${name}</td>
            <td class="age">${age}</td>
            <td>
            <input class="inputName" style="visibility: hidden" value="${name}">
            </td>
            <td><input class="inputAge" style="visibility: hidden" value="${age}"></td>
            <td>
                <button onclick="editElement(this)" class="buttonEdit">Editar</button>
                <button onclick="deleteData(this)" class="buttonDelete">Deletar</button>
            </td>
        </tr>
        `
    const tBody = table.querySelector("tbody");
    tBody.innerHTML += tr;
};
const createData = (self) => {
    const inputName = document.getElementById('name').value;
    const inputAge = document.getElementById('age').value;
    ajax(
        '/create',
        'POST',
        {
            name: inputName,
            age: inputAge,
        },
        (response) => {
            createElement(response.id, response.name, response.age);
            console.log(response)
        }
    );
};
const deleteElement = (self) => {
    self.remove();
};
const deleteData = (self) => {
    const id = self.parentNode.parentNode.id;
    ajax('/delete', 'POST', {id: id}, (response) => {
        deleteElement(document.getElementById(response.id))
    });
};

const read = () => {
    ajax('/read', 'GET', {}, (response) => {
        const data = response.data;
        data.forEach((dados) => {
            createElement(dados.id, dados.name, dados.age);
        });
    });
};
read();

const editElement = (self) => {
    const tr = self.parentNode.parentNode;
    const inputName = tr.getElementsByClassName('inputName')[0]
    const inputAge = tr.getElementsByClassName('inputAge')[0]
    const name = tr.getElementsByClassName('name')[0]
    const age = tr.getElementsByClassName('age')[0]

    const display = (self, property) => {self.style.visibility = property}

    if (inputAge.style.visibility === 'hidden') {
        display(inputAge, 'visible')
        display(inputName, 'visible')
    } else {
        updateData(tr.id, inputName.value, inputAge.value, (response) => {
            age.textContent = response.age;
            name.textContent = response.name;
        })
        display(inputName, 'hidden');
        display(inputAge, 'hidden')
    }

}
const updateData = (id, name, age, callback) => {
    ajax('/update', 'POST', {id: id, name: name, age: age}, (response) => {
        callback(response)
    })
}
