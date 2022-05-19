const fs = require('fs'); //fs library used to write to files

let Topologies = [] //global Array of topologies that hold current topologies in memeory

//**OOP IMPLEMENTATION **/

/****
@class Topology
@description class representation of a Topology
@member : [
    Name: @id
    type: private field
    description: id of a topology
]
@member :[
    Name: @components
    type: private field
    description: array of components, where each component is an object to the class Component
]
@member : [
    Name: @addComponents
    type: method
    retval: None
    params: components 
    description: create the Topology's array of components
]
@member: [
    Name: @getID
    type: method
    retval: id
    params: None
    description: getter method that returns id of topology 
]

@member: [
    Name: @getComponents
    type: method
    retval: component
    params: None
    description: getter iterator function that returns a component object at each call 
]
@member: [
    Name: @createTopologyList
    type: method
    retval: JSON object of a topology
    params: None
    description: returns a javascript object displaying a Topology 
]
*****/
class Topology
{
    id;
    components;

    constructor(id)
    {
        this.id = id
        this.components = []
    }

    addComponents(components)
    {
        components.forEach(component => {
            const Comp = new Component(component.id)
            Comp.setType(component.type)
            Comp.setProperty(Object.keys(component)[2],Object.values(component)[2])
            Comp.setNetlist(component.netlist)
            this.components.push(Comp) 
        });
    }
    getID()
    {
        return this.id
    }
    getComponents()
    {
        let list = this.components
        let i = 0
        return{
            *[Symbol.iterator](){
                while(i<list.length)
                {
                    yield list[i]
                    i++
                }
            }
        }
    }
    createTopologyList()
    {
        const obj = {}
        obj["id"] = this.id
        obj["components"] = []
        this.components.forEach((comp) => {
            obj["components"].push(comp.createComponentList())
        })
        return obj
    }
 
}


/****
@class Component
@description class representation of a single Component
@member : [
    Name: @id
    type: private field
    description: id of a component
]
@member :[
    Name: @netLists
    type: private field
    description: array of node connections. where each node is an instance if the class Node
]
@member :[
    Name: @type
    type: private field
    description: type of a component Ex. "resistor"
]
@member :[
    Name: @property
    type: private field
    description: javascript object that represents a property of a component Ex. resistance, with default, min and max values 
]

@member : [
    Name: @setType
    type: method
    retval: None
    params: type 
    description: setter method that set type of a component
]

@member : [
    Name: @setProperty
    type: method
    retval: None
    params: property 
    description: setter method that set property of a component
]

@member : [
    Name: @setNetlist
    type: method
    retval: None
    params: netlist 
    description: setter method that sets netList array that represent node connections of a component
]


@member: [
    Name: @createComponentList
    type: method
    retval: javascript object of a Component
    params: None
    description: returns a javascript object that represent all details of a component  
]

@member : [
    Name: @checkNode
    type: method
    retval: Boolean value
    params: nodeID 
    description: checks if a component is connected to a given Node
]
*****/

class Component
{
    constructor(id)
    {
        this.id = id
        this.netLists = []
        this.type = null
        this.property = {}
    }
    setType(type)
    {
        this.type = type
    }
    setProperty(title,property)
    {
        this.property["title"] =  title
        this.property["default"] = property.default
        this.property["min"] = property.min
        this.property["max"] = property.max        
    }
    setNetlist(netList)
    {
        const keys = Object.keys(netList)
        keys.forEach((key) => {
            const pinNode = new Node()
            pinNode.setPinName(key)
            pinNode.setNode(netList[key])
            pinNode.setDeviceId(this.id)
            this.netLists.push(pinNode)
        })
    }
    createComponentList()
    {
        const obj = {}
        obj["type"] = this.type
        obj["id"] = this.id
        obj[this.property.title] = {}
        obj[this.property.title]["default"] = this.property.default
        obj[this.property.title]["min"] = this.property.min
        obj[this.property.title]["max"] = this.property.max
        obj["netlist"] = {}
        this.netLists.forEach((node) => {
            obj["netlist"][node.pin] = node.node
        })
        return obj
    }

