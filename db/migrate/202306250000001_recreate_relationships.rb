# frozen_string_literal: true

class RecreateRelationships < ActiveRecord::Migration[7.0]
  def change
    drop_table :quiz_questions

    create_table :quiz_questions do |t|
      t.belongs_to :quiz
      t.belongs_to :question

      t.timestamps
    end
  end
end
