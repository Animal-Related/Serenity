// Command after EACH change in JS file: sudo browserify public/js/serenity2.js -o public/js/bundle.js


(function() {
    var bpm = 80,
        beatMs = 60000 / bpm,
        headline,
        articleUrl,
        score,
        aEl,
        aEl2,
        pEl,
        emojiEl,
        h2El,
        h3El,
        ele,
        newId,
        arrayOfDMObjects,
        articleIndex=0,
        sourceIndex=0,
        first=true;
        var sentimental = require('sentimental');
        var wordfilter = require('wordfilter');
        var emoji = require('node-emoji').emoji;
        var _ = require('underscore');

        var sources = [ 
            {name:'Mail',
            url:"http://www.dailymail.co.uk/news/index.rss"},
            {name:'Times',
            url:"http://www.thetimes.co.uk/tto/news/rss"},
            {name:'Express',
            url:"http://feeds.feedburner.com/daily-express-news-showbiz"},
            {name:'Telegraph',
            url:'http://www.telegraph.co.uk/news/worldnews/rss'},
            {name:'Guardian',
            url:"http://www.theguardian.com/uk/rss"},
            {name:'Independent',
            url:'http://rss.feedsportal.com/c/266/f/3503/index.rss'}
              ];
        var emotions = {
          'very negative': emoji.rage,
          'negative': emoji.angry,
          'neutral': emoji.relaxed,
          'positive': emoji.smile,
          'very positive' : emoji.triumph
        }

   String.prototype.capitalize = function() {return this.charAt(0).toUpperCase() + this.slice(1);}
   Array.prototype.array_to_histogram = function() {
      var hist = {};
      for (var k=0;k<this.length;k++) {
        var word = this[k];
        hist[word] ? hist[word]++ : hist[word]=1;
      } 
      return hist;
   }
   Array.prototype.flatten_arrays = function(){return [].concat.apply([], this);}
   Array.prototype.toHistogram = function(){return this.flatten_arrays().array_to_histogram();}

   function addPapers(){
       var papers = _.pluck(sources, 'name');
        _.each(papers, function(e){
          var paperDiv = document.createElement("div")
          paperDiv.innerHTML = "<p id='"+ e + "'></p><p> "+ e +" </p>"
          document.getElementById('papers').appendChild(paperDiv);         
        });   
    }

   function setUp(myId){
      hEl = document.createElement('h1');
      hEl.className = 'hidden';

      h2El = document.createElement('h2');
      h2El.innerHTML = "Misery rating";

      h3El = document.createElement('h3');
   
      emojiEl = document.createElement('p');
      emojiEl.id="emojis";
      pEl = document.createElement('p');
      pEl.id = 'misery_score';

      aEl = document.createElement('a');
      aEl.innerHTML = '>>';
      aEl.id = "link";
      aEl.className = 'hidden';

      aEl.onclick=function(){
        articleIndex++;

        if (articleIndex == articles.length) { articleIndex=0;}

        index = articleIndex;
        replaceContent(index,myId);
    };

    aEl2 = document.createElement('div');
    aEl2.innerHTML='~>';
    aEl2.id='changesource';
    aEl2.onclick=function(){

      sourceIndex++;
      if (articleIndex == sources.length) { sourceIndex=0;}
      index = sourceIndex;

      ele = document.getElementById(newId);
      ele.classList.remove('active');
      ele.nextSibling.classList.remove('active');
      console.log(newId);

      getContent();
    };

    var navdiv=document.querySelector('nav');
    var paperdiv = document.getElementById('papers');

    if (first==true) {
      addPapers();
      navdiv.appendChild(aEl2);
      paperdiv.appendChild(aEl);
    }
   }

   function replaceContent(i,id) {
        var article = arrayOfDMObjects[i];
        var headline = article.headline;
        hEl.innerHTML =
              '<span>'+ headline.split('').join('</span><span>') + '</span>';
        pEl.innerHTML = article.score;

        getEmotionsfromScore(article.score);

        h3El.innerHTML = "Today's <strike>tripe</strike> news, brought to you by The " + id;
        if (article.rude){h2El.style.color = "blue";console.log(article);}else{h2El.style.color = "black";}
    };
    
    function rssToObjects(allstories){
        arrayOfDMObjects = [];
               
            for (var i = 0; i<allstories.length; i++) {

                headline = allstories[i].title.trim();

                arrayOfDMObjects.push({
                  headline : headline,
                  score : sentimental.analyze(headline)['score'],
                  rude : wordfilter.blacklisted(headline)
                });
                
            }
    }  

    function getTodaysScore(allstories,id) {
                  score = 0;

                  for (var i = 0; i<allstories.length; i++) {
                      score = score + arrayOfDMObjects[i].score;
                  }

                  var ele = document.getElementById(id);
                  ele.innerHTML = score;
                  ele.className = "active";
                  ele.nextSibling.className = "active";
                }  

    function getTopCategories(){

         var sourceCategories = [];

         for (var i = 0; i<articles.length;i++) {
            cats = articles[i].category;
            var storyCategories = [];
            for (var j = 0; j<cats.length;j++) {storyCategories.push(cats[j]['content']);}
            sourceCategories.push(storyCategories);
          }

        var sourceHistogram = sourceCategories.toHistogram();
        keysSorted = Object.keys(sourceHistogram).sort(function(a,b){return sourceHistogram[b]-sourceHistogram[a]});
        top10 = keysSorted.slice(0,10);
        console.log(top10);
      }  

    function getContent(){
      currentSource = sources[sourceIndex];
      newId = currentSource['name'];
      console.log("Fetching " + currentSource['name']);

      queryHeadline(currentSource['url'], currentSource['name']);


    }  

    function getEmotionsfromScore(score){
      var em;

        switch (true) {
         case (score<=-5): em='very negative';
         break;
         
         case (score<=-2): em='negative';
         break;

          case (score<0): em='neutral';
         break;
         
         case (score==0): em='positive';
         break;

         case (score>0): em='very positive';
         break;

      }
      emojiEl.innerHTML = emotions[em];
    } 

    function createArticle(index,id) {

        // articleUrl = article.link.trim();
        replaceContent(0,id); // fire it up for the first time

        headerdiv = document.getElementById('headerdiv');
        headerdiv.innerHTML = '';
        headerdiv.appendChild(h3El);
        headerdiv.appendChild(emojiEl);
        headerdiv.appendChild(h2El);
        headerdiv.appendChild(pEl);
        
        body = document.querySelector('article');
        body.innerHTML = '';
        body.appendChild(hEl);

        
    };  


    function queryHeadline(source, myid) {
        var request = new XMLHttpRequest(),
        query = 'http://query.yahooapis.com/v1/public/yql?q=' +
                  'select * from rss ' +
                  'where url="' + source + '"' + 
                  'limit 10' + 
                  '&format=json';
        request.open('GET', query, true);

        request.onload = function() {
            setUp(myid);
            first=false;

            if (request.status >= 200 && request.status < 400){
         
                articles = JSON.parse(request.responseText).query.results.item;
              
                rssToObjects(articles);
                createArticle(0,myid);
                getTodaysScore(articles,myid);
                // getTopCategories(); // only Guardian RSS has categories !

                // Race condition. Without the timeout we remove the class before the
                // elements are rendered on the page, preventing the transition
                setTimeout(function() {
                  aEl.classList.remove('hidden');
                  hEl.classList.remove('hidden');
                }, 100);

                setTimeout(dancingLights(), 6000);

            } else {
                document.querySelector('article').innerHTML = 'The YQL server returned an error';
            }
        };

        request.onerror = function() {
            document.querySelector('article').innerHTML = 'There was an error performing the YQL request';
        };

        request.send();
    };


    //
    // One by one, momentarily highlight a char in the headline
    //
    var dancingLights = function dancingLights() {
      var i = 0,
          elem = document.querySelector('h1');

      setInterval(function() {
        elem.children[i].className = 'highlight';

        var x = i;
        setTimeout(function() { elem.children[x].className = ''; }, beatMs * 2);

        i = ++i % headline.length;
      }, beatMs);
    };

    getContent();
    

}());

