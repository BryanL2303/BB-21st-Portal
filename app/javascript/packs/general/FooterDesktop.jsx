import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div>
                <div>
                    <p>Social Media:</p>
                    <a href="https://www.instagram.com/bb21coy/" target="_blank" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                </div>
                <div>
                    <p>Affiliated With:</p>
                    <div>
                        <img src="./gm.webp" width="60px" height="60px" alt="Geylang Methodist School (Secondary)" />
                        <img src="./church.png" width="60px" height="60px" alt="Christalite Methodist Chapel" />
                    </div>
                </div>
                <div>
                    <p>Associated Websites:</p>
                    <div>
                        <a href="https://www.bb.org.sg/" target="_blank">BB HQ Website</a>
                        <a href="https://members.bb.org.sg/cos/o.x?c=/ca3_ca3bbportal/user&func=login" target="_blank">BB Members Portal</a>
                    </div>
                </div>
            </div>
            <div>
                <p>Uicons by <a href="https://www.flaticon.com/free-icons/" title="uicons icons" target="_blank">Flaticon</a> & <a href="https://fontawesome.com/" title="Font Awesome" target="_blank">Font Awesome</a></p>
                <p>Website designed and developed by: Bryan Lee & Dylan Yeo</p>
            </div>
        </footer>
    )
}

export default Footer
