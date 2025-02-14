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
      <img className="crest" src="/assets/coy logo-9c8cabf89b71a4b4554e2864db559572b3b21bb9be05fafabfc844e3a584b7e1.png"></img>
      <button className="account-dropdown" onClick={toggleUserMenu}><img src="/packs/media/packs/general/sidebar-icon-d04f396ba76b9667ee34744d3127b961.jpg" alt='Side bar'></img></button>
      {userMenuVisible && <UserMenu/>}
    </div>
  )
}

export { NavigationBar }