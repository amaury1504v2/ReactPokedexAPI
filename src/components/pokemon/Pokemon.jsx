//affiche la page de détails du pokemon
import React, { Component } from 'react';

import axios from 'axios';

const TYPE_COLORS = {
    bug: 'B1C12E',
    dark: '4F3A2D',
    dragon: '755EDF',
    electric: 'FCBC17',
    fairy: 'F4B1F4',
    fighting: '823551D',
    fire: 'E73B0C',
    flying: 'A3B3F7',
    ghost: '6060B2',
    grass: '74C236',
    ground: 'D3B357',
    ice: 'A3E7FD',
    normal: 'C8C4BC',
    poison: '934594',
    psychic: 'ED4882',
    rock: 'B9A156',
    steel: 'B5B5C3',
    water: '3295F6'
};

class Pokemon extends Component {

    state = {
        name: '',
        pokemonIndex: '',
        imageUrl: '',
        types: [], // il peut y avoir plusieurs types donc on doit les ranger dans un tableau
        description: '',
        stats: {
            hp: '',
            attack: '', 
            defense: '', 
            speed: '', 
            specialAttack: '', 
            specialDefense: ''
        }, // on met toutes les statistiques dans un objet
        height: '',
        weight: '',
        eggGroups: '',
        catchRate: '',
        abilities: '',
        genderRatioMale: '',
        genderRatioFemale: '',
        evs: '',
        hatchSteps: ''
    }

    async componentDidMount() {
        // console.log(window.location); // envoie un objet location avec des infos sur la fenêtre (Pokemon.jsx)
        // console.log(this.state);
        const url = window.location.href;
        const pokemonIndex = url.split('/')[url.split('/').length - 1];
        //console.log(pokemonIndex);

        // urls pour récupérer les données de la page de détails du pokemon
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

        const pokemonRes = await axios.get(pokemonUrl);
        //console.log(pokemonRes);

        const name = pokemonRes.data.name
            .toLowerCase()
            .split('-')
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' '); // on récupère le name de l'objet data

        const imageUrl = pokemonRes.data.sprites.front_default;

        let { hp, attack, defense, speed, specialAttack, specialDefense } = '';

        pokemonRes.data.stats.map(stat => { // on parcourt le tableau stats. pour chaque stat dans le tableau stats,
            switch(stat.stat.name) {
                case 'hp': // dans le cas ou stat.stat.name = 'hp', on affiche la base_stat qui se trouve à stat.base_stat
                    hp = stat.base_stat; 
                    break;
                case 'attack': 
                    attack = stat.base_stat; 
                    break;
                case 'defense': 
                    defense = stat.base_stat; 
                    break;
                case 'speed': 
                    speed = stat.base_stat; 
                    break;
                case 'special-attack': 
                    specialAttack = stat.base_stat; 
                    break;
                case 'special-defense': 
                    specialDefense = stat.base_stat; 
                    break;
                default:
                    break;
            }
        });

        

        const height = Math.round((pokemonRes.data.height * 0.328084 + 0.0001) * 100) / 100; // Permet de convertir les décimètres en feet. Le + 0.0001 * 100 / 100 permet d'arrondir à 2 décimales près
        
        // convertit en pounds (lbs)
        const weight = Math.round((pokemonRes.data.weight * 0.220462 + 0.0001) * 100) / 100;

        const types = pokemonRes.data.types.map(type => { return type.type.name });

        const abilities = pokemonRes.data.abilities.map(ability => { 
            return ability.ability.name
                .toLowerCase()
                .split('-')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
        })
        /* Pour la const abilities, on parcourt le tableau abilities. Pour chaque abilité de ce dernier tableau, on retourne le champ name qu'on met en minuscule, 
        on sépare en plusieurs strings par le - et on range les plusieurs valeurs dans un tableau que l'on parcourt. 
        Pour chaque string (valeur) du tableau, à la caractère 0, mettre en majuscule, puis afficher le reste du string, à partir de la caratère 1. Joindre où il y a un espace */

        const evs = pokemonRes.data.stats.filter(stat => { // permet de filtrer chacunes des valeurs stat du tableau stats
            if (stat.effort > 0) { // si l'effort (la valeur effort dans le tableau stats) est supérieur à 0,
                return true; // afficher vrai en tant que valeur à retourner
            } else {
                return false; // afficher faux en tant que valeur à retourner
            }
        }).map(stat => {
            return `${stat.effort} ${stat.stat.name
                    .toLowerCase()
                    .split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ')
                }`;
        })
        .join(', ');

        await axios.get(pokemonSpeciesUrl).then(res => {
            let description = '';
            res.data.flavor_text_entries.some(flavor => {
                if (flavor.language.name === 'en') {
                    description = flavor.flavor_text;
                    return;
                }
            })

            const femaleRate = res.data.gender_rate;
            const genderRatioFemale = 12.5 * femaleRate;
            const genderRatioMale = 12.5 * (8 - femaleRate);

            const catchRate = Math.round((100/255) * res.data.capture_rate); // par défaut, l'API donne un catchRate allant jusqu'à 255. Nous on le convertit en * 100

            const eggGroups = res.data.egg_groups.map(group => {
                return group.name
                    .toLowerCase()
                    .split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
            }).join(', ');

            const hatchSteps = 255 * (res.data.hatch_counter + 1);

            this.setState({
                description,
                genderRatioFemale,
                genderRatioMale,
                catchRate,
                eggGroups,
                hatchSteps
            })
        });

