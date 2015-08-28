// Command after EACH change in JS file: sudo browserify public/js/serenity2.js -o public/js/bundle.js


(function() {
    var bpm = 80,
        beatMs = 60000 / bpm,
        headline,
        articleUrl,
        score,
        articleIndex=0,
        sourceIndex=0;
        var sentimental = require('sentimental');
        var wordfilter = require('wordfilter');
        var sources = [
            {name:'guardian',
            url:"http://www.theguardian.com/uk/rss"},
            {name:'mail',
            url:"http://www.dailymail.co.uk/news/index.rss"},
            {name:'telegraph',
            url:'http://www.telegraph.co.uk/news/worldnews/rss'},
            {name:'independent',
            url:'http://rss.feedsportal.com/c/266/f/3503/index.rss'}
              ];

    //
    // Get the Daily Mail front page headline + description from RSS
    //


 // 'where url="http://www.dailymail.co.uk/news/index.rss" ' +

    function queryHeadline(source, id) {
        var request = new XMLHttpRequest(),
        query = 'http://query.yahooapis.com/v1/public/yql?q=' +
                  'select * from rss ' +
                  'where url="' + source + '"' + 
                  'limit 10' + 
                  '&format=json';
        request.open('GET', query, true);

        request.onload = function() {
            var article, hEl, aEl, body;

            if (request.status >= 200 && request.status < 400){
         
                articles = JSON.parse(request.responseText).query.results.item;
                no_of_articles = articles.length;
                var arrayOfDMObjects = [];

                for (var i = 0; i<no_of_articles; i++) {

                    headline = articles[i].title.trim();

                    var obj = {
                      headline : headline,
                      score : sentimental.analyze(headline)['score'],
                      rude : wordfilter.blacklisted(headline)
                    };

                    arrayOfDMObjects.push(obj);
                }

                createArticle(0);
                getTodaysScore();

                function replaceContent(i) {
                    article = arrayOfDMObjects[i];
                    headline = article.headline;
                    hEl.innerHTML =
                          '<span>'+ headline.split('').join('</span><span>') + '</span>';
                    pEl.innerHTML = article.score;
                    if (article.rude){h2El.style.color = "blue";}
                    console.log(article);
                };

                function getTodaysScore() {
                  score = 0;

                  for (var i = 0; i<no_of_articles; i++) {
                      score = score + arrayOfDMObjects[i].score;
                  }

                  document.getElementById(id).innerHTML = score;

                }

                function createArticle(index) {

                    // articleUrl = article.link.trim();

                    hEl = document.createElement('h1');
                    hEl.className = 'hidden';

                    h2El = document.createElement('h2');
                    h2El.innerHTML = "Misery rating";
                    pEl = document.createElement('p');

                    aEl = document.createElement('a');
                    aEl.innerHTML = 'Find more misery here...';
                    aEl.id = "link";
                    aEl.className = 'hidden';

                    aEl.onclick=function(){

                      articleIndex++;

                      if (articleIndex == articles.length) { articleIndex=0;}
                      index = articleIndex;

                      replaceContent(index);
                    };

                    aEl2 = document.createElement('a');
                    aEl2.innerHTML = 'Change source...';

                    aEl2.onclick=function(){

                      sourceIndex++;

                      if (articleIndex == sources.length) { sourceIndex=0;}
                      index = sourceIndex;

                      getContent(index);
                    };


                    replaceContent(0); // fire it up for the first time

                    body = document.querySelector('article');
                    body.innerHTML = '';
                    body.appendChild(h2El);
                    body.appendChild(pEl);
                    body.appendChild(hEl);
                    body.appendChild(aEl);
                    body.appendChild(aEl2);
                }; 

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
          ele = document.querySelector('h1');

      setInterval(function() {
        ele.children[i].className = 'highlight';

        var x = i;
        setTimeout(function() { ele.children[x].className = ''; }, beatMs * 2);

        i = ++i % headline.length;
      }, beatMs);
    };

    function getContent(){
      currentSource = sources[sourceIndex];
      console.log("Fetching" + currentSource['name']);

      queryHeadline(currentSource['url'], currentSource['name']);
    }

    getContent();
    

}());
