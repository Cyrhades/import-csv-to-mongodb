/**
 * @author LECOMTE Cyril
 * @version 0.1
 * @description Importer des CSV dans MongoDB
 */
const mongoose = require('mongoose');   // est un client mongoDB
const csv = require('csv-parser');  // permet de lire un fichier csv et de le transformer en json
const fs = require('fs');           // permet de manipuler les fichiers (ici pour vérifier l'existance des fichiers)
const { createHmac } = require('crypto');
require('dotenv').config();         // permet de lire les fichiers .env

let verbose = false;    // servira à activer le mode verbeux
let files = [];         // contiendra le nom des fichiers à importer
let promises = [];      // contiendra les différentes promesses pour mettre fins au processus


/** Connexion à MongoDB **/
mongoose.connect(
    process.env.MONGODB_URI, 
    {connectTimeoutMS : 3000, socketTimeoutMS: 20000, useNewUrlParser: true, useUnifiedTopology: true }
);

/**
 * La fonction d'import
 */
function importInMongoDB(file)
{
    let promises = [];
    let prepareData = (row) => row;

    return new Promise((resolve, reject) => {
        // si le fichier CSV existe
        if (fs.existsSync(`./data/csv/${file}.csv`)) {
            // Si le Schema Mongoose existe
            if (fs.existsSync(`./data/schema/${file}.js`)) {
                // On importe le fichier CSV dans MongoDB
                if (fs.existsSync(`./data/schema/prepare.${file}.js`)) {
                    prepareData = require(`./data/schema/prepare.${file}.js`);
                }
                // chargement du Schema
                let currentSchema = require(`./data/schema/${file}.js`);
                let Schema = mongoose.model(file, currentSchema); ;
                // On lit le fichier CSV
                fs.createReadStream(`./data/csv/${file}.csv`)
                    .pipe(csv())
                    .on('data', (row) => {
                        // prpéaration des données
                        row = prepareData(row);
                        
                        let rowInserted = (new Schema(row)).save().then(() => {
                            if(verbose) {
                                if(rowInserted) {
                                    console.log(`Ligne ${JSON.stringify(row)}`);
                                } else {
                                    console.log(`Erreur : ${JSON.stringify(row)}`);
                                }
                            }
                        }).catch((error) => {                            
                            if(verbose) {
                                if(error.code == 11000) 
                                    console.log(`Duplicate key : ${JSON.stringify(row)}`);
                            }
                            console.log(`L'import ${file}.csv a été arrété car une erreur est survenue.`);
                            reject();
                        });
                        promises.push(rowInserted);

                    })
                    .on('end', () => {
                        // On attend que toutes les lignes soient insérées
                        Promise.all(promises).then(() => {
                            console.log(`Import ${file}.csv terminé`);
                            resolve();
                        });
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

// premiere boucle pour vérifier si le mode verbeux est activé et récupérer les noms des fichiers à importer
process.argv.slice(2).forEach((arg) => {
    if (arg === '-v') verbose = true; 
    else files.push(arg);
});

// On récupére la liste des fichiers à importer
files.forEach((file) => {
    promises.push(importInMongoDB(file));
});

// On peut arréter le processus
Promise.all(promises).then(process.exit).catch(process.exit);
