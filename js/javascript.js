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
    const labelName = document.createElement('label');
    const labelAge = document.createElement('label');
    const buttonEdit = document.createElement('button');
    const buttonDelete = document.createElement('button');
    const inputInnerName = document.createElement('input');
    const inputInnerAge = document.createElement('input')

    //attributes
    buttonDelete.setAttribute('onclick', 'deleteData(this)');
    buttonEdit.setAttribute('onclick', 'editElement(this)');
    inputInnerName.setAttribute('class', 'inputInnerName')
    inputInnerAge.setAttribute('class', 'inputInnerAge')
    labelName.setAttribute('class', 'labelName')
    labelAge.setAttribute('class', 'labelAge')

    //text
    buttonDelete.textContent = 'Delete';
    buttonEdit.textContent = 'Edit';
    labelName.textContent = name;
    labelAge.textContent = age;

    //styles
    inputInnerName.style.display = 'none';
    inputInnerAge.style.display = 'none';

    //appends
    li.appendChild(labelName);
    li.appendChild(labelAge);
    li.appendChild(inputInnerName);
    li.appendChild(inputInnerAge);
    li.appendChild(buttonEdit);
    li.appendChild(buttonDelete);
    li.id = id

    if (ul.childNodes[0]){
        ul.insertBefore(li, ul.childNodes[0]);
    } else {
        ul.appendChild(li)
    }
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

const editElement = (self) => {
    const li = self.parentNode;
    const inputInnerAge = li.getElementsByClassName('inputInnerAge')[0]
    const inputInnerName = li.getElementsByClassName('inputInnerName')[0]
    const labelAge = li.getElementsByClassName('labelAge')[0]
    const labelName = li.getElementsByClassName('labelName')[0]
    const id = li.id

    if (inputInnerAge.style.display == 'none') {
        inputInnerAge.value = labelAge.textContent
        inputInnerName.value = labelName.textContent
        inputInnerAge.style.display = 'inline';
        inputInnerName.style.display = 'inline';
    } else {
        updateData(id, inputInnerName.value, inputInnerAge.value, (response) => {
            labelAge.textContent = response.age;
            labelName.textContent = response.name;
        })
        inputInnerAge.style.display = 'none';
        inputInnerName.style.display = 'none';     
    }
}
const updateData = (id, name, age, callback) => {
    ajax('/update', 'POST', {id: id, name: name, age: age}, (response) => {
        callback(response)
    })
}
