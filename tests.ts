function canConstruct(ransomNote: string, magazine: string): boolean {
    const ransomArr = ransomNote.split('');
    const magazineArr = magazine.split('');

    for (let i = 0; i < ransomArr.length; i++) {
        let found = false;
        for (let j = 0; j < magazineArr.length; j++) {
            if (ransomArr[i] === magazineArr[j]) {
                magazineArr.splice(j, 1);
                found = true;
                break;
            }
        }
        if (!found) return false;

    }
    return true;
}

const arr1 = 'aa';
const arr2 = 'ab';

console.log(canConstruct(arr1, arr2));
