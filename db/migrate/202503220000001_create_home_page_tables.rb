# frozen_string_literal: true

class CreateHomePageTables < ActiveRecord::Migration[7.0]
    def change
        create_table :testimonials do |t|
            t.datetime :date
            t.string :name
            t.text :testimony
    
            t.timestamps
        end

        create_table :achievements do |t|
            t.string :year
            t.string :achievement

            t.timestamps
        end
    end
end