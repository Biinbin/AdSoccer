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
      paliers {
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
    const [username, setUsername] = useState(localStorage.getItem('username') || `Captain${Math.floor(Math.random() * 10000)}`);
    const onUserNameChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const username = event.currentTarget.value;
        setUsername(username);
        localStorage.setItem('username', username);
        // Force Apollo client de refetch le query avec le nveau username
        client.resetStore();
    };
    const client = useApolloClient();
    const { loading, error, data } = useQuery(GET_WORLD, {
        context: { headers: { 'x-user': username } },
    });

    let corps = undefined;
    let main = undefined;
    if (loading) corps = <div> Loading... </div>;
    else if (error) corps = <div> Erreur de chargement du monde ! </div>;
    else main=<div> <Main loadworld={data.getWorld} username={username}/> </div>;

    return (
        <div>
        <div className="username" >
            <div> Your ID :</div>
            <input type="text" value={username} onChange={onUserNameChanged} />
            {corps}
        </div>
            {main}
        </div>
    );
}

export default App;
