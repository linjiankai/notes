//数组合并
var arr1 = [1, 2, 3, 4, 5];
var arr2 = [6, 7, 8, 9, 10];

/* 1.concat */
var newarr1 = arr1.concat(arr2);
console.log(newarr1)//[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//concat会合成一个新的数组，原数组不变，但是当2个数组很长，新的数组很占用很大的内存

/* 2.for */
for (var i = 0, len = arr2.length; i < len; i++) {
    arr1.push(arr2[i])
}
console.log(arr1)//[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//向arr1循环添加的arr2，但是arr2的长度比arr长度大的时候，循环arr性能会更好
//也可以用ES5的forEach方法

/* 3.reduce */
var newarr2 = arr2.reduce(function (coll, item) {
    coll.push(item);
    return coll;
}, arr1);
console.log(newarr2)//[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/* 4.push.apply */
arr1.push.apply(arr1, arr2);
console.log(arr1)//[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//这个方法对数组长度有限制,一般不超过10万


//嵌套数组
//1.使用Array.prototype.concat.apply([], [["a"], ["b"]]);
function concat_apply() {
    return Array.prototype.concat.apply([], arguments)
}
var arr3 = ['a', 'b'];
console.log([concat_apply([[1, 2], [3, 4, 5], [6, 7, 8, 9, [11, 12, [13]]], 10], arr3)].join(":"));
//tips：多维数组在包一个数组.join(":")成string在split(',')为一维数组

//2.循环加递归
function nestedArrMerge(arr1, arr2) {
    if (arr1.length >= arr2.length) {
        arr2.forEach(function (val) {
            if (Array.isArray(val)) {
                nestedArrMerge(arr1, val)
            } else {
                arr1.push(val);
            }
        })
        arr2 = null;
        return arr1;
    } else {
        arr1.forEach(function (val) {
            if (Array.isArray(val)) {
                nestedArrMerge(arr2, val)
            } else {
                arr2.unshift(val);
            }
        })
        arr1 = null;
        return arr2;
    }
}
//上述2方法感觉还缺点什么，推荐第1方法


//多个数组
//1.concat方法
arr1.concat(arr2, ['a', 'b', 'c']);

//2.reduce方法
function flatten(arr) {
    return arr.reduce(function(flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
console.log(flatten([[1, 2],[3, 4, 5], [6, 7, 8, 9]]) ) ; //[1, 2, 3, 4, 5, 6, 7, 8, 9]

//数组有对象合并，看场景了