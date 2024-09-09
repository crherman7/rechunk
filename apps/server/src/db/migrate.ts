import Database from 'better-sqlite3';
import {drizzle} from 'drizzle-orm/better-sqlite3';
import {migrate} from 'drizzle-orm/better-sqlite3/migrator';

(async () => {
  const sqlite = new Database('sqlite.db');
  const db = drizzle(sqlite);

  console.log('Starting migrations');

  migrate(db, {migrationsFolder: 'migrations'});

  console.log('Migrations complete.');
})();
