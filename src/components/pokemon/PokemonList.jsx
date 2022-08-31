// permet d'afficher la liste des pokemons
import React, { Component } from 'react'
import axios from 'axios'
import PokemonCard from './PokemonCard'

export default class PokemonList extends Component {
state = {
    url: "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0",
    pokemon: null // on créé un objet pokemon null c'est où on va enregistrer le json
}

async componentDidMount() {
    const res = await axios.get(this.state.url) // on attend de récupérer les pokemon avant d'exectuer la suite de la fonction
    console.log(res);
    this.setState({pokemon: res.data['results']}) // on passe un objet dans le state et on affecte à pokemon le tableau résultats de la data de l'url
    // setState re-render seulement les éléments qu'il faut re-rendre
}

  render() {
    return (
        <React.Fragment>
            {this.state.pokemon ? ( // s'il y a quelquechose dans le state
                <div className='row'>
                    {this.state.pokemon.map(pokemon => ( // .map permet de prendre un objet unique d'un tableau. Ici, on prend un pokemon du tableau results (dans le state pokemon)
                        <PokemonCard 
                            key={pokemon.name} // on utilise le props name comme clé unique car chaque nom de pokemon est unique
                            name={pokemon.name} // c'est le props name dans le pokemonCard
                            url={pokemon.url} // c'est le props url dans le pokemonCard
                        /> // on génère autant de cartes qu'il y a de pokemons dans le tableau results
                    ))}  
                </div>
            ) : (<h1>Loading Pokemon</h1>)} 
            {/* S'il n'y a rien dans le state afficher que le pokemon est en train de charger */}
        </React.Fragment>
    )
  }
}
