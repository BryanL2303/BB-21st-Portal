# frozen_string_literal: true

class SwitchTopicToAward < ActiveRecord::Migration[7.0]
  def change
    change_table :quizzes do |t|
      t.belongs_to :award
      t.remove :topic_id
    end

    change_table :questions do |t|
      t.belongs_to :award
      t.remove :topic_id
    end
  end
end
