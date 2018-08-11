String.prototype.tagify = function(tag, tags = null){
	var tag_string = "";
	if(tags){
		tag_string += " "
		for(key of Object.keys(tags)){
			tag_string += key + "=" + tags[key] + " "
		}
	}
	return "<" + tag + tag_string.slice(0, -1) + ">" + this + "</" + tag + ">"
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1,
        yc = text.attr("y"),
        xc=text.attr("x"),
        dcy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", xc).attr("y", yc).attr("dy", dcy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", xc).attr("y", yc).attr("dy", ++lineNumber * lineHeight + dcy + "em").text(word);
      }
    }
  });
}

var showText = function (target, message, index) {
  if (index < message.length) {
    $(target).append(message[index++]);
	var interval = Math.ceil(Math.random()*20)
    setTimeout(function () { showText(target, message, index); }, interval);
}else{
		addTasks()
		$("#task_svg").before("The Rules".tagify('h1', {'class':'task_text'}))
		$("#task_svg").before("There are no rules. ".tagify('p', {'id':'rules'}))
		setTimeout(function(){
			showRules()
		}, 3000)
	}
}



function showRules(i = 0){
	if (i < dem_rulez_dem.length){

		$('#rules').append(dem_rulez_dem[i++])
		var interval = Math.ceil(Math.random()*10)
		setTimeout(function(){showRules(i)}, interval)
	}
	// } else{
	// 	addTasks()
	// }
}

function pic_cycle(){
	var x = Math.floor(4*Math.random())
	var pic = "'images/" + pics[x] + ".png'"
	chart.style.backgroundImage = "url(" + pic + ")"
}


function starWars(text){
	var sw = {class: '"star-wars"'};
	var crawl = {class: '"crawl"', id: 'tcheck'};
	var title = {class: '"title"'};
	var swHTML = "Episode LX".tagify("p")

	swHTML += "It's All Downhill From Here".tagify("h1")
	swHTML = swHTML.tagify("div", title)
	swHTML = swHTML.tagify("div", crawl)
	swHTML = swHTML.tagify("section", sw)

	d3.select("#intro")
		.append("div")
		.attr("class", "fade")

	$("#intro").append(swHTML)
	d3.select(".crawl")
		.selectAll(".text")
		.data(text, function(d, i){return d;})
		.enter()
		.append("p")
		.attr("class", "text")
		.text(function(d){return d;})
		sw_audio.play()
		// setTimeout(function(){
		// 	sw_audio.pause()
		// },  10000)
}

var test = function(){
	// console.log("yup")
	var dist = chart.scrollTop/3212
	chart.style.backgroundColor = scroll_colour(dist)

}

function class_choice(d){
	if (d.chosen_by == 'tbc'){
		return "empty";
	}else{
		switch(d.done){
			case "yes":
				return "done";
			case "in_progress":
				return "in_progress";
			default:
				return "todo";
		}
	}
}

function addRules(){
	clearInterval(checker)
	d3.selectAll("div").remove()
	$("body").append("".tagify('div', {id:"chart", onscroll: "test()"}))
	$("#chart").append("The Tasks".tagify('h1', {'class': 'task_text'}))
	$("#chart").append("".tagify('p', {'class': 'task_text', 'id': 't_desc'}))
	showText('#t_desc', task_text, 0)
	// d3.select('#chart').on('click', task_click)
}

function addTasks(){

	// we can increase this, everything will scale up with us
	// var w=960,h=500,
	var svg=d3.select("#chart")
        .append("svg")
        .attr("width",w)
		.attr("height", 5 * h)
		.attr("id", "task_svg");

	// filter chain comes from:
	// https://github.com/wbzyl/d3-notes/blob/master/hello-drop-shadow.html
	// cpbotha added explanatory comments
	// read more about SVG filter effects here: http://www.w3.org/TR/SVG/filters.html

	// filters go in defs element
	var defs = svg.append("defs");

	// create filter with id #drop-shadow
	// height=130% so that the shadow is not clipped
	var filter = defs.append("filter")
	    .attr("id", "drop-shadow")
	    .attr("height", "130%");

	// SourceAlpha refers to opacity of graphic that this filter will be applied to
	// convolve that with a Gaussian with standard deviation 3 and store result
	// in blur
	filter.append("feGaussianBlur")
	    .attr("in", "SourceAlpha")
	    .attr("stdDeviation", 5)
	    .attr("result", "blur");

	// translate output of Gaussian blur to the right and downwards with 2px
	// store result in offsetBlur
	filter.append("feOffset")
	    .attr("in", "blur")
	    .attr("dx", 5)
	    .attr("dy", 5)
	    .attr("result", "offsetBlur");

	// overlay original SourceGraphic over translated blurred opacity by using
	// feMerge filter. Order of specifying inputs is important!
	var feMerge = filter.append("feMerge");

	feMerge.append("feMergeNode")
	    .attr("in", "offsetBlur")
	feMerge.append("feMergeNode")
	    .attr("in", "SourceGraphic");
		//.attr("height", h);

	var task_Groups = svg.selectAll('g')
	.data(all_tasks, function(d,i){return d;})
	.enter()
	.append("g")
	.attr("class", "task_group")
	.attr("id", function(d,i){return 'task' + i;})
	.on('click', task_click)




	task_Groups.append("rect")
	.attr("class", function(d){return class_choice(d)})
	.attr('width', w/8)
	.attr('height', 100)
	.attr("x", function(d,i){return d.x})
	.attr("y", function(d,i){return d.y})

	task_Groups.append("text")
	.attr("text-anchor", "middle")
	.attr("x", function(d,i){return d.tx})
	.attr("y", function(d,i){return d.ty;})
	.text(function(d,i){
		var t = "Task " + (i + 1)
		if(d.chosen_by == 'tbc'){
			t = "Task TBC"
		}
		return t;
	})
	.attr("font-family", "Courier New")



	// .attr("fill", "steelblue")
	// .style("filter", 'url(#drop-shadow)')
}

