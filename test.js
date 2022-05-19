api = require('./API')
const {writeJSON,readJSONFile,queryDevices,deleteTopology,queryTopologies,queryDevicesWithNetListNode} = api
// // import {writeJSON,readJSONFile,queryDevices,queryTopologies,queryDevicesWithNetListNode} from "./API"


// readJSONFile("topology.json")
// writeJSON("top1")
// console.log("--------Current Topologies--------")
// console.log(queryTopologies())
// console.log(queryTopologies().length)
// console.log("----------------------------------")
// console.log("--------Current Devices in Toplogy--------")
// console.log(queryDevices("top1"))
// console.log("----------------------------------")
// console.log("--------Current Devices in Toplogy with specific node--------")
// console.log(queryDevicesWithNetListNode("top1","vdd"))
// console.log("----------------------------------")


test('read Topology from JSON File', () => {
    file = require('./topology.json')
    expect(JSON.stringify(readJSONFile("topology.json").createTopologyList())).toBe(JSON.stringify(file))
})

test('write Topology to JSON File', () => {
    expect(writeJSON("top1")).toBe(JSON.stringify(file))
})

test('query Toplogies in memeory', () => {
    expect(queryTopologies().length).toBe(1)
})


test('query devices in a given topology',() => {
    expect(queryDevices("top1").length).toBe(2)
})

test('query devices connected to a given node in a given topology', () => {
    expect(queryDevicesWithNetListNode("top1","n1").length).toBe(2)
})

test('delete topology from memory', () => {
    expect(deleteTopology("top1").length).toBe(0)
})
