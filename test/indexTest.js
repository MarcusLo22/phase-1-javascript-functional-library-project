require ( './helpers.js' );

const chai = require('chai')
const spies = require('chai-spies-next')
chai.use(spies)
const expect = chai.expect

describe('index.js', function () {
  const unmodifiedTestArr = [1, 2, 3, 4]
  const unmodifiedTestObj = {one: 1, two: 2, three: 3, four: 4}


  describe('myEach', function () {
    const alert = chai.spy();
    const testArr = [1, 2, 3, 4]
    const testObj = Object.assign({}, unmodifiedTestObj)
    const spy = chai.spy(x => true)

    it('calls alert with each element passed', function () {
      myEach(testArr, alert)
      expect(alert).to.have.been.called.exactly(testArr.length)
    })

    it('calls alert properly on object values', function () {
      myEach(testObj, spy)
      const objValues = Object.values(testObj)
      objValues.forEach((val) => { expect(spy).to.have.been.called.with(val) })
    })

    it('returns the original collection', function () {
      const result = myEach(testObj, spy)
      expect(testObj === result).to.equal(true)
      expect(objectsEqual(testObj, result)).to.equal(true)
    })
  })

  describe('myMap', function () {
    const testArr = unmodifiedTestArr.slice()
    const testObj = Object.assign({}, unmodifiedTestObj)
    const callback = (x) => (x * 3)



    it('successfully returns a correctly populated array', function () {
      const arrResult = myMap(testArr, callback)
      expect(arraysEqual([3, 6, 9, 12], arrResult)).to.equal(true);
    })

    it('does not modify the original array', function () {
      expect(arraysEqual(testArr, unmodifiedTestArr)).to.equal(true);
    })



    it('successfully returns a correctly populated array from modified object values', function () {
      const objResult = myMap(testObj, callback)
      expect(arraysEqual([3, 6, 9, 12], objResult)).to.equal(true);
    })

    it('does not modify the original object', function () {
      expect(objectsEqual(testObj, unmodifiedTestObj)).to.equal(true)
    })
  })

  describe('myReduce', function () {
    const testArr = unmodifiedTestArr.slice() // arr is [1, 2, 3, 4]
    const testObj = Object.assign({}, unmodifiedTestObj) // obj is {one: 1, two: 2, three: 3, four: 4}
    const callback = (acc, val, collection) => (acc + (val * 3))

    it('returns the correct reduced value when passed an initial value', function () {
      const reduceWithAcc = myReduce(testArr, callback, 10)
      expect(reduceWithAcc).to.equal(40)
    })

    it('returns the correct reduced value when not passed an initial value', function () {
      const reduceSansAcc = myReduce(testArr, callback)
      expect(reduceSansAcc).to.equal(28)
    })

    it('does not modify the original array', function () {
      expect(arraysEqual(unmodifiedTestArr, testArr)).to.equal(true)
    })

    it('returns the correct reduced value from object values', function () {
      const objResult = myReduce(testObj, callback)
      expect(objResult).to.equal(28);
    })

    it('does not modify the original object', function () {
      expect(objectsEqual(testObj, unmodifiedTestObj)).to.equal(true)
    })

  })

  describe('myFind', function() {
    function findCBGenerator(target) {
      return (function(currEl) { return target === currEl })
    }

    const intArr = [-1, 4, 0, 1, 3, 2, 3, 4, 5, 6]
    const strArr = ["maru", "choux", "doge", "coco", "waychillgoldeneye", "trance"]
    const objB = {b: 'b'}
    const objArr = [{a: 'a'}, objB]

    it('returns the value if found', function () {
      expect(myFind(intArr, findCBGenerator(4))).to.equal(4)
      expect(myFind(strArr, findCBGenerator("waychillgoldeneye"))).to.equal("waychillgoldeneye")
      expect(myFind(objArr, findCBGenerator(objB))).to.equal(objB)
    })

    it('does not traverse the whole array if the value is found early', function () {
      const spy = chai.spy(findCBGenerator(0))
      myFind(intArr, spy)
      expect(spy).to.have.been.called.exactly(3)
    })

    it('returns undefined if the value is not present', function () {
      expect(myFind(intArr, findCBGenerator(7))).to.equal(undefined)
      expect(myFind(strArr, findCBGenerator("maxwellisbestmax"))).to.equal(undefined)
      expect(myFind(objArr, findCBGenerator({c: 'c'}))).to.equal(undefined)
    })

  })

  describe('myFilter', function () {
    const testArr = [6, 11, 5, 12, 17, 100, 9, 1, -8]
    const testObj = { two: 2, three: 3, five: 5, seven: 7}

    function excluder(currEl) {
      return (currEl > 10)
    }

    it('correctly filters for values that the callback evaluates as true', function () {
      const greaterThan10 = myFilter(testArr, excluder)
      expect(arraysEqual(greaterThan10, [11, 12, 17, 100])).to.equal(true)
    })

    it('correctly returns an empty array if no matching values are found', function () {
      const greaterThan10 = myFilter(testObj, excluder)
      expect(greaterThan10.length).to.equal(0)
    })
  })

  describe('mySize', function () {
    const testArr = unmodifiedTestArr.slice()
    const testObj = Object.assign({}, unmodifiedTestObj)

    it('correctly returns the size of the collection when an array is passed', function () {
      expect(mySize(testArr)).to.equal(testArr.length)
    })

    it('correctly returns the size of the collection (amount of keys) when an object is passed', function () {
      expect(mySize(testObj)).to.equal(Object.keys(testObj).length)
    })
  })

  describe('myFirst', function () {
    const testArr = unmodifiedTestArr.slice()

    it('returns the first element of the collection', function () {
      expect(myFirst(testArr)).to.equal(1)
    })

    it('returns the first n elements of the collection when the second optional argument (n) is provided', function () {
      expect(arraysEqual(myFirst(testArr, 3), [1, 2, 3])).to.equal(true)
    })
  })

  describe('myLast', function () {
    const testArr = unmodifiedTestArr.slice()

    it('returns the last element of the collection', function () {
      expect(myLast(testArr)).to.equal(4)
    })

    it('returns the last n elements of the collection when the second optional argument (n) is provided', function () {
      expect(arraysEqual(myLast(testArr, 3), [2, 3, 4])).to.equal(true)
    })
  })

  // describe('mySortBy', function () {
  //   const unsortedIntArr = [3, 8, 5, 1, 9, 11, 8]
  //   const unsortedStringArr = ["maru", "choux", "doge", "coconut"]
  //   const unsortedObjArr = [
  //     {name: "dennis", age: 29},
  //     {name: "dee", age: 40},
  //     {name: "mac", age: 34},
  //     {name: "charlie", age: 32},
  //     {name: "frank", age: 72}
  //   ]
  //   const controlSortedObjArr = [
  //     {name: "dennis", age: 29},
  //     {name: "charlie", age: 32},
  //     {name: "mac", age: 34},
  //     {name: "dee", age: 40},
  //     {name: "frank", age: 72}
  //   ]

  //   function sortArrFunction(val) { return val }
  //   function sortIntsBySin(val)   { return Math.sin(val) }
  //   function sortObjFunction(obj) { return obj.age }

  //   it('correctly sorts arrays of integers and arrays of strings', function () {
  //     expect(arraysEqual(mySortBy(unsortedIntArr, sortArrFunction), [1, 3, 5, 8, 8, 9, 11])).to.equal(true)
  //     expect(arraysEqual(mySortBy(unsortedStringArr, sortArrFunction), ["choux", "coconut", "doge", "maru"])).to.equal(true)
  //   })

  //   it('does not modify the original arrays', function () {
  //     mySortBy(unsortedIntArr, sortArrFunction)
  //     mySortBy(unsortedStringArr, sortArrFunction)
  //     expect(arraysEqual(unsortedIntArr, [3, 8, 5, 1, 9, 11, 8])).to.equal(true)
  //     expect(arraysEqual(unsortedStringArr, ["maru", "choux", "doge", "coconut"])).to.equal(true)
  //   })

  //   it('correctly sorts arrays of integers with non-standard sort', function () {
  //     expect(arraysEqual(mySortBy([1, 2, 3, 4, 5, 6], sortIntsBySin), [5, 4, 6, 3, 1, 2])).to.equal(true)
  //   })

  // })

  // describe('myFlatten', function () {

  //   it('correctly flattens a ludicrously nested array', function () {
  //     const nestedArr = [1, [2, 3], [[4, 5], 6, [7, [8, 9]]]]
  //     const flatArr = myFlatten(nestedArr)
  //     expect(arraysEqual(flatArr, [1, 2, 3, 4, 5, 6, 7, 8, 9])).to.equal(true)
  //   })

  //   it('correctly flattens a single level when a second argument of "true" is passed', function () {
  //     const nestedArr = [1, [2, 3], [[4, 5], 6, [7, [8, 9]]]]
  //     const flatArr = myFlatten(nestedArr, true)
  //     expect(arraysEqual(flatArr, [1, 2, 3, [4, 5], 6, [7, [8, 9]]])).to.equal(true)
  //   })

  // })

  describe('myKeys', function () {
    const testObj = Object.assign({}, unmodifiedTestObj)

    it("retrieves all the names of the object's own enumerable properties", function () {
      expect(arraysEqual(myKeys(testObj), Object.keys(unmodifiedTestObj))).to.equal(true)
    })

    it("does not modify the original object", function () {
      expect(objectsEqual(testObj, unmodifiedTestObj)).to.equal(true)
    })

  })

  describe('myValues', function () {
    const testObj = Object.assign({}, unmodifiedTestObj)

    it("retrieves all the values of the object's own properties", function () {
      expect(arraysEqual(myValues(testObj), Object.values(unmodifiedTestObj))).to.equal(true)
    })

    it("does not modify the original object", function () {
      expect(objectsEqual(testObj, unmodifiedTestObj)).to.equal(true)
    })
  })
})

