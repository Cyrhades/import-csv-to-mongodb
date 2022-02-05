// On reçois les données d'une ligne CSV au format Json avec le nom de l'entete en tant qu'attribut
module.exports = (row) => {

    // On impose la mise en mémoire pour la référence (liaison entre 2 collections)
    row.options = {saveReference : true};    
    // si il y a un parent module ...
    if(typeof row.data.parentModuleName !== 'undefined' && row.data.parentModuleName !== '') {
      
        // il fait réfrérence à une autre collection (categorie)
        if(typeof row.references !== 'undefined' && typeof row.references.categories !== 'undefined') {
            let categ = row.references.categories.find(element => {
                return element.name === row.data.parentModuleName
            });
            if(typeof categ !== 'undefined') {
                row.data.parentModule = categ._id;
            } else {
                // La catégorie n'existe pas
            }
        }
    }    

    // Nous devons parser les données de exerciceContent
    if(typeof row.data.exerciceContent === 'string') {
        if(row.data.exerciceContent.length > 0 && row.data.exerciceContent.indexOf('[') != -1 && row.data.exerciceContent.indexOf(']') != -1) {
            row.data.exerciceContent = JSON.parse(row.data.exerciceContent);
        }
    }

    return row;
};

