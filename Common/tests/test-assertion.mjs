
export function assert(a, b, isSucccess){
    if (isSucccess) {
        return { result: "OK", color: "\x1b[32m" }
    }
    else {
        /**
         * @type {String}
         */
        let stack = new Error().stack

        // break the textblock into an array of lines
        let lines = stack.split('\n');
        // remove one line, starting at the first position
        let finalText = lines.splice(2);
        // join the array back into a single string
        stack = finalText.join('\n');

        // cut the first line:
        throw { result: "FAILED", color:"\x1b[31m", message: "left: " 
            + JSON.stringify(a) 
            + "\n     right: " + JSON.stringify(b) + "\n"   
            + "\n" + stack 
    }
                
    }    
}

export function isEqual(a, b){
    return assert(a,b, (a == b)) 
}

export function done(){
    return assert(0, 0, true) 
}

export function fail(){
    return assert(0, 0, false) 
}

export function doneAsync(){
    return assert(0, 0, true) 
}

export async function wait(seconds){
    await new Promise((resolve, reject) => {
        setTimeout(() => { 
            resolve("ready")
        } , seconds * 1000)
      });
} 