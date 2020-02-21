import React, {useRef} from 'react';
import TableMain from './pages/TableMain';


export default function HomePage(props: any) {
    let refs = useRef();
    const showTable = () => {
        let element: any = refs.current;
        element.style.visibility = "visible";
    }

    return (
        <div>
            <h1>Data<br/>
                Assignment 6</h1>
            <br/>
            <h3 style={{color: "blue"}}>Welcome to Traffic Camera Analytics Page<br/>
                Click <a href="##" style={{textDecoration: "underline"}} onClick={showTable}>​here​</a> to see details
                about Traffic Cameras in Austin Metro Area.</h3>
            <TableMain useRe={refs}/>
        </div>
    );
}

