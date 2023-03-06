const {lastupdate, allunlocks} = require("./world");
let worldjs = require("./world");
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

function updateScore(context){
    let world = context.world
    let produits = world.products
    let tempsEcoule = Date.now - parseInt(world.lastupdate);
    let qte = 0;
    for(let i=0; i < produits.length; i++){
        let produitR = produits[i];

        // SI le produit n'a pas de manager
        if(produitR.managerUnlocked === false){
            if (produitR.timeleft != 0 && produitR.timeleft < tempsEcoule){
                qte = 1;
            }else if(produitR.timeleft === 0 ){
                qte = 0;
            } else {
                produitR.timeleft -= tempsEcoule;
            }

        // SI le produit a un manager
        } else {
            if(produitR.timeleft < tempsEcoule) {
                tempsEcoule -= produitR.timeleft
                qte = Math.floor(tempsEcoule / produitR.vitesse) + 1;
                produitR.timeleft = produitR.vitesse - (tempsEcoule % produitR.timeleft);
            } else {
                produitR.timeleft -= tempsEcoule;
            }
        }
        // Actualisation de l'argent et du score du monde
        world.money += (produitR.revenu * produitR.quantite * (1 + world.activeangels * world.angelbonus  /100)) * qte;
        world.score += (produitR.revenu * produitR.quantite * (1 + world.activeangels * world.angelbonus  /100)) * qte;
    }
    world.lastupdate = Date.now().toString();
    saveWorld(context);
}

function addBonus(bonus, context) {
    let world = context.world;
    let produit = world.products.find((p) => p.id === bonus.idcible);
    // 3 if != 0 ou pas -1
    if(bonus.idcible != -1 && bonus.idcible != 0) {
        if (bonus.typeratio === "vitesse") {
            produit.vitesse = produit.vitesse / bonus.ratio;
            bonus.unlocked = true;

        } else if (bonus.typeratio === "gain") {
            produit.revenu = produit.revenu * bonus.ratio;
            bonus.unlocked = true;
        }
    } else if (bonus.idcible == 0) {
        if (bonus.typeratio === "vitesse") {
            world.products.forEach(p => {
                p.vitesse = p.vitesse / bonus.ratio;
            })
            bonus.unlocked = true;

        } else if (bonus.typeratio === "gain") {
            world.products.forEach(p => {
                p.revenu = p.revenu * bonus.ratio;
            })
            bonus.unlocked = true;
        }
    } else if (bonus.idcible == -1){
        bonus.unlocked = true;
    }
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
            updateScore(context)
            let qte = args.quantite;
            let idProduit = args.id;
            let world = context.world;
            let produit = world.products.find((p) => p.id === idProduit);
            let coef = Math.pow(produit.croissance, produit.quantite);

            if (produit === undefined){
                throw new Error(
                    `Le produit avec l'id ${args.id} n'existe pas`);
            } else {
                context.world.money -= produit.cout*((1-coef) / (1-produit.croissance));
                produit.quantite += qte;
                produit.cout = produit.cout * Math.pow(produit.croissance,qte);

                let palierDebloques = produit.palliers.filter((p => p.unlocked === false && p.ratio < produit.quantite));
                palierDebloques.forEach(p => {
                    addBonus(p, context);
                })

                let allUnlocksDebloques = world.allunlocks.filter((u) => u.unlocked === false)
                let counter = 0;
                let nbTotal = 0;
                allUnlocksDebloques.forEach(u => {
                    world.products.forEach(p => {
                        nbTotal += 1;
                        if(p.quantite >= u.seuil){
                            counter +=1
                        }
                    })
                    if(counter === nbTotal) {
                        addBonus(u, context)
                    }
                })

                world.lastupdate = Date.now().toString();
                saveWorld(context);
                return produit;
            }
},
        lancerProductionProduit(parent, args, context){
            updateScore(context)
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
                timeleft = vitesseProduit
                world.lastupdate = Date.now().toString();
                saveWorld(context)
                return produit
            }
        },

        engagerManager(parent, args, context){
            updateScore(context)
            let nomManager = args.name;
            let world = context.world;
            let manager = context.world.managers.find((m) => m.name === nomManager);
            let managerProduct = manager.idcible;
            let produit = world.products.find((p) => p.id === managerProduct);

            context.world.money -= manager.seuil
            manager.unlocked = true;
            produit.managerUnlocked = true;
            world.lastupdate = Date.now().toString();
            saveWorld(context)
            return manager
        },

        acheterCashUpgrade(parent, args, context){
            updateScore(context)
            let world = context.world;
            let nameUpgrade = args.name;
            let upgrade = world.upgrades.find((u) => u.name === nameUpgrade);

            if (upgrade === undefined){
                throw new Error(
                    `L'upgrade ${upgrade.name} n'existe pas`);
            } else {
                world.money -= upgrade.seuil;
                addBonus(upgrade, context);
                world.lastupdate = Date.now().toString();
                saveWorld(context);
                return upgrade;
            }
        },

        acheterAngelUpgrade(parent, args, context){
            updateScore(context)
            let world = context.world;
            let nameAngel = args.name;
            let angel = world.angelupgrades.find((a) => a.name === nameAngel);

            if (angel === undefined){
                throw new Error(
                    `L'ange ${angel.name} n'existe pas`);
            } else {
                world.money -= angel.seuil;
                addBonus(angel, context);
                world.lastupdate = Date.now().toString();
                saveWorld(context);
                return angel;
            }
        },

        resetWorld(parent, args, context){
            let actWorld = context.world;
            let score = actWorld.score;
            let activeangels = actWorld.activeangels;
            let totalangels = actWorld.totalangels;

            //Réinitialisation
            nWorld = worldjs;

            nWorld.totalangels = totalangels;
            nWorld.activeangels = activeangels;

            nWorld.activeangels += Math.round(150 * Math.sqrt(score/Math.pow(10,15)) - totalangels);
            nWorld.totalangels += Math.round(150 * Math.sqrt(score/Math.pow(10,15)));
            nWorld.score = 0;

            nWorld.lastupdate = Date.now().toString();
            context.world = nWorld;
            saveWorld(context);
            return nWorld;
            }
    }
}