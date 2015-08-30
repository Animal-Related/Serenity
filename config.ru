require 'bundler'
require 'rubygems'
require 'bundler/setup'

require './app'

Bundler.require(:default)

map "/" do
	run HelloWorldApp
end
