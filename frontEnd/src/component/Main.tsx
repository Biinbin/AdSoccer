import { useState, useEffect } from "react";
import { World, Product, Pallier} from "../world";
import "../style/main.css";
import '../style/Product.css'
import ProductComponent from "./Product";
import {transform} from "./utils";
import ManagersComponent from "./Managers";
import AllUnlocksComponent from "./AllUnlocks";
import AngelsComponent from "./AngelsUpgrades";
import {gql, useMutation} from "@apollo/client";
import managers from "./Managers";
import UpgradesComponent from "./Upgrades";
import product from "./Product";
import angelsUpgrades from "./AngelsUpgrades";

type MainProps = {
    loadworld: World;
    username: string;
};

export default function Main({ loadworld, username}: MainProps) {
    const [world, setWorld] = useState(
        JSON.parse(JSON.stringify(loadworld)) as World
    );
    const ACHETER_QT_PRODUIT = gql`
         mutation acheterQtProduit($id: Int!, $quantite: Int!) {
            acheterQtProduit(id: $id, quantite: $quantite) {
                id             
            }
         }`;
    const ENGAGER_MANAGER = gql`
         mutation engagerManager($name: String!) {
            engagerManager(name: $name) {
                name
             }
         }`;
    const ACHETER_CASH_UPGRADES = gql`
         mutation acheterCashUpgrade($name: String!) {
            acheterCashUpgrade(name: $name) {
                name
             }
         }`;

    const ACHETER_ANGELS_UPGRADES = gql`
         mutation acheterAngelUpgrade($name: String!) {
            acheterAngelUpgrade(name: $name) {
                name
             }
         }`;

    const RESET_WORLD = gql`
         mutation resetWorld {
            resetWorld {
            
    name
    logo
    money
    score
    totalangels
    activeangels
    angelbonus
    lastupdate
    products {
      id
      name
      logo
      cout
      croissance
      revenu
      vitesse
      quantite
      timeleft
      managerUnlocked
      palliers {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
    }
    allunlocks {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
    upgrades {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
    angelupgrades {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
    managers {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
             }
         }`;

    const [acheterQtProduit] = useMutation(ACHETER_QT_PRODUIT,
        { context: { headers: { "x-user": username }},
            onError: (error): void => {
                console.log(error);
            }
        }
    )

    const [engagerManager] = useMutation(ENGAGER_MANAGER,
        { context: { headers: { "x-user": username }},
            onError: (error): void => {
                console.log(error);
            }
        }
    )
    const [acheterCashUpgrade] = useMutation(ACHETER_CASH_UPGRADES,
        { context: { headers: { "x-user": username }},
            onError: (error): void => {
                console.log(error);
            }
        }
    )

    const [acheterAngelUpgrade] = useMutation(ACHETER_ANGELS_UPGRADES,
        { context: { headers: { "x-user": username }},
            onError: (error): void => {
                console.log(error);
            }
        }
    )

    const [resetWorld] = useMutation(RESET_WORLD,
        { context: { headers: { "x-user": username }},
            onError: (error): void => {
                console.log(error);
            }
        }
    )

    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadworld)) as World);
    }, [loadworld]);

    function onProductionDone(p: Product): void {
        // calcul de la somme obtenue par la production du produit
        let gain = (p.quantite * p.revenu)
        world.score += gain
        world.money+=gain
        // ajout de la somme à l’argent possédé
        setWorld(prevWorld => ({...prevWorld, score: prevWorld.score + gain}));
    }

    function onProductBuy(quantity: number, product: Product): void {
        let idProduit = product.id;
        let produit = world.products.find((p) => p.id === idProduit);
        let coef = Math.pow(product.croissance, quantity);
        if (produit === undefined) {
            throw new Error(
                `Le produit avec l'id ${product.id} n'existe pas`);
        } else {
            console.log("money"+ product.cout)
            world.money -= product.cout  * ((1 - coef) / (1 - produit.croissance));
            console.log(world.money)
            product.quantite += quantity;
            product.cout=product.cout*Math.pow(product.croissance, quantity)

            setWorld(prevWorld => ({...prevWorld, money: prevWorld.money}));
            let palierDebloques = product.palliers.filter((p => p.unlocked === false && p.seuil <= product.quantite));
            palierDebloques.forEach(p => {
                console.log("palliers")
                console.log(product.vitesse)
                if(p.typeratio=="gain"){
                    product.revenu= product.revenu*p.ratio;
                }else{
                    product.vitesse= product.vitesse/p.ratio;
                }
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
                    console.log("allunlocks")
                    if(u.typeratio=="gain"){
                        product.revenu= product.revenu*u.ratio;
                    }else{
                        product.vitesse= product.vitesse*u.ratio;
                    }
                }
            })
        }
        acheterQtProduit({ variables: { id: product.id , quantite : quantity} });
    }

    const [qtmulti, setQtmulti] = useState("x1");
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const [isAllUnlocksOpen, setIsAllUnlocksOpen] = useState(false);
    const [isAngelsOpen, setIsAngelsOpen] = useState(false);
    const [isUpgradesOpen, setIsUpgradesOpen] = useState(false);
    const [isInvestorsOpen, setInvestorsOpen] = useState(false);



    function onHireManager(manager: Pallier): void{
        let arg = world.money
        if (arg >= manager.seuil) {
            // Retirer le coût du manager de l'argent possédé par le joueur
            world.money = arg - manager.seuil;
            // Positionner la propriété unlocked du manager à vrai
            manager.unlocked = true;
            // Trouver le produit associé au manager
            const product = world.products.find((p) => p.id === manager.idcible);
            if (product) {
                // Positionner la propriété managerUnlocked du produit à vrai
                product.managerUnlocked = true;
                engagerManager({variables: {name: manager.name}});
            }
        }
    }

    function onClose(){
        setIsManagerOpen(!isManagerOpen)
    }

    function onCloseAngels(){
        setIsAngelsOpen(!isAngelsOpen);
    }

    function onCloseAllUnlocks(){
        setIsAllUnlocksOpen(!isAllUnlocksOpen)
    }
    function onAllUnlocks(allunlocks: Pallier): void{
    }


    function onHireUpgrades(upgrades: Pallier): void{
        let arg = world.money
        if (arg >= upgrades.seuil) {
            // Retirer le coût de l'upgrades de l'argent possédé par le joueur
            world.money = arg - upgrades.seuil;
            // Positionner la propriété unlocked de l'upgrades à vrai
            upgrades.unlocked = true;
            // Trouver le produit associé à l'upgrades
            const product = world.products.find((p) => p.id === upgrades.idcible);
            if (product) {
                // Positionner la propriété managerUnlocked du produit à vrai
                if(upgrades.typeratio=="gain"){
                    product.revenu= product.revenu*upgrades.ratio;
                }else{
                    product.vitesse= product.vitesse*upgrades.ratio;
                }
                acheterCashUpgrade({ variables: { name : upgrades.name} });
            }
        }
    }

    function onBuyAngels (angels: Pallier): void{
        let arg = world.activeangels
        if (arg >= angels.seuil){
            world.activeangels = arg - angels.seuil;
            angels.unlocked = true;
            world.angelbonus = angels.ratio + world.angelbonus
            acheterAngelUpgrade({ variables: { name : angels.name} });
        }
    }

    function onCloseUpgrades(){
        setIsUpgradesOpen(!isUpgradesOpen)
    }

    return (
        <div className="main-container">
            <div className="header">
                <h1 className="main-title">
                    Welcome to {world.name}, {username}!
                    <img className="logoW"
                         src={"http://localhost:4000/" + world.logo}
                         alt={world.name}
                    />
                </h1>
                <div className="money-container">
                    <span className="money-label">Cagnotte Totale</span>
                    <span className="money-value"><span dangerouslySetInnerHTML={{__html: transform(world.money)}}/>$</span>
                </div>
                <button className="multi" onClick={() =>{
                    switch(qtmulti) {
                        case "x1":
                            setQtmulti("x10");
                            break;
                        case "x10":
                            setQtmulti("x100");
                            break;
                        case "x100":
                            setQtmulti("MAX");
                            break;
                        default:
                            setQtmulti("x1");
                            break;
                        }}
                }>{qtmulti}
                </button>
            </div>
            <div className="left-panel">
                <div>
                    <button className="button-managers" onClick={() => setIsManagerOpen(!isManagerOpen)}>Managers</button>
                    <ManagersComponent showManagers={isManagerOpen}
                                       onHireManager={onHireManager}
                                       world={world}
                                       onClose={onClose}/>
                </div>
                <div>
                    <button className="button-AllUnlocks" onClick={() => setIsAllUnlocksOpen(!isAllUnlocksOpen)}>Unlocks</button>
                    <AllUnlocksComponent showAllUnloks={isAllUnlocksOpen}
                                         onAllUnlocks={onAllUnlocks}
                                         world={world}
                                         onCloseAllUnloks={onCloseAllUnlocks}/>
                </div>
                <div>
                    <button className="button-Angels" onClick={() => setIsAngelsOpen(!isAngelsOpen)}>Angels</button>
                    <AngelsComponent     showAngels={isAngelsOpen}
                                         onHireAngels={onBuyAngels}
                                         world={world}
                                         onCloseAngels={onCloseAngels}/>
                </div>
                <div>
                    <button className="button-Upgrades" onClick={() => setIsUpgradesOpen(!isUpgradesOpen)}>Upgrades</button>
                    <UpgradesComponent showUpgrades={isUpgradesOpen}
                                       onHireUpgrades={onHireUpgrades}
                                       world={world}
                                       onCloseUpgrades={onCloseUpgrades}/>
                </div>
                <div>
                    <button className="button-Upgrades" onClick={ () => resetWorld()}>Reset World</button>
                </div>
            </div>
            <div className="product-grid">
                <ProductComponent product={world.products[0]}
                                  onProductionDone={onProductionDone}
                                  onProductBuy={onProductBuy}
                                  qtmulti={qtmulti.toString()}
                                  money={world.money}
                                  username={username}
                />
                <ProductComponent product={world.products[1]}
                                  onProductionDone={onProductionDone}
                                  qtmulti={qtmulti.toString()}
                                  onProductBuy={onProductBuy}
                                  money={world.money}
                                  username={username}
                />
                <ProductComponent product={world.products[2]}
                                  onProductionDone={onProductionDone}
                                  qtmulti={qtmulti.toString()}
                                  onProductBuy={onProductBuy}
                                  money={world.money}
                                  username={username}
                />
                <ProductComponent product={world.products[3]}
                                  onProductionDone={onProductionDone}
                                  onProductBuy={onProductBuy}
                                  qtmulti={qtmulti.toString()}
                                  money={world.money}
                                  username={username}
                />
                <ProductComponent product={world.products[4]}
                                  onProductionDone={onProductionDone}
                                  onProductBuy={onProductBuy}
                                  qtmulti={qtmulti.toString()}
                                  money={world.money}
                                  username={username}
                />
                <ProductComponent product={world.products[5]}
                                  onProductionDone={onProductionDone}
                                  onProductBuy={onProductBuy}
                                  qtmulti={qtmulti.toString()}
                                  money={world.money}
                                  username={username}
                />
            </div>
        </div>
    );
}
