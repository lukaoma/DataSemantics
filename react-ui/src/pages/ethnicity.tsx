import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import React, {useEffect, useState} from "react";
import {GetPacients} from "./Names";

// Resolves charts dependancy
charts(FusionCharts);


export default function Ethnicity() {
    const [races, setRaces] = useState({
        chart: {
            caption: "Ethnicity of Patients",
            plottooltext: "<b>$percentValue</b> of population is $label",
            showlegend: "1",
            showpercentvalues: "1",
            legendposition: "bottom",
            usedataplotcolorforlabels: "1",
            theme: "umber"
        },
        data: [{
            label: "White",
            value: 0
        }

        ]
    });
    useEffect(() => {
        GetPacients().pipe().subscribe({
            next: data => setRaces(old => {
                const newData = JSON.parse(JSON.stringify(old));
                console.log();
                if (data.resource.extension !== undefined) {
                    const currentEthnicity: string = data.resource.extension[0].valueCodeableConcept.coding[0].display;
                    const found = newData.data.find(ele => ele.label === currentEthnicity);
                    if (found !== undefined) {
                        found.value = (parseInt(found.value) + 1) + ""
                    } else {
                        newData.data.push({
                            label: currentEthnicity,
                            value: "1"
                        },);
                    }
                }
                return newData
            }),
        });
    }, []);

    return (
        <ReactFusioncharts
            type="pie3d"
            width="100%"
            height="150%"
            dataFormat="JSON"
            dataSource={races}
        />
    );
}
