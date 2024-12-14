# frozen_string_literal: true

class AddLevelsAndClasses < ActiveRecord::Migration[7.0]
    def change
      change_table :parade_attendances do |t|
        t.integer :level
      end
      
      change_table :accounts do |t|
        t.string :class_1
        t.string :class_2
        t.string :class_3
        t.string :class_4
        t.string :class_5
        t.string :rank_1
        t.string :rank_2
        t.string :rank_3
        t.string :rank_4
        t.string :rank_5
      end
    end
end