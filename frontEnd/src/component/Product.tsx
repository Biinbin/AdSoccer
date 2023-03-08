import {Product} from "../world";
import '../style/Product.css'
import {useState, useEffect, useRef} from "react";
import MyProgressbar, { Orientation } from "./MyProgressbar";
import {useInterval} from './MyInterval';

type ProductProps = {
    product: Product;
    onProductionDone: (product: Product) => void;
    onProductBuy: (quantity: number, product: Product) => void;
    qtmulti: string;
    money: number;
};

function ProductComponent({ product, onProductionDone,onProductBuy, qtmulti, money}: ProductProps) {
    const [timeLeft, setTimeLeft] = useState(product.timeleft);
    const lastUpdate = useRef(Date.now());
    const [maxBuyable, setMaxBuyable] = useState(0);

    function startFabrication () {
        lastUpdate.current = Date.now();
        setTimeLeft(product.vitesse);
    };
    function calcScore(){
        let end = Date.now() - lastUpdate.current;
        lastUpdate.current = Date.now();
        if(timeLeft==0){}
        if(timeLeft!==0){
            if(end>=timeLeft){
                setTimeLeft(0);
                onProductionDone(product );
            }
            else{
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
        } else {
            const maxBuyable = Math.floor(Math.log(1 - affordable * (1 - growth)) / Math.log(growth));
            return maxBuyable > 0 ? maxBuyable : 0;
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
            case "Max" :
                if (canBuy > 0) {
                    onProductBuy(canBuy, product);
                }
                break;
            default :
                break;
        }
    }


    useEffect(() => {
        setMaxBuyable(calcMaxCanBuy());
    }, [money, product]);

    return (
        <div className="product-container">
                <img className="product-image" src={"https://isiscapitalistgraphql.kk.kurasawa.fr/" + product.logo} onClick={startFabrication} alt={product.name} />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-description">{product.quantite}</p>
            <div className="product-price">{product.cout} $</div>
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
            <button className="product-buy-button" /*onClick={handleBuyProduct}*/ id={"handleBuyProduct" + product.id.toString()}>Buy {qtmulti}$</button>
        </div>
    );
}

export default ProductComponent;
