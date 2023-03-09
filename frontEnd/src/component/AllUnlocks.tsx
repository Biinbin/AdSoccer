import React, {useState} from 'react';
import {World} from "../world";
import "../style/AllUnlocks.css"


type AllUnloksProps = {
    showAllUnloks: boolean;
    world: World;
    onCloseAllUnloks : () => void;

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
                                    </div>
                                </div>
                        )
                        }
                        <button className="closebutton" onClick={toggleAllUnloks}>Close</button>
                    </div>
                </div>
            }
        </div>
    );
}
export default AllUnlocksComponent;