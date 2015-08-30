class CreateInitialTables < ActiveRecord::Migration
  def change
  	 create_table :scores do |t|
      t.integer :score
      t.string	:source
      t.datetime	:date
    end
  end
end
