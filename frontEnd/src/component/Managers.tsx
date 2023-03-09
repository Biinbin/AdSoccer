import React, {useState} from 'react';
import {Pallier, World} from "../world";
import {Button} from "@mui/material";
import "../style/Managers.css"


type ManagersProps = {
    showManagers: boolean;
    world: World;
    onHireManager : (manager: Pallier) => void;
    onClose : () => void;

}
function ManagersComponent({ showManagers, world, onHireManager, onClose}: ManagersProps) {

    const [State, setState] = useState(showManagers);


    function toggleManagers(){
        console.log("Toggle Managers, State =", State);
        setState(!State);
        onClose();
    }

    function hireManager(manager : Pallier) {
        if (world.money >= manager.seuil) {
            onHireManager(manager);
        }
    }

    return (
        <div>
            {showManagers &&
                <div className="modal">
                    <div>
                        <h1 className="title">Managers</h1>
                    </div>
                    <div>
                        { world.managers.filter(managers => !managers.unlocked).map(
                            managers =>
                                <div key={managers.idcible} className="managergrid">
                                    <div>
                                        <div className="logo">
                                            <img alt="manager logo" className="round" src={"http://localhost:4000/" + managers.logo} />
                                        </div>
                                    </div>
                                    <div className="infosmanager">
                                        <div className="managername">{managers.name}</div>
                                        <div className="managercible">{world.products[managers.idcible-1].name}</div>
                                        <div className="managercost">{managers.seuil}</div>
                                    </div>
                                    <div onClick={() => hireManager(managers)}>
                                        <Button disabled={world.money < managers.seuil}>Hire !</Button>
                                    </div>
                                </div>
                        )
                        }
                        <button className="closebutton" onClick={toggleManagers}>Close</button>
                    </div>
                </div>
            }
        </div>
    );
}
export default ManagersComponent;