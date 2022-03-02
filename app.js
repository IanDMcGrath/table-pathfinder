
/*
psudo code:
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

const TABLES = {
  T1: {
  1: {name: '1'},
    col2: 'L2',
    col3: 'L3'
  },
  T2: {
    col1: 'L2',
    col2: 'L4'
  },
  T3: {
    col1: 'L3',
    col
  }
};

class Database {
  // use database like a folder directory
  constructor(name) {

  }
}

class Table {
  constructor(name) {
    this.name = name;
    this.columns = {};
  }

  addColumn(column) {
    //
    this.columns[column.name] = column;
    this.columns[column.link] = column;
  }
}