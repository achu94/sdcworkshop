import { Contract, Name, Singleton, TableStore, requireAuth, currentTimeSec, isAccount, print } from 'proton-tsc';
import { GuestbookGlobal, GuestbookEntry } from './guestbook-storage.tables';

@contract
class GuestbookStorage extends Contract {
    // only admin can delete entries
    admin: Name = Name.fromString('admin');

    // tables
    globalSingleton: Singleton<GuestbookGlobal> = new Singleton<GuestbookGlobal>(this.receiver);
    entries: TableStore<GuestbookEntry> = new TableStore<GuestbookEntry>(this.receiver);

    /**
     * Adds a new entry to the guestbook
     * @param {Name} guest - account that provides a message
     * @param {string} message - the message
     */
    @action('add')
    addEntry(guest: Name, message: string): void {
        // TODOs
        // 1. require authorization of guest account, see https://docs.xprnetwork.org/contract-sdk/api/authentication.html#requireauth
        requireAuth(guest);
        // see https://docs.xprnetwork.org/contract-sdk/storage.html#overview
        // 2. get row from "GuestbookGlobal" singleton
        const row = this.globalSingleton.get();

        // 3. increase global entryId to determine entryId
        row.increment();

        // 4. update GuestbookGlobal row
        this.globalSingleton.set(row, guest);

        // 5. create GuestbookEntry with current timestamp
        const currentTimestamp = currentTimeSec();
        const newEntry = new GuestbookEntry(row.entryId, guest, message, currentTimestamp);

        // 6. store a new entry (payed by the guest)
        if (this.entries.exists(newEntry.id)) {
            this.entries.update(newEntry, guest);
        }
        else {
            this.entries.store(newEntry, guest);
        }
    }

    /**
     * Deletes an entry from the guestbook
     * @param {u64} id - id of the message to delete
     */
    @action('delete')
    deleteEntry(id: u64): void {
        // TODO
        // 1. require authorization of admin account, see https://docs.xprnetwork.org/contract-sdk/api/authentication.html#requireauth
        requireAuth(Name.fromString('admin'));
        // see https://docs.xprnetwork.org/contract-sdk/storage.html#overview

        // 2. get entry from table
        const row = new GuestbookEntry(id, this.receiver);

        // 3. remove entry from table
        if (row) {
            this.entries.remove(row);
        }
    }
}
