//数组排序

// 1、简单的排序
var arr1 = [1, 7, 3, 5, 4]
arr1.sort(); //[1, 3, 4, 5, 7]

//2、降序
arr1.sort(function(a,b){
    return b - a;
}); //[7, 5, 4, 3, 1]
// 若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值。
// 若 a 等于 b，则返回 0。
// 若 a 大于 b，则返回一个大于 0 的值。

//3、字符串数组按首字母排序
//发现一个问题，var name = ['12321'].出来是个string。因为name是javascript中windows对象的关键字
var data = ['Milo','Teana','Mary','King','Iroity'];
data.sort();  // ["Iroity", "King", "Mary", "Milo", "Teana"]
//因为默认排序顺序是根据字符串Unicode码点。

//4、对象数组排序
var file = [{
    index: 0,
    name : 'a',
    count: 4,
},{
    index: 2,
    name : 'c',
    count: 1,
},{
    index: 4,
    name : 'e',
    count: 0,
},{
    index: 1,
    name : 'b',
    count: 2,
},{
    index: 3,
    name : 'd',
    count: 10,
}];

var newfile = file.sort(function (a,b) {
    return a['index'] - b['index'];
});

console.log(newfile)

//5、数组中文比较(前提条件是全部是中文)
var city = ['北京', '上海', '深圳', '杭州', '成都', '苏州'];
//见pinyin.html,获取到首字母拼音，再排序。
