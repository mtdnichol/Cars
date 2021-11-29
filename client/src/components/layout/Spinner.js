import React, { Fragment } from "react";

const Spinner =  () => (
    <Fragment>
        <img src='https://res.cloudinary.com/carsapp/image/upload/v1637822161/resources/Gear-0.3s-200px_z8bjjs.svg'
             style={{ position: 'absolute', top: '50%', left: '50%', 'marginRight': '-50%', transform: 'translate(-50%, -50%)', width: '15%' }}
             alt='Loading'/>
    </Fragment>
)

export default Spinner