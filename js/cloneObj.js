

    // const cloneObj1 = (objToClone) => {
    //     let clonedObj;
    //     let key;
    //     let val;

    //     if(typeof objToClone !== 'function' && typeof objToClone !== 'object') {
    //         return objToClone;
    //     }
    //     if(typeof objToClone === 'function') return objToClone()
    
    //     if(Array.isArray(objToClone)) {
    //         console.log(`objToClone is Array...: `, objToClone);
    //         clonedObj = [];
    //         // parentObject = []
    //         objToClone.forEach(element => {
    //             console.log('array element to push...:', element);
    //             clonedObj.push(cloneObj(element))
    //         });
    //     }

    //     if(typeof objToClone === 'object') {
    //         console.log(`objToClone is object...: `, objToClone);
    //         // if (!parentObject) parentObject = {};
    //         clonedObj = {};
    //         for (key in objToClone) {
    //             val = objToClone[key]
    //             console.log(val)
    //             clonedObj[key] = cloneObj(val);
                
    //         }
    //     }

    //     return clonedObj
    // } 
    
// https://gist.github.com/djD-REK/e8b1497e7fbf0374e4eada669e5609cf
function cloneObj(objToClone) {
    let clonedObj;
    let key;
    let val;

    if(typeof objToClone !== 'function' && typeof objToClone !== 'object') return objToClone;
    if(typeof objToClone === 'function') return objToClone();

    clonedObj = Array.isArray(objToClone) ? [] : {};

    for (key in objToClone) {
        val = objToClone[key];
        clonedObj[key] = cloneObj(val);
    } 

    return clonedObj

}

export { cloneObj }


// function testFunction(){
//     return 'testSuccess?'
// }

// const testArr = [
//     5,
//     'seven',
//     [
//         5,
//         {
//             one: 1,
//             two: [
//                 1,
//                 2,
//             ],
//         },
//         [
//             {
//                 three: 3,
//                 four: {
//                     five: [
//                         testFunction,
//                         7,
//                     ]
//                 }
//             }
//         ]
//     ]
// ]

// const letsClone = cloner()

// const clonedObj2 = letsClone.cloneObj(testArr)

// console.log(JSON.stringify(clonedObj2))
// console.log(JSON.stringify(testArr))