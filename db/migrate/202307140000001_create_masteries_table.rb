# frozen_string_literal: true

class CreateMasteriesTable < ActiveRecord::Migration[7.0]
  def change
    create_table :masteries do |t|
      t.string :mastery_name
      t.string :badge_requirements
      t.string :results_description
      t.string :recommended_level

      t.timestamps
    end

    change_table :awards do |t|
      t.boolean :has_mastery
    end
  end
end
