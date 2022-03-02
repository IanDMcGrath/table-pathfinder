import { Database, Table, Column } from "./db";

const db1 = new Database('db1');
const t1 = new Table('personnel');
const t2 = new Table('stations');
const t3 = new Table('stationworkers');

db1.addTable(t1);
db1.addTable(t2);
db1.addTable(t3);

t1.addColumn('id', 'int');
t1.addColumn('name', 'string');
t1.addColumn('email', 'string');
t1.addColumn('address', 'string');
t1.addColumn('phone', 'string');

t2.addColumn('id', 'int');
t2.addColumn('name', 'string');
t2.addColumn('address', 'string');

t3.addColumn('id', 'int');
t3.addColumn('personnelId', 'int');
t3.addColumn('stationId', 'int');

console.log(db1.getTables());