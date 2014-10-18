require 'nokogiri'
require 'wordnet'
require 'open-uri'
require 'lemmatizer'


namespace :grab do

	 task :mail do


		lem = Lemmatizer.new

		response = open('http://www.dailymail.co.uk/home/index.html')
		doc = Nokogiri::HTML(response)

	   title = doc.css('div.article a').first.content
	  
	   words = title.split(" ")

	   all_title_words = []
	   
	   # word, length, position, evilness

	   words.each do |w|
	   	
	   	word = w 
	   	length = w.length
	   	index = words.index(w)

	   	clean = ''
	   	w.split('').each {|letter| clean << letter if letter.upcase != letter.downcase}
	   	p clean

	   	lemma = lem.lemma(clean)

	   	word_map = {word: word, length: length, index: index, lemma: lemma}
	   	p word_map

	   end

     end

end