        this.setState({
            imageUrl,
            pokemonIndex,
            name,
            types,
            stats: {
              hp,
              attack,
              defense,
              speed,
              specialAttack,
              specialDefense
            },
            height,
            weight,
            abilities,
            evs
        });
    }



  render() {
    return (
      <div className="col">
        <div className="card">
            <div className="card-header">
                <div className="row">
                    <div className="col-5">
                        <h5>{this.state.pokemonIndex}</h5>
                    </div>
                    <div className="col-7">
                        <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                            {this.state.types.map(type => (
                                <span 
                                    key={type} 
                                    className="badge" 
                                    style={{ marginRight: "0.5em", backgroundColor: `#${TYPE_COLORS[type]}`, color: 'white' }}
                                >
                                    {type
                                        .toLowerCase()
                                        .split('-')
                                        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                        .join(' ')
                                    }
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-3">
                        <img src={this.state.imageUrl} alt={this.state.name} className="card-image-top rounded mx-auto mt-2" />
                    </div>
                    <div className="col-md-9">
                        <h4 className="mx-auto mb-2">{this.state.name}</h4>
                        <div className="row align-items-center">
                            <div className="col-12 col-md-3">HP</div>
                            <div className="col-12 col-md-9">
                                <div className="progress">
                                    <div 
                                        className="progress-bar" 
                                        role="progressBar" 
                                        style={{ width: `${this.state.stats.hp}%` }}
                                        aria-valuenow="25"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        <small>{this.state.stats.hp}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-12 col-md-3">Attack</div>
                            <div className="col-12 col-md-9">
                                <div className="progress">
                                    <div 
                                        className="progress-bar" 
                                        role="progressBar" 
                                        style={{ width: `${this.state.stats.attack}%` }}
                                        aria-valuenow="25"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        <small>{this.state.stats.attack}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-12 col-md-3">Defense</div>
                            <div className="col-12 col-md-9">
                                <div className="progress">
                                    <div 
                                        className="progress-bar" 
                                        role="progressBar" 
                                        style={{ width: `${this.state.stats.defense}%` }}
                                        aria-valuenow="25"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        <small>{this.state.stats.defense}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-12 col-md-3">Speed</div>
                            <div className="col-12 col-md-9">
                                <div className="progress">
                                    <div 
                                        className="progress-bar" 
                                        role="progressBar" 
                                        style={{ width: `${this.state.stats.speed}%` }}
                                        aria-valuenow="25"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        <small>{this.state.stats.speed}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-12 col-md-3">Special Attack</div>
                            <div className="col-12 col-md-9">
                                <div className="progress">
                                    <div 
                                        className="progress-bar" 
                                        role="progressBar" 
                                        style={{ width: `${this.state.stats.specialAttack}%` }}
                                        aria-valuenow="25"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        <small>{this.state.stats.specialAttack}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-12 col-md-3">Special Defense</div>
                            <div className="col-12 col-md-9">
                                <div className="progress">
                                    <div 
                                        className="progress-bar" 
                                        role="progressBar" 
                                        style={{ width: `${this.state.stats.specialDefense}%` }}
                                        aria-valuenow="25"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        <small>{this.state.stats.specialDefense}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col">
                            <p className="p-2">{this.state.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className="card-body">
                <h5 className="card-title text-center">Profile</h5>
                <div className="row">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="text-end" style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <h6>Height:</h6>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="text-beginning" style={{ display: 'flex', justifyContent: 'flex-start'}}>
                                    <h6>{this.state.height} ft.</h6>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="text-end" style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <h6>Weight:</h6>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="text-beginning" style={{ display: 'flex', justifyContent: 'flex-start'}}>
                                    <h6>{this.state.weight} lbs.</h6>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="text-end" style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <h6>Catch Rate:</h6>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="text-beginning" style={{ display: 'flex', justifyContent: 'flex-start'}}>
                                    <h6>{this.state.catchRate}%</h6>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="text-end" style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <h6>Gender Ratio:</h6>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="progress">
                                    <div 
                                        className="progress-bar"
                                        role="progressBar"
                                        style={{ 
                                            width: `${this.state.genderRatioFemale}%`,
                                            backgroundColor: "#C2185B"
                                        }}
                                        aria-valuenow="15"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        {this.state.genderRatioFemale}
                                    </div>
                                    <div 
                                        className="progress-bar"
                                        role="progressBar"
                                        style={{ 
                                            width: `${this.state.genderRatioMale}%`,
                                            backgroundColor: "#1976D2"
                                        }}
                                        aria-valuenow="30"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        {this.state.genderRatioMale}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="text-end" style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <h6>Egg Groups:</h6>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="text-beginning" style={{ display: 'flex', justifyContent: 'flex-start'}}>
                                    <h6>{this.state.eggGroups}</h6>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="text-end" style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <h6>Hatch Steps:</h6>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="text-beginning" style={{ display: 'flex', justifyContent: 'flex-start'}}>
                                    <h6>{this.state.hatchSteps}</h6>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="text-end" style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <h6>Abilities:</h6>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="text-beginning" style={{ display: 'flex', justifyContent: 'flex-start'}}>
                                    <h6>{this.state.abilities}</h6>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="text-end" style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <h6>EVs:</h6>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="text-beginning" style={{ display: 'flex', justifyContent: 'flex-start'}}>
                                    <h6>{this.state.evs}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-footer text-muted">
                Data from <a href="http://pokeapi.co/" target="_blank" className="card-link text-decoration-none">PokeAPI.co</a>
            </div>
        </div>
    </div>
    )
  }
}

export default Pokemon;

