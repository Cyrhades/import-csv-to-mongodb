// On reçois les données d'une ligne CSV au format Json avec le nom de l'entete en tant qu'attribut
module.exports = (row) => {
    console.log(row)
    row.data.nutrients = [];
    // On va boucler sur tous les attributs, 
    //tout ce qui commence par nutrients seront gérér spécifiquement;
    for (let [key, value] of Object.entries(row.data)) {
        
        if(key.indexOf('nutrients.') != -1) {
            value = value.replace(',','.');
            // on crée la bonne clé si la valeur est supérieur à 0
            if(parseFloat(value) > 0) {
                row.data.nutrients.push({name: key.split('.')[1], quantity : parseFloat(value) });
            }
            // on supprime celle de base
            delete row.data[key];
        }
        // Gestion des prix (si virgule)
        if(key == 'price') {
            value =  parseFloat(value.replace(',','.'));
        }

    }
    if(typeof row.data.ingredients === 'string') {
        if(row.data.ingredients.length > 0 && row.data.ingredients.indexOf('[') != -1 && row.data.ingredients.indexOf(']') != -1) {
            row.data.ingredients = JSON.parse(row.data.ingredients);
        }
    }

    // On doit retourner la ligne préparée
    return row;
};