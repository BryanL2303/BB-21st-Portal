class FixTypoInCustomColumn < ActiveRecord::Migration[7.0]
  def change
    change_table :custom_columns do |t|
      t.belongs_to :award
      t.belongs_to :mastery
      t.remove :awards_id
      t.remove :masteries_id
    end
  end
end
