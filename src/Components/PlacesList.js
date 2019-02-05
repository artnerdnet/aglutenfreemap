import React, { Component } from 'react';
import FoursquareCredit from '../img/foursquare.png'
import FreePikCredit from '../img/freepik.png'
class PlacesList extends Component {


  render() {
    return (
      <div className='list-container'>
        <div className='searchFilter'>
          <label className="selector-intro"><h1>What do you want to eat?</h1></label>
          {/* ---- Creates drop down selector based on categories state ----- */}
          <select className="select" aria-label="Choose what you want to eat" onChange={event => {
            this.props.filterVenues(event.target.value)
          }}>

            {this.props.categories.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>

            ))}
          </select>
        </div>
        <div className="placeslisting">
          <ul id="placesListing" role="listbox">
            {/* ---- Creates listing ----- */}
            {this.props.filteredVenues.map((place) => (
              <li key={place.venue.id} role="button"  tabIndex="0"  onKeyPress={() => this.props.handleClick(place.venue.id)} onClick={() => this.props.handleClick(place.venue.id)}>
                {place.venue.name}
              </li>

            ))}
          </ul>
          <div className="credits">
            <a id='devcredit' href="http://www.artnerd.net" target='_blank' rel="noopener noreferrer">Developed by Art Nerd Net</a>
            <div id="fpcredit">Icon made by Freepik <a href="https://www.freepik.com/" title="Freepik" target='_blank' rel="noopener noreferrer"><img src={FreePikCredit} alt='Made by FreePik' /></a></div>
            <a href='https://www.foursquare.com' target='_blank' rel="noopener noreferrer"> <img id="fscredit" src={FoursquareCredit} alt='Powered by FourSquare' /></a>
          </div>
        </div>
      </div>
    );
  }
}

export default PlacesList;