import React, {useState} from 'react';
import {Pallier, World} from "../world";
import "../style/AllUnlocks.css"
import "../style/Paliers.css"
import allUnlocks from "./AllUnlocks";


type AllUnloksProps = {
    showAllUnloks: boolean;
    world: World;
    onAllUnlocks: (allUnlocks: Pallier) => void;
    onCloseAllUnloks: () => void;

}
function AllUnlocksComponent({ showAllUnloks, world, onCloseAllUnloks}: AllUnloksProps) {

    const [State, setState] = useState(showAllUnloks);

    function toggleAllUnloks(){
        console.log("Toggle AllUnloks, State =", State);
        setState(!State);
        onCloseAllUnloks();
    }

    return (
        <div>
            {showAllUnloks &&
                <div className="modal">
                    <div>
                        <h1 className="title">Paliers</h1>
                    </div>
                    <div>
                        {world.products.map(products =>
                            <div key={products.id} className="paliersgrid">
                                <div>
                                    <div className="productName">
                                        <h1>{products.name}</h1>
                                    </div>
                                        {products.palliers.map(palier => (!palier.unlocked &&
                                            <div className="infosPaliers">
                                                <div>
                                                    <img alt="palier logo" className="paliersImg" src={"http://localhost:4000/" + palier.logo}/>
                                                    <h2>{palier.name}</h2>
                                                </div>
                                                <div>
                                                    <div className="paliersName">{palier.seuil}</div>
                                                    <div className="paliersRatio" >{palier.typeratio} x{palier.ratio}</div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )
                        }
                    </div>
                    <div>
                        <h1 className="title">AllUnloks</h1>
                    </div>
                    <div>
                        { world.allunlocks.filter(allUnloks => !allUnloks.unlocked).map(
                            allunlocks =>
                                <div key={allunlocks.name} className="allUnloksgrid">
                                    <div>
                                        <div className="logo">
                                            <img alt="allUnloks logo" className="allUnloksImg" src={"http://localhost:4000/" + allunlocks.logo} />
                                        </div>
                                    </div>
                                    <div className="infosAllUnloks">
                                        <div className="allUnloksname">{allunlocks.name}</div>
                                        <div className="allUnlokscost">{allunlocks.seuil}</div>
                                        <div className="allUnloksRatio">{allunlocks.typeratio} x{allunlocks.ratio}</div>
                                    </div>
                                </div>
                        )
                        }
                        <button className="closebutton"
                                onClick={toggleAllUnloks}> Close</button>
                    </div>
                </div>
            }
        </div>
    );
}
export default AllUnlocksComponent;