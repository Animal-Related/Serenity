#!/usr/bin/env ruby

require 'sinatra'

get '/' do
  send_file 'public/index.html'
end