    checkNode(NodeID)
    {
        let flag = 0
        this.netLists.forEach((node) => {
            
            if(node.node == NodeID)
            {
                flag = 1
            }
        })
        return flag
    }


}

/****
@class Node
@description class representation of a single Node connection
@member : [
    Name: @pin
    type: private field
    description: pin of a device that is connected to this node
]
@member :[
    Name: @node
    type: private field
    description: name of the node Ex. vdd
]
@member :[
    Name: @deviceId
    type: private field
    description: id of a device connected to this node
]

@member : [
    Name: @setPinName
    type: method
    retval: None
    params: pin 
    description: setter method that sets pin name of a node connection
]

@member : [
    Name: @setNode
    type: method
    retval: None
    params: property 
    description: setter method that sets node name of a node connection
]

@member : [
    Name: @setDeviceId
    type: method
    retval: None
    params: netlist 
    description: setter method that sets id of a device connected to the node
]
*****/
class Node{
    constructor()
    {
        this.pin = null
        this.node = null
        this.deviceId = null
    }
    setPinName(pin)
    {
        this.pin = pin
    }
    setNode(node)
    {
        this.node = node
    }
    setDeviceId(id)
    {
        this.deviceId = id
    }
}


/**  
**************
API EXPOSED functions
**************
*/

/**
 * @function readJSONFile
 * @param fileName 
 * @returns topology (instance of class Topology)
 * @description convert JSON file object to a created instance of Topology class, add instance to array of topologies
 */

function readJSONFile(fileName)
{
    fileData =  require(`./${fileName}`)
    topology = new Topology(fileData.id)
    topology.addComponents(fileData.components)
    Topologies.push(topology)
    return topology
}

/**
 * @function writeJSON
 * @param TopologyId
 * @returns data (JSON object of a Topology instance)
 * @description convert a Topology instance matching a specific topologyId to JSON object and write to new JSON file
 */


function writeJSON(TopologyId)
{
    let newFile = null
    let data = null
    Topologies.forEach((topology) => {
        if(topology.getID() == TopologyId)
        {
            newFile = topology.createTopologyList()
        }
    })
    if(newFile)
    {
        data = JSON.stringify(newFile);
        fs.writeFile('user.json',data,(err) => {
            if(err){
                throw err;
            }
        })
    }
    return data

}


/**
 * @function queryTopologies
 * @param None
 * @returns topologyList (list of current topologies in memeory)
 * @description returns an array of objects where each object conatins data of a Topology instance in memory
 */

function queryTopologies()
{
    topologyList = []
    Topologies.forEach((top) => {
        topologyList.push(top.createTopologyList())
    })
    return topologyList
}

/**
 * @function deleteTopology
 * @param TopologyId
 * @returns Topologies (global array of topologies)
 * @description delete a specific topology from topologies array
 */


function deleteTopology(topologyId)
{
    return Topologies = Topologies.filter((top) => top.getID() != topologyId)
}

/**
 * @function queryDevices
 * @param TopologyId
 * @returns deviceList (array of components list)
 * @description returns a list of components in a specific Topology
 */

function queryDevices(TopologyId)
{
    deviceList = []
    Topologies.forEach((topology) => {
        if(topology.getID() == TopologyId)
        {
            for(let comp of topology.getComponents())
            {
                deviceList.push(comp.createComponentList())
            }
        }
    })
    return deviceList
}

/**
 * @function queryDevicesWithNetListNode
 * @param TopologyId
 * @param NetListNodeID
 * @returns deviceList (array of components list)
 * @description returns a list of components in a specific Toplogy connected to a specific node
 */

function queryDevicesWithNetListNode(TopologyId,NetListNodeID)
{
    deviceList = []
    Topologies.forEach((topology) => {
        if(topology.getID() == TopologyId)
        {
            for(let comp of topology.getComponents())
            {
                if(comp.checkNode(NetListNodeID))
                {
                    deviceList.push(comp.createComponentList())
                }
            }
        }
    })
    return deviceList
}



//Export API Functions...
module.exports = {writeJSON,readJSONFile,queryDevices,deleteTopology,queryTopologies,queryDevicesWithNetListNode}


//Uncomment below code to execute sample runs

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