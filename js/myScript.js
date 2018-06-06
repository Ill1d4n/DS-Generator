var multiplier = 6;
var NomeFile="";
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var colors = {undertread : "yellow", cap : "red", wing : "green", base: "blue", sidewall: "blue", treadPlyInsert: "yellow", abrasion: "green"};

// translate context to center of canvas
context.translate(0, canvas.height);

// flip context horizontally
context.scale(1, -1);

function getLocationValue(string)
		{
			var loc = document.location.toString()+"";
			var pos;
			if (loc.indexOf("?") == -1) {
			return "";
			}else{
			pos = loc.indexOf("&"+string+"=");
			if(pos == -1){
			pos = loc.indexOf("?"+string+"=")
			}
			
			if(pos == -1){
			return "";
			}
			
			pos+=2+(string.length);
			
			var store = "";
			for(; pos < loc.length && loc.charAt(pos) != '&' && loc.charAt(pos)!= undefined ; pos++){
			store = store.concat(loc.charAt(pos));
			}
			
			return unescape(store);
			}
		}
			
			NomeFile = getLocationValue("sfoglia");
			alert(NomeFile);
function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
	
    xobj.open('GET', 'data/'+NomeFile, true); // relative path + json filename
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}
;

function init() {
    loadJSON(function (response) {
        // Parse JSON string into object
        var totalWidth = 0;
        var prevtotalWidth = 0;
        var actual_JSON = JSON.parse(response);

        for (var i = 0; i < actual_JSON.increments.length; i++) {
            var increment = actual_JSON.increments[i];
            totalWidth = increment.width;
            if (i == 0) {
                createShape(increment);
            } else {
                createShapeFromPrevious(increment, totalWidth, prevtotalWidth);
            }
            prevtotalWidth += totalWidth;
        }
    })
}
;



//drawGrid(10);
init();

function GetLayerColor(player) {
	if (player.kind === "undertread") {
	    var lightness = colors.undertread;
	} else if (player.kind === "cap") {
	    var lightness = colors.cap;
	} else if (player.kind === "wing") {
	    var lightness = colors.wing;
	} else if (player.kind === "base") {
	    var lightness = colors.base;
	} else if (player.kind === "sidewall") {
	    var lightness = colors.sidewall;
	} else if (player.kind === "treadPlyInsert") {
	    var lightness = colors.treadPlyInsert;
	} else if (player.kind === "abrasion") {
	    var lightness = colors.abrasion;
	}

	return lightness;
};

function createShapeFromPrevious(object, totalWidth, prevtotalWidth)
{

    var layer = object.layers[0];
    var previousLayer = layer;
    var y1 = 0;
    var y4 = 0;

    for (var i = 0; i < object.layers.length; i++) {
        var aPath = new Path();
        var layer = object.layers[i];
        console.log("Layer " + i, layer);

        //x1,y1
        var x1y1 = new Point(prevtotalWidth* multiplier, y1 * multiplier);
        aPath.add(x1y1);
        //x2,y2
        var x2y2 = new Point(prevtotalWidth * multiplier,  (layer.gaugeLeft + y1) * multiplier);
        aPath.add(x2y2);
        //x3,y3
        var x3y3 = new Point((prevtotalWidth+totalWidth) * multiplier, (layer.gaugeRight + y4) * multiplier);
        aPath.add(x3y3);
        //x4,y4
        var x4y4 = new Point((prevtotalWidth+totalWidth) * multiplier, y4 * multiplier);
        aPath.add(x4y4);
        aPath.closed = true;

		//console.log("basepoint X,Y" + i, basepoint);
		console.log("x1y1" + i, x1y1);
		console.log("x2y2" + i, x2y2);
		console.log("x3y3" + i, x3y3);
		console.log("x4y4" + i, x4y4);

        var previousLayer = layer;
		y1 += previousLayer.gaugeLeft;
		y4 += previousLayer.gaugeRight;

        aPath.fillColor = GetLayerColor(layer);
        console.log("Color " + i, GetLayerColor(layer));
		aPath.strokeColor = 'black';
	}
}

function createShape(object) {
    var aPath = new Path();

    for (var i = 0; i < object.layers.length; i++) {
        var layer = object.layers[i];
        console.log("Layer " + i, layer);

        aPath.add(new Point(0, 0));
        aPath.add(new Point(0, layer.gaugeLeft * multiplier));
        aPath.add(new Point(object.width * multiplier, layer.gaugeRight * multiplier));
        aPath.add(new Point(object.width * multiplier, 0));

        aPath.closed = true;
        aPath.fillColor = GetLayerColor(layer);
        aPath.strokeColor = 'black';
    }

}



