import React from 'react'

export const NavBar = () => <nav 
    className="navbar is-light" 
    role="navigation" 
    aria-label="main navigation"
    style={{height:100, paddingRight:30, paddingLeft:30, background:'linear-gradient(white 50%, transparent)'}}
>
    <div className="navbar-brand" style={{margin:'auto'}}>
        <img src="logo.png" style={{height:128, marginTop:-14}} alt="banner"/>
    </div>

</nav>


export const NotificationBar = () => <div className="notification is-primary" style={{padding:0}}>
    <p>
        <img src="logo.png" width="112" height="28" alt="banner"/>
        The Jobs Recommendation Engine for Software Engineers
    </p>
</div>
