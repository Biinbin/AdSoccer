import React, {useState} from 'react';
import {Pallier, World} from "../world";
import {Button} from "@mui/material";
import "../style/Angels.css"

type angelsUpgradeProps = {
    showAngels: boolean;
    world: World;
    onHireAngels : (angels: Pallier) => void;
    onCloseAngels : () => void;

}
function AngelsComponent({ showAngels, world, onHireAngels, onCloseAngels}: angelsUpgradeProps) {

    const [State, setState] = useState(showAngels);


    function toggleAngels(){
        console.log("Toggle Angels, State =", State);
        setState(!State);
        onCloseAngels();
    }

    function hireAngels(angels : Pallier) {
        if (world.activeangels >= angels.seuil) {
            onHireAngels(angels);
        }
    }

    return (
        <div>
            {showAngels &&
                <div className="modal">
                    <div>
                        <h1 className="title">Angels</h1>
                        <div className="nbAnge"> Nombre d'ange : {world.activeangels}</div>
                        <div className="nbAnge"> Bonus d'ange : {world.angelbonus}</div>
                    </div>
                    <div>
                        { world.angelupgrades.filter(angels => !angels.unlocked).map(
                            angels =>
                                <div key={angels.name} className="angelsgrid">
                                    <div>
                                        <div className="logo">
                                            <img alt="angelslogo" className="angelsImg" src={"http://localhost:4000/" + angels.logo} />
                                        </div>
                                    </div>
                                    <div className="infosangels">
                                        <div className="angelsname">{angels.name}</div>
                                        <div className="angelscost">{angels.seuil}</div>
                                        <div className="angelsratio">{angels.typeratio} x{angels.ratio}</div>
                                    </div>
                                    <div onClick={() => hireAngels(angels)}>
                                        <Button disabled={world.activeangels < angels.seuil}>Angels Upgrades !</Button>
                                    </div>
                                </div>
                        )
                        }
                        <button className="closebutton" onClick={toggleAngels}>Close</button>
                    </div>
                </div>
            }
        </div>
    );
}
export default AngelsComponent;