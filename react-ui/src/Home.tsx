import React     from 'react';
import Favicon   from 'react-favicon';
import logo      from './images/icon.png';
import Condition from './pages/conditions';
import Ethnicity from './pages/ethnicity';
import InputNote from './pages/inputNote';
import TableMain from './pages/TableMain';


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
            <div>
                <Favicon url={logo}/>
                <br/>
                <h1>Hospital Readmission, Data Semantics<br/>
                    <h3>Larry Ukaoma & Oliver Lu </h3>
                    <br/>
                </h1>
                <>
                    <InputNote/>
                </>
                <TableMain/>
                <Ethnicity/>
                <Condition/>
            </div>

        </div>
    );
}
