# frozen_string_literal: true

class CreateCommentsWithGrading < ActiveRecord::Migration[7.0]
  def change
    change_table :assignment_answers do |t|
      t.string :comments
    end
  end
end
