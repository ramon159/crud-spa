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
const ul = document.getElementById('viewData');
const createElement = (id, name, age) => {
    const li = document.createElement('li');
    const nameLabel = document.createElement('label');
    const ageLabel = document.createElement('label');
    const buttonEdit = document.createElement('button');
    const buttonDelete = document.createElement('button');

    //buttonEdit.setAttribute()
    buttonDelete.setAttribute('onclick', 'deleteData(this)');
    buttonEdit.setAttribute('onclick', 'editData(this)');
    buttonEdit.textContent = 'Edit';
    buttonDelete.textContent = 'Delete';

    nameLabel.textContent = name;
    ageLabel.textContent = age;
    li.appendChild(nameLabel);
    li.appendChild(ageLabel);
    li.appendChild(buttonEdit);
    li.appendChild(buttonDelete);
    li.id = id

    ul.insertBefore(li, null);
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
            createElement(Number.parseInt(ul.lastElementChild.id)+1, response.name, response.age);
        }
    );
};
const deleteElement = (self) => {
    self.remove();
};
const deleteData = (self) => {
    ajax('/delete', 'POST', {id: self.parentNode.id}, (response) => {
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

const editData = (self) => {
    
}