import { useState, useEffect } from "react";
import { World, Product } from "../world";
import "../style/main.css";
import '../style/Product.css'
import ProductComponent from "./Product";
import {transform} from "./utils";

type MainProps = {
    loadworld: World;
    username: string;
};

export default function Main({ loadworld, username }: MainProps) {
    const [world, setWorld] = useState(
        JSON.parse(JSON.stringify(loadworld)) as World
    );

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
        //console.log(product.quantite)
        product.quantite= product.quantite + quantity
        //console.log(product.quantite)
        product.cout=product.cout*Math.pow(product.croissance, quantity)
        world.money = world.money - prix
        setWorld(prevWorld => ({...prevWorld, money: prevWorld.money}));

    }

    //calcule le prix du produit en fonction de sa quantité et de sa croissance
    function prev(quantity: number, product: Product):number{
        let price = product.cout
        for (let i=1; i<quantity;i++){
            price = product.cout+(product.cout*product.croissance)
        }return price
    }

    const [qtmulti, setQtmulti] = useState("x1");

    return (
        <div className="main-container">
            <h1 className="main-title">
                Welcome to {world.name}, {username}!
            </h1>
            <div className="money-container">
                <span className="money-label">Cagnotte Totale</span>
                <span className="money-value"><span dangerouslySetInnerHTML={{__html: transform(world.money)}}/>$</span>
            </div>
            <img className="logoW"
                src={"https://isiscapitalistgraphql.kk.kurasawa.fr/" + world.logo}
                alt={world.name}/>
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
            <h2 className="product-title">Liste des produits :</h2>
            <div className="product-grid">
                <ProductComponent product={world.products[0]}
                                  onProductionDone={onProductionDone}
                                  onProductBuy={onProductBuy}
                                  qtmulti={qtmulti.toString()}
                                  money={world.money}
                />
                <ProductComponent product={world.products[1]}
                                  onProductionDone={onProductionDone}
                                  qtmulti={qtmulti.toString()}
                                  onProductBuy={onProductBuy}
                                  money={world.money}
                />
                <ProductComponent product={world.products[2]}
                                  onProductionDone={onProductionDone}
                                  qtmulti={qtmulti.toString()}
                                  onProductBuy={onProductBuy}
                                  money={world.money}
                />
                <ProductComponent product={world.products[3]}
                                  onProductionDone={onProductionDone}
                                  onProductBuy={onProductBuy}
                                  qtmulti={qtmulti.toString()}
                                  money={world.money}
                />
                <ProductComponent product={world.products[4]}
                                  onProductionDone={onProductionDone}
                                  onProductBuy={onProductBuy}
                                  qtmulti={qtmulti.toString()}
                                  money={world.money}
                />
                <ProductComponent product={world.products[5]}
                                  onProductionDone={onProductionDone}
                                  onProductBuy={onProductBuy}
                                  qtmulti={qtmulti.toString()}
                                  money={world.money}
                />
            </div>
        </div>
    );
}
