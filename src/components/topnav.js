import React from "react";
import "../css/topnav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse, faMessage, faUsersRectangle, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
library.add(faHouse, faMessage, faUsersRectangle, faMagnifyingGlass);

function Topnav() {
    return(
        <div className="topnav">
            <form method="POST" id='searchForm' className="searchNav">
                <input type='search' id="searchField" className="searchBox" placeholder="Search MML+" />
                <button type='submit' className="searchSub">
                    <FontAwesomeIcon className="searchIcon" icon='fa-solid fa-magnifying-glass' />
                </button>
           </form>
        </div>
    );
}
export default Topnav;