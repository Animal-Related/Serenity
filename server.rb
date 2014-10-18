#!/usr/bin/env ruby

require 'sinatra'

get '/' do
  'Hello World!'
end

set :public_folder, File.dirname(__FILE__) + '/static'
