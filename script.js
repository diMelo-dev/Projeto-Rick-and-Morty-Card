//Initial Data
let warningElement = document.querySelector(".warning");
let species = [];

speciesData();

//Events
document.querySelectorAll('.filter-box input[data-drop]').forEach(item => {
    item.addEventListener('keydown', e => {
        e.preventDefault();
    })
});

document.querySelectorAll('.filter-box input[data-drop]').forEach(item => {
    item.addEventListener('click', dropDown);
});

document.querySelectorAll('.filter-box input[data-drop]').forEach(item => {
    item.addEventListener('focus', dropDown);
});

document.querySelector(".generate-bt").addEventListener('click', makeRequisition);

document.querySelector('.reset-bt').addEventListener('click', resetInputs);

document.querySelector('input[name="name"]').addEventListener('focus', clearInputDropList);

document.querySelector('.back-menu span').addEventListener('click', backMenu);


//Functions
async function speciesData() {
    let url = 'https://rickandmortyapi.com/api/character';

    let req = await fetch(url);
    let json = await req.json();

    for (i in json.results) {//Vai percorrer 20 vezes
        let characterSpecies = json.results[i].species;

        //Se species nao tiver characterSpecies então adiciona

        if (!species.includes(characterSpecies)) {
            species.push(characterSpecies); 
        }
    }

    let nextUrl = json.info.next;
            
        
    for (i=0; i < json.info.pages; i++) {
        let nextPageRequisition = '';
        let nextJson = '';
        //Só posso fazer essa req se nextUrl for
        //diferente de null
        //let nextPageRequisition = await fetch(nextUrl);
        //let nextJson = await nextPageRequisition.json();

        if (nextUrl !== null) { 
            
            //Só posso fazer essa req se a propriedade
            //next da req atual for diferente de null
            nextPageRequisition = await fetch(nextUrl);
            nextJson = await nextPageRequisition.json();
            
            for (k in nextJson.results) {//Vai percorrer 20 vezes
                let characterSpecies = nextJson.results[k].species;
        
                if (!species.includes(characterSpecies)) {
                    species.push(characterSpecies); 
                }
            } 
            nextUrl = nextJson.info.next;
        }
    }

    let dataSpecies = species.join("|");

    let filterSpecies = document.querySelector('input[name="species"');
    filterSpecies.setAttribute('data-drop', dataSpecies);
}

function dropDown(e) {
    let dataDrop = e.target.getAttribute('data-drop');
    clearInputDropList();


    dataDrop = dataDrop.split("|");

    let dropList = document.createElement('div');
    dropList.classList.add('drop-list');
    let options = '';
    for (i in dataDrop) {
        options += `<div class="option">${dataDrop[i]}</div>`;
    }
    dropList.innerHTML = options;
    e.target.parentNode.insertBefore(dropList, e.target.nextSibling);

    document.querySelectorAll(".option").forEach(item => {
        item.addEventListener('click', addInputOption)
    });
}

function addInputOption(e) {
    let option = e.target.innerText;
    let input = e.target.parentNode.parentNode.querySelector("input");
    
    input.value = option;
    clearInputDropList();
}

function clearInputDropList() {
    let dropField = document.querySelector(".drop-list");
    if (dropField) {
        dropField.parentNode.removeChild(dropField);
    }
}

function cardGenerator(character) {
    let cardItem = document.querySelector('.card').cloneNode(true);

    //Registrando as infos do card
    cardItem.querySelector(".card-bg").setAttribute('data-species', speciesValue(character.species));
    cardItem.querySelector('.card--id').innerHTML = `<span>ID</span> ${character.id}`;
    cardItem.querySelector('.card--img img').setAttribute('src', character.img);
    cardItem.querySelector('.card--name').innerHTML = character.name;
    cardItem.querySelector('.card--species').innerHTML = character.species;
    cardItem.querySelector('.card--species').setAttribute('data-species', speciesValue(character.species));
    cardItem.querySelector('div[data-label="status"]').innerHTML = character.status;
    cardItem.querySelector('div[data-label="type"]').innerHTML = character.type;
    cardItem.querySelector('div[data-label="origin"]').innerHTML = character.origin;

    document.querySelector('.card-container').append(cardItem);
    document.querySelector('.filter-box').style.display = 'none';
    document.querySelector('.card-container').style.display = 'flex';
    document.querySelector('.back-menu').style.display = 'block';
    document.querySelectorAll('.bt').forEach(item => {
        item.style.display = 'none';
    });
    document.querySelector('.container h1').style.display = 'none';
    
}

