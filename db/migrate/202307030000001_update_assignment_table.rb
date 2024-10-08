# frozen_string_literal: true

class UpdateAssignmentTable < ActiveRecord::Migration[7.0]
  def change
    change_table :assignments do |t|
      t.belongs_to :quiz
      t.string :topic_name
      t.boolean :show_answer
      t.integer :attempt_limit
    end
  end
end
