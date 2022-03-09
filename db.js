
const util = require("./util.js");
const { abbreviateName, dupNameIncrement, makeAlias } = util;

/*
pseudo code:
normal use -
  user select pathstart column -
    select table name from dropdown, then select column name from available columns
    or select column name from all tables, then select table that has this column

  user select pathend column
    ""

  scan for table containing the pathend column
    BFS - grab all legs and put into the queue - recursive, pass queue to arguments
    should be able to jump to a previously walked table, but not table/column combo

  path through all tables with known joins and return shortest path

  construct SQL statement

  present to user
*/

/*
todo:
JOIN t ON '' = '' AND '' = '' statements
  change  the this.match[table.name] to return array

add table aliases to SQL return
*/

class Database {
  // use database like a folder directory
  // a Database might have a parent database
  /*
  parent Database (or null) : {
    database1: {
      databases: {
        databaseChild1: Database
      }, tables: {
        table1: Table
      }
    }
  }
  */
  constructor(name) {
    this.name = name;
    this.tables = {};
  }

  getPath() {
    const { parent, name } = this;
    let path = '';
    if (parent) {
      path = `${parent.getPath()}.[${name}]`;
    } {
      path = `[${name}]`;
    }
    return path;
  }

  setParent(db) {
    this.parent = db;
  }

  addTable(table) {
    this.tables[table.name] = table;
    table.parent = this;
  }

  getTables() {
    let result = {};
    Object.values(this.tables).forEach(t => {
      let columns = Object.keys(t.getColumns());
      result[t.name] = columns;
    });
    return result;
  }

  getTablesColumns() {
    let result = {};
    Object.values(this.tables).forEach(t => {
      let columns = t.getColumns();
      result[t.name] = columns;
    });
    return result;
  }
}

class Table {
  // parent db : { table1: {name: '', parent: Database, columns: { col1: Column, ... } } }
  constructor(name) {
    this.name = name;
    this.columns = {};
    this.joins = {};
  }

  getPath() {
    try {
      return `${this.parent.getPath()}.[${this.name}]`
    } catch {
      console.log('getPath() failed, either no name or no parent');
    }
  }

  addColumn(name, dataType) {
    this.columns[name] = new Column(name, this, dataType);
  }

  getColumns() {
    return Object.values(this.columns).map(col => col.getColumn());
  }

  addJoin(table2, col1, col2) { // table1.addMatch(table 2, column 1, column 2) // FROM t1 JOIN t2 ON col1 = col2
    if (this.joins[table2.name]) {
      this.joins[table2.name].columns.push(col2);
    } else {
      this.joins[table2.name] = {table: table2, columns: [col2]};
    }
    if (table2.joins[this.name]) {
      table2.joins[this.name].columns.push(col1);
    } else {
      table2.joins[this.name] = {table: this, columns: [col1]};
    }
    if (col1.dataType !== col2.dataType) {
      console.log(`WARNING!: Tables joined but dataTypes don't match: ${col1.getPath()} ${col1.dataType} and ${col2.getPath()} ${col2.dataType}`);
    }
  }
}

class Column {
  // parent table : { col1: {name: '', parent: Table, dataType: '' } }
  constructor(name, parentTable, dataType) {
    this.name = name;
    this.parent = parentTable;
    this.dataType = dataType;
  }

  getPath() {
    try {
      return `${this.parent.getPath()}.[${this.name}]`
    } catch {
      console.log('getPath() failed, either no name or no parent');
    }
  }

  getColumn() {
    return {[this.name]: this.dataType};
  }
}

class Graph { // ORIG
  constructor() {
    this.tables = [];
    this.joins = {};
    this.numJoins = 0;
    this.tablesData = {};
  }

  addTable(v) {
    this.tables.push(v);
    this.joins[v] = [];
  }

  addJoin(v, w) {
    this.joins[v].push(w);
    this.joins[w].push(v);
    this.numJoins++;
  }

  bfs(goal, root = this.tables[0]) {
    let join = this.joins;
    const queue = [root];
    const joins = [];
    const found = [];
    joins[root] = 0;
    const namesInc = {};
    const namesAlias = {};

    const pathfind = (goal, root, found) => {
      const stack = [goal];

      let u = found[goal];
      while(u != root) {
        stack.push(u);
        u = found[u];
      }
      stack.push(root);
      let shortPath = stack.join(' <-> ');
      let longPath = stack;
      let alias = makeAlias(namesInc, this.tablesData[longPath[0]].name, namesAlias);
      let lines = [`FROM ${this.tablesData[longPath[0]].getPath()} [${alias}]`];
      longPath = lines.concat(longPath.map((n, i) => {
        if (i+1 < longPath.length) {
          let t1 = this.tablesData[n];
          let t2 = this.tablesData[longPath[i+1]];
          let alias1 = makeAlias(namesInc, t1.name, namesAlias);
          console.log(namesInc);
          console.log(namesAlias);
          let alias2 = makeAlias(namesInc, t2.name, namesAlias);

          console.log(namesInc);
          console.log(namesAlias);

          console.log(alias1);
          console.log(alias2);
          // console.log(`t1 name = ${t1.name}`);
          // console.log(`t1 name = ${t2.name}`);
          // console.log(t1.joins[t2.name].table.name);
          // console.log(t2.joins[t1.name].table.name);
          let c1 = t2.joins[t1.name].columns[0];
          let c2 = t1.joins[t2.name].columns[0];
          let result = '';
          // result = 'JOIN ' + t2.getPath() + alias1 + ' ON ' + c1.getPath() + ' = ' + c2.getPath();
          result = `JOIN ${t2.getPath()} [${alias2}] ON [${alias1}].[${c1.name}] = [${alias2}].[${c2.name}]`;

          for (let j=1; j < t2.joins[t1.name].columns.length; j++) {
            c1 = t2.joins[t1.name].columns[j];
            c2 = t1.joins[t2.name].columns[j];
            result += `\nAND  [${alias2}].[${c2.name}] = [${alias1}].[${c1.name}]`;
          }

          return result;
        }
      }));
      return [shortPath, longPath.join('\n')];
    }


    while(queue.length) {
      let t = queue.shift();

      if (t === goal) {
        return {
          distance: joins[goal],
          path: pathfind(goal, root, found)
        };
      }

      for (let i = 0; i < join[t].length; i++) {
        if (!found[join[t][i]]) {
          queue.push(join[t][i]);
          joins[join[t][i]] = joins[t] + 1;
          found[join[t][i]] = t;
        }
      }
    }

    return false;
  }
}

module.exports.Database = Database;
module.exports.Table = Table;
module.exports.Column = Column;
module.exports.Graph = Graph;