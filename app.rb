require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/reloader'
require 'sinatra/asset_pipeline'

configure :development, :test do
  require 'pry'
end

Dir[File.join(File.dirname(__FILE__), 'app', '**', '*.rb')].each do |file|
  require file
  also_reload file
end

set :database_file, "config/database.yml"

class HelloWorldApp < Sinatra::Base

	register Sinatra::ActiveRecordExtension

	configure do
	  set :views, 'app/views'
	end

  	set :public_folder, 'public'
	set :partial_template_engine, :erb

	set :root, File.dirname(__FILE__) # You must set app root
	set :static, true #PUT ALL STATIC FILES IN PUBLIC!

	# register Sinatra::AssetPipeline 

	get '/' do
	  erb :index
	end

end