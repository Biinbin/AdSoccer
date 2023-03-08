import React from 'react';

type ManagersProps = {
    showManagers: false,
}
function ManagersComponent({ showManagers}: ManagersProps) {
/*
    const toggleManagers = () => {
        setState({ showManagers: !showManagers });
    }

    const hireManager = (manager) => {
        if (world.money >= manager.seuil) {
            onHireManager(manager.id);
        }
    }


    return (
        <div>
            {this.state.showManagers &&
                <div className="modal">
                    <div>
                        <h1 className="title">Managers make you feel better !</h1>
                    </div>
                    <div>
                        { this.props.world.managers.pallier.filter(manager => !manager.unlocked).map(
                            manager =>
                                <div key={manager.idcible} className="managergrid">
                                    <div>
                                        <div className="logo">
                                            <img alt="manager logo" className="round" src={this.props.services.server + manager.logo} />
                                        </div>
                                    </div>
                                    <div className="infosmanager">
                                        <div className="managername">{manager.name}</div>
                                        <div className="managercible">{this.props.world.products.product[manager.idcible-1].name}</div>
                                        <div className="managercost">{manager.seuil}</div>
                                    </div>
                                    <div onClick={() => hireManager(manager)}>
                                        <Button disabled={this.props.world.money < manager.seuil}>Hire !</Button>
                                    </div>
                                </div>
                        )
                        }
                        <button className="closebutton" onClick={toggleManagers}>Close</button>
                    </div>
                </div>
            }
        </div>
    );*/
}
export default ManagersComponent;