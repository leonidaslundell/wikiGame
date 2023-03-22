// variables for logic
//var title_true = 'test';
var image_url
var titles = ' '
var correct
var answer
var score = 0
var img

// meta for buttons
var button_text_1 = 'Choice 1'
var button_text_2 = 'Choice 2'
var button_text_3 = 'Choice 3'

// layout for objects

var canvas_size = [500, 500]
var pic_size = [400, 400]
var x_pos = [50, 200, 450]
var y_pos_buttons = 10 //relative to pic height
var y_pos_text = 10 //relative to pic height

// ------------ Action ------------
function setup() {
    createCanvas(canvas_size[0], canvas_size[1]);

    button_1 = createButton(button_text_1)
    button_1.position(100, height + 25)
    
    button_2 = createButton(button_text_2)
    button_2.position(200, height + 25)
    
    button_3 = createButton(button_text_3)
    button_3.position(300, height + 25)
    
    button_1.mousePressed(buttonPress_1)
    button_2.mousePressed(buttonPress_2)
    button_3.mousePressed(buttonPress_3)
}

function draw() {
    background(256)
    
    textSize(10)
    textWrap(WORD)
    text(titles[0], 100, height - 50, 40)
    text(titles[1], 200, height - 50, 40)
    text(titles[2], 300, height - 50, 40)
    
    textSize(15)
    text('Your score:', 450, height * .05, 24)
    textSize(20)
    text(score, 450, height * .15, 24)
    //text(correct == answer, height * 2, 24)

    if (img) {
        image(img, 0, 0, pic_size[0], pic_size[1]);
    }
}

function buttonPress_1() {
    is_they_smart(0)
    generateQuestion()
}

function buttonPress_2() {
    is_they_smart(1)
    generateQuestion()
  }

function buttonPress_3() {
    is_they_smart(2)
    generateQuestion()
}

function is_they_smart(answer) {
    if(correct == answer){
        score += 1
        //Cheaters get what they deserve
        correct = 42
    }else{
        score = 0
    }
}

function generateQuestion(){
    url_true = wikiRandomUrl()
    httpGet(url_true, 'json', callback = getTrue)
}

function getTrue(response, diag = false){
    
    //display image
    title_true = response['tfa']['titles']['normalized']
    image_url = response['tfa']['thumbnail']['source']
    img = loadImage(image_url)
    
    url_alt = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=backlinks&blpageid='
    url_alt = url_alt + response['tfa']['pageid']
    
    //get alternatives
    httpGet(url_alt, 'jsonp', callback = getAlt)
    
    if(diag){
        print('------True Query----------')
        print(title_true)
        print('-------URL to backlinks-------')
        print(url_alt)
        print('-------URL to img-------')
        print(image_url)
    }
}

function getAlt(response, diag = false) {
    
    titles = response['query']['backlinks']
    titles = titles.filter(page => page.ns === 0).map(page => page.title)
    
    titles = shuffle(titles, false)
    titles = [titles[0], titles[1], title_true]
    titles = shuffle(titles, false)
    
    correct = titles.indexOf(title_true)

    if(diag){
        print(title_true)
        print(titles)
    }

    if(titles.length<2){
        generateQuestion()
    }
} 

function wikiRandomUrl(){
  //births might be more interesting to guess since there will be consistent theme
  
  api = 'https://api.wikimedia.org/feed/v1/wikipedia/en/featured/';
  startDate = new Date(2016, 1, 1); //start date for tfa
  endDate = new Date(2023, 2, 12);
  randomTimestamp = Math.floor(Math.random() * (endDate.getTime() - startDate.getTime())) + startDate.getTime();
  randomDate = new Date(randomTimestamp);
  year_rand = randomDate.getFullYear();
  month_rand = ('0' + (randomDate.getMonth() + 1)).slice(-2);
  day_rand = ('0' + randomDate.getDate()).slice(-2);
  date_rand = year_rand + '/' + month_rand  + '/' + day_rand;
  return api + date_rand;
}