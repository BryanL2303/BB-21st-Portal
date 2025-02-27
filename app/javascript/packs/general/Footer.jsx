import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div>
                <div>
                    <p>Social Media:</p>
                    <a href="https://www.instagram.com/bb21coy/" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                </div>
                <div>
                    <p>Affiliated With:</p>
                    <div>
                        <a href="https://www.geylangmethodistsec.moe.edu.sg/" target='_blank' rel="noreferrer" aria-label='Geylang Methodist School (Secondary) Website'>
                            <img src="/assets/gm-3fa691a60eebcd4c586a4a35eecafc9cf13f7f44005a12f609badbbd03ac934b.webp" width="60px" height="60px" alt="Geylang Methodist School (Secondary)" />
                        </a>
                        <a href="https://www.cmch.sg/" target='_blank' rel="noreferrer" aria-label='Christalite Methodist Chapel Website'>
                            <img src="/assets/church-1a489e164024027313247629433f9d397441e4f460323a3e367223c01f5dc57c.png" width="60px" height="60px" alt="Christalite Methodist Chapel" />
                        </a>
                    </div>
                </div>
                <div>
                    <p>Associated Websites:</p>
                    <div>
                        <a href="https://www.bb.org.sg/" target="_blank" rel="noreferrer">BB HQ Website</a>
                        <a href="https://members.bb.org.sg/cos/o.x?c=/ca3_ca3bbportal/user&func=login" target="_blank" rel="noreferrer">BB Members Portal</a>
                    </div>
                </div>
            </div>
            <div>
                <p>Uicons by <a href="https://fontawesome.com/" title="Font Awesome" target="_blank" rel="noreferrer">Font Awesome</a></p>
                <p>Website designed and developed by: Bryan Lee & Dylan Yeo</p>
            </div>
        </footer>
    )
}

export default Footer
