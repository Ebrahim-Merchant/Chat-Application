
function solution(s, b) {
    let excessMoney = s
    let total = b.reduce((acc, val) => acc + parseFloat(val), 0);
    let excessPennies = 0;
    let smallestIndex = -1;
    let smallestValue = total;
    const excess =  b.map((numVal) => {
        const temp = Number(numVal);
        let value = (excessMoney * (temp/total))
        let num = value.toString()
        excessPennies += Number(`0.00${num.slice((num.indexOf("."))+3)}`);
        value = Number(num);
        excessMoney = (excessMoney - value);
        total = total - temp;
        return value;
    });
    const answer = excess.map((val, index) => {
        let num = val.toString();
        if(num < smallestValue) {
            smallestValue = val;
            smallestIndex = index;
        }
        num = num.slice(0, num.indexOf(".")+3);
        return num;
    })
    answer[smallestIndex] = String(Number(answer[smallestIndex]) + Number(excessPennies.toFixed(2)));
    return answer;
}

console.log(solution(300.01, ['300.00', '200.00', '100.00']));
console.log(solution(1.00, ['0.05', '1.00']));

/***
 * def solution(A):
answer = 0
current_sum = 0
#Currently there is one empty subarray with sum 0
prefixSumCount = {0:1}

for list_element in A:
    current_sum = current_sum + list_element
    if current_sum in prefixSumCount:
        answer = answer + prefixSumCount[current_sum]
    
    if current_sum not in prefixSumCount:
        prefixSumCount[current_sum] = 1
    else:
        prefixSumCount[current_sum] = prefixSumCount[current_sum] + 1

if answer > 1000000000:
    return -1
else:
    return answer 
 */