function arraysEqual(arrA, arrB) {
  if (arrA.length !== arrB.length) return false
  for (let idx = 0; idx < arrA.length; idx++) {
    if (Array.isArray(arrA[idx]) && Array.isArray(arrB[idx])) {
      arraysEqual(arrA[idx], arrB[idx])
    } else if (arrA[idx] !== arrB[idx]) {
      return false
    }
  }
  return true
}

function objectsEqual(objA, objB) {
  return (JSON.stringify(objA) === JSON.stringify(objB))
}

// Custom each method
function myEach(collection, callback) {
  if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
          callback(collection[i], i, collection);
      }
  } else {
      for (let key in collection) {
          if (collection.hasOwnProperty(key)) {
              callback(collection[key], key, collection);
          }
      }
  }
  return collection;
}

// Custom map method
function myMap(collection, callback) {
  const result = Array.isArray(collection) ? [] : {};
  myEach(collection, (value, key) => {
      result[key] = callback(value, key, collection);
  });
  return result;
}

// Custom reduce method
function myReduce(collection, callback, initialValue) {
  let accumulator = initialValue !== undefined ? initialValue : collection[0];
  const startIndex = initialValue !== undefined ? 0 : 1;

  for (let i = startIndex; i < collection.length; i++) {
      accumulator = callback(accumulator, collection[i], i, collection);
  }

  return accumulator;
}

