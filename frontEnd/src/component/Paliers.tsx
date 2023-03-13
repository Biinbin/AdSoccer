import React, {useState} from 'react';
import {Pallier, World} from "../world";
import "../style/Paliers.css"

type PaliersProps = {
    showPaliers: boolean;
    world: World
    onPaliers: (allUnlocks: Pallier) => void;
    onClosePaliers: () => void;

}

function PaliersComponent({showPaliers, world, onClosePaliers}: PaliersProps) {

    const [State, setState] = useState(showPaliers);

    function togglePaliers() {
        console.log("Toggle Paliers, State =", State);
        setState(!State);
        onClosePaliers();
    }

    return (
        <div>
            {showPaliers &&
                <div className="modal">
                    <div>
                        <h1 className="title">Paliers</h1>
                    </div>
                    <div>
                        {world.products.map(products =>
                            <div key={products.id} className="paliersGrid">
                                <div>
                                    <div className="logo">
                                        {products.name}
                                    </div>
                                    <ul>
                                        {products.palliers.map(palier => (!palier.unlocked &&
                                            <li>
                                                <div>
                                                    <img alt="palier logo" className="paliersImg" src={"http://localhost:4000/" + palier.logo}/>
                                                    <h1>{palier.name}</h1>
                                                </div>
                                                <h2>{palier.seuil}</h2>
                                                {palier.typeratio} x{palier.ratio}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )
                        }
                        <button className="closebutton"
                                onClick={togglePaliers}> Close
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}

export default PaliersComponent;