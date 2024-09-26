# frozen_string_literal: true

class DropTopicTable < ActiveRecord::Migration[7.0]
  def change
    drop_table :topics
  end
end
