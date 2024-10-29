# frozen_string_literal: true

class CreateAwardAttainedTable < ActiveRecord::Migration[7.0]
  def change
    create_table :demo_attained_awards do |t|
      t.belongs_to :demo_account
      t.belongs_to :demo_award
      t.belongs_to :demo_mastery

      t.timestamps
    end
  end
end
