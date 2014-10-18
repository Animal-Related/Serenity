require 'nokogiri'
require 'wordnet'
require 'open-uri'
require 'lemmatizer'

namespace :grab do

	 task :mail do

		response = open('http://www.dailymail.co.uk/home/index.html')
		doc = Nokogiri::HTML(response)

	   title = doc.css('div.article a').first.content
	  
	   words = title.split(" ")

	   all_title_words = []
	   
	   # word, length, position, evilness

	   words.each do |w|
	   	word_array = []
	   	
	   	word = w 
	   	length = w.length
	   	index = words.index(w)

	   	word_array = [word,length,index]
	   	p word_array

	   end

     end

end
