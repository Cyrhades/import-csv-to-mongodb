// On reçois les données d'une ligne CSV au format Json avec le nom de l'entete en tant qu'attribut
module.exports = (row) => {

    // On peut préparer des données particuliéres  
    row.data.nutriments = [];
    if(parseFloat(row.data.VitamineA) > 0) row.data.nutriments.push({name : 'VitamineA', value : row.data.VitamineA});
    if(parseFloat(row.data.VitamineB) > 0) row.data.nutriments.push({name : 'VitamineB', value : row.data.VitamineB});
    if(parseFloat(row.data.VitamineC) > 0) row.data.nutriments.push({name : 'VitamineC', value : row.data.VitamineC});


    // On doit retourner la ligne préparée
    return row;
};