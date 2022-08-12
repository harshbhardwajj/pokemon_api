import React from 'react';
import './style.css';

function Navbar() {
    return (
        <div className="Navbar">
            <div className='titleSection'>
                <a className='poke-heading' href='/'><h1>Pokémon Stats</h1></a>
                 {/* <input  placeholder='Search pokemon here:' type="text"/>
                 <button className="search-btn" >Search</button> */}
            </div>
            
        </div>
    );
}

export default Navbar