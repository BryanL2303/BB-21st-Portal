# frozen_string_literal: true

class UpdateTopicWithMastery < ActiveRecord::Migration[7.0]
  def change
    change_table :quizzes do |t|
      t.belongs_to :mastery
    end

    change_table :questions do |t|
      t.belongs_to :mastery
    end
  end
end
