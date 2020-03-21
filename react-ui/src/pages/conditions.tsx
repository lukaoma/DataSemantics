import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import React, {useEffect, useState} from "react";
import {Observable, Observer} from "rxjs";
import * as FHIR from "fhirclient";

// Resolves charts dependancy for visuals
charts(FusionCharts);

export function GetPacients(): Observable<Entry> {
    const nameData = new Observable((serve: Observer<Entry>) => {
        const client = FHIR.client("https://r3.smarthealthit.org");
        client.request("/Condition", {pageLimit: 5}).then((r: any) => {
            const apiResponse: ConditionResponse = r;
            //update table
            if (apiResponse.entry === undefined) {
                const lotsApi: ConditionResponse[] = r;
                for (let eachResponse of lotsApi) {
                    getCondition(eachResponse.entry, serve)
                }
            } else {
                getCondition(apiResponse.entry, serve)
            }
        }).then(r => {
            serve.complete()
        });
    });
    return nameData
}

function getCondition(listCondition: Entry[], serve: any) {
    for (let condition of listCondition) {
        serve.next(condition);
    }
}

export default function Condition() {
    const [conditions, setConditions] = useState({
        chart: {
            caption: "Top Conditions",
            yaxisname: "Patients",
            showvalues: "1",
            numberprefix: "",
            theme: "fusion"
        },
        data: [{
            label: "Abnormal ECG",
            value: 0
        }]
    });
    useEffect(() => {
        GetPacients().pipe().subscribe({
            next: data => setConditions(old => {
                const newData = JSON.parse(JSON.stringify(old));
                console.log();
                if (data.resource.code.coding[0] !== undefined) {
                    const currentCondition: string = data.resource.code.coding[0].display;
                    const found = newData.data.find(ele => ele.label === currentCondition);
                    if (found !== undefined) {
                        found.value = (parseInt(found.value) + 1) + ""
                    } else {
                        newData.data.push({
                            label: currentCondition,
                            value: "1"
                        },);
                    }
                }
                newData.data.sort((a, b) => {
                    return parseInt(b.value) - parseInt(a.value)
                });
                newData.data = newData.data.slice(0, 9);
                return newData
            }),
        });
    }, []);

    return (
        <ReactFusioncharts
            type="bar3d"
            width="85%"
            height="80%"
            dataFormat="JSON"
            dataSource={conditions}
        />
    );
}


export interface ConditionResponse {
    resourceType?: string;
    id?: string;
    meta?: ConditionResponseMeta;
    type?: string;
    link?: Link[];
    entry?: Entry[];
    name?: string;
    founded?: number;
    members?: string[];
}

export interface Entry {
    fullURL?: string;
    resource?: Resource;
    search?: Search;
}

export interface Resource {
    resourceType?: string;
    id?: string;
    meta?: ResourceMeta;
    text?: Text;
    clinicalStatus?: string;
    verificationStatus?: string;
    code?: Code;
    subject?: Context;
    onsetDateTime?: Date;
    context?: Context;
    abatementDateTime?: Date;
    assertedDate?: Date;
}

export interface Code {
    coding?: Coding[];
    text?: string;
}

export interface Coding {
    system?: string;
    code?: string;
    display?: string;
}

export interface Context {
    reference?: string;
}

export interface ResourceMeta {
    versionID?: string;
    lastUpdated?: Date;
    tag?: Tag[];
    profile?: string[];
}

export interface Tag {
    system?: string;
    code?: string;
}

export interface Text {
    status?: string;
    div?: string;
}

export interface Search {
    mode?: string;
}

export interface Link {
    relation?: string;
    url?: string;
}

export interface ConditionResponseMeta {
    lastUpdated?: Date;
}

export interface Album {
    name?: string;
    artist?: Artist;
    tracks?: Track[];
}

export interface Artist {
    name?: string;
    founded?: number;
    members?: string[];
}

export interface Track {
    name?: string;
    duration?: number;
}
