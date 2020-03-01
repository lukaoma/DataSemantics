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
import {GetNames} from "./Names";
import axios, {AxiosRequestConfig} from 'axios';
import {Observable, Observer} from "rxjs";
import {take} from "rxjs/operators";

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

export function createData(name: string, last: string, ...stuff): Data {
    return {note: "", name, last, prediction: "46.2%"};
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
        // createData('Felecia', 'Wolf', 1403500365, 9596961),
        // createData('Maryln', 'Wisozk', 60483973, 301340),
        // createData('Jules', 'Wuckert', 327167434, 9833520),
        // createData('Mechelle', 'Trantow', 37602103, 9984670),
    ]);

    // add names thanks :)

    useEffect(() => {
        GetNames().pipe(take(6)).subscribe({
            next: data => setRows(old => {
                return [...old, data]
            }),
            complete: () => addPrediction().subscribe({
                next: data => makePredict(data)
            }),
        });
    }, []);

    const notesGET: AxiosRequestConfig = {
        method: 'GET',
        url: document.location + "send",
        headers: {
            'fileName': "notes.json"
        },
    };

    function addPrediction(): Observable<string> {
        return new Observable((observe: Observer<string>) => {
            axios(notesGET).then((resp) => {
                const data: HealthData = resp.data;
                //update table
                for (let eachPerson of data.entry) {
                    const note = eachPerson.resource.content[0].attachment.data;
                    observe.next(note)
                }
            });
        });
    }

    function makePredict(notes: string) {
        getPrediction(notes).subscribe({
            next: data => setRows(old => {
                console.log("data", data);
                let precent = (parseFloat(data) * 100).toFixed(1) + "%";
                for (let data of old) {
                    if (data.note === "") {
                        data.note = notes;
                        data.prediction = precent;
                        break;
                    }
                }
                return [...old]
            })
        })
    }

    const getPrediction = (note: string): Observable<string> => {
        const predictionPost: AxiosRequestConfig = {
            method: 'POST',
            url: document.location + "predict",
            data: {note}
        };
        const predit = new Observable((observe: Observer<string>) => {
            axios(predictionPost).then(res => {
                console.log(res.data);
                observe.next(res.data)
            });
        });
        return predit
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
