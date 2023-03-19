import React, {useState} from 'react';
import {Pallier, World} from "../world";
import {Button, Snackbar} from "@mui/material";
import "../style/Upgrades.css"

type UpgradesProps = {
    showUpgrades: boolean;
    world: World;
    onHireUpgrades : (upgrades: Pallier) => void;
    onCloseUpgrades : () => void;

}
function UpgradesComponent({ showUpgrades, world, onHireUpgrades, onCloseUpgrades}: UpgradesProps) {

    const [State, setState] = useState(showUpgrades);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    function toggleUpgrades(){
        console.log("Toggle Managers, State =", State);
        setState(!State);
        onCloseUpgrades();
    }

    function hireUpgrades(upgrades : Pallier) {
        if (world.money >= upgrades.seuil) {
            onHireUpgrades(upgrades);
            setOpenSnackbar(true);
            setSnackbarMessage(`${upgrades.name} est débloquée!`);
        }
    }

    return (
        <div>
            {showUpgrades &&
                <div className="modal">
                    <div>
                        <h1 className="title">Upgrades</h1>
                    </div>
                    <div>
                        { world.upgrades.filter(upgrades => !upgrades.unlocked).map(
                            upgrades =>
                                <div key={upgrades.name} className="upgradesgrid">
                                    <div>
                                        <div className="logo">
                                            <img alt="upgrades logo" className="upgradesImg" src={"http://localhost:4000/" + upgrades.logo} />
                                        </div>
                                    </div>
                                    <div className="infosupgrades">
                                        <div className="upgradesname">{upgrades.name}</div>
                                        <div className="upgradescible">{world.products[upgrades.idcible-1].name}</div>
                                        <div className="upgradescost">{upgrades.seuil}</div>
                                        <div className="upgradesRatio">{upgrades.typeratio} x{upgrades.ratio}</div>
                                    </div>
                                    <div onClick={() => hireUpgrades(upgrades)}>
                                        <Button disabled={world.money < upgrades.seuil}>Cash Upgrades !</Button>
                                    </div>
                                </div>
                        )
                        }
                        <button className="closebutton" onClick={toggleUpgrades}>Close</button>
                    </div>
                </div>
            }
            <Snackbar
                open={openSnackbar}
                message={snackbarMessage}
                autoHideDuration={5000}
                onClose={() => setOpenSnackbar(false)}
            />
        </div>
    );
}
export default UpgradesComponent;