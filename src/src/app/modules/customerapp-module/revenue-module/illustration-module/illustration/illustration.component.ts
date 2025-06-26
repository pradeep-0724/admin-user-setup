import { Component, OnInit, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { IllustrationConstants } from 'src/app/core/constants/illustration.constants';
import * as d3 from "d3";
import { isValidValue, getObjectFromList } from '../../../../../shared-module/utilities/helper-utils';
import { clone, cloneDeep } from 'lodash';

@Component({
  selector: 'app-illustration',
  templateUrl: './illustration.component.html',
  styleUrls: ['./illustration.component.scss']
})
export class IllustrationComponent implements OnInit {
  @Input() tripList = [];
  @Input() initialize: boolean = false;
  level2Color = new IllustrationConstants().COLORS.LEVEL2;
  graphData = {
    nodes: [{
      id: '',
      name : '',
      x : 6,
      y : 100,
      connected : false,
      color : this.level2Color
    }],
    links: []
  }
  node  = {
    id : '',
    name : '',
    x : 5,
    y : 100,
    connected : false,
    color : this.level2Color
  }
  curve = {
    source: {
     x: 0,
     y: 0
   },
   target: {
     x: 0,
     y: 0
   },
   color: this.level2Color
  }
  linkWidth = new IllustrationConstants().LINK_WIDTH;
  curveData = [];
  initialX: number = new IllustrationConstants().FIRST_NODE_POSITION;
  colors = new IllustrationConstants().COLORS.COLORS_LIST;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const initialize: SimpleChange = changes.initialize;
    const tripList: SimpleChange = changes.tripList;
      if(initialize && initialize.currentValue) {
        this.initializeD3();
      }
      if(tripList && tripList.currentValue) {
        // console.log('value changes',tripList.currentValue);
        this.createIllustrationData(tripList.currentValue);
      }
  }

  ifEqualStrings(str1,str2) {
    let n;
      if(!str1 || !str2) {
        return false;
      }
        n = str1.localeCompare(str2);
        return n == 0 ? true : false;
  }

  initializeD3() {
    d3.select('#graph').selectAll('svg').remove();
    this.graphData.nodes = [{
      id: '',
      name : '',
      x : this.initialX,
      y : 100,
      connected : false,
      color : this.level2Color
    }];
    this.curveData = [];
    this.graphData.links = [];
  }

  getTripName(source,destination) {
    let s = '';let d = '';
    if(source && source.length >0)
      s = source.substring(0, 3).toUpperCase();
    if(destination && destination.length>0)
      d = destination.substring(0, 3).toUpperCase();
    return s + '-' + d;
  }

  setFirstNode(trip) {
    this.graphData.nodes[0].id = trip.id;
    this.graphData.nodes[0].name = this.getTripName(trip.consignor,trip.consignee);
  }

  setNode(trip,previousNodeIndex:number,y:number,tripList) {
    let nodeObj = clone(this.node);
    let existingNode = getObjectFromList(trip.id,this.graphData.nodes);
    let previousNode = this.graphData.nodes[previousNodeIndex];
    let connected = false
    if(!isValidValue(existingNode)) {
      if(this.ifEqualStrings(tripList[previousNodeIndex].consignee,trip.consignor)) {
        connected = true;
        this.graphData.nodes[previousNodeIndex].connected = connected;
      }
      nodeObj.id = trip.id;
      nodeObj.name = this.getTripName(trip.consignor,trip.consignee);
      nodeObj.x = previousNode.x + this.linkWidth;
      nodeObj.y = y;
      nodeObj.connected = connected;
      this.graphData.nodes.push(nodeObj);
      if(y == 50 && !this.ifEqualStrings(nodeObj.name,previousNode.name) && previousNode.y == 50) {
        //not equal but level 2
        this.graphData.nodes[previousNodeIndex+1].x += this.linkWidth;
      }
      let currentNode = this.graphData.nodes[previousNodeIndex+1];
      if(y == previousNode.y && (currentNode.x - previousNode.x)== this.linkWidth) {
        // same level
        this.createLink(previousNodeIndex,y == 50 ? true : nodeObj.connected);
      }
      else {
        // different levels
        this.createCurveData(currentNode,previousNode);
      }
    }
  }

  createLink(prevIndex:number,connected) {
    let linkObj = {
      source : prevIndex,
      target : prevIndex+1,
      arrow : !connected,
      color : this.level2Color
    }
    this.graphData.links.push(linkObj);
  }

  createCurveData(currentNode,previousNode) {
    if(currentNode.x-previousNode.x == ( 2 * this.linkWidth )) {
      let c1 = cloneDeep(this.curve);
      c1.source.x = previousNode.x;
      c1.source.y = previousNode.y;
      c1.target.x = previousNode.x + this.linkWidth;
      c1.target.y = previousNode.y + 50;
      this.curveData.push(c1);

      let c2 = cloneDeep(this.curve);
      c2.source.x = previousNode.x + this.linkWidth;
      c2.source.y = previousNode.y + 50;
      c2.target.x = currentNode.x;
      c2.target.y = currentNode.y;
      this.curveData.push(c2);

    }
    else {
      let curveObj = cloneDeep(this.curve);
      curveObj.source.x = previousNode.x;
      curveObj.source.y = previousNode.y;
      curveObj.target.x = currentNode.x;
      curveObj.target.y = currentNode.y
      this.curveData.push(curveObj);
    }
  }

  createIllustrationData(tripList) {
    let level2Y = new IllustrationConstants().lEVEL_2Y;
    let level1Y = new IllustrationConstants().lEVEL_1Y;
    this.initializeD3();
    let level2NodeInit = {
        id: '',
        name : '',
        x : this.initialX,
        y : level2Y,
        connected : false,
        color : this.level2Color
    }

    tripList.forEach((trip,index) => {
      if(index < tripList.length-1) {
        if(this.ifEqualStrings(trip.consignee,tripList[index+1].consignee) && this.ifEqualStrings(trip.consignor,tripList[index+1].consignor)) {
          // level 2
          if(index == 0) {
            this.graphData.nodes[0] = level2NodeInit;
            this.setFirstNode(trip);
          }
          else {
          this.setNode(trip,index-1,level2Y,tripList);
          }
          this.setNode(tripList[index+1],index,level2Y,tripList);
        }
        else {
           // level 1
          if(index == 0) {
            this.setFirstNode(trip);
          }
          this.setNode(trip,index-1,level1Y,tripList);
        }
      }
      else {
        // last index
        if(index == 0) {
          this.setFirstNode(trip);
        }
        this.setNode(trip,index-1,level1Y,tripList);
      }
    });
    this.setColorToNode();
    // console.log('graph',this.graphData)
    this.createIllustration(tripList);
  }

  setColorToNode() {
    this.graphData.nodes.forEach((node,index) => {
      if(node.y == 100) {
        node.color = this.getColorForNode(index)
        for(let link of this.graphData.links) {
          if(link.source == index) {
            link.color = node.color;
            break;
          }
        }
        for(let curve of this.curveData) {
          if(curve.source.x == node.x && curve.source.y == node.y) {
            curve.color = node.color;
            break;
          }
        }
      }
    });
  }

  getColorForNode(nodeIndex) {
    return this.colors[nodeIndex%this.colors.length];
  }

  createIllustration(tripList) {
    let svgWidth = tripList.length * this.linkWidth * 0.88;
    var svg = d3.select("#graph")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", 160);

    var horizontalCurve:any = d3.linkHorizontal()
      .x(function(d:any) { return d.x; })
      .y(function(d:any) { return d.y; });

    svg.selectAll(null)
     .data(this.curveData)
     .enter()
     .append("path")
     .attr("class", "link")
     .style("stroke", function(d) {
       return d.color;
     })
     .attr('stroke-width','1.5')
     .style("fill", "none")
     .attr("d", horizontalCurve);
     var data = this.graphData
       svg.selectAll("link")
      .data(this.graphData.links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr('marker-end', function(d) {
        if (d.arrow)
          return marker(d.color);
      })
      .style("stroke", function(d) {
        return d.color;
      })
      .attr('stroke-width','1.3')
      .attr("x1", function(l) {
        var sourceNode = data.nodes.filter(function(d, i) {
          return i == l.source
        })[0];
        d3.select(this).attr("y1", sourceNode.y);
        return sourceNode.x
      })
      .attr("x2", function(l) {
        var targetNode = data.nodes.filter(function(d, i) {
          return i == l.target
        })[0];
        d3.select(this).attr("y2", targetNode.y);
        return targetNode.x
      })
      .attr( "d", function(l) {
        var sourceNode = data.nodes.filter(function(d, i) {
          return i == l.source
        })[0];
        var targetNode = data.nodes.filter(function(d, i) {
          return i == l.target
        })[0];
          return "M" + sourceNode.x + "," + sourceNode.y + "," + targetNode.x + "," +     targetNode.y
      });
      svg.selectAll("node")
      .data(this.graphData.nodes)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return d.x
      })
      .attr("cy", function(d) {
        return d.y
      })
      .attr("r", 5)
      .style("fill", function(d) {
        if(!d.connected) {
           return "#FFF"
           }
          else {
            return d.color;
          }
      })
      .style("stroke", function(d) {
        return d.color;
      });

        svg.selectAll("texts")
         .data(this.graphData.nodes)
         .enter()
         .append("text")
         .attr("dx", 12)
         .attr("dy", "0.35em")
         .style("fill",function(d) {
           return d.color;
         })
         .attr("x", function(d) { return d.x - 15; })
         .attr("y", function(d) { return d.y + 30; })
         .text(function(d){ return d.name; });

     function marker(color) {
       let c = color;
       svg.append("svg:marker")
      .attr("id", c.replace("#",""))
      .attr("viewBox", "0 -5 10 10")
      .attr('refX', 15)//so that it comes towards the center.
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("fill",color);

      return "url("+ color +")";
     }
  }




}
