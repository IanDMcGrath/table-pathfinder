const db = require("./db.js");
const { Database, Table, Column, Graph } = db;
// import { Database, Table, Column } from "./db";

// initialize db and tables
const db1 = new Database('db1');
const t1 = new Table('personnel');
const t2 = new Table('stations');
const t3 = new Table('stationWorkers');
const t4 = new Table('thatsANewTable');
const t5 = new Table('thatsAlsoNewTable');

// define table rows
db1.addTable(t1);
t1.addColumn('id', 'int');
t1.addColumn('name', 'string');
t1.addColumn('email', 'string');
t1.addColumn('address', 'string');
t1.addColumn('phone', 'string');

db1.addTable(t2);
t2.addColumn('id', 'int');
t2.addColumn('name', 'string');
t2.addColumn('address', 'string');

db1.addTable(t3);
t3.addColumn('id', 'int');
t3.addColumn('personnelId', 'int');
t3.addColumn('stationId', 'int');

db1.addTable(t4);
t4.addColumn('id', 'int');
t4.addColumn('bogus', 'customDataType');
t4.addColumn('foo', 'customDataType');
t4.addColumn('fizz', 'customDataType');
t4.addColumn('buzz', 'customDataType');
t4.addColumn('directToYou', 'varChar(10)');

db1.addTable(t5);
t5.addColumn('id', 'int');
t5.addColumn('foobar', 'varchar(3200)');
t5.addColumn('stationId', 'int');
t5.addColumn('xyz', 'varchar(5)');
t5.addColumn('abc', 'varchar(60)');

// create table relations
t1.addJoin(t3, t1.columns.id, t3.columns.personnelId);
t2.addJoin(t3, t2.columns.id, t3.columns.stationId);
t4.addJoin(t5, t4.columns.foo, t5.columns.foobar);
t4.addJoin(t5, t4.columns.fizz, t5.columns.xyz);
t5.addJoin(t2, t5.columns.stationId, t2.columns.id);
t4.addJoin(t1, t4.columns.directToYou, t1.columns.address);


// initialize Graph and pass in tables as nodes
const g = new Graph();
Object.values(db1.tables).forEach(t => {
  g.addTable(t.name);
});

// add connections to Graph
// g.addJoin(t1.name, t3.name);
// g.addJoin(t2.name, t3.name);
// g.addJoin(t5.name, t4.name);
// g.addJoin(t2.name, t5.name);
// g.addJoin(t1.name, t4.name);

Object.values(db1.tables).forEach(table1 => {
  Object.values(table1.joins).forEach(join => {
    g.addJoin(table1.name, join.table.name);
  });
});

// pass tables to Graph
g.tablesData = db1.tables;

let r = g.bfs("thatsANewTable","stations");
if (r) {
  console.log(r.path[0]);
  console.log(r.path[1]);
} else {
  console.log("found none");
}