import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './PokemonSearchBar.css';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

export default function PokemonSearchBar({ placeholder, data, onDataFiltered }) {
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");

    const handleFilter = (e) => {
        const searchWord = e.target.value;
        setWordEntered(searchWord);
        const newFilter = data.filter(value => {
            return (value.name.toLowerCase().includes(searchWord.toLowerCase()));
        });
        
        if(searchWord === "") {
            setFilteredData([]);
            onDataFiltered([]);
        } else {
            setFilteredData(newFilter);
            onDataFiltered(newFilter);
        }
    }

    const clearInput = (e) => {
        setWordEntered("");
        setFilteredData([]);
    }

  return (
    <div className='search'>
        <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="col-3"></div>
            <div className="col-6">
                <div className="searchInputs" style={{ display: 'flex', justifyContent: 'center'}}>
                    <input type="text" className="form-control rounded" placeholder={placeholder} onChange={handleFilter} value={wordEntered} />
                    {filteredData.length === 0 ? <button type="button" className="btn btn-primary"><SearchIcon /></button> : <button type="button" className="btn btn-warning"><CloseIcon onClick={clearInput} /></button>}
                </div>
            </div>
            <div className="col-3"></div>
        </div>
        {filteredData.length !== 0 &&
            <div className="dataResult mx-auto" style={{ display: 'flex', justifyContent: 'center' }}>
                <ul>
                    {filteredData.slice(0, 15).map((pokemon) => {
                        return (<li style={{ listStyleType: 'none', textDecoration: 'none'}} className="dataItem"><Link to="/" className="a" style={{ textDecoration: 'none', color: 'black' }}>{pokemon.name}</Link></li>)
                    })}
                </ul>
            </div>
        }
    </div>
  )
}
