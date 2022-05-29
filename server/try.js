const d1 = new Date();
let cuurentTime = d1.getTime();
let updatedTime = new Date("May 29, 2022 17:00:00:0").getTime()

const d2 = new Date(cuurentTime - updatedTime);
updatedTime += 1*60*60*1000;
// console.log(updatedTime, cuurentTime, (cuurentTime - updatedTime)/(1000*60*60))

if(updatedTime > cuurentTime){
    console.log('prb not resolved! ')
}

    const today = new Date().toISOString().slice(0, 10);
    // console.log(today)

const curr = new Date().toLocaleTimeString();
// const d = new Date(curr);

console.log(curr);