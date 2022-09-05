// permet d'afficher la liste des pokemons
import React, { Component } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';

import PokemonCard from './PokemonCard';


export default class PokemonList extends Component {
    state = {
        url: "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0",
        pokemon: [], // on créé un objet (qui va devenir un tableau) pokemon null c'est où on va enregistrer le json
        pageNumber: 0,
        pokemonsPerPage: 16
    };

    async componentDidMount() {
        const res = await axios.get(this.state.url); // on attend de récupérer les pokemon avant d'exectuer la suite de la fonction
        console.log(res.data['results']);
        this.setState({pokemon: res.data['results']}); // on passe un objet dans le state et on affecte à pokemon le tableau résultats de la data de l'url
        // setState re-render seulement les éléments qu'il faut re-rendre
    };

    render() {
        console.log(this.state.pokemon);

        const pagesVisited = this.state.pageNumber * this.state.pokemonsPerPage;

        const displayUsers = this.state.pokemon
            .slice(pagesVisited, pagesVisited + this.state.pokemonsPerPage)
            .map((pokemon) => {
                return (
                    <PokemonCard 
                        key={pokemon.name} // on utilise le props name comme clé unique car chaque nom de pokemon est unique
                        name={pokemon.name} // c'est le props name dans le pokemonCard
                        url={pokemon.url} // c'est le props url dans le pokemonCard
                    /> // on génère autant de cartes qu'il y a de pokemons dans le tableau results
                )
            });

            const pageCount = Math.ceil(this.state.pokemon.length / this.state.pokemonsPerPage); // ceil() permet d'arrondir au supérieur

            const changePage = ({selected}) => {
                this.setState({pageNumber: selected})
            }

        return (
            <React.Fragment>
                {this.state.pokemon ? ( // s'il y a quelquechose dans le state
                    <div className='row'>
                        {displayUsers}
                        <div style={{ display: 'flex', justifyContent: 'center'}}>
                            <ReactPaginate 
                                previousLabel={"previous"}
                                nextLabel={"Next"}
                                pageCount={pageCount}
                                onPageChange={changePage}
                                containerClassName={"paginationButtons"}
                                previousLinkClassName={"previousButton"}
                                nextLinkClassName={"nextButton"}
                                disabledClassName={"paginationDisabled"}
                                activeClassName={"paginationActive"}
                            />
                        </div>
                    </div>
                ) : (<h2>Loading Pokemon</h2>)} 
                {/* S'il n'y a rien dans le state afficher que le pokemon est en train de charger */}
            </React.Fragment>
        )
    }
}
