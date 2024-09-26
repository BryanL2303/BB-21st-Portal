class UpdateMasteriesTable < ActiveRecord::Migration[7.0]
  def change
    change_table :masteries do |t|
      t.belongs_to :award
    end
  end
end
