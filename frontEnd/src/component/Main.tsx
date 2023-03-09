import { useState, useEffect } from "react";
import { World, Product, Pallier} from "../world";
import "../style/main.css";
import '../style/Product.css'
import ProductComponent from "./Product";
import {transform} from "./utils";
import ManagersComponent from "./Managers";
import AllUnlocksComponent from "./AllUnlocks";
import {gql, useMutation} from "@apollo/client";

type MainProps = {
    loadworld: World;
    username: string;
};

export default function Main({ loadworld, username }: MainProps) {
    const [world, setWorld] = useState(
        JSON.parse(JSON.stringify(loadworld)) as World
    );
    const ACHETER_QT_PRODUIT = gql`
         mutation acheterQtProduit($id: Int!, $quantite: Int!) {
            acheterQtProduit(id: $id, quantite: $quantite) {
             id
             quantite
             }
         }`;
    const [acheterQtProduit] = useMutation(ACHETER_QT_PRODUIT,
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
        let prix = prev(quantity, product)
        product.quantite= product.quantite + quantity
        product.cout=product.cout*Math.pow(product.croissance, quantity)
        world.money = world.money - prix
        setWorld(prevWorld => ({...prevWorld, money: prevWorld.money}));
        acheterQtProduit({ variables: { id: product.id , quantite : quantity} });
    }

    //calcule le prix du produit en fonction de sa quantité et de sa croissance
    function prev(quantity: number, product: Product):number{
        let price = product.cout
        for (let i=1; i<quantity;i++){
            price = product.cout+(product.cout*product.croissance)
        }return price
    }

    const [qtmulti, setQtmulti] = useState("x1");
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const [isAllUnloksOpen, setIsAllUnloksOpen] = useState(false);


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
            }
        }
    }

    function onClose(){
        setIsManagerOpen(!isManagerOpen)
    }

    function onCloseAllUnloks(){
        setIsAllUnloksOpen(!isAllUnloksOpen)
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
                    <button className="button-AllUnlocks" onClick={() => setIsAllUnloksOpen(!isAllUnloksOpen)}>Unlocks</button>
                    <AllUnlocksComponent showAllUnloks={isAllUnloksOpen}
                                         world={world}
                                         onCloseAllUnloks={onCloseAllUnloks}/>
                </div>
                <div>
                    <button className="button-Angels">Angels</button>
                </div>
                <div>
                    <button className="button-Upgrades">Upgrades</button>
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
