
const BREAKCHARS = " _-@#$%&"
const UPPERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const abbreviateName = (name) => {
  let newName = '';
  let bChange = true;
  for (let i in name) {
    if (bChange) {
      newName += name[i].toUpperCase();
    } else {
      newName += name[i];
    }
    bChange = BREAKCHARS.includes(name[i]);
  }

  let abr = '';

  for (let i in newName) {
    if (UPPERS.includes(newName[i])) {
      abr += newName[i];
    }
  }

  return abr;
}

const dupNameIncrement = (names, n) => {
  if (names[n]) {
    names[n] += 1;
    n += names[n]; // append number to alias if duplicate name
  } else {
    names[n] = 1;
  }
}

const makeAlias = (countObj, name, aliasesObj) => {
  if (aliasesObj[name]) return aliasesObj[name]; // if there's already an alias, return it

  let alias = abbreviateName(name); // create abbreviation
  dupNameIncrement(countObj, alias); // append number if alias already exists

  aliasesObj[name] = alias; // store name:alias

  return alias;
}

module.exports.abbreviateName = abbreviateName;
module.exports.dupNameIncrement = dupNameIncrement;
module.exports.makeAlias = makeAlias;