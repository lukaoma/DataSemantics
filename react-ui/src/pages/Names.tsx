import * as FHIR from "fhirclient";
import {createData, Data} from "./TableMain";
import {Observable, Observer} from "rxjs";

export function GetPacients(): Observable<Entry> {
    const nameData = new Observable((serve: Observer<Entry>) => {
        const client = FHIR.client("https://r3.smarthealthit.org");
        client.request("/Patient", {pageLimit: 1}).then((r: any) => {
            const apiResponse: Response = r;
            //update table
            if (apiResponse.entry === undefined) {
                const lotsApi: Response[] = r;
                for (let eachResponse of lotsApi) {
                    getPeople(eachResponse.entry, serve)
                }
            } else {
                getPeople(apiResponse.entry, serve)
            }
        }).then(r => {
            serve.complete()
        });
    });
    return nameData
}


function getPeople(listpeople: Entry[], serve: any) {
    for (let person of listpeople) {
        serve.next(person);
    }
}

export function GetNames(): Observable<Data> {
    const nameData = new Observable((serve: Observer<Data>) => {
        const client = FHIR.client("https://r3.smarthealthit.org");
        client.request("/Patient", {pageLimit: 1}).then((r: any) => {
            const apiResponse: Response = r;
            //update table
            if (apiResponse.entry === undefined) {
                const lotsApi: Response[] = r;
                for (let eachResponse of lotsApi) {
                    buildNewRows(eachResponse.entry, serve)
                }
            } else {
                buildNewRows(apiResponse.entry, serve)
            }
        }).then(r => {
            serve.complete()
        });
    });
    return nameData
}


function buildNewRows(listRows: Entry[], serve: any) {

    for (let person of listRows) {
        if (person.resource.name !== undefined) {
            const firstName = person.resource.name[0].given[0];
            const lastName = person.resource.name[0].family;
            serve.next(createData(firstName, lastName));
        }
    }
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


