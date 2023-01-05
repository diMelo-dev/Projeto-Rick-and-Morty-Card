//Dados Iniciais
let species = [];
makeSpeciesReq();

//Eventos


//Funções
async function makeSpeciesReq() {
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

    console.log(species);
}