function getInputValues() {
    let inputValues = [];
    document.querySelectorAll('input').forEach(item => {
        inputValues.push(item.value);
    })

    return inputValues;
}

function urlGenerator(valuesObj) {
    let filterUrl = `https://rickandmortyapi.com/api/character/?`;
    
    for (let [key, value] of Object.entries(valuesObj)) {
        if (value !== '') {
            filterUrl += `${encodeURI(key)}=${encodeURI(value)}&`;
        }
    }

    if (filterUrl.slice(-1) === "&") {
        filterUrl = filterUrl.substring(0, filterUrl.length-1);
    }

    if (filterUrl.slice(-2) === "/?") {
        filterUrl = filterUrl.substring(0, filterUrl.length-2);
    }
    
    return filterUrl;
}

async function makeRequisition() {
    let inputValues = getInputValues();
    let name = inputValues[0].toLowerCase();
    let status = inputValues[1].toLowerCase();
    let species = inputValues[2].toLowerCase();

    
    //Utiliza os valores para fazer a busca no filter
    //EXEMPLO DE URL: https://rickandmortyapi.com/api/character/?page=2&name=rick&species=alien&status=alive
    let url = urlGenerator({
        name: name,
        status: status,
        species: species
    });

    fetch(url)
        .then(function(response) {
            if(response.ok !== true) {
                console.log('deu erro');
                throw Error(response.statusText);
            } else {
                return response;
            }
        })
        .then(async function(response) {
            let json = await response.json();

            for (i in json.results) {//Vai percorrer 20 vezes
                let character = json.results[i];
        
                cardGenerator({
                    id: character.id,
                    name: character.name,
                    status: character.status,
                    species: character.species,
                    type: character.type,
                    origin: character.origin.name,
                    originUrl: character.origin.url,
                    img: character.image
                });
            }
        
        
            let nextUrl = json.info.next;
            
        
            for (i=0; i < json.info.pages; i++) {
                let nextPageRequisition = '';
                let nextJson = '';
        
                if (nextUrl !== null) { 
                    nextPageRequisition = await fetch(nextUrl);
                    nextJson = await nextPageRequisition.json();
                    
                    for (k in nextJson.results) {//Vai percorrer 20 vezes
                        let character = nextJson.results[k];
                
                        cardGenerator({
                            id: character.id,
                            name: character.name,
                            status: character.status,
                            species: character.species,
                            type: character.type,
                            origin: character.origin.name,
                            originUrl: character.origin.url,
                            img: character.image
                        });
                    } 
                    nextUrl = nextJson.info.next;
                }
                
        
            }
        })
        .catch(function(error) {
            showWarning('Personagem não encontrado');
            console.log(error);
        });
    
    warningElement.style.display = 'none';
}

function showWarning(msg) {
    warningElement.innerHTML = msg;
    warningElement.style.display = 'block';
}

function speciesValue(speciesName) {
    
    let index = species.findIndex((item, idx) => {
        if (item === speciesName) {
            return idx+1;//Por algum motivo human estava retornando -1
        }
    });

    return index;
}

function resetInputs() {
    document.querySelector('input[name="name"]').value = '';
    document.querySelector('input[name="status"]').value = '';
    document.querySelector('input[name="species"]').value = '';
    document.querySelector('.warning').innerHTML = '';
    clearInputDropList();
}

function backMenu() {
    setTimeout(() => {
        cleanCards();
        resetInputs();
        document.querySelector('.filter-box').style.display = 'flex';
        document.querySelector('.card-container').style.display = 'none';
        document.querySelector('.back-menu').style.display = 'none';
        document.querySelectorAll('.bt').forEach(item => {
            item.style.display = 'inline-block';
        });
        document.querySelector('.container h1').style.display = 'block';
        }, 1000);
}

function cleanCards() {
    let cardContainer = document.querySelector('.card-container');
    cardContainer.querySelectorAll('.card').forEach(item => {
        item.remove();
    });
}



