import React, { Component } from "react";
import "./styles/App.css";
import Sidebar from "./Components/Sidebar";
import GFIcon from "./img/marker.png";

class App extends Component {
  state = {
    venues: [],
    selectedPlace: null,
    markers: [],
    categories: [
      { name: "All", id: "4d4b7105d754a06374d81259" },
      { name: "Coffee & Bakery", id: "4bf58dd8d48988d16d941735" },
      { name: "Ice-cream", id: "4bf58dd8d48988d1c9941735" },
      { name: "Italian Cuisine", id: "4bf58dd8d48988d110941735" },
      { name: "Mediterranean Cuisine", id: "4bf58dd8d48988d1c0941735" },
      { name: "Mexican Cuisine", id: "4bf58dd8d48988d1c1941735" },
      { name: "Vegetarian/Vegan Cuisine", id: "4bf58dd8d48988d1d3941735" }
    ],
    filteredVenues: []
  };

  componentDidMount() {
    this.loadMap();
    this.fetchVenues();
    window.gm_authFailure = function() {
      alert("Authentication failed!");
  };
  }

  /* MAP LOADING */
  loadMap = () => {
    const googleApi = "";
    loadScript(
      `http://maps.googleapis.com/maps/api/js?libraries=geometry&key=${googleApi}&callback=initMap`
    )
    window.initMap = this.initMap;
    window.google = {};
  }

  // Fetch from FourSquare
  fetchVenues = () => {
    const parameters = {
      query: "gluten free",
      lat: 41.40676473289501,
      lng: 2.184118732202137,
      limit: 100,
      v: "20181412",
      clientSecret: "",
      clientID: "",
      categoryId: [
        "4bf58dd8d48988d16d941735",
        "4bf58dd8d48988d1d3941735",
        "4bf58dd8d48988d1c9941735",
        "4bf58dd8d48988d1c0941735",
        "4bf58dd8d48988d1c1941735",
        "4bf58dd8d48988d110941735"
      ]
    };

    let baseUrl = "https://api.foursquare.com/v2/venues/";
    let url =
      baseUrl +
      `explore?client_id=${parameters.clientID}&client_secret=${parameters.clientSecret}&v=${parameters.v}&ll=${parameters.lat},${parameters.lng}&limit=${parameters.limit}&categoryId=${parameters.categoryId}&intent=browse&radius=30000&query=${parameters.query}`;

    // Fetching from FourSquare
    fetch(url)
      // Fetch from the URL, then handle json response
      .then(response => response.json())
      .then(fsdata => {
        // set the state of both the venues and initial state for filteredVenues list
        this.setState(
          {
            venues: fsdata.response.groups[0].items,
            filteredVenues: fsdata.response.groups[0].items
          },
          this.loadMap()
        );
      })
      .catch(err => window.alert("Foursquare API not fetched. Error occurs " + err));
  };

  /* MAP CREATION */
  initMap = () => {
    // Create A Map
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 41.3851, lng: 2.1734 },
      zoom: 14
    });
    
    // Map has been created
    this.createMarker(map)
  };

  // Create Marker and Info Window
  createMarker = map => {
    this.state.venues.map(place => {
      // Create A Marker //
      const marker = new window.google.maps.Marker({
        id: place.venue.categories[0].id,
        venueId: place.venue.id,
        alt: 'marker',
        position: {
          lat: place.venue.location.lat,
          lng: place.venue.location.lng
        },
        icon: GFIcon,
        map: map
      });
      // When the map loads, the markers appear by dropping on the map
      marker.setAnimation(window.google.maps.Animation.DROP);
      // All markers go on an array to set the state
      const markers = [];
      markers.push(marker);
      this.setState(previousState => ({
        markers: [...previousState.markers, marker]
      }));
      // Create the infoWindow calling the function createInfoWindow()
      return this.createInfoWindow(marker, place);
      
    });
  };

  // Create InfoWindow
  createInfoWindow = (marker, place) => {
    const infowindow = new window.google.maps.InfoWindow();
    let contentString = `<div class='infoWindow'>
    <h1>${place.venue.name}</h1>
    <h2>${place.venue.categories[0].name}</h2>
    <h3>Address: ${place.venue.location.formattedAddress}</h3>
    </div>`;


    // Click on A Marker
    marker.addListener("click", function () {
      // Zoom to marker on click
      this.map.setCenter(marker.getPosition());
      this.map.setZoom(16);
      marker.setAnimation(window.google.maps.Animation.BOUNCE);

      setTimeout(function () {
        marker.setAnimation(null)
      }, 1000);

      // Change the content of the window
      infowindow.setContent(contentString);

      // Open An InfoWindow
      infowindow.open(this.map, marker);

      this.map.addListener("click", function () {
        infowindow.close()
      });
    });
  };


  // Filter Venues depending on dropdown selection
  filterVenues = value => {
    let filteredVenues;
    // If the value is equal to the first category, then show all
    if (value === this.state.categories[0].id) {
      this.setState({ filteredVenues: this.state.venues });
      this.state.markers.forEach(marker => {
        marker.setVisible(true);
      });
      // Else, update state and call the filterMakers() function to update the markers
    } else {
      filteredVenues = this.state.venues.filter(
        place => place.venue.categories[0].id === value
      );
      this.setState({ filteredVenues: filteredVenues }, () => {
        this.filterMarkers(this.state.filteredVenues);
      });
    }
  };

  filterMarkers = () => {
    let i;
    // Loop through the markers array
    for (i = 0; i < this.state.markers.length; i++) {
      const marker = this.state.markers[i];
      let opt;
      // Loop through the filteredVenues that come from filterVenues() to compare with the markers array
      for (opt = 0; opt < this.state.filteredVenues.length; opt++) {
        // If the marker id doesn't match the category selected then hide
        if (
          marker.id !== this.state.filteredVenues[opt].venue.categories[0].id
        ) {
          marker.setVisible(false);
          // Else, show the markers on the map
        } else if (
          marker.id === this.state.filteredVenues[opt].venue.categories[0].id
        ) {
          marker.setVisible(true);
        }
      }
    }
  };

  // Handle click on an item in the Sidebar
  handleClick = placeClicked => {
    this.setState({
      selectedPlace: placeClicked
    });
    return this.state.markers.forEach(marker => {
      // Iterate through the markers array, if it's a match then animate and open infoWindow
      if (marker.venueId === placeClicked) {
        window.google.maps.event.addListener(marker, "click", function () {
          this.map.setZoom(16);
          this.map.setCenter(marker.getPosition());
        });

        return window.google.maps.event.trigger(marker, "click");
      }
    });
  };

  render() {
    return (
      <main>
        <Sidebar
          venues={this.state.venues}
          filteredVenues={this.state.filteredVenues}
          marker={this.marker}
          handleClick={this.handleClick}
          categories={this.state.categories}
          filterVenues={this.filterVenues}
        />

        <div ref="map" id="map" aria-label="map"/>
      </main>
    );
  }
}

// Learned to do this by Elharony tutorial https://www.youtube.com/watch?v=ywdxLNjhBYw
function loadScript(url) {
  const index = window.document.getElementsByTagName("script")[0];
  const script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
