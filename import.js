/**
 * @author LECOMTE Cyril
 * @version 0.3
 * @description Importer des CSV dans MongoDB
 */
const mongoose = require('mongoose');   // est un client mongoDB
const csv = require('csv-parser');  // permet de lire un fichier csv et de le transformer en json
const fs = require('fs');           // permet de manipuler les fichiers (ici pour vérifier l'existance des fichiers)
require('dotenv').config();         // permet de lire les fichiers .env

let drop = false;       // si true, on supprime toutes la collection
let verbose = false;    // servira à activer le mode verbeux
let files = [];         // contiendra le nom des fichiers à importer
let promises = [];      // contiendra les différentes promesses pour mettre fins au processus
let separator = ',';    // permet de gérer le séparateur CSV
let references = {};    // objet qui peut être utilisé pour mémoriser les réfernces

/** Connexion à MongoDB **/
mongoose.connect(
    process.env.MONGODB_URI, 
    {connectTimeoutMS : 3000, socketTimeoutMS: 20000, useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;

/**
 * La fonction d'import
 */
function importInMongoDB(file)
{
    let promises = [];
    let prepareData = (row) => row;
    let rows = [];

    return new Promise(async (resolve, reject) => {
        // si le fichier CSV existe
        if (fs.existsSync(`./data/csv/${file}.csv`)) {
            // Si le Schema Mongoose existe
            if (fs.existsSync(`./data/schema/${file}.js`)) {
                // On importe le fichier CSV dans MongoDB
                if (fs.existsSync(`./data/schema/prepare.${file}.js`)) {
                    prepareData = require(`./data/schema/prepare.${file}.js`);
                }
                let currentSchema = require(`./data/schema/${file}.js`);
                let Schema = mongoose.model(file, currentSchema);
                // si l'option drop a était activé
                if(drop === true) { 
                    // On doit attendre la suppresion de la collection avant de continuer
                    await function() {
                        db.dropCollection(file).then(() => {
                            console.log(`La collection "${file}" a été supprimée.`);
                        }).catch(() => {
                            console.log(`La collection "${file}" n'existe pas et n'a pas été supprimée.`);
                        });
                    }();
                }

                // On lit le fichier CSV
                fs.createReadStream(`./data/csv/${file}.csv`)
                    .pipe(csv({separator: separator}))
                    .on('data', (row) => rows.push(row))
                    .on('end', async () => {
                        for (let row of rows) {
                            // prpéaration des données
                            row = prepareData({data : row, references, options:{} });
                            // On enregistre la ligne dans la base de données
                            const saveRow = await saveInBdd(Schema, prepareData, file, row).then().catch();
                            // On pousse chaque promesses dans un tableau
                            promises.push(saveRow);
                        }
                        // Quand chaque promesse(insertion de ligne) est terminée
                        Promise.all(promises).then(resolve).catch(reject);
                    });
            }
            // Le Schema Mongoose n'existe pas
            else {
                console.log(`./data/schema/${file}.js n'existe pas`);
                reject();
            }
        }
        // Le fichier CSV n'existe pas
        else {
            console.log(`./data/csv/${file}.csv n'existe pas`);
            reject();
        }
    });
}

function saveInBdd(Schema,prepareData, file, row)
{    
    return (new Schema(row.data)).save().then((data) => {
        if(data) {
            if(row.options.saveReference === true) {
                if(typeof references[file] === 'undefined') references[file] = [];
                //  @todo : permettre la sauvegarde uniquement des informations nécessaires à la référence
                references[file].push(data);
            }
        }
        if(verbose) {
            if(data) {
                console.log(`Ligne ${JSON.stringify(row)}`);
            } else {
                console.log(`Erreur : ${JSON.stringify(row)}`);
            }
        }
    }).catch((error) => {                           
        if(verbose) {
            if(error.code == 11000) 
                console.log(`Duplicate key : ${JSON.stringify(row)}`);
            else
                console.log(`Erreur : ${error}`);
        }
        //console.log(error)
        console.log(`L'import ${file}.csv a été arrété car une erreur est survenue.`);
    });
}

// premiere boucle pour vérifier si le mode verbeux est activé et récupérer les noms des fichiers à importer
for (let i = 2; i < process.argv.length; i++) {
    switch(process.argv[i]) {
        case '-v': verbose = true; break;
        case '-s': separator = process.argv[++i]; break;
        case '-d': drop = true; break;
        default: files.push(process.argv[i]);
    }
}

db.once('open', async () => {
    // On récupére la liste des fichiers à importer
    for (let file of files) {
        promises.push(await importInMongoDB(file).then().catch());
    }

    // On peut arréter le processus
    Promise.all(promises).then(process.exit).catch(process.exit);
});