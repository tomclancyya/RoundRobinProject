import { TestEngine } from "../../Common/tests/test-engine.mjs";
import { RoundRobinTest } from "./round-robin-balancer-test.mjs";

console.log('')
console.log('\x1b[36m%s\x1b[0m', 'Running test');  //cyan

let testEngine = new TestEngine()
testEngine.add(RoundRobinTest)
testEngine.runAll()