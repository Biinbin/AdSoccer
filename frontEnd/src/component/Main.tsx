import { useState, useEffect } from "react";
import { World, Product } from "../world";
import "../style/main.css";
import '../style/Product.css'
import ProductComponent from "./Product";

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

    return (
        <div className="main-container">
            <h1 className="main-title">
                Welcome to {world.name}, {username}!
            </h1>
            <div className="money-container">
                <span className="money-label">Cagnotte Totale</span>
                <span className="money-value">{world.money} $</span>
            </div>
            <img className="logoW"
                src={"https://isiscapitalistgraphql.kk.kurasawa.fr/" + world.logo}
                alt={world.name}/>
            <h2 className="product-title">Liste des produits :</h2>
            <div className="product-container product-grid">
                {world.products.map((product: Product) => (
                    <ProductComponent key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
