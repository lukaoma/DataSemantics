import React from 'react';
import TableMain from "./pages/TableMain";
import Favicon from 'react-favicon';
import logo from "./images/icon.png"
import Ethnicity from "./pages/ethnicity";
import Condition from "./pages/conditions";


export default function HomePage(props: any) {
    // const client = FHIR.client("https://r3.smarthealthit.org");
    // let info = null;
    //
    // let refs = useRef();
    // const showTable = () => {
    //     let element: any = refs.current;
    //     element.style.visibility = "visible";
    // };
    //
    // useEffect(() => {
    //     client.request("Patient/2e27c71e-30c8-4ceb-8c1c-5641e066c0a4").then((r: any) => {
    //         const real = JSON.stringify(r);
    //         console.log(real);
    //         //document.getElementById("chill").innerText = real;
    //     });
    // }, []);

    return (
        <div>
            <Favicon url={logo}/>
            <h1>Data Semantics<br/>
                <br/>
            </h1>
            {/*<h1 id="chill">HER</h1>*/}
            <TableMain/>
            <Ethnicity/>
            <Condition/>
            {/*<h3 style={{color: "blue"}}>Welcome to Traffic Camera Analytics Page<br/>*/}
            {/*    Click <a href="##" style={{textDecoration: "underline"}} onClick={showTable}>​here​</a> to see details*/}
            {/*    about Traffic Cameras in Austin Metro Area.</h3>*/}
            {/*<TableMain useRe={refs}/>*/}
        </div>
    );
}
