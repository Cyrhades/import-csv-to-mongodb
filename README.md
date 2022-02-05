# Systeme d'import CSV vers MongoDB

**Télécharger**
> git clone https://github.com/Cyrhades/import-csv-to-mongodb

**Installer**
> npm install

Vous devez également créez un fichier **.env**
pour créer une variable d'environnement nommé **MONGODB_URI**
**Exemple :**
  
     MONGODB_URI=mongodb+srv://**<username>**:**<password>**@**<cluster>**.mongodb.net/**<bdd_name>**



**Utilisation**
Dans le contenu du repository un exemple est mis en exemple pour vous montrer l'utilisation de l'import.

(obligatoire) Déposez votre fichier csv dans **./data/csv/<NOM_FICHIER>.csv**
(obligatoire) Créez un fichier du même nom que votre csv dans avec une extension js  **./data/schema<NOM_FICHIER>.js** qui devra contenir un schema mongoose.
(facultatif) Si des données ont besoins d'être modifiés, créez un fichier prepare.<NOM_FICHIER>.js. (voir exemple)


**IMPORTANT :** Le nom du fichier sera le nom de la collection
Par défaut le séparateur de colonne dans les CSV est la virgule ','.
Il est possible d'envoyer le parametre -s suivi du séprateur souhaité.


> node import  <fichier1> <fichier2> <fichierN>

Exemple :
> node import users  orders settings

*Vous ne devez pas mettre l'extension dans la commande*

Option : **-v** permet d'activer le mode verbeux
> node import -v <fichier1> <fichier2> <fichierN>

Exemple :
> node import -v users orders settings

Option : **-s** permet de modifier le séparateur par défaut

**IMPORTANT :** Si vous utilisez l'option -d (drop collection), chaque collection correspondante à un fichier d'import sera supprimée
Option : **-d** permet de supprimer la collection des fichiers chargés pour l'import

Exemple :
> node import -d users orders settings
> node import categories exos -d
Les collections users, orders et settings seront supprimées avant l'import


Exemples d'utilisation des fichiers fournis :
> node import users 
> node import dishes drinks desserts -s ";"


Pour créer des fixtures au format CSV vous pouvez utiliser le site Mockaroo
https://www.mockaroo.com/