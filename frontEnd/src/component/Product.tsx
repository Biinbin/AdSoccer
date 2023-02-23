import {Product} from "../world";
import '../style/Product.css'

type ProductProps = {
    product: Product;
};

function ProductComponent({ product }: ProductProps) {
    return (
        <div className="product-container">
            <img className="product-image" src={"https://isiscapitalistgraphql.kk.kurasawa.fr/" + product.logo} alt={product.name} />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-description">{product.quantite}</p>
            <div className="product-price">{product.cout} $</div>
            <button className="product-buy-button">Buy Now</button>
        </div>
    );
}
export default ProductComponent;