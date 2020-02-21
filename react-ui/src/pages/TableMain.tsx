import React, {useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table';
import TableElement from './TableElement'

export interface ElementTD {
    Camera_Attribute: string
    Camera_Attribute_Value: string
    Count: number
}

const eleTD: ElementTD = {
    Camera_Attribute: "camera_status",
    Camera_Attribute_Value: "DESIRED",
    Count: 10
}

function TableMain(props: any) {
    const [data, setData] = useState([eleTD]);
    const getData = () => {
        fetch("/api")
            .then(response => {
                return response.json();
            }).then(json => {
                // alert(JSON.stringify(json));
                const response: ElementTD[] = json;
                setData(old => {
                    return [...response]
                });
            }
        )

    }
    useEffect(() => {
        getData()
    }, []);

    return (
        <div className="Table" ref={props.useRe}>
            <Table striped bordered>
                <thead>
                <tr>
                    <th>Camera Attribute</th>
                    <th>Camera Attribute Value</th>
                    <th>Count</th>
                </tr>
                </thead>
                <tbody>{data.map(tableElem => <TableElement eleTD={tableElem}/>)}
                </tbody>
            </Table>
        </div>
    );
}

export default TableMain;
