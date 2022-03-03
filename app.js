const db = require("./db.js");
const { Database, Table, Column, Graph } = db;
// import { Database, Table, Column } from "./db";


const db1 = new Database('db1');
const t1 = new Table('personnel');
const t2 = new Table('stations');
const t3 = new Table('stationworkers');
const t4 = new Table('2345');
const t5 = new Table('987');

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

// db1.addTable();

// console.log(db1.getTablesColumns());
// t3.columns.personnelId.getPath();



const g = new Graph();

// g.addVertex("A"); // table
// g.addVertex("B");
// g.addVertex("C");
// g.addVertex("D");
// g.addVertex("E");
// g.addVertex("F");
// g.addVertex("G");

Object.values(db1.tables).forEach(t => {
  g.addTable(t.name);
});

t1.addJoin(t3, t1.columns.id, t3.columns.personnelId);
t2.addJoin(t3, t2.columns.id, t3.columns.stationId);
t4.addJoin(t5, t4.columns.foo, t5.columns.foobar);
t5.addJoin(t2, t5.columns.stationId, t2.columns.id);
t4.addJoin(t1, t4.columns.directToYou, t1.columns.address);

g.addJoin(t1.name, t3.name);
g.addJoin(t2.name, t3.name);
g.addJoin(t5.name, t4.name);
g.addJoin(t2.name, t5.name);
g.addJoin(t1.name, t4.name);

g.tablesData = db1.tables;

let r = g.bfs("2345","stations");
if (r) {
  console.log(r.path[0]);
  console.log(r.path[1]);
} else {
  console.log("found none");
}

// g.addEdge("A","B"); // keys
// g.addEdge("A","C");
// g.addEdge("A","D");
// g.addEdge("B","C");
// g.addEdge("B","D");
// g.addEdge("C","D");
// g.addEdge("C","E");
// g.addEdge("D","F");
// g.addEdge("F","G");

// console.log(g.bfs("G", "A"));