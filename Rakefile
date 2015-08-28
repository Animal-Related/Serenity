require 'nokogiri'
require 'wordnet'
require 'open-uri'
require 'lemmatizer'
require './alchemyapi'
require 'json'
require 'pry'

L_KEY = 'f2614c679010cc8afb24722dd693999b'


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
						.find { |r| r['word'].downcase != clean.downcase } rescue nil

			rhyme = rhyme if rhyme

			p rhyme["word"] if rhyme

		  
		  if not clean.empty?
		    lemma = lem.lemma(clean.downcase)

		  	response = alchemyapi.sentiment("text", lemma)

	   	  	evilness = response["docSentiment"]["score"]
	   	  	evilness = 0 if evilness.nil?

	   	  	how_evil = evilness.to_f

	   	  	if how_evil < -0.2
	   	  		#'http://apifree.forvo.com/action/word-pronunciations/format/json/word/' + clean + '/language/en/key/60fb68af7fed2704ab8967913fd97630/''
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

	   	  if rhyme
	   	  	begin
	   	  		audio_response = open('http://apifree.forvo.com/key/60fb68af7fed2704ab8967913fd97630/format/json/action/word-pronunciations/word/' + rhyme["word"] + '/language/en')

	   	  		json = audio_response.read
	   	  		foo = JSON.parse(json)
	   	  		# binding.pry
	   	  	
	   	  		#['items'].first
	   	  		#['pathogg']
	   	  		rhyme_url = JSON.parse(json)['items'].first['pathogg']
	   		rescue NoMethodError
	   	  		rhyme_url = nil
	   		end
	   	  end

			# # calculate evilness value of lemma 
		 
		 # 	evilness_map = {positive: 1, neutral: 0, negative: -1}

		 # 	# compare words to sentiment map
			# if sent_map.has_key?(lemma)
			# 	sentiment = sent_map[lemma]
			# 	evilness = evilness_map[sentiment.to_sym]
			# end 

			
			rw = nil
			rw = rhyme["word"] if rhyme

		 	# save the parameters into a map  	
		   	{word: word, length: length, index: index,
		   		 #lemma: lemma ,
		   		evilness: evilness,
		   		audio: audio_urls,
		   		rhyme_word: rw,
		   		rhyme: rhyme_url}

	   end
	    	result = [sentiment_score, words]

	    	puts result

        File.write 'result-mail_222.json', result.to_json


     end


     task :mail2 do
	 
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

	   title = doc.css('div.article a')[5].content

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
						.find { |r| r['word'].downcase != clean.downcase } rescue nil

			rhyme = rhyme if rhyme

			p rhyme["word"] if rhyme

		  
		  if not clean.empty?
		    lemma = lem.lemma(clean.downcase)

		  	response = alchemyapi.sentiment("text", lemma)

	   	  	evilness = response["docSentiment"]["score"]
	   	  	evilness = 0 if evilness.nil?

	   	  	how_evil = evilness.to_f

	   	  	if how_evil < -0.2
	   	  		#'http://apifree.forvo.com/action/word-pronunciations/format/json/word/' + clean + '/language/en/key/60fb68af7fed2704ab8967913fd97630/''
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

	   	  if rhyme
	   	  	begin
	   	  		audio_response = open('http://apifree.forvo.com/key/60fb68af7fed2704ab8967913fd97630/format/json/action/word-pronunciations/word/' + rhyme["word"] + '/language/en')

	   	  		json = audio_response.read
	   	  		foo = JSON.parse(json)
	   	  		# binding.pry
	   	  	
	   	  		#['items'].first
	   	  		#['pathogg']
	   	  		rhyme_url = JSON.parse(json)['items'].first['pathogg']
	   		rescue NoMethodError
	   	  		rhyme_url = nil
	   		end
	   	  end

			# # calculate evilness value of lemma 
		 
		 # 	evilness_map = {positive: 1, neutral: 0, negative: -1}

		 # 	# compare words to sentiment map
			# if sent_map.has_key?(lemma)
			# 	sentiment = sent_map[lemma]
			# 	evilness = evilness_map[sentiment.to_sym]
			# end 

			
			rw = nil
			rw = rhyme["word"] if rhyme

		 	# save the parameters into a map  	
		   	{word: word, length: length, index: index,
		   		 #lemma: lemma ,
		   		evilness: evilness,
		   		audio: audio_urls,
		   		rhyme_word: rw,
		   		rhyme: rhyme_url}

	   end
	    	result = [sentiment_score, words]

	    	puts result

        File.write 'result-mail_2xxx.json', result.to_json


     end




     task :standard do
	 
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
	   response = open('http://www.standard.co.uk/')
	   doc = Nokogiri::HTML(response)

	   title = doc.css('div.text h1 a').first.content

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
	   	  		address = 'http://apifree.forvo.com/action/word-pronunciations/format/json/word/' + clean + '/language/en/key/60fb68af7fed2704ab8967913fd97630/'
	   	  		old_address = 'http://apifree.forvo.com/key/60fb68af7fed2704ab8967913fd97630/format/json/action/word-pronunciations/word/' + clean + '/language/en'
	   	  		audio_response = open(address)

	   	  		json_audio = JSON.parse(audio_response.read)
	   	  		# binding.pry
	   	  		
	   	  		audio_urls = []

	   	  		json_audio['items'].each do |item|
	   	  			audio_urls << item['pathogg'] if item["sex"] == 'm'
	   	  		end

	   	  	elsif how_evil > 0.2
	   	  		address = 'http://apifree.forvo.com/action/word-pronunciations/format/json/word/' + clean + '/language/en/key/60fb68af7fed2704ab8967913fd97630/'
	   	  		old_address = 'http://apifree.forvo.com/key/60fb68af7fed2704ab8967913fd97630/format/json/action/word-pronunciations/word/' + clean + '/language/en'
	   	  		audio_response = open(address)
	   	  		
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

        File.write 'result-standard.json', result.to_json


     end

end
