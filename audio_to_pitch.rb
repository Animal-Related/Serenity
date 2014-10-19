# pitch shift audio to predetermined pitches
require 'open-uri'
require 'pry'
require 'json'
require 'open3'


def initialize
	make_notes (0)
end

def play_background (array)
	len = array.length * 4

	1.upto(len) do 
		Thread.new do
			play accompanying_note_1
		end
		
		sleep 0.2

		Thread.new do
			play accompanying_note_2
		end
	end


end


def play_from_array (array)

	array.each do |sound|

		word = sound[1]
		length = sound[2]
		evilness = sound[-2]
		rhyme = sound[-1] if sound[-1]

		Thread.new do
			 play word
		end

		sleep 0.6

		Thread.new do
			 play rhyme if rhyme
		end

		sleep 0.2
	end

end

def make_notes (sentiment)

	low_note_1 = "public/sounds/pianoteq-vibraphone-3-00.ogg"
	low_note_2 = "public/sounds/pianoteq-vibraphone-3-00.ogg"

	accompanying_note_1 = "public/sounds/pianoteq-vibraphone-6-06.ogg"
	accompanying_note_2  = "public/sounds/pianoteq-vibraphone-6-03.ogg"


	if sentiment < 0.5
		tempo = ''
		time_sig = ''
		genre = ''
		rhythm_notes = []

	end
end






def clean_word (s)
	clean = ''
	s.split('').each {|letter| clean << letter if letter.upcase != letter.downcase}

end

def to_ogg_filename (s) 
	 s.downcase + '.ogg'
end

def save_tempfile (filename,url)

	File.open(filename, "wb") do |saved_file| # save tempfile to name file
		open(url, "rb") do |read_file| # the "open" is provided by open-uri
			saved_file.write(read_file.read)
	  	end
	end
end

def pull_audio (location_array)
	if location_array.length > 0
	 	url = location_array.first
	else
		url = nil
	end
end

def play(file)
	`play #{file} >/dev/null 2>&1`
end

#data = JSON.parse(File.read("result.json"))

def create_from_data (json_file,with_saving)

	data = JSON.parse(File.read(json_file))
	sentiment = data[0]
	word_objects = data[1]

	notes_array = []

	word_objects.each do |obj|

		clean = clean_word (obj["word"])
		name = to_ogg_filename (clean)
		url = pull_audio_url (obj["audio"])

		if obj["audio"]
			if url
				save_tempfile (name,url) if with_saving?
				rhymename = nil

				if obj["rhyme"]
					rhymename = to_ogg_filename (obj["rhyme_word"])
					rhyme_url = obj["rhyme"]

					save_tempfile (rhymename,rhyme_url) if with_saving
				end

			  	# system "play #{name} norm reverse vad reverse"
			else
			 	name = low_note_1
			end

			if with_saving

		else
			name = low_note_2
			# system "play #{name} norm reverse vad reverse"
		end

		notes_array << [clean,name,obj["length"],obj["evilness"], rhymename]
	end

	p notes_array

	play_background (notes_array)
	play_from_array (notes_array)

end














# binding.pry

# url = "http://apifree.forvo.com/audio/1m343m3n1j382l2p28333g1i1j1p252l2b1l1l351o221k3b342f39251j352d2c1g2d333k28231h25222d2g3m2a3n272h3i21283l333d342o3h2j333m1f2p2l1p2a2b2i2g2c3k3h1n1h253o2i333m3a3h3h1o3d2l3n371t1t_3b393m2e2a2j2e1j1i251i1o2h332e3n2p2b2o33343n1t1t"
# word = 'miscalculation'



# run with 
# ruby audio_to_pitch.rb ("result-mail.json",true) if you want to save the filenames too
# or
# ruby audio_to_pitch.rb ("result-mail.json",false) if you dont
# ruby -r "./audio_to_pitch.rb" -e "create_from_data "result-mail.json",false"


