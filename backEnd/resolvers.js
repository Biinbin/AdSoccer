const fs = require("fs");
function saveWorld(context) {
    fs.writeFile("userworlds/" + context.user + "-world.json",
        JSON.stringify(context.world), err => {
            if (err) {
                console.error(err)
                throw new Error(
                    `Erreur d'écriture du monde coté serveur`)
            }
        })
}

module.exports = {
    Query: {
        getWorld(parent, args, context) {
            saveWorld(context)
            return context.world
        }
    },
    Mutation: {
        acheterQtProduit(parent, args, context){
            let produit = world.products.find((p) => p.id === idProduit)

            let qte = args.quantite;
            let idProduit = args.id;
            let world = context.world;
            let coef = Math.pow(produit.croissance,produit.quantite);

            if (produit === undefined){
                throw new Error(
                    `Le produit avec l'id ${args.id} n'existe pas`);
            } else {
                produit.quantite += qte;
                context.world.money -= produit.cout*((1-coef) / (1-produit.croissance));
                world.lastudate=Date.now()
                saveWorld(context)
                return produit
            }
},
        lancerProductionProduit(parent, args, context){
            let produit = world.products.find((p) => p.id === idProduit)
            let vitesseProduit = produit.vitesse;
            let timeleft = produit.timeleft;
            let world = context.world;

            if(produit === undefined){
                throw new Error(
                    `Le produit avec l'id ${args.id} n'existe pas`)
            }
            else{
                produit.timeleft = produit.vitesse
                world.lastudate=Date.now()
                saveWorld(context)
                return produit
            }
        },
        engagerManager(parent, args, context){
            let nomManager = context.world.managers.find((m) => m.name === nomManager)

        }
    }
}