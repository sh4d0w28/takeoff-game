import { LibSQLDatabase, drizzle } from 'drizzle-orm/libsql';
import { Client, createClient } from '@libsql/client';
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { eq, desc } from 'drizzle-orm';

export default class PersistentStorage {

    private _client:Client;
    private _db:LibSQLDatabase;

    private _scores = sqliteTable('scores', {
        userid: text('userid'),
        score: integer('score')
    });

    constructor() {
        this._client = createClient({ url: 'file:edushm.com.db' });
        this._db = drizzle(this._client);
    }

    async listHighScores() {
        var res = await this._db.select().from(this._scores).orderBy(desc(this._scores.score));
        return res;
    }

    async updateScore(userid: string, score: number) {
        var res = await this._db.select().from(this._scores).where(eq(this._scores.userid, userid));
        // if there is no entrance yet
        if (res.length == 0) {
            this._db.insert(this._scores).values({userid: userid, score: score}).run();
        } else {
            var currentScor = res.at(0)?.score || 0;
            if(currentScor < score) {
                this._db.update(this._scores).set({score: score}).where(eq(this._scores.userid, userid)).run();
            }
        }
    }
} 
