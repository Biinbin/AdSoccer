import '../style/App.css';
import React, { useState } from 'react';
import {gql, useApolloClient, useQuery} from '@apollo/client';
import Main from "./Main";

const GET_WORLD = gql`
  query getWorld {
  getWorld {
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
}
`;

function App() {
    //const [username, setUsername] = useState (localStorage.getItem('username') || `Captain${Math.floor(Math.random() * 10000)}`);

    const client = useApolloClient();

    let name = localStorage.getItem("username");
    // si pas de username, on génère un username aléatoire
    if (!name || name === "") {
        name = "Captaine" + Math.floor(Math.random() * 10000);
        localStorage.setItem("username", name);
    }

    const [username, setUsername] = useState(name)
    const {loading, error, data, refetch } = useQuery(GET_WORLD, {
        context: { headers: { "x-user": username } }
    });

    const onUserNameChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const username = event.currentTarget.value;
        setUsername(username);
        localStorage.setItem('username', username);
        // Force Apollo client de refetch le query avec le nveau username
        client.resetStore();
    };

    let corps = undefined
    if (loading) corps = <div> Loading... </div>;
    else if (error) corps = <div> Erreur de chargement du monde ! </div>;
    else corps=<div> <Main loadworld={data.getWorld} username={username}/> </div>;

    return (
        <div className="appli">
        <div className="username" >
            <div> Your ID :</div>
            <input type="text" value={username} onChange={onUserNameChanged} />
        </div>
            {corps}
        </div>
    );
}

export default App;
