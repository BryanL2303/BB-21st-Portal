# frozen_string_literal: true

class UpdateMasteryTable2 < ActiveRecord::Migration[7.0]
  def change
    change_table :masteries do |t|
      t.string :mastery_requirements
      t.remove :badge_requirements
    end
  end
end
