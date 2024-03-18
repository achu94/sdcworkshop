import { Table, Name } from 'proton-tsc';

@table('global', singleton)
export class GuestbookGlobal extends Table {
    constructor(
        // used as primary key for new entries
        // increment for each new entry
        public entryId: u64 = 0,
    ) {
        super();
    }

    public increment(): void {
        this.entryId++;
    }
}

@table('entries')
export class GuestbookEntry extends Table {
    // see https://docs.xprnetwork.org/contract-sdk/storage.html
    // TODO constructor for properties: id (u64), guest (Name), message (string), timestamp (u64)
    constructor(
        public id: u64 = 0,
        public guest: Name = new Name(),
        public message: string = "",
        public timestamp: u64 = 0
    ) {
        super();
    }

    @primary
    get primary(): u64 {
        return this.id;
    }
}
