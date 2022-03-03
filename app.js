const db = require("./db.js");
const { Database, Table, Column, Graph } = db;
// import { Database, Table, Column } from "./db";


const db1 = new Database('db1');
const t1 = new Table('personnel');
const t2 = new Table('stations');
const t3 = new Table('stationworkers');

const match1 = 'personnelToStationWorkers'
const match2 = 'stationsToStationWorkers'

db1.addTable(t1);
t1.addColumn('id', 'int', match1);
t1.addColumn('name', 'string');
t1.addColumn('email', 'string');
t1.addColumn('address', 'string');
t1.addColumn('phone', 'string');

db1.addTable(t2);
t2.addColumn('id', 'int', match2);
t2.addColumn('name', 'string');
t2.addColumn('address', 'string');

db1.addTable(t3);
t3.addColumn('id', 'int');
t3.addColumn('personnelId', 'int', match1);
t3.addColumn('stationId', 'int', match2);

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

g.addJoin(t1.name, t3.name);
g.addJoin(t2.name, t3.name);

g.tablesData = db1.tables;

let r = g.bfs("personnel", "stations");
console.log(r.path[1]);

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