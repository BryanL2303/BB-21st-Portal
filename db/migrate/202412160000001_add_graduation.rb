# frozen_string_literal: true

class AddGraduation < ActiveRecord::Migration[7.0]
    def change
      change_table :accounts do |t|
        t.boolean :graduated
      end
    end
end