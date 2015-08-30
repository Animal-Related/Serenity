# Serenity

Making The Daily Mail beautiful

Require anything new inside serenity2.js then Browserify JS changes /
	sudo browserify public/js/serenity2.js -o public/js/bundle.js


Run with

	rackup or bundle exec rackup

and access at 
	http://localhost:9292/

Migrations

1) create migration

	bundle exec rake db:create_migration NAME=create_words_table_again

2) create a table

	def change
		create_table :lines do |t|
		      t.integer :line_number
		end
	end

OR modify existing tables

	def change
	  	rename_column :songs, :numer_of_shares, :number_of_shares
	  	add_column :lines, :line, :string
	end

3) make change on db

	bundle exec rake db:migrate


ActiveRecord Store

 	store :settings, accessors: [:line_number, :number_words, :number_syllables, :last_rhyme, :last_pos, :line], coder: JSON

access via

	u = User.new(color: 'black', homepage: '37signals.com')
  	u.settings[:country] = 'Denmark' 
  	
  	u.color                          # Accessor stored attribute
	u.settings[:country] = 'Denmark' # Any attribute, even if not specified with an accessor

	# There is no difference between strings and symbols for accessing custom attributes
	u.settings[:country]  # => 'Denmark'
	u.settings['country'] # => 'Denmark'