import React, { useState } from 'react'
import { UserMenu } from './UserMenu'

/* To access all the pages */
const NavigationBar = () => {
  const [userMenuVisible, setUserMenuVisible] = useState(false)

  // Function to toggle the visibility of the user menu
  const toggleUserMenu = () => {
    setUserMenuVisible(prevState => !prevState);
  };

  return(
    <div className='navigation-bar'>
      <img className="crest" src="/packs/media/packs/general/bb-crest-7106b85f04ce6829d39a973203d05a81.png"></img>
      <button className="account-dropdown" onClick={toggleUserMenu}><img src="/packs/media/packs/general/sidebar-icon-d04f396ba76b9667ee34744d3127b961.jpg" alt='Side bar'></img></button>
      {userMenuVisible && <UserMenu/>}
    </div>
  )
}

export { NavigationBar }