import React from 'react';
import {ElementTD} from './TableMain';

function TableElement(props: any) {
    const holdEle: ElementTD = props.eleTD;
    return (
        <tr>
            <td>{holdEle.Camera_Attribute}</td>
            <td>{holdEle.Camera_Attribute_Value}</td>
            <td>{holdEle.Count}</td>
        </tr>
    );
}

export default TableElement;
