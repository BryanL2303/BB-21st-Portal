# frozen_string_literal: true

class RecordAttemptsScore < ActiveRecord::Migration[7.0]
  def change
    create_table :attempt_scores do |t|
      t.belongs_to :assigned_account
      t.float :score
      t.integer :attempt

      t.timestamps
    end
  end
end
