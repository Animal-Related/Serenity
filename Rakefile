require 'nokogiri'
require 'wordnet'
require 'open-uri'
require 'lemmatizer'
require './alchemyapi'
require 'json'
require 'pry'


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

		   rhyme = JSON.parse(open("http://rhymebrain.com/talk?function=getRhymes&word=" + clean).read)
						.first(3)
						.find { |r| r['word'].downcase != clean.downcase }


		  
		  if not clean.empty?
		    lemma = lem.lemma(clean.downcase)

		  	response = alchemyapi.sentiment("text", lemma)

	   	  	evilness = response["docSentiment"]["score"]
	   	  	evilness = 0 if evilness.nil?

	   	  	how_evil = evilness.to_f

	   	  	if how_evil < -0.2
	   	  		#http://apifree.forvo.com/action/word-pronunciations/format/json/word/rapist/language/en/key/60fb68af7fed2704ab8967913fd97630/
	   	  		audio_response = open('http://apifree.forvo.com/key/60fb68af7fed2704ab8967913fd97630/format/json/action/word-pronunciations/word/' + clean + '/language/en')
	  
	   	  		json_audio = JSON.parse(audio_response.read)
	   	  		# binding.pry
	   	  		
	   	  		audio_urls = []

	   	  		json_audio['items'].each do |item|
	   	  			audio_urls << item['pathogg'] if item["sex"] == 'm'
	   	  		end

	   	  	elsif how_evil > 0.2
	   	  		audio_response = open('http://apifree.forvo.com/key/60fb68af7fed2704ab8967913fd97630/format/json/action/word-pronunciations/word/' + clean + '/language/en')
	  
	   	  		json_audio = JSON.parse(audio_response.read)
	   	  		# binding.pry
	   	  		
	   	  		audio_urls = []

	   	  		json_audio['items'].each do |item|
	   	  			audio_urls << item['pathogg'] if item["sex"] == 'f'
	   	  		end

	   	  		
	   	  	end


	   	  else
	   	  	evilness = 0
	   	  end

	   	  	audio_response = open('http://apifree.forvo.com/key/60fb68af7fed2704ab8967913fd97630/format/json/action/word-pronunciations/word/' + rhyme["word"] + '/language/en')


	   	  	begin
	   	  		json = audio_response.read
	   	  		JSON.parse(json)['items'].first['pathogg']
	   	  		rhyme_url = JSON.parse(json)['items'].first['pathogg']
	   		rescue NoMethodError
	   	  		rhyme_url = nil
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
		   		evilness: evilness,
		   		audio: audio_urls,
		   		rhyme_word: rhyme["word"],
		   		rhyme: rhyme_url}

	   end
	    	result = [sentiment_score, words]

	    	puts result

        File.write 'result.json', result.to_json


     end

end
