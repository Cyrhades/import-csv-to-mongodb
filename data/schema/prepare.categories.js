// On reçois les données d'une ligne CSV au format Json avec le nom de l'entete en tant qu'attribut
module.exports = (row) => {
    // On impose la mise en mémoire pour la référence (liaison entre 2 collections)
    row.options = {saveReference : true};    

    if(typeof row.data.parentThemeName !== 'undefined' && row.data.parentThemeName!== '') {
        if(typeof row.references !== 'undefined' && typeof row.references.categories !== 'undefined') {
            let categ = row.references.categories.find(element => element.name === row.data.parentThemeName);
            if(typeof categ !== 'undefined') {
                row.data.parentTheme = categ._id;
            } else {
                // La catégorie parente n'existe pas cela va générer des erreurs,
                // vous devez créer un csv corrects.
            }
        }
    }
    return row;
};