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

interface Column {
    id: 'name' | 'last' | 'population' | 'size' | 'density';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    {id: 'name', label: 'First Name', minWidth: 170},
    {id: 'last', label: 'Last Name', minWidth: 100},
    {
        id: 'population',
        label: 'Population',
        minWidth: 170,
        align: 'right',
        format: (value: number) => value.toLocaleString(),
    },
    {
        id: 'size',
        label: 'Size\u00a0(km\u00b2)',
        minWidth: 170,
        align: 'right',
        format: (value: number) => value.toLocaleString(),
    },
    {
        id: 'density',
        label: 'Density',
        minWidth: 170,
        align: 'right',
        format: (value: number) => value.toFixed(2),
    },
];

interface Data {
    name: string;
    last: string;
    population: number;
    size: number;
    density: number;
}

function createData(name: string, last: string, population: number, size: number): Data {
    const density = population / size;
    return {name, last, population, size, density};
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
        createData('India', 'IN', 1324171354, 3287263),
        createData('China', 'CN', 1403500365, 9596961),
        createData('Italy', 'IT', 60483973, 301340),
        createData('United States', 'US', 327167434, 9833520),
        createData('Canada', 'CA', 37602103, 9984670),
        createData('Australia', 'AU', 25475400, 7692024),
        createData('Germany', 'DE', 83019200, 357578),
        createData('Ireland', 'IE', 4857000, 70273),
        createData('Mexico', 'MX', 126577691, 1972550),
        createData('Japan', 'JP', 126317000, 377973),
        createData('France', 'FR', 67022000, 640679),
        createData('United Kingdom', 'GB', 67545757, 242495),
        createData('Russia', 'RU', 146793744, 17098246),
        createData('Nigeria', 'NG', 200962417, 923768),
        createData('Brazil', 'BR', 210147125, 8515767),
    ]);

    const client = FHIR.client("https://r3.smarthealthit.org");
    useEffect(() => {
        client.request("/Patient", {pageLimit: 1}).then((r: any) => {
            const real = JSON.stringify(r);
            const apiResponse: Response = r;
            console.log(apiResponse);
            //update table
            const newRows: Data[] = [];
            for (let person of apiResponse.entry) {
                const firstName = person.resource.name[0].given[0];
                const lastName = person.resource.name[0].family;
                newRows.push(createData(firstName, lastName, -1, -1))
            }
            setRows((old) => {
                return [...newRows]
            });
            //document.getElementById("chill").innerText = real;
        });
    }, []);

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
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.last}>
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

export interface Response {
    resourceType?: string;
    id?: string;
    meta?: ResponseMeta;
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
}

export interface Address {
    use?: string;
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}

export interface GeneralPractitioner {
    reference?: string;
}

export interface Identifier {
    use?: string;
    type?: Type;
    system?: string;
    value?: string;
}

export interface Type {
    coding?: Coding[];
    text?: string;
}

export interface Coding {
    system?: string;
    code?: string;
    display?: string;
}

export interface ResourceMeta {
    versionID?: string;
    lastUpdated?: Date;
    tag?: Tag[];
}

export interface Tag {
    system?: string;
    code?: string;
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

export interface ResponseMeta {
    lastUpdated?: Date;
}

