import {Product} from "../world";
import '../style/Product.css'
import {useState, useEffect, useRef} from "react";
import MyProgressbar, { Orientation } from "./MyProgressbar";
import {useInterval} from './MyInterval';
import {transform} from "./utils";
import managers from "./Managers";
import {gql, useMutation} from "@apollo/client";
import {switchClasses} from "@mui/material";

type ProductProps = {
    product: Product;
    onProductionDone: (product: Product) => void;
    onProductBuy: (quantity: number, product: Product) => void;
    qtmulti: string;
    money: number;
    username : string;
};


function ProductComponent({ product, onProductionDone,onProductBuy, qtmulti, money, username}: ProductProps) {
    const [timeLeft, setTimeLeft] = useState(product.timeleft);
    const lastUpdate = useRef(Date.now());
    const [maxBuyable, setMaxBuyable] = useState(0);
    const LANCER_PRODUCTION = gql`
         mutation lancerProductionProduit($id: Int!) {
            lancerProductionProduit(id: $id) {
             id
             }
         }`
    const [lancerProduction] = useMutation(LANCER_PRODUCTION,
        { context: { headers: { "x-user": username }},
            onError: (error): void => {
                console.log(error);
            }
        }
    )
    function startFabrication () {
        lastUpdate.current = Date.now();
        setTimeLeft(product.vitesse);
        lancerProduction({ variables: { id: product.id } });
    };
    function calcScore() {
        let end = Date.now() - lastUpdate.current;
        lastUpdate.current = Date.now();

        if (product.managerUnlocked) {
            setTimeLeft(product.vitesse);
            if (timeLeft === 0) {
                return;
            }
            if (end >= timeLeft) {
                setTimeLeft(0);
                onProductionDone(product);
            } else {
                setTimeLeft(timeLeft - end);
            }
        }else{
            if (timeLeft === 0) {
            return;
        }
        if (end >= timeLeft) {
            setTimeLeft(0);
            onProductionDone(product);
        } else {
            setTimeLeft(timeLeft - end);
        }}
    }

    useInterval(() => calcScore(), 100)

    function calcMaxCanBuy(): number {
        const cost = product.cout;
        const growth = product.croissance;
        const affordable = money / cost;
        if (growth === 1) {
            return Math.floor(affordable);
            //nombre d'unités que l'utilisateur peut acheter avec son argent disponible, arrondi à l'entier inférieur
        } else {
            const maxBuyable = Math.floor(Math.log(1 - affordable * (1 - growth)) / Math.log(growth));
            return maxBuyable > 0 ? maxBuyable : 0;
            //nombre maximal d'unités achetables en prenant en compte le taux de croissance
        }
    }
    function handleBuyProduct() {
        const canBuy = calcMaxCanBuy();
        console.log(money)
        console.log(product.cout)
        console.log(money < product.cout)
        switch (qtmulti) {
            case "x1" :
            case "x10" :
            case "x100" :
                let qtmultInt = parseInt(qtmulti.substring(1))

                if (qtmultInt <= canBuy) {
                    onProductBuy(qtmultInt, product);
                }
                break;
            case "MAX" :
                //  console.log(qtmulti)
                if (canBuy >= 1) {
                    onProductBuy(canBuy, product);
                }
                break;
            default :
                break;
        }
    }

    useEffect(() => {
        //garantit que la valeur de maxBuyable est toujours à jour avec le montant d'argent de l'utilisateur et le coût du produit
        setMaxBuyable(calcMaxCanBuy());
    }, [money, product]);

    return (
        <div className="product-container">
            <img className="product-image" src={"http://localhost:4000/" + product.logo} onClick={startFabrication} alt={product.name} />
            <p className="product-description">{product.quantite}</p>
            <div className="product-price">
                <span dangerouslySetInnerHTML={{__html: transform(product.revenu*product.quantite)}}></span>$
            </div>
            <MyProgressbar className="barstyle"
                           vitesse={product.vitesse}
                           initialvalue={product.vitesse - timeLeft}
                           run={timeLeft>0 || product.managerUnlocked}
                           frontcolor="#ff8400"
                           backcolor="#feffff"
                           auto={product.managerUnlocked}
                           orientation={Orientation.horizontal}
            />
            <p>Time left: {timeLeft}s</p>
            <button className="product-buy-button"
                    onClick={handleBuyProduct}
                    id={"handleBuyProduct" + product.id.toString()}
                    disabled={money < product.cout}>
                Buy {qtmulti} for :
                <span dangerouslySetInnerHTML={{__html: transform(product.cout)}}></span>$
            </button>
        </div>
    );
}

export default ProductComponent;
