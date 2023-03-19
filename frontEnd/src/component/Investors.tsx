import React, {useState} from 'react';
import "../style/Investors.css"
import {gql, useMutation} from "@apollo/client";
import {World} from "../world";

type InvestorsProps = {
    showInvestors: boolean;
    username: string;
    world: World;
    onCloseInvestors : () => void;
}
function InvestorsComponent({ showInvestors, username, world, onCloseInvestors}: InvestorsProps) {

    const [State, setState] = useState(showInvestors);

    const RESET_WORLD = gql`
         mutation resetWorld {
            resetWorld {
            
    name
    logo
    money
    score
    totalangels
    activeangels
    angelbonus
    lastupdate
    products {
      id
      name
      logo
      cout
      croissance
      revenu
      vitesse
      quantite
      timeleft
      managerUnlocked
      palliers {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
    }
    allunlocks {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
    upgrades {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
    angelupgrades {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
    managers {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
             }
         }`;

    const [resetWorld] = useMutation(RESET_WORLD,
        { context: { headers: { "x-user": username }},
            onError: (error): void => {
                console.log(error);
            }
        }
    )
    let score = world.score;
    //Calcul des anges
    let activeAngelsBis = Math.round(150 * Math.sqrt(score / Math.pow(10, 4)));

    function toggleInvestors(){
        //console.log("Toggle Managers, State =", State);
        setState(!State);
        onCloseInvestors();
    }

    return (
        <div>
            {showInvestors &&
                <div className="modal">
                    <div>
                        <h1 className="title">Angel Investors</h1>
                    </div>
                    <div>
                        <div className="infosinvestors">
                            <div className="totalangels">Total des Anges : {world.totalangels}</div>
                            <div className="angelbonus">2% de bonus par anges</div>
                        </div>
                        <div>
                            <button className="button-reset" onClick={() => { resetWorld(); window.location.reload(); }}>
                                Reset World avec {activeAngelsBis} nouveaux anges en plus
                            </button>
                        </div>
                        <button className="closebutton" onClick={toggleInvestors}>Close</button>
                    </div>
                </div>
            }
        </div>
    );
}
export default InvestorsComponent;