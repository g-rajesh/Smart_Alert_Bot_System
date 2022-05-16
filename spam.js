const possibilities = [
    "do not have power", "do not have electricity", "do not have current", "do not have power supply", "don't have power",
    "don't have electricity", "don't have current", "don't have power supply", "didn't have power", "didn't have electricity",
    "didn't have current", "didn't have power supply", "did not have power", "did not have electricity", "did not have current",
    "did not have power supply", "dont have power", "dont have electricity", "dont have current", "dont have power supply",
    "didnt have power", "didnt have electricity", "didnt have current", "didnt have power supply", "no power", "no electricity",
    "no current", "no power supply", "power supply", "power resume", "doesn't have power", "doesn't have electricity", "doesn't have current",
    "doesn't have power supply", "does not have power", "does not have electricity", "does not have current", "does not have power supply", "doesnt have power", "doesnt have electricity", "doesnt have current", "doesnt have power supply", "power shortage",
    "power cut", "transformer burst", "trees fall on power line", "power line cuts due to heavy rain", "heavy load vehicles cuts the power line", "low voltage", "voltage fluctutation", "voltage drop", "cut power", "cut the power", "cut power supply",
    "cut the power supply", "cut electricity supply", "cut the electricity supply", "cut current supply", "cut the current supply",
    "stop power", "stop the power", "stop power supply", "stop the power supply", "stop electricity supply", "stop the electricity supply", "stop current supply", "stop the current supply"
]

const detectSpam = (message) => {

    message = message.toLowerCase();

    for(let i in possibilities) {
        if(message.includes(possibilities[i])) {
            return false;
        }
    }

    return true;
}

let message = "hi abinesh";

if(!detectSpam(message)) {
    console.log("Not a spam");
} else {
    console.log("Spam");
}
