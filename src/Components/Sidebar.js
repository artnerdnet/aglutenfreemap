import React, { Component } from "react";
import PlacesList from "./PlacesList";
import "../styles/sidebar.css";
import Logo from "../img/logo.png";


class Sidebar extends Component {

    enterPressed(event) {
        var code = event.keyCode || event.which;
        if(code === 13) { 
            document.getElementById("openSidebarMenu").click();
        } 
    }

    render() {
        return (
            <div>
                <div className="header">
                    <img src={Logo} className="logo" alt="Gluten Free Map Logo" />
                </div>

                <input
                    type="checkbox"
                    className="openSidebarMenu"
                    id="openSidebarMenu"
                />
                <label id="menuBtn" htmlFor="openSidebarMenu" className="sidebarIconToggle" aria-label="menu" role="button" tabIndex="0" onKeyPress={this.enterPressed.bind(this)}>
                    <div className="spinner diagonal part-1" />
                    <div className="spinner horizontal" />
                    <div className="spinner diagonal part-2" />
                </label>
                <div id="sidebarMenu">
                    <PlacesList
                        venues={this.props.venues}
                        marker={this.props.marker}
                        selectedPlace={this.props.selectedPlace}
                        handleClick={this.props.handleClick}
                        categories={this.props.categories}
                        filterVenues={this.props.filterVenues}
                        filteredVenues={this.props.filteredVenues}
                    />
                    


                </div>
            </div>
        );
    }
}

export default Sidebar;
