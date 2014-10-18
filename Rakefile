require 'nokogiri'
require 'wordnet'
require 'open-uri'
require 'lemmatizer'
require './alchemyapi'

alchemyapi = AlchemyAPI.new()
lem = Lemmatizer.new


namespace :grab do

	 task :mail do
	 
	 #create sentiment map

	 	file = open('subjectivity_lexicon_opinion_finder.txt') #open subjectivity file 

	 	sent_map = {}
	 	IO.foreach(file) do |line|

	 		items = line.split(" ")
	 		sentiment = items[-1]
	 		dict_word = items[1]
	 		sent_map[dict_word] = sentiment
	 	end


		# scrape the main title of the day / hour
	   response = open('http://www.dailymail.co.uk/home/index.html')
	   doc = Nokogiri::HTML(response)

	   title = doc.css('div.article a').first.content
	  
	   words = title.split(" ")

	   response = alchemyapi.sentiment("text", title)
	   sentiment_score = response["docSentiment"]["score"]

	   words.map! do |w|   # word, length, position, evilness
	   	
			# get the length and position 
		   	word = w 
		   	length = w.length
		   	index = words.index(w)

		 	# get lemma
		   clean = ''
		   w.split('').each {|letter| clean << letter if letter.upcase != letter.downcase}
		  
		  if not clean.empty?
		    lemma = lem.lemma(clean.downcase)

		  	response = alchemyapi.sentiment("text", lemma)

	   	  	evilness = response["docSentiment"]["score"]
	   	  	evilness = 0 if evilness.nil?

	   	  else
	   	  	evilness = 0
	   	  end

		

			# # calculate evilness value of lemma 
		 
		 # 	evilness_map = {positive: 1, neutral: 0, negative: -1}

		 # 	# compare words to sentiment map
			# if sent_map.has_key?(lemma)
			# 	sentiment = sent_map[lemma]
			# 	evilness = evilness_map[sentiment.to_sym]
			# end 

		 	# save the parameters into a map  	
		   	{word: word, length: length, index: index,
		   		 #lemma: lemma ,
		   		evilness: evilness}

	   end
	    	result = [sentiment_score, words]

	    	puts result


     end

end
