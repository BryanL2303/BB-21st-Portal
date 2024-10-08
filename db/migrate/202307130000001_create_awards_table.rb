# frozen_string_literal: true

class CreateAwardsTable < ActiveRecord::Migration[7.0]
  def change
    create_table :awards do |t|
      t.string :badge_name
      t.string :badge_requirements
      t.string :results_description
      t.string :recommended_level

      t.timestamps
    end

    change_table :accounts do |t|
      t.integer :level
    end
  end
end
