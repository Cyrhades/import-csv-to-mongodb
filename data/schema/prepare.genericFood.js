// On reçois les données d'une ligne CSV au format Json avec le nom de l'entete en tant qu'attribut
module.exports = (row) => {
    row.nutrients = [];
    // On va boucler sur tous les attributs, 
    //tout ce qui commence par nutrients seront gérér spécifiquement;
    for (let [key, value] of Object.entries(row)) {
        
        if(key.indexOf('nutrients.') != -1) {
            value = value.replace(',','.');
            // on crée la bonne clé si la valeur est supérieur à 0
            if(parseFloat(value) > 0) {
                row.nutrients.push({name: key.split('.')[1], quantity : parseFloat(value) });
            }
            // on supprime celle de base
            delete row[key];
        }
        // Gestion des prix (si virgule)
        if(key == 'price') {
            value =  parseFloat(value.replace(',','.'));
        }

    }
    if(typeof row.ingredients === 'string') {
        if(row.ingredients.length > 0 && row.ingredients.indexOf('[') != -1 && row.ingredients.indexOf(']') != -1) {
            row.ingredients = JSON.parse(row.ingredients);
        }
    }


    // On doit retourner la ligne préparée
    return row;
};