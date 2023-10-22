const testSet = new Set();

testSet.add({
    product: ['Bingo', 'Wuz'],
    aisle: ['here', '1'],
    price: ['$3.49', '$6.78']
});
testSet.add({
    product: ['Bingo the second', 'Wuz'],
    aisle: ['here', '1'],
    price: ['$3.49', '$6.78']
});

let newObj = [];

for(let key of testSet) {
    newObj.push(key);
}
console.log(newObj);