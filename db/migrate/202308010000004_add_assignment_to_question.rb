# frozen_string_literal: true

class AddAssignmentToQuestion < ActiveRecord::Migration[7.0]
  def change
    change_table :questions do |t|
      t.boolean :assigned
    end
  end
end
