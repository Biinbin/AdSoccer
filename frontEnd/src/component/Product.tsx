import {Product, World} from "../world";
import '../style/Product.css'
import {useState, useEffect, useRef} from "react";
import MyProgressbar, {Orientation} from "./MyProgressbar";
import {useInterval} from './MyInterval';
import {transform} from "./utils";
import {gql, useMutation} from "@apollo/client";

type ProductProps = {
    product: Product;
    onProductionDone: (product: Product) => void;
    onProductBuy: (quantity: number, product: Product) => void;
    qtmulti: string;
    money: number;
    username: string;
    world: World;
};


function ProductComponent({product, onProductionDone, onProductBuy, qtmulti, world, money, username}: ProductProps) {
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
        {
            context: {headers: {"x-user": username}},
            onError: (error): void => {
                console.log(error);
            }
        }
    )

    function quantityCalc(){
        if (product.cout < money || product.quantite != 0){
            return true;
            product.timeleft = 0;
        } else {
            return false;
        }
    }

    function startFabrication() {
        if (product.quantite >= 1) {
            lastUpdate.current = Date.now();
            setTimeLeft(product.vitesse);
            lancerProduction({variables: {id: product.id}});
        }
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
        } else {
            if (timeLeft === 0) {
                return;
            }
            if (end >= timeLeft) {
                setTimeLeft(0);
                onProductionDone(product);
            } else {
                setTimeLeft(timeLeft - end);
            }
        }
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

    let coef = Math.pow(product.croissance, parseInt(qtmulti.substring(1)));

    return (
        <div className="product-container">
            <img className="product-image" src={"http://localhost:4000/" + product.logo} onClick={startFabrication}
                 alt={product.name}/>
            <p className="product-description">{product.quantite}</p>
            <div className="product-price">
                <span dangerouslySetInnerHTML={{__html: transform(product.quantite * product.revenu * (1 + world.activeangels * world.angelbonus / 100))}}></span>$
            </div>
            {quantityCalc() ? (
                <div className="info-products">
                    <MyProgressbar className="barstyle"
                                   vitesse={product.vitesse}
                                   initialvalue={product.vitesse - timeLeft}
                                   run={timeLeft > 0 || product.managerUnlocked }
                                   frontcolor="#ff8400"
                                   backcolor="#feffff"
                                   auto={product.managerUnlocked && product.quantite != 0}
                                   orientation={Orientation.horizontal}
                    />
                    <p className="timeLeft">Time left: {timeLeft}s</p>
                    <button className="product-buy-button"
                            onClick={handleBuyProduct}
                            id={"handleBuyProduct" + product.id.toString()}
                            disabled={money < product.cout}>
                        Buy {qtmulti} for :
                        <span
                            dangerouslySetInnerHTML={{__html: transform((product.cout *
                                    parseInt(qtmulti.substring(1))) + ((1 - coef) / (1 - product.croissance)) - 1)}}></span>$
                    </button>
                </div>
            ) : <p> Coût du produit : {product.cout} $</p> }
        </div>
    );
}

export default ProductComponent;
