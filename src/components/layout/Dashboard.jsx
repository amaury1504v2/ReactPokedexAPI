// c'est ici l'interface utilisateur
import React, { Component } from 'react';
import axios from 'axios';

import PokemonList from '../pokemon/PokemonList';

export default class Dashboard extends Component {
  state = {
    url: "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0",
    pokemon: null // on créé un objet pokemon null c'est où on va enregistrer le json
  }

  async componentDidMount() {
    const res = await axios.get(this.state.url) // on attend de récupérer les pokemon avant d'exectuer la suite de la fonction
    this.setState({pokemon: res.data['results']}) // on passe un objet dans le state et on affecte à pokemon le tableau résultats de la data de l'url
    // setState re-render seulement les éléments qu'il faut re-rendre
    
  }
  render() {
    return (
      <div className="row">
        <div className="col">
            <br />
            <PokemonList />
        </div>
      </div>
    )
  }
}
