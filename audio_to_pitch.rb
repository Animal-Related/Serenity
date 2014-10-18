# pitch shift audio to predetermined pitches
require 'open-uri'
require 'pry'
require 'json'
require 'open3'

our_array = JSON.parse(File.read("result.json"))
sentiment = our_array[0]
objects = our_array[1]

notes_array = []

objects.each do |obj|

	word = obj["word"]
	clean = ''
	word.split('').each {|letter| clean << letter if letter.upcase != letter.downcase}

	name = clean.downcase + '.ogg'

	if obj["audio"]

		if obj["audio"].length > 0

	 		url = obj["audio"].first

		else

			url = nil
		end

		if url
			word = obj["word"]
			clean = ''
		   word.split('').each {|letter| clean << letter if letter.upcase != letter.downcase}

			name = clean.downcase + '.ogg'

			File.open(name, "wb") do |saved_file| # save tempfile to name file
			 	open(url, "rb") do |read_file| # the "open" is provided by open-uri
			    	saved_file.write(read_file.read)
			  	end
			end

		  	# system "play #{name} norm reverse vad reverse"


		 else
		 	name = "public/sounds/pianoteq-vibraphone-3-00.ogg"
		 	# system "play #{name} norm reverse vad reverse"

		end

		
	   
	else
		name = "public/sounds/pianoteq-vibraphone-4-00.ogg"
		# system "play #{name} norm reverse vad reverse"
	end

	notes_array << [clean,name,obj["length"],obj["evilness"]]

end

p notes_array


len = notes_array.length * 2


high_note = "public/sounds/pianoteq-vibraphone-6-03.ogg"
Thread.new do
	len.times do 
		Thread.new do
			system "play #{high_note} 1>/dev/null" 
		end
	sleep 0.4
	end
end

notes_array.each do |sound|

	Thread.new do
		system "play #{sound[1]} norm reverse vad reverse 1>/dev/null" 
	end

	sleep 0.8
end

# binding.pry

# url = "http://apifree.forvo.com/audio/1m343m3n1j382l2p28333g1i1j1p252l2b1l1l351o221k3b342f39251j352d2c1g2d333k28231h25222d2g3m2a3n272h3i21283l333d342o3h2j333m1f2p2l1p2a2b2i2g2c3k3h1n1h253o2i333m3a3h3h1o3d2l3n371t1t_3b393m2e2a2j2e1j1i251i1o2h332e3n2p2b2o33343n1t1t"
# word = 'miscalculation'





