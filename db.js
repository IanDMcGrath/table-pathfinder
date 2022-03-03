
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

  return all table/column bridges

  construct SQL statement

  present to user
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
    this.match = {};
  }

  getPath() {
    try {
      return `${this.parent.getPath()}.[${this.name}]`
    } catch {
      console.log('getPath() failed, either no name or no parent');
    }
  }

  addColumn(name, dataType, match='') {
    this.columns[name] = new Column(name, this, dataType, match);
  }

  getColumns() {
    return Object.values(this.columns).map(col => col.getColumn());
  }

  addJoin(table2, col1, col2) { // table1.addMatch(table 2, column 1, column 2) // FROM t1 JOIN t2 ON col1 = col2
    this.match[table2.name] = {table: table2, column: col2};
    table2.match[this.name] = {table: this, column: col1};
  }
}

class Column {
  // parent table : { col1: {name: '', parent: Table, dataType: '' } }
  constructor(name, parentTable, dataType, joinId='') {
    this.name = name;
    this.parent = parentTable;
    this.dataType = dataType;
    this.joinId = joinId; // the grouping (string) that tables' columns will use to be matched
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

    const pathfind = (goal, root, found) => {
      const stack = [goal];

      let u = found[goal];
      while(u != root) {
        stack.push(u);
        u = found[u];
      }
      stack.push(root);
      let shortPath = stack.reverse().join(' <-> ');
      let longPath = stack.reverse();
      let lines = ['FROM ' + longPath[0]];
      longPath = lines.concat(longPath.map((n, i) => {
        if (i+1 < longPath.length) {
          let t1 = this.tablesData[n];
          let t2 = this.tablesData[longPath[i+1]];
          // console.log(`t1 name = ${t1.name}`);
          // console.log(`t1 name = ${t2.name}`);
          // console.log(t1.match[t2.name].table.name);
          // console.log(t2.match[t1.name].table.name);
          let c1 = t2.match[t1.name].column;
          let c2 = t1.match[t2.name].column;
          return 'JOIN ' + t2.getPath() + ' ON ' + c1.getPath() + ' = ' + c2.getPath();
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

// class Graph {
//   constructor() {
//     this.tables = {};
//     this.joinKeys = {};
//     this.numJoins = 0;
//   }

//   addVertex(table) {
//     this.tables[table.name] = table;
//     this.joins[table.name] = {};
//   }

//   addEdge(col1, col2) {
//     this.joins[col1.name] = col2;
//     this.joins[col2].push(col1);
//     this.numJoins++;
//   }

//   bfs(goal, root = this.tables[0]) {
//     let join = this.joins;

//     const queue = [];
//     queue.push(root);

//     const bFound = [];
//     bFound[root] = true;

//     const numJoins = [];
//     numJoins[root] = 0;

//     const found = [];
//     found[root] = null;

//     const buildPath = (goal, root, found) => {
//       const stack = [];
//       stack.push(goal);

//       let u = found[goal];

//       while(u != root) {
//         stack.push(u);
//         u = found[u];
//       }

//       stack.push(root);

//       let path = stack.reverse().join('-');

//       return path;
//     }


//     while(queue.length) {
//       let v = queue.shift();

//       if (v === goal) {
//         return {
//           distance: numJoins[goal],
//           path: buildPath(goal, root, found)
//         };
//       }

//       for (let i = 0; i < join[v].length; i++) {
//         if (!bFound[join[v][i]]) {
//           bFound[join[v][i]] = true;
//           queue.push(join[v][i]);
//           numJoins[join[v][i]] = numJoins[v] + 1;
//           found[join[v][i]] = v;
//         }
//       }
//     }

//     return false;
//   }

// }

module.exports.Database = Database;
module.exports.Table = Table;
module.exports.Column = Column;
module.exports.Graph = Graph;