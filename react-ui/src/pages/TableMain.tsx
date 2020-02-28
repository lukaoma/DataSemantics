import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import * as FHIR from "fhirclient";

// import {GetNames} from "./Names";

interface Column {
    id: 'name' | 'last' | 'prediction';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    {id: 'name', label: 'First Name', minWidth: 170},
    {id: 'last', label: 'Last Name', minWidth: 100},
    {
        id: 'prediction',
        label: 'Readmission',
        minWidth: 170,
        align: 'right',
        format: (value: number) => value.toLocaleString(),
    },
];

export interface Data {
    name: string;
    last: string;
    note: string;
    prediction: string
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

export function createData(name: string, last: string, ...stuff): Data {
    return {note: "", name, last, prediction: "-1%"};
}

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

export default function StickyHeadTable() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [rows, setRows] = useState([
        createData('Joshua', 'Williams', 1324171354, 3287263),
        createData('Felecia', 'Wolf', 1403500365, 9596961),
        createData('Maryln', 'Wisozk', 60483973, 301340),
        createData('Jules', 'Wuckert', 327167434, 9833520),
        createData('Mechelle', 'Trantow', 37602103, 9984670),
    ]);

    // add names thanks :)

    const rowser =
        new Promise(function (resolve, reject) {
            resolve()
        });


    useEffect(() => {
        const link = document.location + "send";
        // const link = "http://localhost:5000/send";
        const fileName = "notes.json";
        console.log("OUR BEST", link, fileName);
        rowser.then(r => {
                // console.log((r as []).length)
                fetch(link, {
                    headers: {
                        'fileName': fileName
                    }
                }).then(r => {
                    return r.json()
                }).then((resp) => {
                        if (resp != null) {
                            const data: HealthData = resp;
                            //update table
                            let allnotes: string[] = [];
                            for (let eachPerson of data.entry) {
                                allnotes.push(eachPerson.resource.content[0].attachment.data)
                            }
                            const sad = new Promise(function (resolve, reject) {
                                setRows(old => {
                                    const here = old;
                                    let notes = 0;
                                    for (let index of here) {
                                        index.note = allnotes[notes];
                                        notes++;
                                        const kk = getPrediciton(allnotes[notes]).then(rf => {
                                            index.prediction = parseFloat(rf).toLocaleString("en", {style: "percent"});
                                            setRows(old => {
                                                return [...here]
                                            })
                                        });
                                    }
                                    return [...here]
                                });
                                resolve()
                            });
                            sad.then(k => {
                                console.log("DFGDFGDFGDF")
                            })


                        }
                    }
                );
            }
        )
    }, []);


    function GetNames(): Data[] {
        let allRows: Data[] = [];
        const client = FHIR.client("https://r3.smarthealthit.org");
        client.request("/Patient", {pageLimit: 1}).then((r: any) => {
            const apiResponse: Response = r;
            //update table
            if (apiResponse.entry === undefined) {
                const lotsApi: Response[] = r;
                for (let eachResponse of lotsApi) {
                    allRows.push(...buildNewRows(eachResponse.entry));
                    setRows(old => {
                        console.log("" + allRows + "");
                        return [...allRows]
                    })
                }
            } else {
                allRows.push(...buildNewRows(apiResponse.entry))
            }
        });
        return allRows
    }


    function buildNewRows(listRows: Entry[]): Data[] {
        const newRows: Data[] = [];
        for (let person of listRows) {
            const firstName = person.resource.name[0].given[0];
            const lastName = person.resource.name[0].family;
            newRows.push(createData(firstName, lastName))
        }
        return newRows;
    }

    const getPrediciton = (note: string) => {
        let predictions = "-sync error early return";
        const link = document.location + "predict";
        return fetch(link, {
            method: 'POST',
            headers: {
                'info': note
            },
            body: note
        }).then(r => r.text()).then(prediction => {
            predictions = prediction;
            console.log("PREDICT", prediction);
            return prediction
        });
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{minWidth: column.minWidth}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={Math.random()}>
                                    {columns.map(column => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export interface HealthData {
    resourceType?: string;
    id?: string;
    type?: string;
    timestamp?: Date;
    entry?: Entry[];
}

export interface Entry {
    resource?: Resource;
}

export interface Resource {
    resourceType?: string;
    id?: string;
    status?: string;
    type?: Type;
    category?: Category[];
    content?: Content[];
    subject?: Subject;
    context?: Context;
    author?: Subject[];
}

export interface Subject {
    reference?: string;
}

export interface Category {
    coding?: CategoryCoding[];
}

export interface CategoryCoding {
    system?: string;
    code?: string;
}

export interface Content {
    attachment?: Attachment;
}

export interface Attachment {
    contentType?: string;
    data?: string;
}

export interface Context {
    encounter?: Subject[];
}

export interface Type {
    coding?: TypeCoding[];
}

export interface TypeCoding {
    system?: string;
    code?: string;
    display?: string;
}


export interface Response {
    resourceType?: string;
    id?: string;
    meta?: WelcomeMeta;
    type?: string;
    total?: number;
    link?: Link[];
    entry?: Entry[];
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
    identifier?: Identifier[];
    active?: boolean;
    name?: Name[];
    telecom?: Identifier[];
    gender?: string;
    birthDate?: Date;
    address?: Address[];
    generalPractitioner?: GeneralPractitioner[];
    extension?: ResourceExtension[];
    maritalStatus?: MaritalStatus;
    multipleBirthBoolean?: boolean;
    communication?: Communication[];
}

export interface Address {
    use?: string;
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    extension?: AddressExtension[];
}

export interface AddressExtension {
    url?: string;
    extension?: ExtensionExtension[];
}

export interface ExtensionExtension {
    url?: string;
    valueDecimal?: number;
}

export interface Communication {
    language?: Language;
}

export interface Language {
    coding?: LanguageCoding[];
}

export interface LanguageCoding {
    system?: string;
    code?: string;
    display?: string;
}

export interface ResourceExtension {
    url?: string;
    valueCodeableConcept?: ValueCodeableConcept;
    valueAddress?: ValueAddress;
    valueString?: string;
    valueCode?: string;
    valueBoolean?: boolean;
    valueHumanName?: ValueHumanName;
}

export interface ValueAddress {
    city?: string;
    state?: string;
    country?: string;
}

export interface ValueCodeableConcept {
    coding?: LanguageCoding[];
    text?: string;
}

export interface ValueHumanName {
    text?: string;
}

export interface GeneralPractitioner {
    reference?: string;
}

export interface Identifier {
    use?: string;
    type?: ValueCodeableConcept;
    system?: string;
    value?: string;
}

export interface MaritalStatus {
    coding?: TagElement[];
    text?: string;
}

export interface TagElement {
    system?: string;
    code?: string;
}

export interface ResourceMeta {
    versionID?: string;
    lastUpdated?: Date;
    tag?: TagElement[];
    profile?: string[];
}

export interface Name {
    use?: string;
    family?: string;
    given?: string[];
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

export interface WelcomeMeta {
    lastUpdated?: Date;
}


