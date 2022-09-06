// permet de créer une carte avec les pokemons
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

import spinner from './spinner.gif';

// 1em = 16px

const Sprite = styled.img`
    width: 5em;
    height: 5em;
    display: none;
`;

const Card = styled.div`
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    &:hover {
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    }
    -moz-user-select: none; 
    -website-user-select: none;
    user-select: none;
    -o-user-select: none;
`;

// on utilise le styled.link comme Link de react-router-dom
const StyledLink = styled(Link)` 
    text-decoration: none;
    color: black;
    &focus: none;
    &:hover {
        color: #ef5350;
    }
    &visited: none;
    &link: none;
    &active: none {
        text-decoration: none;
    }
`;

// on utilise plusieurs select parce que les navigateurs réagissent pas à tous et ça permet à l'utilisateur de ne pas pouvoir sélectionner l'image et le texte

export default class PokemonCard extends Component {
    state = {
        name: '',
        imageUrl: '',
        pokemonIndex: '', // c'est l'id du pokemon
        imageLoading: true,
        tooManyRequests: false
    }

    componentDidMount() {
        //const name = this.props.name; // on passe le state name en props de ce composant
        //const url = this.props.url; // on passe le state url en props de ce composant
        const {name, url} = this.props; // on passe en props de ce composant le state name et le state url

        const pokemonIndex = url.split('/')[url.split('/').length - 2];
        const imageUrl = `https://github.com/PokeApi/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;

        this.setState({
            name, 
            imageUrl, 
            pokemonIndex
        })
    }

    render() {
        return (
            // col-md-3 : 4 cartes par rangée; col-sm-6 : 2 cartes par rangée
            <div className='col-md-3 col-sm-6 mb-5'> 
                <StyledLink to={`pokemon/${this.state.pokemonIndex}`}>
                    <Card className="card">
                        <h5 className="card-header">{this.state.pokemonIndex}</h5>
                        {this.state.imageLoading ? (
                            <img src={spinner} alt="" style={{width: '5em', height: '5em'}} className='card-img-top rounded mx-auto mt-2' /> // si le state imageLoading est vrai, ajouter le spinner, sinon, rien jouter
                        ) : null}
                        <Sprite className='card-img-top rounded mx-auto mt-2'
                            onLoad={() => this.setState({imageLoading: false})} // une fois que c'est chargé, on passe l'imageLoading dans le state à false
                            onError={() => this.setState({tooManyRequests: true})} // s'il y a une erreur, on met true à tooManyRequests dans le state
                            src={this.state.imageUrl}
                            style={
                                this.state.tooManyRequests ? {display: 'none'} : 
                                this.state.imageLoading ? null : {display: 'block'}
                            }
                        />
                        {this.state.tooManyRequests ? (
                            <h6 className="mx-auto">
                                <span className="badge badge-danger mt-2">
                                    Too Many Requests
                                </span>
                            </h6>
                        ) : null}
                        <div className="card-body mx-auto">
                            <h6 className="class-title">
                                {this.state.name
                                    .toLowerCase() // on lower case le nom du state
                                    .split(' ') // on range le string dans un tableau en créant une nouvealle valeur à chaque espace
                                    .map( // parcourir
                                        letter => letter.charAt(0).toUpperCase() + letter.substring(1) // pour chaque lettre dans le mot, à la charactère 0, mettre en majuscule 
                                    ).join(' ')} {/* Rejoint tout ensemble */}
                            </h6>
                        </div>
                    </Card>
                </StyledLink>
            </div>
        
        )
  }
}
