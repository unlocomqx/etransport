import { exec } from 'child-process-promise';
import * as fs from 'fs';
import { readFileSync } from 'fs';
import * as path from 'path';

export async function seed(spec: string) {
	const file = new URL(`../fixtures/sql/${spec}.sql`, import.meta.url);
	if (!fs.existsSync(file.pathname)) {
		await exportData(file.pathname);
		console.log(fs, readFileSync(file.pathname, 'utf8').toString());
	}

	if (spec !== 'reset') {
		await seed('reset');
	}

	const command = `psql -U postgres -f ${file.pathname} -d etransport_test`;
	return exec(command);
}

async function exportData(pathname: string) {
	const dir = path.dirname(pathname);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	const command = `pg_dump --dbname=etransport_test --schema=public --data-only --file=${pathname} --column-inserts --username=postgres --host=localhost --port=5432`;
	console.log(command);
	return exec(command);
}
