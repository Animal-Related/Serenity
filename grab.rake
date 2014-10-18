require 'nokogiri'
require 'wordnet'

namespace :grab do

	 task :mail do

		response = open('http://www.dailymail.co.uk/home/index.html')
		doc = Nokogiri::HTML(response)

	   contents = doc.css('a').first.contents
	   p contents

     end

end
