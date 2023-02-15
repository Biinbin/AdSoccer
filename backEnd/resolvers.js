const fs = require("fs").promises;
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

            let qte = args.quantite;
            let idProduit = args.id;
            let world = context.world;
            let produit = world.products.find((p) => p.id === idProduit);
            let coef = Math.pow(produit.croissance,produit.quantite);

            if (produit === undefined){
                throw new Error(
                    `Le produit avec l'id ${args.id} n'existe pas`);
            } else {
                context.world.money -= produit.cout*((1-coef) / (1-produit.croissance));
                produit.quantite += qte;
                produit.cout = produit.cout * Math.pow(produit.croissance,qte);
                world.lastudate=Date.now();
                saveWorld(context);
                return produit;
            }
},
        lancerProductionProduit(parent, args, context){
            let idProduit = args.id;
            let world = context.world;
            let produit = world.products.find((p) => p.id === idProduit)
            let vitesseProduit = produit.vitesse;
            let timeleft = produit.timeleft;

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
            let nomManager = args.name
            let world = context.world;
            let manager = context.world.managers.find((m) => m.name === nomManager)
            let managerProduct = manager.idcible
            let produit = world.products.find((p) => p.id === managerProduct)

            context.world.money -= manager.seuil
            manager.unlocked = true;
            produit.managerUnlocked = true;
            world.lastudate=Date.now();
            saveWorld(context)
            return manager
        }
    }
}