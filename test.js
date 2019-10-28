const s = (arr) => {
    let n = [];

    for (let i = arr.length - 1; i >= 0; i--) {
        let tile = arr[i];

        if (arr[i - 1] == tile) {
            n.push(tile * 2);
            i--;
        } else {
            n.push(tile);
        }
    }

    return n;
};

// all length 2 arr possibilities
console.log(s([4, 4]));
console.log(s([2, 2]));
console.log(s([2, 4]));
console.log(s([4, 2]));

// all length 3 arr possibilities
console.log(s([2, 2, 2]));
console.log(s([2, 2, 4]));
console.log(s([2, 4, 2]));
console.log(s([2, 4, 4]));
console.log(s([4, 2, 2]));
console.log(s([4, 2, 4]));
console.log(s([4, 4, 2]));
console.log(s([4, 4, 4]));