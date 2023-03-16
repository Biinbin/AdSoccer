const {lastupdate, allunlocks, angelbonus} = require("./world");
let worldjs = require("./world");
const fs = require("fs").promises;

function saveWorld(context) {
    context.world.lastupdate = Date.now().toString();
    fs.writeFile("userworlds/" + context.user + "-world.json",
        JSON.stringify(context.world), err => {
            if (err) {
                console.error(err)
                throw new Error(
                    `Erreur d'écriture du monde coté serveur`)
            }
        })
}

function updateScore(context) {
    let tempsEcoule = Date.now() - parseInt(context.world.lastupdate);
    let qte = 0;
    context.world.products.forEach(produitR => {
        // SI le produit n'a pas de manager
        if (produitR.managerUnlocked === false) {
            // SI le produit n'a pas de manager
            if (produitR.timeleft != 0 && produitR.timeleft < tempsEcoule) {
                qte = 1;
                produitR.timeleft = 0;
            }
            // SI le produit a un manager
        } else if (produitR.managerUnlocked) {
            if (produitR.timeleft > 0) {
                tempsEcouleProd = tempsEcoule - produitR.timeleft
                if (tempsEcouleProd < 0) {
                    produitR.timeleft -= tempsEcoule
                } else {
                    qte = (tempsEcouleProd / produitR.vitesse) + 1
                    produitR.timeleft = tempsEcouleProd % produitR.vitesse
                }
            } else {
                produitR.timeleft -= tempsEcoule
                if (produitR.timeleft <= 0) {
                    qte = 1
                    produitR.timeleft = 0
                }
            }
        }
        // Actualisation de l'argent et du score du monde
        context.world.score += qte * produitR.revenu * produitR.quantite * (1 + context.world.activeangels * context.world.angelbonus / 100)
        context.world.money += qte * produitR.revenu * produitR.quantite * (1 + context.world.activeangels * context.world.angelbonus / 100)
    })
}

function addBonus(bonus, context) {
    let world = context.world;
    let produit = world.products.find((p) => p.id === bonus.idcible);
    // 3 if != 0 ou pas -1
    if (bonus.idcible != -1 && bonus.idcible != 0) {
        if (bonus.typeratio === "vitesse") {
            Math.round(produit.vitesse = produit.vitesse / bonus.ratio);
            bonus.unlocked = true;

        } else if (bonus.typeratio === "gain") {
            produit.revenu = produit.revenu * bonus.ratio;
            bonus.unlocked = true;
        }
    } else if (bonus.idcible == 0) {
        if (bonus.typeratio === "vitesse") {
            world.products.forEach(p => {
                Math.round(p.vitesse = p.vitesse / bonus.ratio);
            })
            bonus.unlocked = true;

        } else if (bonus.typeratio === "gain") {
            world.products.forEach(p => {
                p.revenu = p.revenu * bonus.ratio;
            })
            bonus.unlocked = true;
        }
    } else if (bonus.idcible == -1) {
        bonus.unlocked = true;
        world.angelbonus = bonus.ratio + world.angelbonus
    }
}


module.exports = {
    Query: {
        getWorld(parent, args, context) {
            updateScore(context)
            saveWorld(context)
            return context.world
        }
    },
    Mutation: {
        acheterQtProduit(parent, args, context) {
            updateScore(context)
            let qte = args.quantite;
            let idProduit = args.id;
            let world = context.world;
            let produit = world.products.find((p) => p.id === idProduit);
            let coef = Math.pow(produit.croissance, qte);

            if (produit === undefined) {
                throw new Error(
                    `Le produit avec l'id ${args.id} n'existe pas`);
            } else {
                context.world.money -= produit.cout * ((1 - coef) / (1 - produit.croissance));
                produit.quantite += qte;
                produit.cout =produit.cout * Math.pow(produit.croissance, qte);

                let palierDebloques = produit.palliers.filter((p => p.unlocked === false && p.seuil < produit.quantite));
                palierDebloques.forEach(p => {
                    addBonus(p, context);
                })

                let allUnlocksDebloques = world.allunlocks.filter((u) => u.unlocked === false)
                let counter = 0;
                let nbTotal = 0;
                allUnlocksDebloques.forEach(u => {
                    world.products.forEach(p => {
                        nbTotal += 1;
                        if (p.quantite >= u.seuil) {
                            counter += 1
                        }
                    })
                    if (counter === nbTotal) {
                        addBonus(u, context)
                    }
                })
                saveWorld(context);
                return produit;
            }
        },
        lancerProductionProduit(parent, args, context) {
            updateScore(context)
            let idProduit = args.id;
            let world = context.world;
            let produit = world.products.find((p) => p.id === idProduit)

            if (produit === undefined) {
                throw new Error(
                    `Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                produit.timeleft = produit.vitesse
                saveWorld(context)
                return produit
            }
        },

        engagerManager(parent, args, context) {
            updateScore(context)
            let nomManager = args.name;
            let world = context.world;
            let manager = context.world.managers.find((m) => m.name === nomManager);
            let managerProduct = manager.idcible;
            let produit = world.products.find((p) => p.id === managerProduct);

            if (manager === undefined) {
                throw new Error(
                    `Le manager avec l'id ${args.id} n'existe pas`)
            } else {
                context.world.money -= manager.seuil
                manager.unlocked = true;
                produit.managerUnlocked = true;
                saveWorld(context)
                return manager
            }
        },

        acheterCashUpgrade(parent, args, context) {
            updateScore(context)
            let world = context.world;
            let nameUpgrade = args.name;
            let upgrade = world.upgrades.find((u) => u.name === nameUpgrade);

            if (upgrade === undefined) {
                throw new Error(
                    `L'upgrade avec l'id ${args.id} n'existe pas`);
            } else {
                world.money -= upgrade.seuil;
                addBonus(upgrade, context);
                saveWorld(context);
                return upgrade;
            }
        },

        acheterAngelUpgrade(parent, args, context) {
            updateScore(context)
            let world = context.world;
            let nameAngel = args.name;
            let angel = world.angelupgrades.find((a) => a.name === nameAngel);

            if (angel === undefined) {
                throw new Error(
                    `L'ange avec l'id ${args.id} n'existe pas`);
            } else {
                world.activeangels -= angel.seuil;
                addBonus(angel, context);
                saveWorld(context);
                return angel;
            }
        },

        resetWorld(parent, args, context) {
            let actWorld = context.world;
            let score = actWorld.score;
            let activeangels = actWorld.activeangels;
            let totalangels = actWorld.totalangels;

            //Réinitialisation
            let nWorld = worldjs;

            //Récupération des anges
            nWorld.totalangels = totalangels;
            nWorld.activeangels = activeangels;

            //Calcul des anges
            let activeAngelsBis = Math.round(150 * Math.sqrt(score / Math.pow(10, 4)) - totalangels);
            let totalAngelsBis = Math.round(150 * Math.sqrt(score / Math.pow(10, 4)) - totalangels);

            if (activeAngelsBis > 0) {
                nWorld.activeangels += activeAngelsBis
                nWorld.totalangels += totalAngelsBis
            }

            //Réinitialisation du score à 0
            nWorld.score = 0;

            context.world = nWorld;
            saveWorld(context);
            return nWorld;
        }
    }
}