// Custom find method
function myFind(collection, predicate) {
  for (let i = 0; i < collection.length; i++) {
      if (predicate(collection[i], i, collection)) {
          return collection[i];
      }
  }
  return undefined;
}

// Custom filter method
function myFilter(collection, predicate) {
  const result = [];
  myEach(collection, (value, key) => {
      if (predicate(value, key, collection)) {
          result.push(value);
      }
  });
  return result;
}

// Custom size method
function mySize(collection) {
  return Array.isArray(collection) ? collection.length : Object.keys(collection).length;
}

// Custom first method
function myFirst(collection, n) {
  if (n === undefined) {
      return collection[0];
  }
  return collection.slice(0, n);
}

// Custom last method
function myLast(collection, n) {
  if (n === undefined) {
      return collection[collection.length - 1];
  }
  return collection.slice(-n);
}

// Custom keys method
function myKeys(object) {
  return Object.keys(object);
}

// Custom values method
function myValues(object) {
  return Object.values(object);
}

// Custom each method
function myEach(collection, callback) {
  if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
          callback(collection[i], i, collection);
      }
  } else {
      for (let key in collection) {
          if (collection.hasOwnProperty(key)) {
              callback(collection[key], key, collection);
          }
      }
  }
  return collection;
}

// Custom map method
function myMap(collection, callback) {
  const result = [];
  myEach(collection, (value, key) => {
      result.push(callback(value, key, collection));
  });
  return result;
}

// Example usage
const obj = { a: 1, b: 2, c: 3 };
const modifiedArray = myMap(obj, (value) => value * 2); // [2, 4, 6]
console.log(modifiedArray); // Output: [2, 4, 6]

// Custom each method
function myEach(collection, callback) {
  if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
          callback(collection[i], i, collection);
      }
  } else {
      for (let key in collection) {
          if (collection.hasOwnProperty(key)) {
              callback(collection[key], key, collection);
          }
      }
  }
  return collection;
}

// Custom reduce method
function myReduce(collection, callback, initialValue) {
  let accumulator = initialValue !== undefined ? initialValue : Array.isArray(collection) ? collection[0] : Object.values(collection)[0];
  const startIndex = initialValue !== undefined ? 0 : Array.isArray(collection) ? 1 : 1;

  if (Array.isArray(collection)) {
      for (let i = startIndex; i < collection.length; i++) {
          accumulator = callback(accumulator, collection[i], i, collection);
      }
  } else {
      const values = Object.values(collection);
      for (let i = startIndex; i < values.length; i++) {
          accumulator = callback(accumulator, values[i], i, values);
      }
  }

  return accumulator;
}

