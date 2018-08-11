var intro_switch = Math.random()
var empty_tasks = d3.range(60 - tasks.length)
                    .map(function(x){
                        return {chosen_by: 'tbc',
                                task: "Click here and choose a task for John to do. Be as creative as possible!",
                                done: "no"}
                    })
const pics = ["dad1", "dad2", "dad_married", "dad_stern"]
var task_selected = false
// var sp_text = text_split.map(function(x, index){return x.tagify({id:"spanned"+index})}).join("")
// d3.select("#maintext").html(text)
const user = $.getJSON('https://ipapi.co/json/', function(data) {
  console.log(JSON.stringify(data, null, 2));
});

const w = $(window).width();
const h = $(window).height();

var grid_width = (w/8 + 20)*6,
    grid_margin = (w - grid_width)/2

var all_tasks = tasks.concat(empty_tasks)
    .map(function(x,i){
        // debugger
        x.x = grid_margin + 20*(i%6) + (i % 6)*w/8
        x.y = 20*(Math.floor(i/6) +1) + Math.floor(i/6)*h/8
        x.tx = w/16 + grid_margin + 20*(i%6) + (i % 6)*w/8
        x.ty = 50 + 20*(Math.floor(i/6) +1) + Math.floor(i/6)*h/8
        return x
    })

var scroll_colour = d3.scaleLinear().domain([0, 1]).range(["red", "green"]);

var introText = "In the year of our lord 1957, on the ninth day of the ninth month, "

var lla = "A long time ago"
var lla2 = "(like, literally aaaages ago)"
var lla3 = ",\nnot particulary far away..."

var swText = "He's only gone and bloody done it. The big man's hit the big 6-0.  Evidently the dividends of his strict five-a-day habit (a beer, two whiskeys, another beer, and some ice cream), today's hero looks no worse than he did 30, nay 40 years ago.\nPutting aside the majesty of this achievement, it has been decided by higher powers (Sandy) that JP is short of exactly 60 things to do in his 61st year.  His beloved family have drawn up a list of 33 things they couldn't be arsed to do themselves, but now they need your help.\n \n \n \nI have a feeling that the actual scrolling text in Star Wars films has three paragraphs, so here's another.  Crazy weather we're having, am I right?"

var task_text = "Click on a task to see what JP gets to do.  Green tasks have been completed, blues ones are yet to begin, and orange ones are works in progress.  If a task is TBC, then it is up for grabs - feel free to suggest a challenge, be creative!"

var dem_rulez_dem = "Jk, obvs there are rules.\n\n\tRule 1) Do not talk about fight club.\n\n\tRule 2) JP may veto any challenge if he is too much of a wuss to do it.\n\n\tRule 3) His family is afforded 3 collective 'supervetoes' that override any veto.\n\tThese must be agreed upon unanimously, and bribes are not only permitted but actively encouraged."


// setTimeout(function(){
//     var hc = user.responseJSON.ip.hashCode()
//     if (hc == 1875569125){
//         window.alert("Hi Robyn! I hope you're having a nice holiday and thanks for helping me!")
//     }
//     },1000)
var checker;

function detectmob() {
   if(window.innerWidth <= 800 && window.innerHeight <= 600) {
     return true;
   } else {
     return false;
   }
}

$(function() {
    if(typeof window.orientation !== 'undefined'){
        alert("It looks like you're using a mobile device.  That, or you have an odd resolution I haven't catered for because of apathy. You're going to have a bad time, but then you've already made that choice, haven't you?")
    }

    if(intro_switch < 1.5){
        // document.getElementsByTagName("body")[0].style = "black";
        starWars(swText.split(/\n/))
        checker = setInterval(function(){
            var pos = tcheck.getBoundingClientRect()
            console.log(pos.bottom)
            console.log($(window).scrollTop())
            if(pos.bottom > 5000 | $(window).scrollTop() > 500){
                addRules()
            }
        }, 400)
    }else{
        d3.select("#intro").remove()
        var twHTML = "".tagify("p",{id:'"maintext"'})

        twHTML = twHTML.tagify("div", {id:'"intro2"'})
        twHTML += "".tagify("div", {id:'"tasks"'})
        $("body").append(twHTML)
        showText("#maintext", text, 0 , 10);
    }
});
