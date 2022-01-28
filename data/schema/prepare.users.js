// On reçois les données d'une ligne CSV au format Json avec le nom de l'entete en tant qu'attribut
module.exports = (row) => {

    // On peut préparer des données particuliéres  
    row.nutriments = [];
    if(parseFloat(row.VitamineA) > 0) row.nutriments.push({name : 'VitamineA', value : row.VitamineA});
    if(parseFloat(row.VitamineB) > 0) row.nutriments.push({name : 'VitamineB', value : row.VitamineB});
    if(parseFloat(row.VitamineC) > 0) row.nutriments.push({name : 'VitamineC', value : row.VitamineC});


    // On doit retourner la ligne préparée
    return row;
};