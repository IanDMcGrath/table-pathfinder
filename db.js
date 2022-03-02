
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

export class Database {
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
  }

  getTables() {
    return this.tables;
  }
}

export class Table {
  // parent db : { table1: {name: '', parent: Database, columns: { col1: Column, ... } } }
  constructor(name) {
    this.name = name;
    this.columns = {};
  }

  getPath() {
    try {
      return `${this.parent.getPath()}.[${this.name}]`
    } catch {
      console.log('getPath() failed, either no name or no parent');
    }
  }

  addColumn(column) {
    //
    this.columns[column.name] = column;
  }

  getColumns() {
    return this.columns;
  }
}

export class Column {
  // parent table : { col1: {name: '', parent: Table, dataType: '' } }
  constructor(name) {
    this.name = name;
  }

  getPath() {
    try {
      return `${this.parent.getPath()}.[${this.name}]`
    } catch {
      console.log('getPath() failed, either no name or no parent');
    }
  }
}