function return_to_normal(e){
	// debugger
	var chart = d3.select('.blur')

	d3.selectAll('#selected_task').remove()
	chart.attr('class', '')

	task_selected = false
	//console.log('return_to_normal')
}

function task_click(d, i){
	// debugger
	console.log(d, i)
	if(!d){
		return_to_normal()
		return;
	}
	const priv = user.responseJSON.ip.hashCode() == -1984128467 || user.responseJSON.ip.hashCode() == -781308564
	if (priv) {
		console.log('Privileged as fuck mate')

	}
	task_selected = i
	d3.select("#chart").attr("class", "blur")
	d3.select('#selected_task').remove()
	var st = d3.select("body")
	.append("div")
	.attr('class', 'selected_task')
	.attr('id', 'selected_task')

	$('#selected_task').on('mousewheel DOMMouseScroll', function(event) {
    	$('#chart').scrollTop($('#chart').scrollTop() - (event.originalEvent.wheelDelta || -event.originalEvent.detail*30));
	});

	pic_cycle()
	pos = 'width:' + Math.floor(w/3) + 'px;'
	pos+= 'height:' + Math.floor(h/3) + 'px;'
	pos+= 'left:' + Math.floor(w/3) + 'px;'
	pos+= 'top:' + Math.floor(h/3) + 'px;'
	selected_task.setAttribute('style', pos)

	// selected_task.style.width = w/3;
	// selected_task.style.height = h/3;
	// selected_task.style.top = h/3;
	// selected_task.style.left = w/3;


	var sel_svg = d3.select('#selected_task')
		.append('svg')
		.attr('width', '100%')
		.attr('height', '100%')
	d.i = i
	var sel_group = sel_svg.selectAll('#sel_group')
		.data([d], function(d){return d;})
		.enter()
		.append('g')
		.attr('transform', 'scale(0)')
		.attr('id', 'sel_group')

	var sel_rect = sel_group.append('rect')
		.attr('width', w/3)
		.attr('height', h/3)
		.attr('x', 0)
		.attr('y', 0)
		.attr('class', function(d){return class_choice(d)})

	var ret_text = sel_group.append('text')
		.text('return')
		.attr('text-anchor', 'middle')
		.attr('x', w/6)
		.attr('y', h/3 - 10)
		.attr('font-size', '15px')
		.attr('id', 'ret_text')
		.on('click', return_to_normal)

	var task_text = sel_group.append('text')
		.text(function(d){
			out = d.task
			if(d.chosen_by !== 'fam'){
				out += ' \n(with thanks to ' + d.chosen_by + ')'
			}
			return out;
		})
		.attr('text-anchor', 'middle')
		.attr('x', w/6)
		.attr('y', h/6 - 50)
		.attr('font-size', '25px')
		.attr('id', 'task_text')
		.attr('class', '_' + d.chosen_by)
		.attr('dy', 0)
		.call(wrap, w/3)
		.on('click', email)

	if(d.done === 'yes' && d.quote){
		var dad_quote = sel_group.append('text')
			.text(function(d){return 'Quoth JP, on completion: "' + d.quote + '"'})
			.attr('text-anchor', 'middle')
			.attr('x', w/6)
			.attr('y', h/6 + 40)
			.attr('font-size', '20px')
			.attr('id', 'quote_text')
			.attr('dy', 0)
			.call(wrap, w/3)
	}

	const dad_text = priv ? "It lookes like you're JP.  Click here to update your progress on this task." : ""
	var task_label = sel_group.append('text')
		.text(function(d){return 'Task ' + (d.chosen_by == 'tbc' ? 'TBC' : (i + 1));})
		.attr('text-anchor', 'middle')
		.attr('x', w/6)
		.attr('y', 20)
		.attr('font-size', '20px')

	var is_dad = sel_group.append('text')
			.text(dad_text)
			.attr('text-anchor', 'middle')
			.attr('x', w/6)
			.attr('y', 40)
			.attr('dy', 0)
			.attr('font-size', '10px')
			.attr('id', 'ret_text')
			.call(wrap, w/4)
			.on('click', function(){
				alert('Send an email to jpturns60@gmail.com saying which task and whether it\'s in progress or copmplete.  If you set up your outlook to link to your hotmail (just follow the wizard that pops up when you click the TBC tasks), then I can automate this bit!')
			})


	sel_group.transition().duration(500).attr('transform', 'scale(1)')


}
// $.getJSON('//freegeoip.net/json/?callback=?', function(data) {
//   console.log(JSON.stringify(data, null, 2));
// });
function email(){
	// d3.selectAll("a").remove()
	var cl = d3.select(this).attr('class').slice(1)
	if(cl == 'tbc'){
		var bdy = "Hi! \n\n John should swim with laser sharks (feel free to edit as you wish) \n\n Yours sincerely and emphatically, "
		$("#chart").prepend("".tagify("a",
		{href: 'mailto:jpturns60@gmail.com?subject=I%27ve%20got%20a%20great%20idea%20for%20a%20challenge%21&body=' + encodeURIComponent(bdy)}
		)
	)
		$("a")[0].click()
		d3.selectAll("a").remove()
		alert("That was meant to open an email template. If it instead prompted you to set up some annoying email software, simply send your suggestion to jpturns60@gmail.com instead.")
	}
}
